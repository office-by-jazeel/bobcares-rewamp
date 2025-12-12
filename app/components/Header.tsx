"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import HamburgerMenu from "./HamburgerMenu";

interface HeaderContentProps {
  isTransparent: boolean;
  variant?: "default" | "menu";
  onClose?: () => void;
}

export function HeaderContent({ isTransparent, variant = "default", onClose }: HeaderContentProps) {
  const textButtonClasses = [
    "backdrop-blur-md border border-solid flex items-center justify-center px-8 py-[18px] rounded-[45px] transition-colors",
    isTransparent ? "border-white/20 hover:bg-black/10" : "border-[#0073EC] bg-[#0073EC] hover:bg-[#0045D9]",
  ].join(" ");

  if (variant === "menu") {
    return (
      <div className="flex items-center justify-between py-5">
        <div className="h-[28px] md:h-[46.614px] max-h-full w-[254.06px] relative">
          <Image
            src={isTransparent ? "/icons/logo.svg" : "/icons/logo-white.svg"}
            alt="Bobcares Logo"
            width={254}
            height={47}
            className="h-full w-auto"
          />
        </div>
        <div className="flex items-center gap-[30px] md:gap-6">
          <button className={cn(
            "md:border md:border-white/20 md:border-solid flex items-center justify-center md:p-5 rounded-[45px] md:size-[60px] hover:bg-black/10 transition-colors",
            !isTransparent && "md:border-[#9898982E] bg-[#00000003]"
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
            "hidden border border-white/20 border-solid md:flex items-center justify-center p-5 rounded-[45px] size-[60px] hover:bg-black/10 transition-colors",
            !isTransparent && "border-[#9898982E] bg-[#00000003]"
          )}>
            <Image
              src="/icons/phone-icon.svg"
              alt="Phone"
              width={26}
              height={26}
              className={cn("size-[26px]", !isTransparent && "-invert brightness-0")}
            />
          </button>
          <button className={cn(textButtonClasses, "hidden md:block")}>
            <span
              className={cn(
                "font-medium text-[20px] leading-[22px] text-white"
              )}
            >
              Client Area
            </span>
          </button>
          <button className={cn(textButtonClasses, "hidden md:block")}>
            <span
              className={cn(
                "font-medium text-[20px] leading-[22px] text-white"
              )}
            >
              Emergency
            </span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="md:p-2 hover:opacity-70 transition-opacity"
              aria-label="Close menu"
            >
              <Image
                src="/icons/close.svg"
                alt="Close"
                width={24}
                height={24}
                className="size-6"
              />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-5 sm:px-8 flex items-center justify-between">
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-start pb-1 pt-0 px-1">
          <div className="h-[28px] md:h-[46.614px] max-h-full w-[254.06px] relative">
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
      <div className="flex gap-[30px] items-center justify-end">
        <div className="flex gap-4 items-center">
          <button className={cn(
            "md:border md:border-white/20 md:border-solid flex items-center justify-center md:p-5 md:rounded-[45px] md:size-[60px] hover:bg-black/10 transition-colors",
            !isTransparent && "md:border-[#9898982E] bg-[#00000003]"
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
            "border border-white/20 border-solid hidden md:flex items-center justify-center p-5 rounded-[45px] size-[60px] hover:bg-black/10 transition-colors",
            !isTransparent && "border-[#9898982E] bg-[#00000003]"
          )}>
            <Image
              src="/icons/phone-icon.svg"
              alt="Phone"
              width={26}
              height={26}
              className={cn("size-[26px]", !isTransparent && "-invert brightness-0")}
            />
          </button>
          <button className={cn(textButtonClasses, "hidden md:block")}>
            <span
              className={cn(
                "font-medium text-[20px] leading-[22px] text-white"
              )}
            >
              Emergency
            </span>
          </button>
        </div>
        <HamburgerMenu isTransparent={isTransparent} />
      </div>
    </div>
  );
}

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

  return (
    <header className={cn(
      "z-50 w-full h-[70px] md:h-[100px] py-4 md:py-4 transition-colors duration-300",
      isTransparent ? "relative" : "sticky top-0",
      isTransparent
        ? "bg-transparent border-transparent text-white"
        : "bg-white border-b border-[#e8e8e8] text-black",
    )}>
      <HeaderContent isTransparent={isTransparent} />
    </header>
  );
}
