/**
 * Video streaming utilities for HLS support and fallback handling
 */

// Type for HLS.js (will be available at runtime after package installation)
type HlsType = any;

// Lazy-loaded HLS.js instance
let Hls: HlsType | null = null;
let hlsLoadPromise: Promise<HlsType | null> | null = null;

/**
 * Lazy load HLS.js library
 */
async function loadHls(): Promise<HlsType | null> {
  if (typeof window === 'undefined') return null;
  
  if (Hls !== null) return Hls;
  if (hlsLoadPromise) return hlsLoadPromise;
  
  hlsLoadPromise = (async () => {
    try {
      const hlsModule = await import('hls.js');
      Hls = hlsModule.default;
      return Hls;
    } catch (error) {
      console.warn('hls.js not available:', error);
      return null;
    }
  })();
  
  return hlsLoadPromise;
}

/**
 * Get HLS.js synchronously if already loaded
 */
function getHlsSync(): HlsType | null {
  return Hls;
}

/**
 * Check if a URL is an HLS format (.m3u8)
 */
export function isHlsUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes('.m3u8') || url.endsWith('.m3u8');
}

/**
 * Check if the browser has native HLS support (Safari/iOS)
 */
export function hasNativeHlsSupport(): boolean {
  if (typeof window === 'undefined') return false;
  
  const video = document.createElement('video');
  return video.canPlayType('application/vnd.apple.mpegurl') !== '';
}

/**
 * Check if HLS.js is available and can be used
 */
export async function canUseHlsJs(): Promise<boolean> {
  const hls = await loadHls();
  return hls !== null && typeof hls.isSupported === 'function' && hls.isSupported();
}

/**
 * Check if HLS streaming is supported (either native or via HLS.js)
 */
export async function isHlsSupported(): Promise<boolean> {
  return hasNativeHlsSupport() || await canUseHlsJs();
}

/**
 * Initialize HLS.js for a video element
 * Returns the HLS instance or null if initialization fails
 */
export async function initHlsJs(
  videoElement: HTMLVideoElement,
  hlsUrl: string,
  onError?: (error: Error) => void
): Promise<HlsType | null> {
  const HlsClass = await loadHls();
  if (!HlsClass || typeof HlsClass.isSupported !== 'function' || !HlsClass.isSupported()) {
    return null;
  }

  try {
    const hls = new HlsClass({
      // Streaming-optimized configuration
      enableWorker: true,
      lowLatencyMode: false,
      backBufferLength: 90,
      maxBufferLength: 30,
      maxMaxBufferLength: 60,
      maxBufferSize: 60 * 1000 * 1000, // 60MB
      maxBufferHole: 0.5,
      // Don't preload entire video
      startLevel: -1, // Auto-select quality
      capLevelToPlayerSize: true,
    });

    hls.loadSource(hlsUrl);
    hls.attachMedia(videoElement);

    // Handle HLS errors
    if (HlsClass.Events && HlsClass.ErrorTypes) {
      hls.on(HlsClass.Events.ERROR, (event: any, data: any) => {
        if (data.fatal) {
          switch (data.type) {
            case HlsClass.ErrorTypes.NETWORK_ERROR:
              // Try to recover from network errors
              console.warn('HLS network error, attempting recovery:', data);
              try {
                hls.startLoad();
              } catch (e) {
                // If recovery fails, trigger fallback
                if (onError) {
                  onError(new Error('HLS network error - recovery failed'));
                }
              }
              break;
            case HlsClass.ErrorTypes.MEDIA_ERROR:
              // Try to recover from media errors
              console.warn('HLS media error, attempting recovery:', data);
              try {
                hls.recoverMediaError();
              } catch (e) {
                // If recovery fails, trigger fallback
                if (onError) {
                  onError(new Error('HLS media error - recovery failed'));
                }
              }
              break;
            default:
              // Fatal error, cannot recover
              console.error('HLS fatal error:', data);
              if (onError) {
                onError(new Error(`HLS fatal error: ${data.type}`));
              }
              break;
          }
        }
      });
    }

    return hls;
  } catch (error) {
    console.error('Failed to initialize HLS.js:', error);
    if (onError && error instanceof Error) {
      onError(error);
    }
    return null;
  }
}

/**
 * Clean up HLS.js instance
 */
export function destroyHlsJs(hls: HlsType | null): void {
  if (hls && typeof hls.destroy === 'function') {
    try {
      hls.destroy();
    } catch (error) {
      console.warn('Error destroying HLS instance:', error);
    }
  }
}

/**
 * Determine the best video source to use
 * Returns the URL to use, or null if fallback should be used
 */
export async function getVideoSource(
  cloudinaryId: string | null | undefined,
  fallbackSrc: string | null | undefined
): Promise<{
  source: string | null;
  isHls: boolean;
  useHlsJs: boolean;
}> {
  // If no cloudinaryId, use fallback directly
  if (!cloudinaryId) {
    return {
      source: fallbackSrc || null,
      isHls: false,
      useHlsJs: false,
    };
  }

  // Check if cloudinaryId is an HLS URL
  if (isHlsUrl(cloudinaryId)) {
    // Check if HLS is supported
    const hlsSupported = await isHlsSupported();
    if (hlsSupported) {
      return {
        source: cloudinaryId,
        isHls: true,
        useHlsJs: !hasNativeHlsSupport(), // Use HLS.js if not native
      };
    } else {
      // HLS not supported, use fallback
      return {
        source: fallbackSrc || null,
        isHls: false,
        useHlsJs: false,
      };
    }
  }

  // Not an HLS URL, use cloudinaryId directly (could be MP4 or other format)
  return {
    source: cloudinaryId,
    isHls: false,
    useHlsJs: false,
  };
}
