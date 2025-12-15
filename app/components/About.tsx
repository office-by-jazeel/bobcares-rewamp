"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CloudinaryImage from "@/components/CloudinaryImage";
import aboutData from "../../data/about.json";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About() {
  const { stats, teamImage, teamImageCloudinaryId, backgroundImage, backgroundImageCloudinaryId } = aboutData;
  return (
    <section className="relative overflow-hidden">
      <div className="bg-black">
        <div className="container mx-auto flex flex-col items-center py-14 lg:py-[140px] relative">
          {/* Background with subtle grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <CloudinaryImage
              src={backgroundImage}
              cloudinaryId={backgroundImageCloudinaryId}
              alt="Background"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative z-10 w-full">
            <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-32 items-center">

              {/* Left Section - Team Photo */}
              <div className="w-full lg:w-1/2 shrink-0">
                <div className="relative w-full aspect-square rounded-3xl overflow-hidden">
                  <CloudinaryImage
                    src={teamImage}
                    cloudinaryId={teamImageCloudinaryId}
                    alt="Team collaboration"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Right Section - Content */}
              <div className="w-full lg:w-1/2 flex flex-col gap-6 sm:gap-8 lg:gap-10">
                {/* Heading */}
                <p className="font-normal text-[14px] sm:text-[16px] text-[#9e9e9e] uppercase tracking-wide">
                  OUR SUCCESS
                </p>

                {/* Tagline */}
                <h2 className="font-grotesque font-semibold leading-[1.05] text-[48px] lg:text-[72px] tracking-[-1px] -mt-4">
                  <span className="text-white">We love technology, giving</span>{' '}
                  <span className="text-[#6e6e6e]">back, and great experiences.</span>
                </h2>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 md:gap-20 mt-6 sm:mt-8">
                  {stats.map((stat) => (
                    <StatItem key={stat.id} stat={stat} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ stat }: { stat: { value: string; label: string } }) {
  const [displayValue, setDisplayValue] = useState("0");
  const valueRef = useRef<HTMLParagraphElement>(null);
  const hasAnimated = useRef(false);

  // Parse value to extract number and suffix
  const parseValue = (value: string) => {
    // Match number (including decimals) and optional suffix (M, +, etc.)
    const match = value.match(/^([\d.]+)(.*)$/);
    if (!match) return { number: 0, suffix: "" };

    const number = parseFloat(match[1]);
    const suffix = match[2] || "";
    return { number, suffix };
  };

  useEffect(() => {
    if (!valueRef.current || hasAnimated.current) return;

    const { number, suffix } = parseValue(stat.value);

    // Format number based on suffix
    const formatNumber = (num: number): string => {
      if (suffix === "M" || suffix === "m") {
        // For millions, show one decimal place if needed
        return num.toFixed(num % 1 !== 0 ? 1 : 0);
      }
      // For other values, show as integer
      return Math.floor(num).toString();
    };

    const scrollTrigger = ScrollTrigger.create({
      trigger: valueRef.current,
      start: "top 80%",
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        gsap.to(
          { value: 0 },
          {
            value: number,
            duration: 2,
            ease: "power2.out",
            onUpdate: function () {
              const currentValue = this.targets()[0].value;
              setDisplayValue(formatNumber(currentValue) + suffix);
            },
          }
        );
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [stat.value]);

  return (
    <div className="flex flex-col gap-4 relative md:pl-8">
      {/* Blue accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#133DE2] hidden md:block"></div>

      {/* Stat value */}
      <p
        ref={valueRef}
        className="font-bold text-[40px] sm:text-[52px] lg:text-[64px] text-white tracking-[-0.64px] leading-none"
      >
        {displayValue}
      </p>

      {/* Stat label */}
      <p className="font-normal text-[15px] sm:text-[18px] lg:text-[20px] text-[#FFFFFF] tracking-[-0.2px]">
        {stat.label}
      </p>
    </div>
  );
}

