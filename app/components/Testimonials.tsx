'use client';

import { useEffect, useRef, useState } from 'react';
import CloudinaryImage from "@/components/CloudinaryImage";
import testimonialsData from "../../data/testimonials.json";

export default function Testimonials() {
  const { testimonials } = testimonialsData;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any | null>(null);
  
  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];
  
  const handlePlayClick = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };
  
  const closeVideoModal = () => {
    setSelectedVideo(null);
  };
  
  const handleReadMore = (testimonial: any) => {
    setSelectedTestimonial(testimonial);
  };
  
  const closeTestimonialModal = () => {
    setSelectedTestimonial(null);
  };
  
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
              <TestimonialCard 
                key={`${testimonial.id}-${index}`} 
                testimonial={testimonial} 
                onPlayClick={handlePlayClick}
                onReadMore={handleReadMore}
              />
            ))}
          </div>
        </div>

      </div>
      
      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal videoUrl={selectedVideo} onClose={closeVideoModal} />
      )}
      
      {/* Testimonial Detail Modal */}
      {selectedTestimonial && (
        <TestimonialDetailModal testimonial={selectedTestimonial} onClose={closeTestimonialModal} />
      )}
    </section>
  );
}

function TestimonialCard({ 
  testimonial, 
  onPlayClick,
  onReadMore
}: { 
  testimonial: { 
    id: number; 
    type: string;
    category: string; 
    quote: string; 
    author: string; 
    role: string; 
    bgColor: string; 
    image: string; 
    imageCloudinaryId?: string;
    videoUrl?: string;
  };
  onPlayClick: (videoUrl: string) => void;
  onReadMore: (testimonial: any) => void;
}) {
  // Show large image if type is "text-image" or "text-image-video"
  const showLargeImage = testimonial.type === "text-image" || testimonial.type === "text-image-video";
  // Show play button only if type is "text-image-video" and videoUrl exists
  const showPlayButton = testimonial.type === "text-image-video" && testimonial.videoUrl;
  
  return (
    <div className="bg-white flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-12 items-start px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12 rounded-3xl shrink-0 w-[320px] sm:w-[500px] lg:w-[600px] h-[400px] sm:h-[450px] lg:h-[500px]">
      {/* Left Content */}
      <div className="flex flex-1 flex-col gap-6 sm:gap-8 items-start w-full">
        {/* Category Tag */}
        <p className="font-medium leading-normal text-[12px] sm:text-[14px] text-black uppercase">
          {testimonial.category}
        </p>
        
        {/* Quote - reduced size */}
        <p className="font-semibold leading-[1.3] text-[16px] sm:text-[18px] lg:text-[20px] text-black w-full">
          "{testimonial.quote}"
        </p>
        
        {/* Read More Link */}
        <button 
          onClick={() => onReadMore(testimonial)}
          className="font-medium text-[16px] sm:text-[18px] text-black tracking-[-0.5px] underline hover:text-[#0073ec] transition-colors text-left"
        >
          Read More
        </button>
        
        {/* Client Info */}
        <div className="flex gap-3 sm:gap-4 items-center w-full mt-auto">
          <div className="relative rounded-full shrink-0 size-10 sm:size-12 overflow-hidden">
            <CloudinaryImage
              src={testimonial.image}
              cloudinaryId={testimonial.imageCloudinaryId}
              alt={testimonial.author}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <div className="flex flex-1 flex-col gap-0.5 text-black">
            <p className="font-semibold text-[16px] sm:text-[18px]">{testimonial.author}</p>
            <p className="font-normal text-[14px] sm:text-[16px] text-[#4d4d4d]">{testimonial.role}</p>
          </div>
        </div>
      </div>
      
      {/* Right Large Image (only for first testimonial) */}
      {showLargeImage && (
        <div className="bg-gray-200 overflow-hidden relative rounded-2xl shrink-0 w-full sm:w-[200px] lg:w-[240px] h-full">
          <CloudinaryImage
            src={testimonial.image}
            cloudinaryId={testimonial.imageCloudinaryId}
            alt={testimonial.author}
            fill
            className="object-cover"
          />
          {/* Play Button Overlay - only show if type is text-image-video */}
          {showPlayButton && testimonial.videoUrl && (
            <button
              onClick={() => onPlayClick(testimonial.videoUrl!)}
              className="absolute bottom-4 right-4 bg-white/90 rounded-full p-3 hover:bg-white transition-colors cursor-pointer z-10"
              aria-label="Play video"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5V19L19 12L8 5Z" fill="black"/>
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function VideoModal({ videoUrl, onClose }: { videoUrl: string; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // Play video when modal opens
    if (videoRef.current) {
      videoRef.current.play();
    }
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        
        {/* Video Player */}
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="w-full h-auto max-h-[80vh]"
          onEnded={onClose}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

function TestimonialDetailModal({ testimonial, onClose }: { testimonial: any; onClose: () => void }) {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const showLargeImage = testimonial.type === "text-image" || testimonial.type === "text-image-video";
  const showPlayButton = testimonial.type === "text-image-video" && testimonial.videoUrl;
  
  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/30 rounded-full p-2 transition-colors"
          aria-label="Close modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        
        <div className="flex flex-col lg:flex-row gap-8 p-8 lg:p-12">
          {/* Left Content */}
          <div className="flex flex-1 flex-col gap-6">
            {/* Category Tag */}
            <p className="font-medium leading-normal text-[14px] text-black uppercase">
              {testimonial.category}
            </p>
            
            {/* Quote */}
            <p className="font-semibold leading-[1.3] text-[24px] sm:text-[28px] lg:text-[32px] text-black">
              "{testimonial.quote}"
            </p>
            
            {/* Client Info */}
            <div className="flex gap-4 items-center">
              <div className="relative rounded-full shrink-0 size-16 overflow-hidden">
                <CloudinaryImage
                  src={testimonial.image}
                  cloudinaryId={testimonial.imageCloudinaryId}
                  alt={testimonial.author}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1 text-black">
                <p className="font-semibold text-[20px]">{testimonial.author}</p>
                <p className="font-normal text-[16px] text-[#4d4d4d]">{testimonial.role}</p>
              </div>
            </div>
          </div>
          
          {/* Right Large Image (if applicable) */}
          {showLargeImage && (
            <div className="bg-gray-200 overflow-hidden relative rounded-2xl shrink-0 w-full lg:w-[300px] h-[300px] lg:h-[400px]">
              <CloudinaryImage
                src={testimonial.image}
                cloudinaryId={testimonial.imageCloudinaryId}
                alt={testimonial.author}
                fill
                className="object-cover"
              />
              {/* Play Button Overlay (if video available) */}
              {showPlayButton && testimonial.videoUrl && (
                <button
                  onClick={() => {
                    onClose();
                    // You can trigger video modal here if needed
                  }}
                  className="absolute bottom-4 right-4 bg-white/90 rounded-full p-4 hover:bg-white transition-colors cursor-pointer z-10"
                  aria-label="Play video"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19L19 12L8 5Z" fill="black"/>
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

