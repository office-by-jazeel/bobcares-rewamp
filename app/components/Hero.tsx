"use client";

import { useState } from "react";
import VideoCarousel from "@/components/VideoCarousel";
import VideoTimeline from "@/components/VideoTimeline";
import heroData from "../../data/hero.json";
import CloudinaryImage from "@/components/CloudinaryImage";

// Type for video items to match the JSON structure
type VideoItem = {
  src?: string;
  cloudinaryId?: string | null;
  thumbnail?: string;
  thumbnailCloudinaryId?: string | null;
};

export default function Hero() {
  const { title, description, ratings, buttons, backgroundVideos } = heroData;

  // Ensure backgroundVideos matches the expected type
  const videos: VideoItem[] = backgroundVideos as VideoItem[];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDurations, setVideoDurations] = useState<number[]>([]);

  return (
    <section
      id="hero-section"
      className="relative h-dvh min-h-[720px] w-full overflow-hidden bg-black">

      {/* ================= BACKGROUND VIDEO ================= */}
      <div className="absolute inset-0 w-full h-full">
        <VideoCarousel
          videos={videos}
          className="absolute inset-0 w-full h-full object-cover"
          showTimeline={false}
          currentVideoIndex={currentVideoIndex}
          onVideoChange={setCurrentVideoIndex}
          onTimeUpdate={setCurrentTime}
          onDurationsUpdate={setVideoDurations}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-0 left-0 w-full h-[200px] md:h-[260px] bg-gradient-to-b from-black/60 to-transparent" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="absolute left-0 bottom-0 w-full">
        <div className="container mx-auto px-5 sm:px-8 flex md:flex-row flex-col justify-between md:items-end mb-16 sm:mb-24 lg:mb-[118px] max-md:gap-8">
          <div className="flex flex-col gap-8 sm:gap-10">
            {/* TITLE */}
            <h1 className="font-grotesque text-white font-bold tracking-[-0.02em] whitespace-pre-wrap text-[36px] leading-[0.95] sm:text-[48px] md:text-[64px] lg:text-[96px] lg:leading-[0.85] lg:max-w-[750px]">
              {title}
            </h1>

            {/* DESCRIPTION */}
            <p className="text-white w-full md:w-[520px] text-[15px] sm:text-[17px] md:text-[20px] leading-relaxed whitespace-pre-wrap lg:max-w-[750px]">
              {description}
            </p>

            {/* RATINGS */}
            <div className="flex flex-wrap md:flex-nowrap items-center gap-4 sm:gap-6 md:gap-[34px]">
              {ratings.map((rating, index) => (
                <>
                  <div key={index} className="flex items-center flex-wrap gap-[10px]">
                    <div className="flex items-center flex-nowrap gap-[10px]">
                      <CloudinaryImage
                        src={rating.icon}
                        alt={rating.platform}
                        width={24}
                        height={24}
                        className="object-contain shrink-0"
                      />
                      <span className="text-white text-[15px] sm:text-[17px] md:text-[20px] tracking-[-1px]">
                        {rating.platform}
                      </span>
                    </div>
                    <div className="flex items-center flex-nowrap gap-[10px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="block md:hidden">
                        <path d="M7.99936 11.5168L5.23269 13.1835C5.11047 13.2612 4.98269 13.2946 4.84936 13.2835C4.71602 13.2724 4.59936 13.2279 4.49936 13.1501C4.39936 13.0724 4.32158 12.9751 4.26602 12.8585C4.21047 12.7418 4.19936 12.6112 4.23269 12.4668L4.96602 9.3168L2.51602 7.20014C2.40491 7.10014 2.33547 6.98625 2.30769 6.85847C2.27991 6.73069 2.28825 6.60569 2.33269 6.48347C2.37713 6.36125 2.4438 6.26125 2.53269 6.18347C2.62158 6.10569 2.7438 6.05569 2.89936 6.03347L6.13269 5.75014L7.38269 2.78347C7.43825 2.65014 7.52436 2.55014 7.64102 2.48347C7.75769 2.4168 7.87713 2.38347 7.99936 2.38347C8.12158 2.38347 8.24102 2.4168 8.35769 2.48347C8.47436 2.55014 8.56047 2.65014 8.61602 2.78347L9.86602 5.75014L13.0994 6.03347C13.2549 6.05569 13.3771 6.10569 13.466 6.18347C13.5549 6.26125 13.6216 6.36125 13.666 6.48347C13.7105 6.60569 13.7188 6.73069 13.691 6.85847C13.6632 6.98625 13.5938 7.10014 13.4827 7.20014L11.0327 9.3168L11.766 12.4668C11.7994 12.6112 11.7882 12.7418 11.7327 12.8585C11.6771 12.9751 11.5994 13.0724 11.4994 13.1501C11.3994 13.2279 11.2827 13.2724 11.1494 13.2835C11.016 13.2946 10.8882 13.2612 10.766 13.1835L7.99936 11.5168Z" fill="#FCBD02" />
                      </svg>
                      <CloudinaryImage
                        src="/images/hero/star-rating.png"
                        alt="star"
                        width={140}
                        height={24}
                        className="object-contain shrink-0 hidden md:block"
                      />
                      <span className="text-white text-[15px] sm:text-[17px] md:text-[20px] tracking-[-1px]">
                        {rating.rating}
                      </span>
                    </div>
                  </div>
                  {index !== ratings.length - 1 && (
                    <div className="block h-6 border-l border-white/30 shrink-0" />
                  )}
                </>
              ))}
            </div>
            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4">
              {buttons.map((btn, index) => (
                <button
                  key={index}
                  className={
                    btn.variant === "primary"
                      ? "max-md:leading-none bg-[#0073ec] hover:bg-[#005bb5] px-[28px] py-4 sm:px-[38px] rounded-[45px] text-white text-[18px] sm:text-[20px] font-medium tracking-[-1px]"
                      : "max-md:leading-none border border-white px-[28px] py-4 sm:px-[38px] rounded-[45px] text-white text-[18px] sm:text-[20px] font-medium tracking-[-1px] hover:bg-white/10"
                  }
                >
                  {btn.text}
                </button>
              ))}
            </div>
          </div>

          {/* TIMELINE — moves under buttons on small screens */}
          <div className="flex justify-center md:justify-end md:pr-[100px] lg:pr-[10px]">
            <VideoTimeline
              videos={videos}
              currentVideoIndex={currentVideoIndex}
              currentTime={currentTime}
              videoDurations={videoDurations}
              onVideoClick={(index) => setCurrentVideoIndex(index)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
