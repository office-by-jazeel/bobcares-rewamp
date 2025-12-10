'use client';

import { useEffect, useRef, useState } from 'react';
import CloudinaryImage from "@/components/CloudinaryImage";
import testimonialsData from "../../data/testimonials.json";

export default function Testimonials() {
  const { testimonials } = testimonialsData;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];
  
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollPosition = 0;
    const scrollSpeed = 3; // pixels per frame
    let animationFrameId: number;
    let lastTime = performance.now();

    const scroll = (currentTime: number) => {
      if (isPaused) {
        animationFrameId = requestAnimationFrame(scroll);
        return;
      }

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Calculate scroll based on time for consistent speed
      scrollPosition += scrollSpeed * (deltaTime / 16.67); // Normalize to 60fps
      
      // Calculate the width of one set of testimonials
      const singleSetWidth = container.scrollWidth / 2;
      
      // Reset scroll position when we've scrolled through one full set
      if (scrollPosition >= singleSetWidth) {
        scrollPosition = scrollPosition - singleSetWidth;
      }
      
      container.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(scroll);
    };

    // Wait for content to load before starting scroll
    const startScroll = () => {
      if (container.scrollWidth > 0) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(scroll);
      } else {
        setTimeout(startScroll, 100);
      }
    };

    startScroll();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPaused]);

  return (
    <section className="bg-[#110536] flex flex-col items-center px-6 sm:px-12 lg:px-[180px] py-[80px] lg:py-[140px] relative overflow-hidden">
      <div className="w-full max-w-[1560px] flex flex-col gap-12 lg:gap-20">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 w-full">
          <h2 className="font-semibold leading-[1.1] text-[40px] sm:text-[56px] lg:text-[72px] xl:text-[96px] text-white tracking-[-1px]">
            <span>Kind words from </span>
            <br className="hidden sm:block" />
            <span className="text-[#00e8e8]">valued clients</span>
          </h2>
          <button className="
            border border-solid border-white 
            flex items-center justify-center 
            px-8 sm:px-[38px] py-4 sm:py-5 
            rounded-[45px] 
            hover:bg-white/10 
            transition-colors
            shrink-0
          ">
            <span className="font-medium text-[18px] sm:text-[20px] text-white tracking-[-1px]">
              View All Testimonials
            </span>
          </button>
        </div>

        {/* Carousel */}
        <div className="w-full overflow-hidden">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-6 items-start overflow-x-auto pb-4 scrollbar-hide"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollBehavior: 'auto'
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <TestimonialCard key={`${testimonial.id}-${index}`} testimonial={testimonial} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: { id: number; category: string; quote: string; author: string; role: string; bgColor: string; image: string; imageCloudinaryId?: string } }) {
  return (
    <div 
      className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-[52px] items-start px-8 sm:px-12 lg:px-14 py-12 sm:py-14 lg:py-16 rounded-3xl shrink-0 w-[320px] sm:w-[600px] lg:w-[840px]"
      style={{ backgroundColor: testimonial.bgColor }}
    >
      <div className="flex flex-1 flex-col gap-6 sm:gap-8 lg:gap-[52px] items-start w-full">
        <div className="flex flex-col gap-6 sm:gap-8 items-start w-full">
          <p className="font-medium leading-normal text-[14px] sm:text-[16px] text-black uppercase w-full">
            {testimonial.category}
          </p>
          <p className="font-semibold leading-[1.2] text-[24px] sm:text-[32px] lg:text-[40px] text-black w-full">
            "{testimonial.quote}"
          </p>
          <a href="#" className="font-medium text-[18px] sm:text-[20px] text-black tracking-[-0.5px] underline hover:text-[#0073ec] transition-colors">
            Read More
          </a>
        </div>
        <div className="flex gap-4 items-center w-full">
          <div className="relative rounded-full shrink-0 size-12 sm:size-14 overflow-hidden">
            <CloudinaryImage
              src={testimonial.image}
              cloudinaryId={testimonial.imageCloudinaryId}
              alt={testimonial.author}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1 items-start text-black">
            <p className="font-semibold text-[18px] sm:text-[20px] w-full">{testimonial.author}</p>
            <p className="font-normal text-[14px] sm:text-[16px] w-full">{testimonial.role}</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-300 overflow-hidden relative rounded-2xl shrink-0 w-full sm:w-[200px] lg:w-[284px] h-[200px] sm:h-auto sm:self-stretch">
        <CloudinaryImage
          src={testimonial.image}
          cloudinaryId={testimonial.imageCloudinaryId}
          alt={testimonial.author}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}

