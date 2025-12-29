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
  title: "Bobcares - Get pro-level help from certified server experts",
  description: "Bobcares is a leading provider of server management, cloud solutions, and IT services. Trusted by 2.5k+ clients worldwide with 4.9/5 ratings.",
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
