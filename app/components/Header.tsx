"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import HamburgerMenu from "./HamburgerMenu";
import HeaderLinks from "./header/HeaderLinks";

interface HeaderContentProps {
  isHeaderFixed: boolean;
  variant?: "default" | "menu";
  onClose?: () => void;
}

export function HeaderContent({ isHeaderFixed, variant = "default", onClose }: HeaderContentProps) {
  if (variant === "menu") {
    return (
      <div className="flex items-center justify-between py-5">
          <div className="h-[28px] md:h-[46.614px] max-h-full md:w-[254.06px] relative">
            <Image
              src="/_next/icons/logo.svg"
              alt="Bobcares Logo"
              width={254}
              height={47}
              className="h-full w-auto"
              style={{ width: "auto" }}
            />
          </div>
        <div className="flex items-center gap-4 md:gap-[30px]">
          <HeaderLinks variant="menu" />
          {onClose && (
            <button
              onClick={onClose}
              className="md:p-2 hover:opacity-70 transition-opacity"
              aria-label="Close menu"
            >
              <Image
                src="/_next/icons/navigation/close.svg"
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
          <div className="h-[28px] md:h-[46.614px] max-h-full md:w-[254.06px] relative">
            <Image
              src={isHeaderFixed ? "/_next/icons/logo.svg" : "/_next/icons/logo-white.svg"}
              alt="Bobcares Logo"
              width={254}
              height={47}
              className="h-full w-auto"
              style={{ width: "auto" }}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-4 md:gap-[30px] items-center justify-end">
        <HeaderLinks isHeaderFixed={isHeaderFixed} variant="default" />
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
      "z-50 w-full h-[70px] md:h-[100px] py-4 transition-colors duration-300 flex items-center",
      isHeaderFixed ? "relative" : "sticky top-0",
      isHeaderFixed
        ? "bg-transparent border-transparent text-white"
        : "bg-white border-b border-[#e8e8e8] text-black",
    )}>
      <HeaderContent isHeaderFixed={isHeaderFixed} />
    </header>
  );
}
