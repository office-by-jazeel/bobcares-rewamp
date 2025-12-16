'use client';

import { useState, useRef } from "react";
import CloudinaryImage from "@/components/CloudinaryImage";
import mapPinsData from "../../data/mapPins.json";

// MapPin component for placing pins on the map
interface MapPinProps {
  top: string | number;
  left: string | number;
  label?: string;
  logo?: string | null;
  onClick?: () => void;
}

function MapPin({ top, left, label, logo, onClick }: MapPinProps) {
  const topValue = typeof top === "number" ? `${top}px` : top;
  const leftValue = typeof left === "number" ? `${left}px` : left;
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const pinRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!pinRef.current || !tooltipRef.current) return;

    const pinRect = pinRef.current.getBoundingClientRect();
    const tooltipWidth = 250; // w-[250px]
    // Get tooltip height - it should be available even when opacity is 0
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const tooltipHeight = tooltipRect.height > 0 ? tooltipRect.height : 100; // Fallback estimate
    const margin = 12; // mb-3 = 12px

    // Calculate initial position: above pin, left-aligned to pin center
    let tooltipTop = pinRect.top - tooltipHeight - margin;
    let tooltipLeft = pinRect.left + pinRect.width / 2;

    // Viewport boundary checks
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const padding = 16; // Minimum padding from viewport edges

    // Check if tooltip would go above viewport
    if (tooltipTop < padding) {
      // Position below pin instead
      tooltipTop = pinRect.bottom + margin;
    }

    // Check if tooltip would go below viewport
    if (tooltipTop + tooltipHeight > viewportHeight - padding) {
      // Try to position above pin, or adjust to fit
      tooltipTop = Math.max(padding, pinRect.top - tooltipHeight - margin);
    }

    // Check if tooltip would go off left edge
    if (tooltipLeft < padding) {
      tooltipLeft = padding;
    }

    // Check if tooltip would go off right edge
    if (tooltipLeft + tooltipWidth > viewportWidth - padding) {
      tooltipLeft = viewportWidth - tooltipWidth - padding;
    }

    setTooltipPosition({ top: tooltipTop, left: tooltipLeft });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      <div
        ref={pinRef}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10 group-hover:z-[9999]"
        style={{ top: topValue, left: leftValue }}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Pin dot */}
        <div className="relative z-10">
          {/* Outer glow/pulse effect */}
          <div className="absolute inset-0 rounded-full bg-white opacity-30 animate-ping pointer-events-none" />

          {/* Pin circle */}
          <div className="relative w-6 h-6 rounded-full bg-black border border-[#FFFFFF63] group-hover:bg-white group-hover:border-black transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 block group-hover:hidden scale-[75%]">
              <path d="M6 8H1C0.716667 8 0.479167 7.90417 0.2875 7.7125C0.0958333 7.52083 0 7.28333 0 7C0 6.71667 0.0958333 6.47917 0.2875 6.2875C0.479167 6.09583 0.716667 6 1 6H6V1C6 0.716667 6.09583 0.479167 6.2875 0.2875C6.47917 0.0958333 6.71667 0 7 0C7.28333 0 7.52083 0.0958333 7.7125 0.2875C7.90417 0.479167 8 0.716667 8 1V6H13C13.2833 6 13.5208 6.09583 13.7125 6.2875C13.9042 6.47917 14 6.71667 14 7C14 7.28333 13.9042 7.52083 13.7125 7.7125C13.5208 7.90417 13.2833 8 13 8H8V13C8 13.2833 7.90417 13.5208 7.7125 13.7125C7.52083 13.9042 7.28333 14 7 14C6.71667 14 6.47917 13.9042 6.2875 13.7125C6.09583 13.5208 6 13.2833 6 13V8Z"
                fill="white" />
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="2" viewBox="0 0 12 2" fill="none"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden group-hover:block scale-[75%]">
              <path d="M1 2C0.716667 2 0.479167 1.90417 0.2875 1.7125C0.0958333 1.52083 0 1.28333 0 1C0 0.716667 0.0958333 0.479167 0.2875 0.2875C0.479167 0.0958333 0.716667 0 1 0H11C11.2833 0 11.5208 0.0958333 11.7125 0.2875C11.9042 0.479167 12 0.716667 12 1C12 1.28333 11.9042 1.52083 11.7125 1.7125C11.5208 1.90417 11.2833 2 11 2H1Z" fill="black" />
            </svg>
          </div>
        </div>
      </div>

      {/* Label tooltip (shown on hover) - fixed position */}
      {label && (
        <div
          ref={tooltipRef}
          className="fixed w-[250px] flex items-start flex-col gap-2 px-6 pt-4.5 pb-3 bg-[#222222] backdrop-blur-[70px] border border-[#FFFFFF2B] rounded-[16px] rounded-bl-none shadow-lg transition-opacity duration-300 pointer-events-none whitespace-nowrap z-[9999]"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            opacity: isHovered ? 1 : 0,
          }}
        >
          {logo ? (
            <CloudinaryImage
              src={logo}
              alt={label}
              className="object-contain h-6 w-fit"
            />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="129" height="24" viewBox="0 0 129 24" fill="none">
              <g clip-path="url(#clip0_523_2487)">
                <path d="M9.94514 23.2554H9.18289C7.20285 23.2554 6.01157 23.2551 5.10156 23.0903L10.3681 16.2988L9.94514 23.2554Z" fill="white" />
                <path d="M18.6576 23.111C17.7632 23.2548 16.5914 23.2555 14.6993 23.2555H13.7981L13.373 16.2969L18.6576 23.111Z" fill="white" />
                <path d="M23.6849 18.4129C23.6465 18.5911 23.6012 18.7587 23.5461 18.9198C23.1847 19.9745 22.5504 20.9021 21.7238 21.6265L15.7852 15.1416L23.6849 18.4129Z" fill="white" />
                <path d="M2.08116 21.5572C1.29218 20.8432 0.685241 19.9414 0.335187 18.9197C0.27457 18.7427 0.224241 18.5583 0.183594 18.3602L7.95516 15.1426L2.08116 21.5572Z" fill="white" />
                <path d="M23.8816 14.3129C23.8816 14.9666 23.8797 15.5321 23.8731 16.0285L16.8203 13.3755H23.8816V14.3129Z" fill="white" />
                <path d="M6.92345 13.3755L0.00636055 15.9769C0.000421576 15.4929 0 14.9441 0 14.3129V13.3755H6.92345Z" fill="white" />
                <path d="M14.6982 0C17.1834 0 18.426 0.000321894 19.4294 0.326203C21.3729 0.957616 22.8984 2.44302 23.5468 4.33561C23.8814 5.31268 23.8818 6.52273 23.8818 8.94268V11.637H16.424L21.8029 9.41035L20.2075 8.37909L14.9887 10.3414L17.4385 7.18475L15.6767 6.71505L12.9713 9.66738L12.7699 6.34238H10.9752L10.7706 9.66738L8.06732 6.71505L6.30652 7.18475L8.75321 10.3404L3.53753 8.37909L1.94209 9.41035L7.31994 11.637H0V8.94268C0 6.52273 0.000330564 5.31268 0.33499 4.33561C0.98341 2.44302 2.50883 0.957616 4.45239 0.326203C5.45578 0.000321894 6.69842 0 9.18356 0H14.6982Z" fill="white" />
                <path d="M55.6876 18.2807C56.2488 19.3054 57.3324 19.9504 58.7288 19.9504C60.1252 19.9504 61.2088 19.3054 61.77 18.2807H63.8704C63.1761 20.3283 61.2464 21.6968 58.7288 21.6968C56.2113 21.6968 54.2815 20.3283 53.5869 18.2807H55.6876ZM86.2739 7.41832C89.4741 7.41832 91.716 9.56183 91.716 12.6383C91.716 15.8933 89.2293 17.7396 86.5999 17.7396C84.9694 17.7395 83.5837 17.0248 82.8499 15.7547V21.669H80.9131V12.6582C80.9131 9.46264 83.1556 7.41832 86.2739 7.41832ZM86.2942 9.16474C84.2356 9.16474 82.8499 10.594 82.8499 12.5786C82.8499 14.5634 84.2356 15.9926 86.2942 15.9926C88.3731 15.9926 89.7595 14.5635 89.7595 12.5786C89.7595 10.5939 88.3731 9.16474 86.2942 9.16474ZM47.2007 7.41832C50.3803 7.41832 52.6224 9.60154 52.6225 12.5786C52.6225 15.5558 50.3804 17.7396 47.2007 17.7396C44.021 17.7396 41.7789 15.5558 41.7789 12.5786C41.779 9.60154 44.0211 7.41832 47.2007 7.41832ZM47.2007 9.16474C45.1218 9.16474 43.7357 10.5939 43.7357 12.5786C43.7357 14.5635 45.1217 15.9926 47.2007 15.9926C49.2798 15.9926 50.6658 14.5635 50.6658 12.5786C50.6657 10.5939 49.2797 9.16474 47.2007 9.16474ZM58.9434 7.42286H64.2102V9.1091H62.8513C63.674 10.0075 64.1499 11.2085 64.1499 12.5786C64.1499 15.5558 61.908 17.7396 58.7282 17.7396C55.5485 17.7396 53.3065 15.5558 53.3065 12.5786C53.3065 9.60154 55.5486 7.41832 58.7282 7.41832C58.8005 7.41832 58.8722 7.42059 58.9434 7.42286ZM58.7282 9.16474C56.6493 9.16474 55.2632 10.5939 55.2631 12.5786C55.2631 14.5635 56.6492 15.9926 58.7282 15.9926C60.807 15.9926 62.1933 14.5635 62.1933 12.5786C62.1933 10.5939 60.807 9.16474 58.7282 9.16474ZM70.2564 7.41832C73.4357 7.41832 75.6782 9.60154 75.6782 12.5786C75.6782 15.5558 73.4357 17.7396 70.2564 17.7396C67.0766 17.7396 64.8347 15.5558 64.8347 12.5786C64.8347 9.60154 67.0766 7.41832 70.2564 7.41832ZM70.2564 9.16474C68.1775 9.16474 66.7912 10.5939 66.7912 12.5786C66.7912 14.5635 68.1775 15.9926 70.2564 15.9926C72.3353 15.9926 73.7217 14.5635 73.7217 12.5786C73.7211 10.5939 72.3353 9.16474 70.2564 9.16474ZM96.6106 7.41832C99.0161 7.41838 100.504 8.74836 100.544 10.4354H98.628C98.5671 9.68119 97.8542 9.12509 96.6315 9.12498C95.3472 9.12498 94.6135 9.7209 94.6135 10.495C94.6135 11.4276 95.6732 11.5268 96.9163 11.6856C98.6692 11.9039 100.809 12.2215 100.81 14.4642C100.81 16.4489 99.1588 17.7395 96.6315 17.7396C94.1036 17.7396 92.5137 16.4293 92.4528 14.643H94.4093C94.4499 15.4568 95.2248 16.0323 96.6315 16.0323C98.0984 16.0322 98.8525 15.4171 98.8525 14.643C98.8525 13.7102 97.7927 13.5908 96.5294 13.432C94.7764 13.2137 92.6563 12.8962 92.6563 10.6534C92.6563 8.72818 94.2057 7.41832 96.6106 7.41832ZM103.875 12.7967C103.875 14.9204 105.078 15.9926 106.912 15.9926C108.747 15.9926 109.949 14.9204 109.949 12.7967V7.67605H111.885V12.7967C111.885 16.0518 109.888 17.739 106.912 17.739C103.936 17.739 101.939 16.0716 101.939 12.7967V7.67605H103.875V12.7967ZM33.7217 15.6156H41.2023V17.4813H31.6426V4.50059H33.7217V15.6156ZM79.073 17.4813H77.1368V7.67605H79.073V17.4813ZM124.638 7.41832C127.003 7.41832 128.797 8.80772 128.797 11.8048V17.4813H126.86V11.8048C126.86 9.97886 125.862 9.1648 124.455 9.16474C123.089 9.16474 122.07 10.0184 122.07 11.8048V17.4813H120.134V11.8048C120.134 10.0184 119.094 9.16474 117.729 9.16474C116.322 9.16474 115.323 9.9788 115.323 11.8048V17.4813H113.387V11.8048C113.387 8.80772 115.181 7.41832 117.545 7.41832C119.094 7.41838 120.399 8.09325 121.091 9.36346C121.784 8.09319 123.069 7.41832 124.638 7.41832ZM78.095 3.48828C78.8694 3.48828 79.4408 4.04395 79.4408 4.7981C79.4408 5.55233 78.8694 6.12835 78.095 6.12835C77.3207 6.12829 76.7499 5.55228 76.7499 4.7981C76.7499 4.044 77.3207 3.48836 78.095 3.48828Z" fill="white" />
              </g>
              <defs>
                <clipPath id="clip0_523_2487">
                  <rect width="128.962" height="23.2554" fill="white" />
                </clipPath>
              </defs>
            </svg>
          )}
          <span className="text-[#FFFFFF96] font-light text-base leading-normal">
            {label}
          </span>
        </div>
      )}
    </>
  );
}

export default function Trust() {
  return (
    <section className="bg-black overflow-hidden relative">
      <div className="container mx-auto flex flex-col lg:flex-row items-start h-full w-full py-14 lg:py-[140px] gap-12 lg:gap-16">
        <div className="flex flex-col gap-8 sm:gap-12 items-start w-full lg:w-[40%]">
          <div className="flex flex-col gap-1 items-start w-full">
            {/* <div className="flex items-center">
              <p className="font-normal text-[16px] text-white uppercase">Clients</p>
            </div> */}
            <h2 className="font-grotesque font-semibold leading-[0.95] text-[48px] lg:text-[96px] tracking-[-0.96px] w-full">
              <span className="text-[#6e6e6e]">Trusted by </span>
              <span className="text-white underline decoration-3 underline-offset-8">2.5k+ clients</span>
              <span className="text-[#6e6e6e]"> all around the world</span>
            </h2>
          </div>
          <div className="flex flex-col gap-8 sm:gap-12 items-start">
            <p className="font-normal leading-[1.6] text-[#cccccc] text-[16px] sm:text-[18px] w-full lg:w-[576px]">
              We support businesses across the globe with reliable, expert-driven solutions. Trusted for our consistency, speed, and commitment to quality.
            </p>
            {/* <button className="bg-[#0073ec] flex items-center justify-center px-7 sm:px-[38px] py-4 rounded-[45px] hover:bg-[#005bb5] transition-colors">
              <span className="font-medium text-[18px] sm:text-[20px] text-white tracking-[-1px]">View More</span>
            </button> */}
          </div>
        </div>

        {/* World Map Graphic */}
        <div className="relative flex-1 mt-32 w-full hidden md:block isolate">
          <CloudinaryImage
            src="/images/world-map.png"
            cloudinaryId="bobcares/world-map"
            alt="World map showing global clients"
            className="w-full object-cover"
          />

          {/* Map Pins - Render pins from data */}
          {mapPinsData.mapPins.map((pin) => (
            <MapPin
              key={pin.id}
              top={pin.top}
              left={pin.left}
              label={pin.label}
              logo={pin.logo}
            />
          ))}
        </div>

        <div className="relative flex-1 w-full md:hidden flex flex-col gap-2.5">
          {mapPinsData.mapPins.map((pin) => (
            <div key={pin.id} className="flex items-center justify-between border border-[#FFFFFF2B] bg-[#131313] rounded-[14px] px-4 py-5">
              {pin.logo ? (
                <CloudinaryImage
                  src={pin.logo}
                  alt={pin.label}
                  className="object-contain h-6 w-fit"
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="129" height="24" viewBox="0 0 129 24" fill="none">
                  <g clip-path="url(#clip0_523_2487)">
                    <path d="M9.94514 23.2554H9.18289C7.20285 23.2554 6.01157 23.2551 5.10156 23.0903L10.3681 16.2988L9.94514 23.2554Z" fill="white" />
                    <path d="M18.6576 23.111C17.7632 23.2548 16.5914 23.2555 14.6993 23.2555H13.7981L13.373 16.2969L18.6576 23.111Z" fill="white" />
                    <path d="M23.6849 18.4129C23.6465 18.5911 23.6012 18.7587 23.5461 18.9198C23.1847 19.9745 22.5504 20.9021 21.7238 21.6265L15.7852 15.1416L23.6849 18.4129Z" fill="white" />
                    <path d="M2.08116 21.5572C1.29218 20.8432 0.685241 19.9414 0.335187 18.9197C0.27457 18.7427 0.224241 18.5583 0.183594 18.3602L7.95516 15.1426L2.08116 21.5572Z" fill="white" />
                    <path d="M23.8816 14.3129C23.8816 14.9666 23.8797 15.5321 23.8731 16.0285L16.8203 13.3755H23.8816V14.3129Z" fill="white" />
                    <path d="M6.92345 13.3755L0.00636055 15.9769C0.000421576 15.4929 0 14.9441 0 14.3129V13.3755H6.92345Z" fill="white" />
                    <path d="M14.6982 0C17.1834 0 18.426 0.000321894 19.4294 0.326203C21.3729 0.957616 22.8984 2.44302 23.5468 4.33561C23.8814 5.31268 23.8818 6.52273 23.8818 8.94268V11.637H16.424L21.8029 9.41035L20.2075 8.37909L14.9887 10.3414L17.4385 7.18475L15.6767 6.71505L12.9713 9.66738L12.7699 6.34238H10.9752L10.7706 9.66738L8.06732 6.71505L6.30652 7.18475L8.75321 10.3404L3.53753 8.37909L1.94209 9.41035L7.31994 11.637H0V8.94268C0 6.52273 0.000330564 5.31268 0.33499 4.33561C0.98341 2.44302 2.50883 0.957616 4.45239 0.326203C5.45578 0.000321894 6.69842 0 9.18356 0H14.6982Z" fill="white" />
                    <path d="M55.6876 18.2807C56.2488 19.3054 57.3324 19.9504 58.7288 19.9504C60.1252 19.9504 61.2088 19.3054 61.77 18.2807H63.8704C63.1761 20.3283 61.2464 21.6968 58.7288 21.6968C56.2113 21.6968 54.2815 20.3283 53.5869 18.2807H55.6876ZM86.2739 7.41832C89.4741 7.41832 91.716 9.56183 91.716 12.6383C91.716 15.8933 89.2293 17.7396 86.5999 17.7396C84.9694 17.7395 83.5837 17.0248 82.8499 15.7547V21.669H80.9131V12.6582C80.9131 9.46264 83.1556 7.41832 86.2739 7.41832ZM86.2942 9.16474C84.2356 9.16474 82.8499 10.594 82.8499 12.5786C82.8499 14.5634 84.2356 15.9926 86.2942 15.9926C88.3731 15.9926 89.7595 14.5635 89.7595 12.5786C89.7595 10.5939 88.3731 9.16474 86.2942 9.16474ZM47.2007 7.41832C50.3803 7.41832 52.6224 9.60154 52.6225 12.5786C52.6225 15.5558 50.3804 17.7396 47.2007 17.7396C44.021 17.7396 41.7789 15.5558 41.7789 12.5786C41.779 9.60154 44.0211 7.41832 47.2007 7.41832ZM47.2007 9.16474C45.1218 9.16474 43.7357 10.5939 43.7357 12.5786C43.7357 14.5635 45.1217 15.9926 47.2007 15.9926C49.2798 15.9926 50.6658 14.5635 50.6658 12.5786C50.6657 10.5939 49.2797 9.16474 47.2007 9.16474ZM58.9434 7.42286H64.2102V9.1091H62.8513C63.674 10.0075 64.1499 11.2085 64.1499 12.5786C64.1499 15.5558 61.908 17.7396 58.7282 17.7396C55.5485 17.7396 53.3065 15.5558 53.3065 12.5786C53.3065 9.60154 55.5486 7.41832 58.7282 7.41832C58.8005 7.41832 58.8722 7.42059 58.9434 7.42286ZM58.7282 9.16474C56.6493 9.16474 55.2632 10.5939 55.2631 12.5786C55.2631 14.5635 56.6492 15.9926 58.7282 15.9926C60.807 15.9926 62.1933 14.5635 62.1933 12.5786C62.1933 10.5939 60.807 9.16474 58.7282 9.16474ZM70.2564 7.41832C73.4357 7.41832 75.6782 9.60154 75.6782 12.5786C75.6782 15.5558 73.4357 17.7396 70.2564 17.7396C67.0766 17.7396 64.8347 15.5558 64.8347 12.5786C64.8347 9.60154 67.0766 7.41832 70.2564 7.41832ZM70.2564 9.16474C68.1775 9.16474 66.7912 10.5939 66.7912 12.5786C66.7912 14.5635 68.1775 15.9926 70.2564 15.9926C72.3353 15.9926 73.7217 14.5635 73.7217 12.5786C73.7211 10.5939 72.3353 9.16474 70.2564 9.16474ZM96.6106 7.41832C99.0161 7.41838 100.504 8.74836 100.544 10.4354H98.628C98.5671 9.68119 97.8542 9.12509 96.6315 9.12498C95.3472 9.12498 94.6135 9.7209 94.6135 10.495C94.6135 11.4276 95.6732 11.5268 96.9163 11.6856C98.6692 11.9039 100.809 12.2215 100.81 14.4642C100.81 16.4489 99.1588 17.7395 96.6315 17.7396C94.1036 17.7396 92.5137 16.4293 92.4528 14.643H94.4093C94.4499 15.4568 95.2248 16.0323 96.6315 16.0323C98.0984 16.0322 98.8525 15.4171 98.8525 14.643C98.8525 13.7102 97.7927 13.5908 96.5294 13.432C94.7764 13.2137 92.6563 12.8962 92.6563 10.6534C92.6563 8.72818 94.2057 7.41832 96.6106 7.41832ZM103.875 12.7967C103.875 14.9204 105.078 15.9926 106.912 15.9926C108.747 15.9926 109.949 14.9204 109.949 12.7967V7.67605H111.885V12.7967C111.885 16.0518 109.888 17.739 106.912 17.739C103.936 17.739 101.939 16.0716 101.939 12.7967V7.67605H103.875V12.7967ZM33.7217 15.6156H41.2023V17.4813H31.6426V4.50059H33.7217V15.6156ZM79.073 17.4813H77.1368V7.67605H79.073V17.4813ZM124.638 7.41832C127.003 7.41832 128.797 8.80772 128.797 11.8048V17.4813H126.86V11.8048C126.86 9.97886 125.862 9.1648 124.455 9.16474C123.089 9.16474 122.07 10.0184 122.07 11.8048V17.4813H120.134V11.8048C120.134 10.0184 119.094 9.16474 117.729 9.16474C116.322 9.16474 115.323 9.9788 115.323 11.8048V17.4813H113.387V11.8048C113.387 8.80772 115.181 7.41832 117.545 7.41832C119.094 7.41838 120.399 8.09325 121.091 9.36346C121.784 8.09319 123.069 7.41832 124.638 7.41832ZM78.095 3.48828C78.8694 3.48828 79.4408 4.04395 79.4408 4.7981C79.4408 5.55233 78.8694 6.12835 78.095 6.12835C77.3207 6.12829 76.7499 5.55228 76.7499 4.7981C76.7499 4.044 77.3207 3.48836 78.095 3.48828Z" fill="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0_523_2487">
                      <rect width="128.962" height="23.2554" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              )}
              <span className="text-[#FFFFFF96] font-light text-sm leading-normal">
                {pin.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

