'use client';

import { useState, useEffect, useRef } from 'react';
import { getVideoUrl, isCloudinaryConfigured } from '@/lib/cloudinary';
import CloudinaryImage from './CloudinaryImage';

interface VideoItem {
  src: string;
  cloudinaryId?: string | null;
  thumbnail?: string; // Local thumbnail path
  thumbnailCloudinaryId?: string | null; // Cloudinary thumbnail ID or full URL
}

interface VideoCarouselProps {
  videos: VideoItem[];
  className?: string;
  showTimeline?: boolean;
  currentVideoIndex?: number;
  onVideoChange?: (index: number) => void;
  onTimeUpdate?: (time: number) => void;
  onDurationsUpdate?: (durations: number[]) => void;
}

/**
 * Video carousel component that plays videos sequentially
 * After each video completes, plays the next one
 * After the last video, loops back to the first
 */
export default function VideoCarousel({
  videos,
  className,
  showTimeline = true,
  currentVideoIndex: controlledIndex,
  onVideoChange,
  onTimeUpdate,
  onDurationsUpdate,
}: VideoCarouselProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const currentVideoIndex = controlledIndex !== undefined ? controlledIndex : internalIndex;
  
  const setCurrentVideoIndex = (index: number) => {
    if (controlledIndex === undefined) {
      setInternalIndex(index);
    }
    onVideoChange?.(index);
  };
  const [videoSrcs, setVideoSrcs] = useState<string[]>([]);
  const [videoDurations, setVideoDurations] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize video sources
  useEffect(() => {
    const sources = videos.map((video) => {
      if (video.cloudinaryId) {
        // Check if cloudinaryId is a full URL (starts with http:// or https://)
        const isFullUrl = video.cloudinaryId.startsWith('http://') || video.cloudinaryId.startsWith('https://');
        
        if (isFullUrl) {
          // Use the URL directly
          return video.cloudinaryId;
        } else if (isCloudinaryConfigured()) {
          // It's a Cloudinary public ID, generate the URL
          try {
            return getVideoUrl(video.cloudinaryId, video.src);
          } catch {
            return video.src;
          }
        }
      }
      return video.src;
    });
    setVideoSrcs(sources);
  }, [videos]);

  // Load video durations and handle thumbnail visibility
  useEffect(() => {
    if (videoRef.current && videoSrcs.length > 0) {
      const video = videoRef.current;
      
      // Reset thumbnail visibility when video changes
      setShowThumbnail(true);
      setIsVideoReady(false);
      
      const handleLoadedMetadata = () => {
        if (video.duration) {
          setVideoDurations((prev) => {
            const newDurations = [...prev];
            newDurations[currentVideoIndex] = video.duration;
            onDurationsUpdate?.(newDurations);
            return newDurations;
          });
        }
        setIsVideoReady(true);
      };

      const handleCanPlay = () => {
        // Hide thumbnail when video can start playing
        setShowThumbnail(false);
      };

      const handlePlay = () => {
        // Hide thumbnail when video starts playing
        setShowThumbnail(false);
      };

      const handleWaiting = () => {
        // Show thumbnail if video is buffering
        if (!video.readyState || video.readyState < 3) {
          setShowThumbnail(true);
        }
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('play', handlePlay);
      video.addEventListener('waiting', handleWaiting);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('waiting', handleWaiting);
      };
    }
  }, [videoSrcs, currentVideoIndex, onDurationsUpdate]);

  // Update current time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentVideoIndex, onTimeUpdate]);

  // Handle video end - play next video
  const handleVideoEnd = () => {
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    setCurrentVideoIndex(nextIndex);
    setCurrentTime(0);
    setShowThumbnail(true);
    setIsVideoReady(false);
    onVideoChange?.(nextIndex);
  };

  // Handle video error - fallback to local
  const handleVideoError = () => {
    if (videoRef.current) {
      const currentVideo = videos[currentVideoIndex];
      if (videoRef.current.src !== currentVideo.src) {
        videoRef.current.src = currentVideo.src;
        videoRef.current.load();
      }
    }
  };

  // Jump to specific video (exposed via ref or callback)
  const jumpToVideo = (index: number) => {
    if (index >= 0 && index < videos.length && index !== currentVideoIndex) {
      setCurrentVideoIndex(index);
      setCurrentTime(0);
      onVideoChange?.(index);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }
  };

  // Sync with controlled index - when parent changes the index, update the video
  useEffect(() => {
    if (controlledIndex !== undefined && controlledIndex !== internalIndex) {
      setInternalIndex(controlledIndex);
      setShowThumbnail(true);
      setIsVideoReady(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.load();
        videoRef.current.play().catch(() => {
          // Autoplay might fail, that's okay
        });
      }
    }
  }, [controlledIndex, internalIndex]);

  // Calculate segment progress for the current video

  const currentVideo = videos[currentVideoIndex];
  const hasThumbnail = currentVideo.thumbnail || currentVideo.thumbnailCloudinaryId;

  return (
    <div className="relative w-full h-full">
      {/* Thumbnail - shown before video loads */}
      {showThumbnail && hasThumbnail && (
        <div 
          className="absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            opacity: isVideoReady ? 0 : 1,
          }}
        >
          <CloudinaryImage
            src={currentVideo.thumbnail || '/images/videothumbnail.png'}
            cloudinaryId={currentVideo.thumbnailCloudinaryId}
            alt="Video thumbnail"
            fill
            className={className}
            priority={currentVideoIndex === 0}
          />
        </div>
      )}

      {/* Video */}
      <video
        ref={videoRef}
        key={currentVideoIndex}
        src={videoSrcs[currentVideoIndex] || videos[currentVideoIndex].src}
        className={className}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        onError={handleVideoError}
        style={{
          opacity: showThumbnail && hasThumbnail ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </div>
  );
}

