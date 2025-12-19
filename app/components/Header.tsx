"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import HamburgerMenu from "./HamburgerMenu";

interface HeaderContentProps {
  isHeaderFixed: boolean;
  variant?: "default" | "menu";
  onClose?: () => void;
}

export function HeaderContent({ isHeaderFixed, variant = "default", onClose }: HeaderContentProps) {
  const textButtonClasses = [
    "backdrop-blur-md border border-solid flex items-center justify-center px-8 py-[18px] rounded-[45px] transition-colors",
    variant == 'default'
      ? isHeaderFixed ? "border-[#FFFFFF2E] hover:bg-black/10" : "border-[#0073EC] bg-[#0073EC] hover:bg-[#0045D9]"
      : "border-[#FFFFFF2E]"
  ].join(" ");

  if (variant === "menu") {
    return (
      <div className="flex items-center justify-between py-5">
        <div className="h-[28px] md:h-[46.614px] max-h-full w-[254.06px] relative">
          <Image
            src={"/icons/logo.svg"}
            alt="Bobcares Logo"
            width={254}
            height={47}
            className="h-full w-auto"
          />
        </div>
        <div className="flex items-center gap-[30px] md:gap-6">
          <a
            href="https://bobcares.com/semantic?showAll=true"
            className={cn(
              "md:border md:border-white/20 md:border-solid flex items-center justify-center md:p-5 rounded-[45px] md:size-[60px] hover:bg-black/10 transition-colors",
              "md:border-[#9898982E] bg-[#00000003]"
            )}
            aria-label="Search"
          >
            <Image
              src="/icons/search-icon.svg"
              alt="Search"
              width={26}
              height={26}
              className={cn("size-[26px]")}
            />
          </a>
          <a
            href="tel:+18003835193"
            className={cn(
              "hidden border border-white/20 border-solid md:flex items-center justify-center p-5 rounded-[45px] size-[60px] hover:bg-black/10 transition-colors",
              "border-[#9898982E] bg-[#00000003]"
            )}
            aria-label="Call +18003835193"
          >
            <Image
              src="/icons/phone-icon.svg"
              alt="Phone"
              width={26}
              height={26}
              className={cn("size-[26px]")}
            />
          </a>
          <button className={cn(textButtonClasses, "hidden md:block")}>
            <span
              className={cn(
                "font-medium text-[20px] leading-[22px] text-white truncate"
              )}
            >
              Client Area
            </span>
          </button>
          <a
            href="https://bobcares.com/emergency-server-support/"
            className={cn(textButtonClasses, "hidden md:block hover:border-[#D44A4C]")}
          >
            <span
              className={cn(
                "font-medium text-[20px] leading-[22px] text-white"
              )}
            >
              Emergency
            </span>
          </a>
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
    <div className="container mx-auto flex items-center justify-between">
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-start pb-1 pt-0 px-1">
          <div className="h-[28px] md:h-[46.614px] max-h-full w-[254.06px] relative">
            <Image
              src={isHeaderFixed ? "/icons/logo.svg" : "/icons/logo-white.svg"}
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
          <a
            href="https://bobcares.com/semantic?showAll=true"
            className={cn(
              "backdrop-blur-md md:border md:border-white/20 md:border-solid flex items-center justify-center md:p-5 md:rounded-[45px] md:size-[60px] hover:bg-black/10 transition-colors",
              !isHeaderFixed && "md:border-[#9898982E] bg-[#00000003]"
            )}
            aria-label="Search"
          >
            <Image
              src="/icons/search-icon.svg"
              alt="Search"
              width={26}
              height={26}
              className={cn("size-[26px]", !isHeaderFixed && "-invert brightness-0")}
            />
          </a>
          <a
            href="tel:+18003835193"
            className={cn(
              "backdrop-blur-md border border-white/20 border-solid hidden md:flex items-center justify-center p-5 rounded-[45px] size-[60px] hover:bg-black/10 transition-colors",
              !isHeaderFixed && "border-[#9898982E] bg-[#00000003]"
            )}
            aria-label="Call +18003835193"
          >
            <Image
              src="/icons/phone-icon.svg"
              alt="Phone"
              width={26}
              height={26}
              className={cn("size-[26px]", !isHeaderFixed && "-invert brightness-0")}
            />
          </a>
          <a
            href="https://bobcares.com/emergency-server-support/"
            className={cn(textButtonClasses, "hidden md:block", isHeaderFixed && "hover:border-[#D44A4C]")}
          >
            <span
              className={cn(
                "font-medium text-[20px] leading-[22px] text-white"
              )}
            >
              Emergency
            </span>
          </a>
        </div>
        <HamburgerMenu isHeaderFixed={isHeaderFixed} />
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

  const isHeaderFixed = heroVisible;

  return (
    <header className={cn(
      "z-50 w-full h-[70px] md:h-[100px] py-4 md:py-4 transition-colors duration-300",
      isHeaderFixed ? "relative" : "sticky top-0",
      isHeaderFixed
        ? "bg-transparent border-transparent text-white"
        : "bg-white border-b border-[#e8e8e8] text-black",
    )}>
      <HeaderContent isHeaderFixed={isHeaderFixed} />
    </header>
  );
}
