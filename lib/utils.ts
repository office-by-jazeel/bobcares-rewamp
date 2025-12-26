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

