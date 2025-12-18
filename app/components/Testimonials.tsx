'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import CloudinaryImage from "@/components/CloudinaryImage";
import testimonialsData from "../../data/testimonials.json";

interface Testimonial {
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
}

export default function Testimonials() {
  const { testimonials } = testimonialsData;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isInViewport, setIsInViewport] = useState(false);

  // Drag state management
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartScrollLeftRef = useRef<number>(0);
  const lastMoveXRef = useRef<number>(0);
  const lastMoveTimeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const momentumAnimationIdRef = useRef<number | null>(null);

  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  // Check if animation should be paused (hover/touch OR modal open OR dragging OR not in viewport)
  const shouldPause = isPaused || selectedVideo !== null || selectedTestimonial !== null || isDragging || !isInViewport;

  const handlePlayClick = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const handleReadMore = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
  };

  const closeTestimonialModal = () => {
    setSelectedTestimonial(null);
  };

  // Cancel momentum animation
  const cancelMomentum = useCallback(() => {
    if (momentumAnimationIdRef.current !== null) {
      cancelAnimationFrame(momentumAnimationIdRef.current);
      momentumAnimationIdRef.current = null;
    }
  }, []);

  // Update scroll position helper
  const updateScrollPosition = useCallback((newScrollLeft: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const singleSetWidth = container.scrollWidth / 2;
    scrollPositionRef.current = newScrollLeft;

    // Handle infinite scroll loop
    if (scrollPositionRef.current >= singleSetWidth) {
      scrollPositionRef.current = scrollPositionRef.current - singleSetWidth;
      dragStartScrollLeftRef.current = container.scrollLeft;
    } else if (scrollPositionRef.current < 0) {
      scrollPositionRef.current = singleSetWidth + scrollPositionRef.current;
      dragStartScrollLeftRef.current = container.scrollLeft;
    }

    container.scrollLeft = scrollPositionRef.current;
  }, []);

  // Momentum animation function
  const startMomentum = useCallback((initialVelocity: number) => {
    cancelMomentum();

    const container = scrollContainerRef.current;
    if (!container) return;

    let velocity = initialVelocity;
    const friction = 0.95; // Deceleration factor
    const minVelocity = 0.5; // Stop when velocity is below this threshold

    const animate = () => {
      const currentShouldPause = isPaused || selectedVideo !== null || selectedTestimonial !== null || isDragging || !isInViewport;

      if (Math.abs(velocity) < minVelocity || currentShouldPause) {
        cancelMomentum();
        // Sync scrollPositionRef when momentum ends
        scrollPositionRef.current = container.scrollLeft;
        return;
      }

      scrollPositionRef.current += velocity;
      updateScrollPosition(scrollPositionRef.current);
      velocity *= friction;
      momentumAnimationIdRef.current = requestAnimationFrame(animate);
    };

    momentumAnimationIdRef.current = requestAnimationFrame(animate);
  }, [cancelMomentum, updateScrollPosition, isPaused, selectedVideo, selectedTestimonial, isDragging, isInViewport]);

  // Check if target is an interactive element (button, link, etc.)
  const isInteractiveElement = (target: EventTarget | null): boolean => {
    if (!target || !(target instanceof HTMLElement)) return false;
    const tagName = target.tagName.toLowerCase();
    const isButton = tagName === 'button' || tagName === 'a';
    const isClickable = target.onclick !== null || target.getAttribute('role') === 'button';
    return isButton || isClickable || target.closest('button, a, [role="button"]') !== null;
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't start drag if clicking on interactive elements
    if (isInteractiveElement(e.target)) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    e.preventDefault();
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartScrollLeftRef.current = container.scrollLeft;
    lastMoveXRef.current = e.clientX;
    lastMoveTimeRef.current = performance.now();
    velocityRef.current = 0;
    cancelMomentum();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    e.preventDefault();

    const currentTime = performance.now();
    const deltaX = e.clientX - lastMoveXRef.current;
    const deltaTime = currentTime - lastMoveTimeRef.current;

    // Calculate velocity (pixels per millisecond)
    if (deltaTime > 0) {
      velocityRef.current = deltaX / deltaTime;
    }

    // Update scroll position
    const scrollDelta = e.clientX - dragStartXRef.current;
    const newScrollLeft = dragStartScrollLeftRef.current - scrollDelta;

    updateScrollPosition(newScrollLeft);
    lastMoveXRef.current = e.clientX;
    lastMoveTimeRef.current = currentTime;
  };

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    // Start momentum animation if velocity is significant
    if (Math.abs(velocityRef.current) > 0.1) {
      startMomentum(velocityRef.current);
    } else {
      // Sync scrollPositionRef when drag ends without momentum
      const container = scrollContainerRef.current;
      if (container) {
        scrollPositionRef.current = container.scrollLeft;
      }
    }
  }, [isDragging, startMomentum]);

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // Don't start drag if touching interactive elements
    if (isInteractiveElement(e.target)) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const touch = e.touches[0];
    setIsDragging(true);
    dragStartXRef.current = touch.clientX;
    dragStartScrollLeftRef.current = container.scrollLeft;
    lastMoveXRef.current = touch.clientX;
    lastMoveTimeRef.current = performance.now();
    velocityRef.current = 0;
    cancelMomentum();
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const currentTime = performance.now();
    const deltaX = touch.clientX - lastMoveXRef.current;
    const deltaTime = currentTime - lastMoveTimeRef.current;

    // Calculate velocity (pixels per millisecond)
    if (deltaTime > 0) {
      velocityRef.current = deltaX / deltaTime;
    }

    // Update scroll position
    const scrollDelta = touch.clientX - dragStartXRef.current;
    const newScrollLeft = dragStartScrollLeftRef.current - scrollDelta;

    updateScrollPosition(newScrollLeft);
    lastMoveXRef.current = touch.clientX;
    lastMoveTimeRef.current = currentTime;
  };

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    // Start momentum animation if velocity is significant
    if (Math.abs(velocityRef.current) > 0.1) {
      startMomentum(velocityRef.current);
    } else {
      // Sync scrollPositionRef when drag ends without momentum
      const container = scrollContainerRef.current;
      if (container) {
        scrollPositionRef.current = container.scrollLeft;
      }
    }
  }, [isDragging, startMomentum]);

  // Global mouse event handlers for drag outside container
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      const currentTime = performance.now();
      const deltaX = e.clientX - lastMoveXRef.current;
      const deltaTime = currentTime - lastMoveTimeRef.current;

      // Calculate velocity (pixels per millisecond)
      if (deltaTime > 0) {
        velocityRef.current = deltaX / deltaTime;
      }

      // Update scroll position
      const scrollDelta = e.clientX - dragStartXRef.current;
      const newScrollLeft = dragStartScrollLeftRef.current - scrollDelta;

      updateScrollPosition(newScrollLeft);
      lastMoveXRef.current = e.clientX;
      lastMoveTimeRef.current = currentTime;
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);

      // Start momentum animation if velocity is significant
      if (Math.abs(velocityRef.current) > 0.1) {
        startMomentum(velocityRef.current);
      } else {
        // Sync scrollPositionRef when drag ends without momentum
        const container = scrollContainerRef.current;
        if (container) {
          scrollPositionRef.current = container.scrollLeft;
        }
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, updateScrollPosition, startMomentum]);

  // Cleanup momentum on unmount
  useEffect(() => {
    return () => {
      cancelMomentum();
    };
  }, []);

  // Intersection Observer to detect when carousel is in viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInViewport(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1, // Trigger when at least 10% of the section is visible
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollSpeed = 3; // pixels per frame
    let animationFrameId: number;
    let lastTime = performance.now();

    // Initialize scroll position from container's current position when resuming
    if (container.scrollWidth > 0 && scrollPositionRef.current === 0) {
      scrollPositionRef.current = container.scrollLeft || 0;
    }

    const scroll = (currentTime: number) => {
      if (shouldPause) {
        // When paused, sync the ref with the current scroll position
        scrollPositionRef.current = container.scrollLeft;
        animationFrameId = requestAnimationFrame(scroll);
        return;
      }

      // When resuming, initialize from current scroll position
      if (scrollPositionRef.current === 0 || Math.abs(scrollPositionRef.current - container.scrollLeft) > 1) {
        scrollPositionRef.current = container.scrollLeft || 0;
      }

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Calculate scroll based on time for consistent speed
      scrollPositionRef.current += scrollSpeed * (deltaTime / 16.67); // Normalize to 60fps

      // Calculate the width of one set of testimonials
      const singleSetWidth = container.scrollWidth / 2;

      // Reset scroll position when we've scrolled through one full set
      if (scrollPositionRef.current >= singleSetWidth) {
        scrollPositionRef.current = scrollPositionRef.current - singleSetWidth;
      }

      container.scrollLeft = scrollPositionRef.current;
      animationFrameId = requestAnimationFrame(scroll);
    };

    // Wait for content to load before starting scroll
    const startScroll = () => {
      if (container.scrollWidth > 0) {
        // Initialize scroll position if not already set
        if (scrollPositionRef.current === 0) {
          scrollPositionRef.current = container.scrollLeft || 0;
        }
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
  }, [shouldPause]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="bg-[#110536] w-full flex flex-col gap-12 lg:gap-20 py-14 lg:py-[140px]">
        <div className="container mx-auto flex flex-col items-center relative">

          {/* Header */}
          <div className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 w-full">
              <h2 className="font-grotesque font-semibold leading-[1.05] text-[48px] md:text-[72px] text-white tracking-[-1px]">
                <span>Kind words from </span>
                <br className="hidden sm:block" />
                <span className="text-[#00e8e8]">valued clients</span>
              </h2>
              {/* <button className="hidden md:flex border border-solid border-white items-center justify-center px-7 sm:px-[32px] lg:px-[38px] py-3 lg:py-4
              rounded-[45px] hover:bg-white/10 transition-colors shrink-0">
                <span className="font-medium text-[16px] sm:text-[18px] lg:text-[20px] text-white tracking-[-1px]">
                  View All Testimonials
                </span>
              </button> */}
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="w-full">
          <div
            ref={scrollContainerRef}
            className={`flex gap-4 sm:gap-6 items-start overflow-x-auto pb-4 scrollbar-hide select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollBehavior: 'auto',
              userSelect: isDragging ? 'none' : 'auto'
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              setIsPaused(false);
              // Cancel drag if mouse leaves container
              if (isDragging) {
                setIsDragging(false);
                cancelMomentum();
                const container = scrollContainerRef.current;
                if (container) {
                  scrollPositionRef.current = container.scrollLeft;
                }
              }
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={(e) => {
              setIsPaused(true);
              handleTouchStart(e);
            }}
            onTouchMove={handleTouchMove}
            onTouchEnd={(e) => {
              handleTouchEnd();
              // Resume auto-scroll after touch ends (momentum will continue independently)
              // Use setTimeout to allow handleTouchEnd to complete first
              setTimeout(() => {
                if (selectedVideo === null && selectedTestimonial === null) {
                  setIsPaused(false);
                }
              }, 0);
            }}
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

        {/* <button className="w-fit mx-auto flex md:hidden border border-solid border-white items-center justify-center px-7 sm:px-[32px] lg:px-[38px] py-3 lg:py-4
              rounded-[45px] hover:bg-white/10 transition-colors shrink-0">
          <span className="font-medium text-[16px] sm:text-[18px] lg:text-[20px] text-white tracking-[-1px]">
            View All Testimonials
          </span>
        </button> */}
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

// Helper function to get initials from a name
function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Avatar placeholder component
function AvatarPlaceholder({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = getInitials(name);
  const sizeClasses = {
    sm: "text-[12px]",
    md: "text-[14px] sm:text-[16px]",
    lg: "text-[18px]"
  };

  return (
    <div className={`w-full h-full bg-gradient-to-br from-[#0073ec] to-[#00e8e8] flex items-center justify-center text-white font-semibold ${sizeClasses[size]}`}>
      {initials}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  onPlayClick,
  onReadMore
}: {
  testimonial: Testimonial;
  onPlayClick: (videoUrl: string) => void;
  onReadMore: (testimonial: Testimonial) => void;
}) {
  // Show large image if type is "text-image" or "text-image-video"
  const showLargeImage = testimonial.type === "text-image" || testimonial.type === "text-image-video";
  // Show play button only if type is "text-image-video" and videoUrl exists
  const showPlayButton = testimonial.type === "text-image-video" && !!testimonial.videoUrl && testimonial.videoUrl !== "";
  const hasImage = testimonial.image && testimonial.image.trim() !== "";

  return (
    <div className="bg-[#1A173A] p-[2px] rounded-3xl shrink-0 w-[320px] sm:w-[500px] lg:w-[728px]">
      <div className="bg-white flex flex-col md:flex-row gap-6 sm:gap-8 lg:gap-12 items-start px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12 rounded-[22px] min-h-[550px] md:h-auto md:min-h-[375px]">
        {/* Left Content */}
        <div className="flex flex-1 flex-col gap-6 items-start w-full">
          {/* Category Tag */}
          <p className="font-medium leading-normal text-[12px] sm:text-[14px] text-black uppercase">
            {testimonial.category}
          </p>

          {/* Large Image - Mobile (at top) */}
          {showLargeImage && (
            <div className="block md:hidden w-full">
              <LargeImage image={testimonial.image} imageCloudinaryId={testimonial.imageCloudinaryId} author={testimonial.author} showPlayButton={showPlayButton} videoUrl={testimonial.videoUrl} onPlayClick={onPlayClick} />
            </div>
          )}

          {/* Quote with gradient fade */}
          <div className="min-h-[104px] relative overflow-hidden">
            <p className="font-semibold leading-[1.3] text-[16px] sm:text-[18px] lg:text-[20px] text-black w-full line-clamp-4">
              {testimonial.quote}
            </p>
            {/* Gradient fade overlay - fades text from black to transparent */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          </div>

          {/* Read More Link */}
          <button
            onClick={() => onReadMore(testimonial)}
            className="font-medium text-[16px] sm:text-[18px] text-black tracking-[-0.5px] underline underline-offset-4 hover:text-[#0073ec] transition-colors text-left"
          >
            Read More
          </button>

          {/* Client Info */}
          <div className="flex gap-3 sm:gap-4 items-center w-full mt-auto">
            <div className="relative rounded-full shrink-0 size-10 sm:size-12 overflow-hidden bg-gray-200">
              {hasImage ? (
                <CloudinaryImage
                  src={testimonial.image}
                  cloudinaryId={testimonial.imageCloudinaryId}
                  alt={testimonial.author}
                  fill
                  className="object-cover rounded-full"
                />
              ) : (
                <AvatarPlaceholder name={testimonial.author} size="md" />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-0.5 text-black">
              <p className="font-semibold text-[16px] sm:text-[18px]">{testimonial.author}</p>
              <p className="font-normal text-[14px] sm:text-[16px] text-[#4d4d4d]">{testimonial.role}</p>
            </div>
          </div>
        </div>

        {/* Right Large Image - Desktop */}
        {showLargeImage && (
          <div className="hidden md:block shrink-0">
            <LargeImage image={testimonial.image} imageCloudinaryId={testimonial.imageCloudinaryId} author={testimonial.author} showPlayButton={showPlayButton} videoUrl={testimonial.videoUrl} onPlayClick={onPlayClick} />
          </div>
        )}
      </div>
    </div>
  );
}

function LargeImage({ image, imageCloudinaryId, author, showPlayButton = false, videoUrl = "", onPlayClick }: { image: string; imageCloudinaryId?: string; author: string; showPlayButton?: boolean; videoUrl?: string; onPlayClick: (videoUrl: string) => void }) {
  return (
    <div className="bg-gray-200 overflow-hidden relative rounded-2xl shrink-0 w-full md:w-[200px] lg:w-[240px] h-[186px] md:h-[240px] lg:h-[280px]">
      <CloudinaryImage
        src={image}
        cloudinaryId={imageCloudinaryId}
        alt={author}
        fill
        className="object-cover"
      />
      {/* Play Button Overlay - only show if type is text-image-video */}
      {showPlayButton && videoUrl !== "" && (
        <button
          onClick={() => onPlayClick(videoUrl)}
          className="absolute bottom-4 right-4 bg-white rounded-full p-3 hover:bg-white/90 transition-colors cursor-pointer z-10 shadow-lg"
          aria-label="Play video"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5V19L19 12L8 5Z" fill="black" />
          </svg>
        </button>
      )}
    </div>
  );
}

function VideoModal({ videoUrl, onClose }: { videoUrl: string; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after mount
    requestAnimationFrame(() => {
      setIsMounted(true);
    });

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
      className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${isMounted ? 'opacity-100' : 'opacity-0'
        }`}
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
            <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
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

function TestimonialDetailModal({ testimonial, onClose }: { testimonial: Testimonial; onClose: () => void }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after mount
    requestAnimationFrame(() => {
      setIsMounted(true);
    });

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
  const hasImage = testimonial.image && testimonial.image.trim() !== "";

  return (
    <div
      className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto transition-opacity duration-200 ${isMounted ? 'opacity-100' : 'opacity-0'
        }`}
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
            <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
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
            <p className="font-grotesque font-semibold leading-[1.15] text-[24px] sm:text-[28px] lg:text-[32px] text-black">
              &ldquo;{testimonial.quote}&rdquo;
            </p>

            {/* Client Info */}
            <div className="flex gap-4 items-center">
              <div className="relative rounded-full shrink-0 size-16 overflow-hidden bg-gray-200">
                {hasImage ? (
                  <CloudinaryImage
                    src={testimonial.image}
                    cloudinaryId={testimonial.imageCloudinaryId}
                    alt={testimonial.author}
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <AvatarPlaceholder name={testimonial.author} size="lg" />
                )}
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
                    <path d="M8 5V19L19 12L8 5Z" fill="black" />
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

