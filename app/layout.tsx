import type { Metadata } from "next";
import { Darker_Grotesque, Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import SupportBoard from "./components/SupportBoard";
import CookieConsent from "./components/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const darkerGrotesque = Darker_Grotesque({
  variable: "--font-grotesque",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Outsourced Support, Web Hosting Support, Server Management - Bobcares",
  description: "Bobcares helps businesses build, secure, and scale with product engineering, digital transformation, AI, DevOps, cloud optimization, cybersecurity, and support.",
  openGraph: {
    title: "Bobcares – Product Engineering, AI, and IT Services",
    description: "Bobcares helps businesses build, secure, and scale with product engineering, digital transformation, AI, DevOps, cloud optimization, cybersecurity, and support.",
  },
  twitter: {
    title: "Bobcares – Product Engineering, AI, and IT Services",
    description: "Bobcares helps businesses build, secure, and scale with product engineering, digital transformation, AI, DevOps, cloud optimization, cybersecurity, and support.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${darkerGrotesque.variable} antialiased`}
      >
        <SmoothScroll />
        {children}
        <SupportBoard />
        <CookieConsent />
      </body>
    </html>
  );
}
