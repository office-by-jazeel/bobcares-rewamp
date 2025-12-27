"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn, outlineButtonVariants } from "@/lib/utils";
import navigationData from "../../data/navigation.json";
import HeaderLinks from "./header/HeaderLinks";
import { EMERGENCY_URL, CLIENT_AREA_URL } from "@/lib/urls";

interface HamburgerMenuProps {
  isHeaderFixed?: boolean;
}

export default function HamburgerMenu({ isHeaderFixed = false }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNavItem, setSelectedNavItem] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  // Lock body scroll and stop Lenis when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Stop Lenis smooth scroll when menu is open
      if (window.lenis) {
        window.lenis.stop();
      }
    } else {
      document.body.style.overflow = "";
      // Resume Lenis smooth scroll when menu is closed
      if (window.lenis) {
        window.lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = "";
      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Set Solutions as default when opening (desktop only)
      if (!isMobile) {
        setSelectedNavItem("solutions");
        setExpandedSections(new Set());
      } else {
        // Mobile: no auto-selection
        setSelectedNavItem(null);
        setExpandedSections(new Set());
      }
    } else {
      // Reset when closing
      setSelectedNavItem(null);
      setExpandedSections(new Set());
    }
  };

  const handleNavItemClick = (key: string, href?: string) => {
    // If href exists, redirect to external URL
    if (href) {
      window.location.href = href;
      return;
    }

    setSelectedNavItem(key);
    // Auto-expand first section if it exists
    const subMenu = navigationData.subMenus[key as keyof typeof navigationData.subMenus];
    if (subMenu?.sections.length > 0) {
      setExpandedSections(new Set([subMenu.sections[0].title]));
    } else {
      setExpandedSections(new Set());
    }
  };

  const toggleSection = (sectionTitle: string) => {
    // If clicking on an already expanded section, collapse it
    if (expandedSections.has(sectionTitle)) {
      setExpandedSections(new Set());
    } else {
      // Otherwise, expand only this section (collapse others)
      setExpandedSections(new Set([sectionTitle]));
    }
  };

  const currentSubMenu = selectedNavItem
    ? navigationData.subMenus[selectedNavItem as keyof typeof navigationData.subMenus]
    : null;

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="h-3 md:w-10 relative flex flex-col justify-center items-center gap-1.5 z-50"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            "transition-all duration-300 origin-center",
          )}
        >
          <svg width="28" height="12" viewBox="0 0 28 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="block md:hidden">
            <path d="M0 1H28" stroke={isHeaderFixed ? "white" : "currentColor"} strokeWidth="2" />
            <path d="M0 11H28" stroke={isHeaderFixed ? "white" : "currentColor"} strokeWidth="2" />
          </svg>

          <svg width="40" height="15" viewBox="0 0 40 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden md:block">
            <line x1="1.5" y1="1.5" x2="38.5" y2="1.5" stroke={isHeaderFixed && !isOpen ? "white" : isOpen ? "white" : "currentColor"} strokeWidth="3" strokeLinecap="round" />
            <line x1="1.5" y1="13.5" x2="38.5" y2="13.5" stroke={isHeaderFixed && !isOpen ? "white" : isOpen ? "white" : "currentColor"} strokeWidth="3" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{
              type: "spring",
              mass: 1,
              stiffness: 100,
              damping: 15,
            }}
            className="fixed inset-0 z-100 overflow-hidden"
            style={{ backgroundColor: "#0a0a0a" }}
            onClick={(e) => {
              // Close if clicking on overlay background
              if (e.target === e.currentTarget) {
                setIsOpen(false);
              }
            }}
          >
            <div className="container mx-auto h-full flex flex-col gap-10 md:gap-[72px]">
              {/* Header within menu */}
              <div className="flex items-center justify-between py-5">
                {/* Mobile: Show back button when submenu is selected, otherwise show logo */}
                {isMobile && selectedNavItem ? (
                  <button
                    onClick={() => {
                      setSelectedNavItem(null);
                      setExpandedSections(new Set());
                    }}
                    className="flex items-center gap-2 text-white hover:opacity-70 transition-opacity"
                    aria-label="Back to main menu"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-base font-medium">Back</span>
                  </button>
                ) : (
                  <Link href="/" className="h-[28px] md:h-[46.614px] max-h-full w-[254.06px] relative">
                    <Image
                      src="/_next/icons/logo.svg"
                      alt="Bobcares Logo"
                      width={254}
                      height={47}
                      className="h-full w-auto"
                      style={{ width: "auto" }}
                    />
                  </Link>
                )}
                <div className="flex items-center gap-4 md:gap-[30px]">
                  <HeaderLinks variant="menu" />
                  <button
                    onClick={toggleMenu}
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
                </div>
              </div>

              {/* Two-column layout */}
              <div className="flex-1 flex items-start md:gap-[18%] overflow-hidden">
                {/* Left Column - Primary Navigation */}
                {/* Hide on mobile when submenu is selected */}
                <div className={cn(
                  "w-full md:w-[35%] flex flex-col",
                  isMobile && selectedNavItem && "hidden"
                )}>
                  <nav className="flex-1 overflow-y-visible flex flex-col gap-6 md:gap-9" data-lenis-prevent>
                    {navigationData.primary.map((item) => {
                      const isActive = selectedNavItem === item.key;
                      const hasHref = "href" in item && item.href;
                      const Component = hasHref ? "a" : "button";
                      const componentProps = hasHref
                        ? {
                          href: item.href
                        }
                        : { onClick: () => handleNavItemClick(item.key, item.href) };

                      return (
                        <div key={item.key} className="group">
                          <Component
                            {...componentProps}
                            className={cn(
                              "w-full pb-6 md:pb-10 flex items-center justify-between text-left transition-colors group",
                              // On mobile, always use gray text (no active state)
                              isMobile
                                ? "text-gray-400 hover:text-white"
                                : isActive
                                  ? "text-white"
                                  : "text-gray-400 hover:text-white"
                            )}
                          >
                            <span className={cn(
                              "font-grotesque relative text-5xl md:text-5xl lg:text-7xl font-semibold leading-[57px] tracking-[-2px]",
                            )}>
                              {item.label}
                            </span>
                            <span className={cn(
                              "transition-colors",
                              // On mobile, always use gray (no active state)
                              isMobile
                                ? "text-lg text-gray-400 group-hover:text-white"
                                : isActive ? "text-2xl text-white" : "text-lg text-gray-400 group-hover:text-white"
                            )}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                                <path d="M33.6445 27.0831H10.4154C9.82509 27.0831 9.3303 26.8834 8.93099 26.4841C8.53168 26.0848 8.33203 25.59 8.33203 24.9997C8.33203 24.4095 8.53168 23.9147 8.93099 23.5154C9.3303 23.1161 9.82509 22.9164 10.4154 22.9164H33.6445L27.707 16.9789C27.2904 16.5622 27.0907 16.0761 27.1081 15.5206C27.1254 14.965 27.3251 14.4789 27.707 14.0622C28.1237 13.6456 28.6185 13.4286 29.1914 13.4112C29.7643 13.3938 30.2591 13.5935 30.6758 14.0102L40.207 23.5414C40.4154 23.7497 40.5629 23.9754 40.6497 24.2185C40.7365 24.4615 40.7799 24.722 40.7799 24.9997C40.7799 25.2775 40.7365 25.5379 40.6497 25.781C40.5629 26.024 40.4154 26.2497 40.207 26.4581L30.6758 35.9893C30.2591 36.406 29.7643 36.6056 29.1914 36.5883C28.6185 36.5709 28.1237 36.3539 27.707 35.9372C27.3251 35.5206 27.1254 35.0345 27.1081 34.4789C27.0907 33.9233 27.2904 33.4372 27.707 33.0206L33.6445 27.0831Z"
                                  fill={isMobile ? "#4E4E4E" : (isActive ? "white" : "#4E4E4E")} />
                              </svg>
                            </span>
                          </Component>
                          <div className="relative">
                            <div className="h-px bg-[#272727]" />
                            {/* Hide active blue line on mobile */}
                            <div className={cn(
                              "absolute top-0 left-0 h-1 bg-[#0073EC] w-0 group-hover:w-full transition-all duration-300",
                              isActive && "w-full",
                              "hidden md:block"
                            )} />
                          </div>
                        </div>
                      );
                    })}
                  </nav>

                  {/* Emergency & Client Area Buttons - Mobile Only */}
                  {isMobile && !selectedNavItem && (
                    <div className="flex flex-col gap-4 mt-6">
                      <a
                        href={EMERGENCY_URL}
                        className={outlineButtonVariants.emergency}
                        aria-label="Emergency Server Support"
                      >
                        Emergency
                      </a>
                      <a
                        href={CLIENT_AREA_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={outlineButtonVariants.primary}
                        aria-label="Client Area"
                      >
                        Client Area
                      </a>
                    </div>
                  )}
                </div>

                {/* Right Column - Two Types of Submenu */}
                {/* On mobile, show full width when submenu is selected */}
                <div className={cn(
                  "flex-1 overflow-y-auto scrollbar-hide md:max-h-[70dvh] h-[calc(100dvh-106px)] min-h-0",
                  isMobile && selectedNavItem && "w-full"
                )} data-lenis-prevent>
                  {selectedNavItem && currentSubMenu ? (
                    // Type 1: Expandable Sections Submenu (for items with sections that have items)
                    currentSubMenu.sections.length > 0 && currentSubMenu.sections.some(section => section.items && section.items.length > 0) ? (
                      <div className="flex flex-col gap-4">
                        {currentSubMenu.sections.map((section, index) => {
                          const isExpanded = expandedSections.has(section.title);
                          const hasItems = section.items && section.items.length > 0;
                          const firstItem = section.items?.[0];
                          const isItemObject = firstItem && typeof firstItem === "object";

                          return (
                            <div key={index}>
                              {index === 0 && (
                                <div className="text-base font-semibold uppercase text-[#D9D9D9] mb-[16px] leading-normal">
                                  {selectedNavItem.toUpperCase()}
                                </div>
                              )}
                              <div className={cn("border-b", isExpanded ? "border-white" : "border-[#1C1C1C] py-5", index === currentSubMenu.sections.length - 1 && "border-0")}>
                                <div
                                  onClick={() => {
                                    // Only toggle if no href is present
                                    if (!("href" in section && section.href)) {
                                      toggleSection(section.title);
                                    }
                                  }}
                                  className={cn(
                                    "w-full flex items-center justify-between",
                                    "href" in section && section.href ? "" : "cursor-pointer"
                                  )}
                                >
                                  <div>
                                    {"href" in section && section.href ? (
                                      <a
                                        href={section.href}
                                        className={cn(
                                          "block hover:opacity-80 transition-opacity",
                                          isExpanded
                                            ? "text-white text-[32px] font-semibold leading-normal tracking-[-0.32px]"
                                            : "text-[#808080] text-[20px] font-medium leading-normal tracking-[-0.1px]"
                                        )}
                                      >
                                        {section.title}
                                      </a>
                                    ) : (
                                      <div className={cn(
                                        isExpanded
                                          ? "text-white text-[32px] font-semibold leading-normal tracking-[-0.32px]"
                                          : "text-[#808080] text-[20px] font-medium leading-normal tracking-[-0.1px]"
                                      )}>
                                        {section.title}
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleSection(section.title);
                                    }}
                                    aria-label={isExpanded ? `Collapse ${section.title}` : `Expand ${section.title}`}
                                  >
                                    {isExpanded
                                      ? <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                                        <path d="M10.5 19.5C10.075 19.5 9.71875 19.3562 9.43125 19.0687C9.14375 18.7812 9 18.425 9 18C9 17.575 9.14375 17.2187 9.43125 16.9312C9.71875 16.6437 10.075 16.5 10.5 16.5H25.5C25.925 16.5 26.2812 16.6437 26.5688 16.9312C26.8563 17.2187 27 17.575 27 18C27 18.425 26.8563 18.7812 26.5688 19.0687C26.2812 19.3562 25.925 19.5 25.5 19.5H10.5Z" fill="white" />
                                      </svg>
                                      : <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                                        <path d="M16.5 19.5H9C8.575 19.5 8.21875 19.3563 7.93125 19.0688C7.64375 18.7812 7.5 18.425 7.5 18C7.5 17.575 7.64375 17.2188 7.93125 16.9313C8.21875 16.6438 8.575 16.5 9 16.5H16.5V9C16.5 8.575 16.6438 8.21875 16.9313 7.93125C17.2188 7.64375 17.575 7.5 18 7.5C18.425 7.5 18.7812 7.64375 19.0688 7.93125C19.3563 8.21875 19.5 8.575 19.5 9V16.5H27C27.425 16.5 27.7812 16.6438 28.0688 16.9313C28.3563 17.2188 28.5 17.575 28.5 18C28.5 18.425 28.3563 18.7812 28.0688 19.0688C27.7812 19.3563 27.425 19.5 27 19.5H19.5V27C19.5 27.425 19.3563 27.7812 19.0688 28.0688C18.7812 28.3563 18.425 28.5 18 28.5C17.575 28.5 17.2188 28.3563 16.9313 28.0688C16.6438 27.7812 16.5 27.425 16.5 27V19.5Z" fill="white" />
                                      </svg>}
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {isExpanded && hasItems && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{
                                        type: "spring",
                                        mass: 1,
                                        stiffness: 300,
                                        damping: 20,
                                      }}
                                      className="overflow-hidden"
                                    >
                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8 gap-x-14 mt-8 mb-10">
                                        {section.items.map((item, itemIndex) => {
                                          const itemIcon = typeof item === "object" && item.icon ? item.icon : null;
                                          const itemHref =
                                            typeof item === "object" && "href" in item && item.href
                                              ? item.href
                                              : "#";

                                          return (
                                            <a
                                              key={itemIndex}
                                              href={itemHref}
                                              className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                                            >
                                              {itemIcon && (
                                                <div className="bg-[#141414] p-[9px] rounded-[14px] shrink-0">
                                                  <Image
                                                    src={itemIcon}
                                                    alt=""
                                                    width={24}
                                                    height={24}
                                                    className="size-6"
                                                  />
                                                </div>
                                              )}
                                              <span className="text-[#A4A4A4] text-lg font-light leading-[150%] tracking-[-0.18px]">
                                                {typeof item === "string" ? item : item.label}
                                              </span>
                                            </a>
                                          );
                                        })}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      // Type 2: Promotional/Featured Panel Submenu (for items without sections or with empty sections)
                      <div className="max-w-[600px]">
                        <div className="mb-8">
                          <Image
                            src={navigationData.promotionalContent.image}
                            alt="Promotional"
                            width={600}
                            height={400}
                            className="w-[600px] h-[364px] rounded-xl object-cover"
                          />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-[45px]">
                          {navigationData.promotionalContent.headline}
                        </h2>
                        <p className="text-[#FFFFFF8C] text-lg mb-8 leading-relaxed">
                          {navigationData.promotionalContent.description}
                        </p>
                        <a
                          href={navigationData.promotionalContent.buttonHref}
                          className="inline-block px-8 py-4 bg-[#0073EC] text-white rounded-[45px] hover:bg-[#0066d6] transition-colors font-medium text-base"
                        >
                          {navigationData.promotionalContent.buttonText}
                        </a>
                      </div>
                    )
                  ) : (
                    // Default: Promotional Content when no nav item is selected
                    <div className="hidden">
                      <div className="mb-12">
                        <Image
                          src={navigationData.promotionalContent.image}
                          alt="Promotional"
                          width={600}
                          height={400}
                          className="w-full h-auto rounded-xl object-cover"
                        />
                      </div>
                      <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-[0.95]">
                        {navigationData.promotionalContent.headline}
                      </h2>
                      <p className="text-[#FFFFFF8C] text-lg mb-10 leading-relaxed">
                        {navigationData.promotionalContent.description}
                      </p>
                      <a
                        href={navigationData.promotionalContent.buttonHref}
                        className="inline-block px-8 py-4 bg-[#0073EC] text-white rounded-lg hover:bg-[#0066d6] transition-colors font-medium text-base"
                      >
                        {navigationData.promotionalContent.buttonText}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
