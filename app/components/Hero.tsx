"use client";

import { useState } from "react";
import VideoCarousel from "@/components/VideoCarousel";
import VideoTimeline from "@/components/VideoTimeline";
import heroData from "../../data/hero.json";

export default function Hero() {
  const { title, description, ratings, buttons, backgroundVideos } = heroData;

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDurations, setVideoDurations] = useState<number[]>([]);

  return (
    <section
      id="hero-section"
      className="relative h-dvh w-full overflow-hidden">

      {/* ================= BACKGROUND VIDEO ================= */}
      <div className="absolute inset-0 w-full h-full">
        <VideoCarousel
          videos={backgroundVideos}
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
      <div className="
        absolute 
        z-20 
        left-6 right-6 
        top-[200px]
      ">
        <div className="container mx-auto flex flex-col gap-8">

          {/* TITLE */}
          <h1 className="
          text-white font-bold tracking-[-1.5px] whitespace-pre-wrap
          text-[42px] leading-[1]
          sm:text-[56px]
          md:text-[72px]
          lg:text-[96px] lg:leading-[0.85]
        max-w-[900px]
        ">
            {title.line1}
          </h1>

          {/* DESCRIPTION */}
          <p className="text-white w-full md:w-[520px] text-[16px] sm:text-[18px] md:text-[20px] leading-[1.5] whitespace-pre-wrap
        max-w-[900px]">
            {description.line1} <br /> {description.line2}
          </p>

          {/* RATINGS */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-6 md:gap-10">
            {ratings.map((rating, index) => (
              <div key={index} className="flex items-center gap-3 md:gap-4">
                {index > 0 && (
                  <div className="hidden md:block h-6 border-l border-white/30" />
                )}

                <span className="text-white text-xl">{rating.icon}</span>
                <span className="text-white text-[16px] sm:text-[18px] md:text-[20px] tracking-[-1px]">
                  {rating.platform}
                </span>
                <span className="text-white text-[16px] sm:text-[18px] md:text-[20px] tracking-[-1px]">
                  {rating.rating}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= BUTTONS + TIMELINE ================= */}
      <div
        className="
          absolute w-full px-6 
          bottom-[70px]
          md:bottom-[90px]
          lg:bottom-[120px]
          flex flex-col gap-6
          md:flex-row md:items-center md:justify-between 
          md:left-[80px]
          lg:left-[160px] lg:w-[calc(100%-320px)]
          z-30
        "
      >
        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4">
          {buttons.map((btn, index) => (
            <button
              key={index}
              className={
                btn.variant === "primary"
                  ? "bg-[#0073ec] hover:bg-[#005bb5] px-[28px] py-4 sm:px-[38px] sm:py-5 rounded-[45px] text-white text-[18px] sm:text-[20px] font-medium tracking-[-1px]"
                  : "border border-white px-[28px] py-4 sm:px-[38px] sm:py-5 rounded-[45px] text-white text-[18px] sm:text-[20px] font-medium tracking-[-1px] hover:bg-white/10"
              }
            >
              {btn.text}
            </button>
          ))}
        </div>

        {/* TIMELINE — moves under buttons on small screens */}
        <div className="flex justify-center md:justify-end md:pr-[100px] lg:pr-[10px]">
          <VideoTimeline
            videos={backgroundVideos}
            currentVideoIndex={currentVideoIndex}
            currentTime={currentTime}
            videoDurations={videoDurations}
            onVideoClick={(index) => setCurrentVideoIndex(index)}
          />
        </div>
      </div>
    </section>
  );
}
