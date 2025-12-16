'use client';

interface VideoTimelineProps {
  videos: Array<{ src?: string; cloudinaryId?: string | null }>;
  currentVideoIndex: number;
  currentTime: number;
  videoDurations: number[];
  onVideoClick: (index: number) => void;
}

export default function VideoTimeline({
  videos,
  currentVideoIndex,
  currentTime,
  videoDurations,
  onVideoClick,
}: VideoTimelineProps) {
  if (videos.length <= 1) return null;

  return (
    <div className="relative z-30 pointer-events-auto">
      {/* Video timeline indicators */}
      <div className="flex gap-4 items-center">
        {videos.map((_, index) => {
          const isActive = index === currentVideoIndex;

          // Calculate progress for the active video segment
          const currentVideoDuration = videoDurations[currentVideoIndex];
          const segmentProgress =
            isActive &&
              currentVideoDuration &&
              currentVideoDuration > 0 &&
              !isNaN(currentTime) &&
              isFinite(currentTime)
              ? Math.min(100, Math.max(0, (currentTime / currentVideoDuration) * 100))
              : 0;

          return (
            <button
              key={index}
              onClick={() => onVideoClick(index)}
              aria-label={`Go to video ${index + 1}`}
              className="relative flex items-center cursor-pointer"
            >
              <div
                className="
                  relative 
                  h-[4px]               /* SAME HEIGHT for all */
                  w-[80px]              /* SAME WIDTH for all */
                  rounded-full 
                  overflow-hidden 
                  bg-white/20 
                  hover:bg-white/30 
                  transition-colors
                "
              >
                {/* Active progress fill */}
                {isActive ? (
                  <div
                    className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-100"
                    style={{ width: `${segmentProgress}%` }}
                  />
                ) : (
                  <div className="absolute top-0 left-0 h-full w-full bg-white/40 opacity-50" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
