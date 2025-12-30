"use client";

import { useState } from "react";
import VideoCarousel from "@/components/VideoCarousel";
import VideoTimeline from "@/components/VideoTimeline";
import heroData from "../../data/hero.json";
import CloudinaryImage from "@/components/CloudinaryImage";
import { cn } from "@/lib/utils";
import { openSupportBoard } from "@/lib/support-board";

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
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section
      id="hero-section"
      className="relative h-dvh min-h-[780px] w-full overflow-hidden bg-black">

      {/* ================= BACKGROUND VIDEO ================= */}
      <div className="absolute inset-0 w-full h-full z-2">
        <VideoCarousel
          videos={videos}
          className="absolute inset-0 w-full h-full object-cover"
          showTimeline={false}
          currentVideoIndex={currentVideoIndex}
          onVideoChange={setCurrentVideoIndex}
          onTimeUpdate={setCurrentTime}
          onDurationsUpdate={setVideoDurations}
          muted={isMuted}
        />

      </div>

      {/* Overlays */}
      <div className="absolute top-0 left-0 w-full h-[200px] md:h-[260px] bg-linear-to-b from-black/80 to-transparent z-3" />
      <div className="absolute bottom-0 left-0 w-full h-[200px] md:h-[260px] bg-linear-to-t from-black/80 to-transparent z-3" />

      {/* Mute/Unmute Toggle Button */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 container">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="backdrop-blur-md border border-white/20 border-solid flex items-center justify-center p-3 rounded-[45px] md:size-[60px] hover:bg-black/10 transition-all"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-[26px]"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-[26px]"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="absolute left-0 bottom-0 w-full z-3">
        <div className="container mx-auto flex md:flex-row flex-col justify-between md:items-end mb-16 sm:mb-24 lg:mb-[118px] max-md:gap-8">
          <div className="flex flex-col gap-8 sm:gap-10">
            {/* TITLE */}
            <h1 className="font-grotesque text-white font-bold tracking-[-0.02em] whitespace-pre-wrap text-[64px] leading-[0.95] lg:text-[96px] lg:leading-[0.85] lg:max-w-[750px]">
              {title}
            </h1>

            {/* DESCRIPTION */}
            <p className="text-white w-full md:w-[600px] text-[14px] md:text-[20px] leading-relaxed whitespace-pre-wrap lg:max-w-[750px]">
              {description}
            </p>

            {/* RATINGS */}
            <div className="flex flex-wrap md:flex-nowrap items-center">
              {ratings.map((rating, index) => (
                <div key={index} className={cn("flex items-center flex-wrap gap-[10px] first:pr-[14px] last:pl-[14px] md:first:pr-[34px] md:last:pl-[34px]",
                  index !== ratings.length - 1 && "border-r border-white/30 pr-[34px]")}>
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
                    {Number(rating.rating) === 5
                      ? <div className="hidden md:flex items-center flex-nowrap gap-[3px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M11.999 17.2752L7.84904 19.7752C7.66571 19.8919 7.47404 19.9419 7.27404 19.9252C7.07404 19.9085 6.89904 19.8419 6.74904 19.7252C6.59904 19.6085 6.48237 19.4627 6.39904 19.2877C6.31571 19.1127 6.29904 18.9169 6.34904 18.7002L7.44904 13.9752L3.77404 10.8002C3.60737 10.6502 3.50321 10.4794 3.46154 10.2877C3.41987 10.096 3.43237 9.90853 3.49904 9.72519C3.56571 9.54186 3.66571 9.39186 3.79904 9.2752C3.93237 9.15853 4.11571 9.08353 4.34904 9.0502L9.19904 8.6252L11.074 4.1752C11.1574 3.9752 11.2865 3.8252 11.4615 3.7252C11.6365 3.6252 11.8157 3.5752 11.999 3.5752C12.1824 3.5752 12.3615 3.6252 12.5365 3.7252C12.7115 3.8252 12.8407 3.9752 12.924 4.1752L14.799 8.6252L19.649 9.0502C19.8824 9.08353 20.0657 9.15853 20.199 9.2752C20.3324 9.39186 20.4324 9.54186 20.499 9.72519C20.5657 9.90853 20.5782 10.096 20.5365 10.2877C20.4949 10.4794 20.3907 10.6502 20.224 10.8002L16.549 13.9752L17.649 18.7002C17.699 18.9169 17.6824 19.1127 17.599 19.2877C17.5157 19.4627 17.399 19.6085 17.249 19.7252C17.099 19.8419 16.924 19.9085 16.724 19.9252C16.524 19.9419 16.3324 19.8919 16.149 19.7752L11.999 17.2752Z" fill="#FCBD02" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M11.999 17.2752L7.84904 19.7752C7.66571 19.8919 7.47404 19.9419 7.27404 19.9252C7.07404 19.9085 6.89904 19.8419 6.74904 19.7252C6.59904 19.6085 6.48237 19.4627 6.39904 19.2877C6.31571 19.1127 6.29904 18.9169 6.34904 18.7002L7.44904 13.9752L3.77404 10.8002C3.60737 10.6502 3.50321 10.4794 3.46154 10.2877C3.41987 10.096 3.43237 9.90853 3.49904 9.72519C3.56571 9.54186 3.66571 9.39186 3.79904 9.2752C3.93237 9.15853 4.11571 9.08353 4.34904 9.0502L9.19904 8.6252L11.074 4.1752C11.1574 3.9752 11.2865 3.8252 11.4615 3.7252C11.6365 3.6252 11.8157 3.5752 11.999 3.5752C12.1824 3.5752 12.3615 3.6252 12.5365 3.7252C12.7115 3.8252 12.8407 3.9752 12.924 4.1752L14.799 8.6252L19.649 9.0502C19.8824 9.08353 20.0657 9.15853 20.199 9.2752C20.3324 9.39186 20.4324 9.54186 20.499 9.72519C20.5657 9.90853 20.5782 10.096 20.5365 10.2877C20.4949 10.4794 20.3907 10.6502 20.224 10.8002L16.549 13.9752L17.649 18.7002C17.699 18.9169 17.6824 19.1127 17.599 19.2877C17.5157 19.4627 17.399 19.6085 17.249 19.7252C17.099 19.8419 16.924 19.9085 16.724 19.9252C16.524 19.9419 16.3324 19.8919 16.149 19.7752L11.999 17.2752Z" fill="#FCBD02" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M11.999 17.2752L7.84904 19.7752C7.66571 19.8919 7.47404 19.9419 7.27404 19.9252C7.07404 19.9085 6.89904 19.8419 6.74904 19.7252C6.59904 19.6085 6.48237 19.4627 6.39904 19.2877C6.31571 19.1127 6.29904 18.9169 6.34904 18.7002L7.44904 13.9752L3.77404 10.8002C3.60737 10.6502 3.50321 10.4794 3.46154 10.2877C3.41987 10.096 3.43237 9.90853 3.49904 9.72519C3.56571 9.54186 3.66571 9.39186 3.79904 9.2752C3.93237 9.15853 4.11571 9.08353 4.34904 9.0502L9.19904 8.6252L11.074 4.1752C11.1574 3.9752 11.2865 3.8252 11.4615 3.7252C11.6365 3.6252 11.8157 3.5752 11.999 3.5752C12.1824 3.5752 12.3615 3.6252 12.5365 3.7252C12.7115 3.8252 12.8407 3.9752 12.924 4.1752L14.799 8.6252L19.649 9.0502C19.8824 9.08353 20.0657 9.15853 20.199 9.2752C20.3324 9.39186 20.4324 9.54186 20.499 9.72519C20.5657 9.90853 20.5782 10.096 20.5365 10.2877C20.4949 10.4794 20.3907 10.6502 20.224 10.8002L16.549 13.9752L17.649 18.7002C17.699 18.9169 17.6824 19.1127 17.599 19.2877C17.5157 19.4627 17.399 19.6085 17.249 19.7252C17.099 19.8419 16.924 19.9085 16.724 19.9252C16.524 19.9419 16.3324 19.8919 16.149 19.7752L11.999 17.2752Z" fill="#FCBD02" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M11.999 17.2752L7.84904 19.7752C7.66571 19.8919 7.47404 19.9419 7.27404 19.9252C7.07404 19.9085 6.89904 19.8419 6.74904 19.7252C6.59904 19.6085 6.48237 19.4627 6.39904 19.2877C6.31571 19.1127 6.29904 18.9169 6.34904 18.7002L7.44904 13.9752L3.77404 10.8002C3.60737 10.6502 3.50321 10.4794 3.46154 10.2877C3.41987 10.096 3.43237 9.90853 3.49904 9.72519C3.56571 9.54186 3.66571 9.39186 3.79904 9.2752C3.93237 9.15853 4.11571 9.08353 4.34904 9.0502L9.19904 8.6252L11.074 4.1752C11.1574 3.9752 11.2865 3.8252 11.4615 3.7252C11.6365 3.6252 11.8157 3.5752 11.999 3.5752C12.1824 3.5752 12.3615 3.6252 12.5365 3.7252C12.7115 3.8252 12.8407 3.9752 12.924 4.1752L14.799 8.6252L19.649 9.0502C19.8824 9.08353 20.0657 9.15853 20.199 9.2752C20.3324 9.39186 20.4324 9.54186 20.499 9.72519C20.5657 9.90853 20.5782 10.096 20.5365 10.2877C20.4949 10.4794 20.3907 10.6502 20.224 10.8002L16.549 13.9752L17.649 18.7002C17.699 18.9169 17.6824 19.1127 17.599 19.2877C17.5157 19.4627 17.399 19.6085 17.249 19.7252C17.099 19.8419 16.924 19.9085 16.724 19.9252C16.524 19.9419 16.3324 19.8919 16.149 19.7752L11.999 17.2752Z" fill="#FCBD02" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M11.999 17.2752L7.84904 19.7752C7.66571 19.8919 7.47404 19.9419 7.27404 19.9252C7.07404 19.9085 6.89904 19.8419 6.74904 19.7252C6.59904 19.6085 6.48237 19.4627 6.39904 19.2877C6.31571 19.1127 6.29904 18.9169 6.34904 18.7002L7.44904 13.9752L3.77404 10.8002C3.60737 10.6502 3.50321 10.4794 3.46154 10.2877C3.41987 10.096 3.43237 9.90853 3.49904 9.72519C3.56571 9.54186 3.66571 9.39186 3.79904 9.2752C3.93237 9.15853 4.11571 9.08353 4.34904 9.0502L9.19904 8.6252L11.074 4.1752C11.1574 3.9752 11.2865 3.8252 11.4615 3.7252C11.6365 3.6252 11.8157 3.5752 11.999 3.5752C12.1824 3.5752 12.3615 3.6252 12.5365 3.7252C12.7115 3.8252 12.8407 3.9752 12.924 4.1752L14.799 8.6252L19.649 9.0502C19.8824 9.08353 20.0657 9.15853 20.199 9.2752C20.3324 9.39186 20.4324 9.54186 20.499 9.72519C20.5657 9.90853 20.5782 10.096 20.5365 10.2877C20.4949 10.4794 20.3907 10.6502 20.224 10.8002L16.549 13.9752L17.649 18.7002C17.699 18.9169 17.6824 19.1127 17.599 19.2877C17.5157 19.4627 17.399 19.6085 17.249 19.7252C17.099 19.8419 16.924 19.9085 16.724 19.9252C16.524 19.9419 16.3324 19.8919 16.149 19.7752L11.999 17.2752Z" fill="#FCBD02" />
                        </svg>
                      </div>
                      : <CloudinaryImage
                        src="/_next/images/hero/star-rating.png"
                        alt="star"
                        width={140}
                        height={24}
                        className="object-contain shrink-0 hidden md:block"
                      />
                    }
                    <span className="text-white text-[15px] sm:text-[17px] md:text-[20px] tracking-[-1px]">
                      {rating.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4">
              {buttons.map((btn, index) => {
                const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();

                  // Check if this is the "Free Consultation" button
                  if (btn.text === "Free Consultation") {
                    await openSupportBoard();
                    return;
                  }

                  if (btn.href) {
                    if (btn.href.startsWith("#")) {
                      // Handle anchor links with smooth scroll
                      const targetId = btn.href.substring(1);
                      const targetElement = document.getElementById(targetId);
                      if (targetElement) {
                        // Calculate header height dynamically
                        const header = document.querySelector("header");
                        const headerHeight = header ? (window.innerWidth >= 768 ? 100 : 70) : 0;

                        if (window.lenis) {
                          // Use Lenis for smooth scroll
                          window.lenis.scrollTo(targetElement, {
                            offset: -headerHeight - 20, // Account for header height + padding
                            duration: 1.2,
                          });
                        } else {
                          // Fallback: scroll with offset
                          const elementPosition = targetElement.getBoundingClientRect().top;
                          const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                          });
                        }
                      }
                    } else {
                      // Handle external links
                      window.location.href = btn.href;
                    }
                  }
                };

                return (
                  <button
                    key={index}
                    onClick={handleClick}
                    className={
                      btn.variant === "primary"
                        ? "max-md:leading-none bg-[#0073ec] hover:bg-[#005bb5] px-[28px] py-4 sm:px-[38px] rounded-[45px] text-white text-[18px] sm:text-[20px] font-medium tracking-[-1px]"
                        : "max-md:leading-none border border-white px-[28px] py-4 sm:px-[38px] rounded-[45px] text-white text-[18px] sm:text-[20px] font-medium tracking-[-1px] hover:bg-white/10"
                    }
                  >
                    {btn.text}
                  </button>
                );
              })}
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
