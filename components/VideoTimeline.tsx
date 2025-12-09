'use client';

interface VideoTimelineProps {
  videos: Array<{ src: string; cloudinaryId?: string | null }>;
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

          const segmentProgress =
            videoDurations[currentVideoIndex] && videoDurations[currentVideoIndex] > 0
              ? (currentTime / videoDurations[currentVideoIndex]) * 100
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
