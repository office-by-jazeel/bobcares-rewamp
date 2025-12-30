import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Cookie utility functions for reading and writing cookies
 */

/**
 * Safely reads a cookie value from document.cookie
 * @param name - The name of the cookie to read
 * @returns The cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

/**
 * Sets a cookie with the specified name, value, and max-age
 * @param name - The name of the cookie
 * @param value - The value of the cookie
 * @param maxAge - The max-age in seconds (default: 31536000 = 1 year)
 */
export function setCookie(name: string, value: string, maxAge: number = 31536000): void {
  if (typeof document === 'undefined') {
    return;
  }

  // Set cookie with path=/ and max-age
  // Format matches WordPress Moove GDPR plugin exactly
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
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

