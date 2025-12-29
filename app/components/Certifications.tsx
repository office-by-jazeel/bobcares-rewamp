"use client";

import { useState, useRef, useEffect } from "react";
import CloudinaryImage from "@/components/CloudinaryImage";
import certificationsData from "../../data/certifications.json";

interface Certification {
  id: number;
  provider: string;
  title: string;
  level: string;
  icon: string;
  iconCloudinaryId?: string;
}

export default function Certifications() {
  const { certifications } = certificationsData as { certifications: Certification[] };
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Duplicate certifications for seamless infinite loop
  const duplicatedCertifications = [...certifications, ...certifications, ...certifications];

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeaveContainer = () => {
    setIsDragging(false);
    setIsHovering(false);
  };

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Initialize scroll position for seamless loop
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollWidth = container.scrollWidth;
      // Start at 1/3 to allow seamless scrolling in both directions
      container.scrollLeft = scrollWidth / 3;
    }
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!scrollContainerRef.current || isDragging || isHovering) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const scroll = () => {
      if (!scrollContainerRef.current || isDragging || isHovering) return;

      const container = scrollContainerRef.current;
      const scrollWidth = container.scrollWidth;
      const oneThird = scrollWidth / 3;

      // If we've scrolled past 2/3 of the way, reset to 1/3 for seamless loop
      if (container.scrollLeft >= oneThird * 2) {
        container.scrollLeft = oneThird + (container.scrollLeft - oneThird * 2);
      } else {
        const scrollSpeed = isMobile ? 1.5 : 3; // Slower speed on mobile
        container.scrollLeft += scrollSpeed;
      }

      animationFrameRef.current = requestAnimationFrame(scroll);
    };

    animationFrameRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDragging, isHovering, isMobile]);

  return (
    <section>
      <div className="bg-white">
        <div className="container mx-auto flex flex-col items-center py-14 lg:py-[140px]">
          <div className="w-full flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-16 items-center">

            {/* Left Section - Text */}
            <div className="flex flex-col gap-6 sm:gap-8 lg:gap-14 items-start text-black w-full lg:w-auto lg:max-w-[45%]">
              <div className="flex flex-col gap-4 lg:gap-1 items-start w-full">
                {/* <p className="font-medium text-[14px] sm:text-[16px] uppercase">Our Achievements</p> */}
                <h2 className="font-grotesque font-semibold leading-[0.8] text-[48px] lg:text-[72px] xl:text-[96px] tracking-[-1px]">
                  <span>Proven Expertise Supported by Globally Recognized</span>{' '}
                  <span className="text-[#133de2]">Certifications</span>
                </h2>
              </div>
              <p className="font-normal leading-[1.6] text-[15px] sm:text-[18px] lg:text-[20px] hidden md:block">
                Our certifications are a testament to our proven reliability and industry-trusted performance
              </p>
            </div>

            {/* Right Section - Scrollable Cards */}
            <div className="w-full lg:w-auto lg:flex-1 overflow-hidden">
              <div
                ref={scrollContainerRef}
                className={`flex gap-4 md:gap-[22px] items-center overflow-x-auto pb-4 scrollbar-hide ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeaveContainer}
              >
                {duplicatedCertifications.map((cert: Certification, index: number) => (
                  <CertCard key={`${cert.id}-${index}`} cert={cert} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CertCard({ cert }: { cert: Certification }) {
  return (
    <div className="flex bg-[#f6f8fc] border border-[#EFEFEF] md:border-0 flex-col h-[200px] md:h-[300px] sm:h-[340px] lg:h-[361px] items-stretch justify-between p-4 md:p-6 sm:p-8 relative rounded-3xl shrink-0 w-[162px] md:w-[280px] sm:w-[300px] lg:w-[329px]">
      {/* Header: Logo at top */}
      <div className="flex items-center justify-center w-full flex-1 min-h-0 overflow-hidden pb-2 md:pb-4">
        <div className="relative size-24 sm:size-44 lg:size-56">
          <CloudinaryImage
            src={cert.icon}
            alt={cert.provider}
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Bottom: Title & level */}
      <div className="w-full shrink-0">
        <div className="flex flex-col gap-1 md:gap-1 items-center text-center leading-[1.4] w-full">
          <p className="font-semibold text-[14px] md:text-[18px] sm:text-[20px] text-black line-clamp-2">{cert.title}</p>
          <p className="font-medium text-[#4d4d4d] text-[12px] md:text-[14px] sm:text-[16px]">{cert.level}</p>
        </div>
      </div>
    </div>
  );
}

