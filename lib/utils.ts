import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get public asset path with /_next/ prefix
 * @param path - Public asset path (e.g., "/icons/logo.svg" or "/images/hero-bg.jpg")
 * @returns Path with /_next/ prefix (e.g., "/_next/icons/logo.svg" or "/_next/images/hero-bg.jpg")
 */
export function getPublicAssetPath(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/_next/${cleanPath}`;
}

/**
 * Base outline button styles - reusable across components
 */
export const outlineButtonBase = "w-full px-6 py-4 border-2 rounded-[45px] font-medium text-lg text-center transition-colors";

/**
 * Outline button style variants
 */
export const outlineButtonVariants = {
  primary: cn(
    outlineButtonBase,
    "border-[#0073EC] text-[#0073EC] hover:bg-[#0073EC] hover:text-white",
    "shadow-[0_0_10px_rgba(0,115,236,0.4)]"
  ),
  emergency: cn(
    outlineButtonBase,
    "border-[#D44A4C] text-[#D44A4C] hover:bg-[#D44A4C] hover:text-white",
    "shadow-[0_0_12px_rgba(212,74,76,0.42)]"
  ),
} as const;

