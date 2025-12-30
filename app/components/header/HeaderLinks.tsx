
"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { SEARCH_URL, PHONE_URL, EMERGENCY_URL, CLIENT_AREA_URL } from "@/lib/urls";

type HeaderVariant = "default" | "menu";

interface HeaderLinksProps {
    isHeaderFixed?: boolean;
    variant?: HeaderVariant;
    className?: string;
}

export default function HeaderLinks({
    isHeaderFixed = false,
    variant = "default",
    className,
}: HeaderLinksProps) {
    const isMenu = variant === "menu";

    const textButtonClasses = [
        "md:backdrop-blur-md border border-solid flex items-center justify-center px-8 py-[18px] rounded-[45px] transition-colors",
        isMenu
            ? "border-[#FFFFFF2E]"
            : isHeaderFixed
                ? "border-[#FFFFFF2E] md:hover:bg-black/10"
                : "border-[#0073EC] bg-[#0073EC] hover:bg-[#0045D9]",
    ].join(" ");

    const clientAreaButtonClasses = cn(
        textButtonClasses,
        "hidden lg:block transition-shadow",
        // Theme blue glow effect on hover (#0073EC) - desktop only
        "md:hover:shadow-[0_0_10px_rgba(0,115,236,0.4)]"
    );

    const emergencyLinkClasses = cn(
        textButtonClasses,
        "hidden lg:block transition-all",
        (isMenu || isHeaderFixed) && "hover:border-[#D44A4C]",
        // Subtle base glow + brighter hover glow for emergency - desktop only
        "md:shadow-[0_0_6px_rgba(212,74,76,0.18)] md:hover:shadow-[0_0_12px_rgba(212,74,76,0.42)]"
    );

    const searchLinkClasses = cn(
        isMenu
            ? "md:border md:border-white/20 md:border-solid flex items-center justify-center md:p-5 rounded-[45px] md:size-[60px] md:hover:bg-black/10 transition-all md:border-[#9898982E] bg-[#00000003]"
            : "md:backdrop-blur-md md:border md:border-white/20 md:border-solid flex items-center justify-center md:p-5 md:rounded-[45px] md:size-[60px] md:hover:bg-black/10 transition-all",
        !isMenu && !isHeaderFixed && "md:border-[#9898982E] bg-[#00000003]",
        // Rainbow glow effect on hover - desktop only
        "md:hover:shadow-[0_0_8px_rgba(255,0,0,0.3),0_0_12px_rgba(255,165,0,0.2),0_0_16px_rgba(0,255,0,0.2),0_0_20px_rgba(0,0,255,0.2)]"
    );

    const phoneLinkClasses = cn(
        isMenu
            ? "md:border md:border-white/20 md:border-solid flex items-center justify-center md:p-5 rounded-[45px] md:size-[60px] md:hover:bg-black/10 transition-all md:border-[#9898982E] bg-[#00000003]"
            : "md:backdrop-blur-md md:border md:border-white/20 md:border-solid flex items-center justify-center md:p-5 md:rounded-[45px] md:size-[60px] md:hover:bg-black/10 transition-all",
        !isMenu && !isHeaderFixed && "md:border-[#9898982E] bg-[#00000003]",
        // WhatsApp green glow effect on hover (#25D366) - desktop only
        "md:hover:shadow-[0_0_10px_rgba(37,211,102,0.4)]"
    );

    const iconClasses = cn(
        "size-[26px]",
        !isMenu && !isHeaderFixed && "-invert brightness-0"
    );

    return (
        <div
            className={cn(
                "flex items-center",
                isMenu ? "gap-4 md:gap-[30px]" : "gap-4",
                className
            )}
        >
            <a href={SEARCH_URL} className={searchLinkClasses} aria-label="Search">
                <Image
                    src="/_next/icons/navigation/search-icon.svg"
                    alt="Search"
                    width={26}
                    height={26}
                    className={iconClasses}
                    style={{ width: "auto", height: "auto" }}
                />
            </a>

            <a
                href={PHONE_URL}
                className={phoneLinkClasses}
                aria-label="Call +18003835193"
            >
                <Image
                    src="/_next/icons/navigation/phone-icon.svg"
                    alt="Phone"
                    width={26}
                    height={26}
                    className={iconClasses}
                    style={{ width: "auto", height: "auto" }}
                />
            </a>

            <a
                href={CLIENT_AREA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={clientAreaButtonClasses}
            >
                <span className="font-medium text-[20px] leading-[22px] text-white truncate">
                    Client Area
                </span>
            </a>

            <a
                href={EMERGENCY_URL}
                className={emergencyLinkClasses}
            >
                <span className="font-medium text-[20px] leading-[22px] text-white">
                    Emergency
                </span>
            </a>
        </div>
    );
}

