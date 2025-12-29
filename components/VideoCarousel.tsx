'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { getVideoUrl, isCloudinaryConfigured } from '@/lib/cloudinary';
import {
  getVideoSource,
  initHlsJs,
  destroyHlsJs,
} from '@/lib/video-streaming';
import CloudinaryImage from './CloudinaryImage';

interface VideoItem {
  src?: string;
  cloudinaryId?: string | null;
  thumbnail?: string;
  thumbnailCloudinaryId?: string | null;
}

interface VideoCarouselProps {
  videos: VideoItem[];
  className?: string;
  showTimeline?: boolean;
  currentVideoIndex?: number;
  onVideoChange?: (index: number) => void;
  onTimeUpdate?: (time: number) => void;
  onDurationsUpdate?: (durations: number[]) => void;
  muted?: boolean;
}

interface VideoSource {
  source: string | null;
  isHls: boolean;
  useHlsJs: boolean;
}

interface VideoState {
  showThumbnail: boolean;
  isVideoReady: boolean;
}

/**
 * Custom hook to compute video sources asynchronously with memoization
 */
function useVideoSources(videos: VideoItem[]): VideoSource[] {
  const [videoSources, setVideoSources] = useState<VideoSource[]>([]);

  useEffect(() => {
    const computeSources = async () => {
      const sources = await Promise.all(
        videos.map(async (video) => {
          const isFullUrl = video.cloudinaryId?.startsWith('http://') ||
            video.cloudinaryId?.startsWith('https://');

          let cloudinaryId = video.cloudinaryId;
          if (!isFullUrl && video.cloudinaryId && isCloudinaryConfigured()) {
            try {
              cloudinaryId = getVideoUrl(video.cloudinaryId, video.src || '');
            } catch {
              cloudinaryId = null;
            }
          }

          return await getVideoSource(cloudinaryId || null, video.src || null);
        })
      );
      setVideoSources(sources);
    };

    computeSources();
  }, [videos]);

  return videoSources;
}

/**
 * Custom hook to manage initial video playback
 * Videos now loop continuously in the background, so we only need to start playback once
 */
function useViewportObserver(
  containerRef: React.RefObject<HTMLDivElement | null>,
  videoRef: React.RefObject<HTMLVideoElement | null>,
  hlsInstanceRef: React.MutableRefObject<any>,
  onPlay: () => void
) {
  const [isInViewport, setIsInViewport] = useState(false);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const startPlayback = () => {
      if (!video || hasStartedRef.current) return;
      
      const needsLoad = video.readyState === 0 ||
        (!video.src && !hlsInstanceRef.current);

      if (needsLoad) {
        video.load();
      }

      if (video.readyState >= 3) {
        video.play()
          .then(() => {
            onPlay();
            hasStartedRef.current = true;
          })
          .catch((err) => {
            console.debug('Autoplay prevented:', err);
          });
      } else {
        const canPlayHandler = () => {
          video.play()
            .then(() => {
              onPlay();
              hasStartedRef.current = true;
            })
            .catch((err) => {
              console.debug('Autoplay prevented:', err);
            });
          video.removeEventListener('canplay', canPlayHandler);
        };
        const loadedDataHandler = () => {
          video.play()
            .then(() => {
              onPlay();
              hasStartedRef.current = true;
            })
            .catch((err) => {
              console.debug('Autoplay prevented:', err);
            });
          video.removeEventListener('loadeddata', loadedDataHandler);
        };
        video.addEventListener('canplay', canPlayHandler);
        video.addEventListener('loadeddata', loadedDataHandler);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInViewport(entry.isIntersecting);

        // Only start playback once when video first enters viewport
        if (entry.isIntersecting && video && !hasStartedRef.current) {
          startPlayback();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    observer.observe(container);

    // Check initial intersection state
    const checkInitialIntersection = () => {
      if (container && video) {
        const rect = container.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight + 50 &&
          rect.bottom > -50 &&
          rect.left < window.innerWidth + 50 &&
          rect.right > -50;
        if (isVisible && !hasStartedRef.current) {
          setIsInViewport(true);
          startPlayback();
        }
      }
    };

    const timeoutId = setTimeout(checkInitialIntersection, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [containerRef, videoRef, hlsInstanceRef, onPlay]);

  return isInViewport;
}

/**
 * Custom hook to manage video player, HLS, and source switching
 */
function useVideoPlayer(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  videos: VideoItem[],
  videoSources: VideoSource[],
  currentVideoIndex: number,
  onFallback: () => void,
  hlsInstanceRef: React.MutableRefObject<any>
) {
  const hasTriedFallbackRef = useRef(false);

  // Setup video source and HLS when video index changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoSources.length === 0) return;

    const currentSource = videoSources[currentVideoIndex];
    const currentVideo = videos[currentVideoIndex];

    // Reset fallback flag when video changes
    hasTriedFallbackRef.current = false;

    // Clean up previous HLS instance
    if (hlsInstanceRef.current) {
      destroyHlsJs(hlsInstanceRef.current);
      hlsInstanceRef.current = null;
    }

    // Clear video src first to ensure clean state
    video.src = '';

    const applyFallback = () => {
      const fallbackSrc = currentVideo.src;
      if (fallbackSrc && !hasTriedFallbackRef.current) {
        hasTriedFallbackRef.current = true;
        if (hlsInstanceRef.current) {
          destroyHlsJs(hlsInstanceRef.current);
          hlsInstanceRef.current = null;
        }
        video.src = fallbackSrc;
        video.load();
        video.play().catch(() => { });
      }
    };

    // Determine video source
    if (currentSource.source) {
      if (currentSource.isHls && currentSource.useHlsJs) {
        // Use HLS.js for non-native browsers
        initHlsJs(
          video,
          currentSource.source,
          (error) => {
            console.warn('HLS.js error, falling back to MP4:', error);
            applyFallback();
          }
        ).then((hls) => {
          if (hls) {
            hlsInstanceRef.current = hls;
            video.load();
          }
        }).catch((error) => {
          console.error('Failed to initialize HLS.js:', error);
          applyFallback();
        });
      } else {
        // Native HLS or regular video
        video.src = currentSource.source;
        video.load();
      }
    } else {
      // No source available, use fallback
      video.src = currentVideo.src || '';
      video.load();
    }
  }, [currentVideoIndex, videoSources, videos, videoRef]);

  // Handle video error - fallback to local MP4
  const handleVideoError = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const currentVideo = videos[currentVideoIndex];
    const fallbackSrc = currentVideo.src || '';

    if (!hasTriedFallbackRef.current && fallbackSrc && video.src !== fallbackSrc) {
      hasTriedFallbackRef.current = true;

      if (hlsInstanceRef.current) {
        destroyHlsJs(hlsInstanceRef.current);
        hlsInstanceRef.current = null;
      }

      video.src = fallbackSrc;
      video.load();
      video.play().catch(() => { });
      onFallback();
    }
  }, [currentVideoIndex, videos, videoRef, onFallback]);

  // Cleanup HLS instance on unmount
  useEffect(() => {
    return () => {
      if (hlsInstanceRef.current) {
        destroyHlsJs(hlsInstanceRef.current);
        hlsInstanceRef.current = null;
      }
    };
  }, []);

  return { handleVideoError };
}

/**
 * Custom hook to manage video metadata, durations, and thumbnail visibility
 */
function useVideoMetadata(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  videoSources: VideoSource[],
  currentVideoIndex: number,
  onDurationsUpdate?: (durations: number[]) => void
) {
  const [videoState, setVideoState] = useState<VideoState>({
    showThumbnail: true,
    isVideoReady: false,
  });
  const durationsRef = useRef<number[]>([]);
  const prevVideoIndexRef = useRef(currentVideoIndex);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoSources.length === 0) return;

    // Reset thumbnail visibility when video index changes
    if (prevVideoIndexRef.current !== currentVideoIndex) {
      setVideoState({ showThumbnail: true, isVideoReady: false });
      prevVideoIndexRef.current = currentVideoIndex;
    }

    // Check current playing state when hook initializes or video changes
    // This handles the case when scrolling back into view with an already-loaded video
    const checkPlayingState = () => {
      if (video && !video.paused && !video.ended && video.readyState >= 3) {
        setVideoState(prev => ({ ...prev, showThumbnail: false }));
      }
    };

    // Check immediately and after a short delay to catch async state changes
    checkPlayingState();
    const checkTimeout = setTimeout(checkPlayingState, 100);

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        durationsRef.current[currentVideoIndex] = video.duration;
        onDurationsUpdate?.([...durationsRef.current]);
      }
      setVideoState(prev => ({ ...prev, isVideoReady: true }));
      // Check playing state after metadata is loaded
      checkPlayingState();
    };

    const handlePlay = () => {
      setVideoState(prev => ({ ...prev, showThumbnail: false }));
    };

    const handlePlaying = () => {
      setVideoState(prev => ({ ...prev, showThumbnail: false }));
    };

    const handlePause = () => {
      // Only show thumbnail if video is paused and not at the end
      if (video.ended) {
        // Don't show thumbnail if video ended (will be handled by video end handler)
        return;
      }
      // When paused, show thumbnail
      setVideoState(prev => ({ ...prev, showThumbnail: true }));
    };

    const handleWaiting = () => {
      if (!video.readyState || video.readyState < 3) {
        setVideoState(prev => ({ ...prev, showThumbnail: true }));
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);

    return () => {
      clearTimeout(checkTimeout);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
    };
  }, [videoSources, currentVideoIndex, onDurationsUpdate, videoRef]);

  return videoState;
}

/**
 * Video carousel component that plays videos sequentially
 * After each video completes, plays the next one
 * After the last video, loops back to the first
 */
export default function VideoCarousel({
  videos,
  className,
  currentVideoIndex: controlledIndex,
  onVideoChange,
  onTimeUpdate,
  onDurationsUpdate,
  muted = true,
}: VideoCarouselProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const currentVideoIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;

  const setCurrentVideoIndex = useCallback((index: number) => {
    if (controlledIndex === undefined) {
      setInternalIndex(index);
    }
    onVideoChange?.(index);
  }, [controlledIndex, onVideoChange]);

  // Compute video sources
  const videoSources = useVideoSources(videos);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Video state management
  const [videoState, setVideoState] = useState<VideoState>({
    showThumbnail: true,
    isVideoReady: false,
  });

  // Create hlsInstanceRef that will be shared between hooks
  const hlsInstanceRef = useRef<any>(null);

  // Handle thumbnail visibility updates from viewport observer
  const handleVideoPlay = useCallback(() => {
    setVideoState(prev => ({ ...prev, showThumbnail: false }));
  }, []);

  // Handle fallback
  const handleFallback = useCallback(() => {
    setVideoState(prev => ({ ...prev, showThumbnail: true, isVideoReady: false }));
  }, []);

  // Viewport observer (needs hlsInstanceRef)
  const isInViewport = useViewportObserver(
    containerRef,
    videoRef,
    hlsInstanceRef,
    handleVideoPlay
  );

  // Video player management
  const { handleVideoError } = useVideoPlayer(
    videoRef,
    videos,
    videoSources,
    currentVideoIndex,
    handleFallback,
    hlsInstanceRef
  );

  // Video metadata
  const metadataState = useVideoMetadata(
    videoRef,
    videoSources,
    currentVideoIndex,
    onDurationsUpdate
  );

  // Merge metadata state with local state
  useEffect(() => {
    setVideoState(metadataState);
  }, [metadataState]);

  // Synchronize thumbnail state - hide when video is playing
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!video.paused && !video.ended && video.readyState >= 3) {
      // Video is playing, ensure thumbnail is hidden
      setVideoState(prev => ({ ...prev, showThumbnail: false }));
    }
  }, [videoRef]);

  // Update current time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      onTimeUpdate?.(video.currentTime);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentVideoIndex, onTimeUpdate]);

  // Handle video end - play next video
  // Note: With loop attribute, this should rarely fire, but handle it for carousel behavior
  const handleVideoEnd = useCallback(() => {
    if (videos.length === 1 && videoRef.current) {
      // Single video with loop attribute will auto-loop, but ensure it plays
      videoRef.current.play().catch(() => { });
      return;
    }

    const nextIndex = (currentVideoIndex + 1) % videos.length;
    setCurrentVideoIndex(nextIndex);
    setVideoState({ showThumbnail: true, isVideoReady: false });
  }, [currentVideoIndex, videos.length, setCurrentVideoIndex]);

  // Sync with controlled index
  useEffect(() => {
    if (controlledIndex !== undefined && controlledIndex !== internalIndex) {
      setInternalIndex(controlledIndex);
      setVideoState({ showThumbnail: true, isVideoReady: false });

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.load();
        videoRef.current.play().catch(() => { });
      }
    }
  }, [controlledIndex, internalIndex]);

  // Preload thumbnail when video index changes
  useEffect(() => {
    const currentVideo = videos[currentVideoIndex];
    if (!currentVideo) return;

    if (currentVideo.thumbnail || currentVideo.thumbnailCloudinaryId) {
      const img = new Image();
      const thumbnailSrc = currentVideo.thumbnail || '/images/hero/videothumbnail.png';
      img.src = thumbnailSrc;
    }
  }, [currentVideoIndex, videos]);

  // Memoized computed values
  const currentVideo = useMemo(() => videos[currentVideoIndex], [videos, currentVideoIndex]);
  const hasThumbnail = useMemo(
    () => currentVideo.thumbnail || currentVideo.thumbnailCloudinaryId,
    [currentVideo]
  );
  const currentSource = useMemo(
    () => videoSources[currentVideoIndex],
    [videoSources, currentVideoIndex]
  );
  const videoSrc = useMemo(() => {
    return currentSource && !currentSource.useHlsJs
      ? (currentSource.source || currentVideo.src || '')
      : '';
  }, [currentSource, currentVideo]);

  // Sync muted prop to video element
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = muted;
    }
  }, [muted]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <video
        ref={videoRef}
        key={currentVideoIndex}
        src={videoSrc || undefined}
        className={className}
        preload="none"
        muted={muted}
        playsInline
        loop
        onEnded={handleVideoEnd}
        onError={handleVideoError}
      />

      {hasThumbnail && (
        <div
          className="absolute inset-0 z-10"
          style={{
            opacity: videoState.showThumbnail ? 1 : 0,
            visibility: videoState.showThumbnail ? 'visible' : 'hidden',
            pointerEvents: videoState.showThumbnail ? 'auto' : 'none',
          }}
        >
          <CloudinaryImage
            src={currentVideo.thumbnail || '/images/hero/videothumbnail.png'}
            cloudinaryId={currentVideo.thumbnailCloudinaryId}
            alt="Video thumbnail"
            fill
            className={className}
            priority={currentVideoIndex === 0}
          />
        </div>
      )}
    </div>
  );
}
