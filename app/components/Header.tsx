"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [heroVisible, setHeroVisible] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("hero-section");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      {
        threshold: 0.1,
      }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const isTransparent = heroVisible;

  const headerClasses = [
    "z-50 flex h-[100px] items-center justify-between px-[180px] py-4 transition-colors duration-300",
    isTransparent ? "relative" : "sticky top-0",
    isTransparent
      ? "bg-transparent border-transparent text-white"
      : "bg-white border-b border-[#e8e8e8] text-black",
  ].join(" ");

  const iconButtonClasses = [
    "backdrop-blur-md border border-solid flex items-center justify-center p-5 rounded-[45px] size-[60px] hover:bg-black/10 transition-colors",
    isTransparent ? "border-white/20" : "border-black/10",
  ].join(" ");

  const textButtonClasses = [
    "backdrop-blur-md border border-solid flex items-center justify-center px-8 py-[18px] rounded-[45px] hover:bg-black/10 transition-colors",
    isTransparent ? "border-white/20" : "border-black/10",
  ].join(" ");

  return (
    <header className={headerClasses}>
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-start pb-1 pt-0 px-1">
          <div className="h-[46.614px] w-[254.06px] relative">
            <Image
              src={isTransparent ? "/icons/logo.svg" : "/icons/logo-white.svg"}
              alt="Bobcares Logo"
              width={254}
              height={47}
              className="h-full w-auto"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-5 items-center justify-end">
        <div className="flex gap-4 items-center">
          <button className={cn(
            "border border-white/20 border-solid flex items-center justify-center p-5 rounded-[45px] size-[60px] hover:bg-black/10 transition-colors",
            // isTransparent ? ""backdrop-blur-md bg-black/5 : ""
          )}>
            <Image
              src="/icons/search-icon.svg"
              alt="Search"
              width={26}
              height={26}
              className={cn("size-[26px]", !isTransparent && "-invert brightness-0")}
            />
          </button>
          <button className={cn(
            "border border-white/20 border-solid flex items-center justify-center p-5 rounded-[45px] size-[60px] hover:bg-black/10 transition-colors",
            isTransparent ? "backdrop-blur-md bg-black/5" : ""
          )}>
            <Image
              src="/icons/phone-icon.svg"
              alt="Phone"
              width={26}
              height={26}
              className={cn("size-[26px]", !isTransparent && "-invert brightness-0")}
            />
          </button>
          <button className={textButtonClasses}>
            <span
              className={`font-medium text-[20px] leading-[22px] ${isTransparent ? "text-white/80" : "text-black/80"
                }`}
            >
              Emergency
            </span>
          </button>
        </div>
        <button className="h-3 w-10 relative">
          <Image
            src="/icons/menu-icon.svg"
            alt="Menu"
            fill
            className="object-contain"
          />
        </button>
      </div>
    </header>
  );
}

