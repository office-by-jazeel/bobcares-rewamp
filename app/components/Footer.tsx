'use client';

import { useState } from 'react';
import Image from "next/image";
import footerData from "../../data/footer.json";

const socialIcons = {
  Facebook: "/icons/facebook.svg",
  Twitter: "/icons/x.svg",
  LinkedIn: "/icons/link.svg",
  Instagram: "/icons/instagram.svg",
  YouTube: "/icons/youtube.svg"
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const { newsletter, contact, links, copyright } = footerData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter submission
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="bg-black flex flex-col items-center px-6 sm:px-12 lg:px-[180px] py-[80px] lg:py-[140px]">
      <div className="w-full max-w-[1560px] flex flex-col gap-16 lg:gap-20">
        
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12 w-full">
          
          {/* Newsletter Section */}
          <div className="flex flex-col gap-8 lg:gap-12 w-full lg:w-auto lg:max-w-[600px]">
            <h2 className="font-semibold leading-[1.1] text-[40px] sm:text-[56px] lg:text-[72px] xl:text-[96px] text-white tracking-[-1px]">
              {newsletter.title}
            </h2>
            <form onSubmit={handleSubmit} className="flex gap-3 w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={newsletter.placeholder}
                className="
                  flex-1 
                  bg-[#1a1a1a] 
                  border border-white/10 
                  rounded-full 
                  px-6 sm:px-8 lg:px-10 
                  py-4 sm:py-5 
                  text-white 
                  text-[16px] sm:text-[18px] lg:text-[20px]
                  placeholder:text-gray-500
                  focus:outline-none focus:border-white/30
                  transition-colors
                "
                required
              />
              <button 
                type="submit"
                className="
                  bg-[#0073ec] 
                  flex items-center justify-center 
                  px-8 sm:px-10 lg:px-[38px] 
                  py-4 sm:py-5 
                  rounded-full 
                  hover:bg-[#005bb5] 
                  transition-colors
                  shrink-0
                "
              >
                <span className="font-medium text-[16px] sm:text-[18px] lg:text-[20px] text-white tracking-[-1px]">
                  {newsletter.buttonText}
                </span>
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-10 items-start sm:items-center">
            <div className="flex gap-4 sm:gap-6 items-center">
              <div className="relative shrink-0 size-6 sm:size-8">
                <Image
                  src="/icons/mail.svg"
                  alt="Email"
                  width={32}
                  height={32}
                  className="w-full h-full"
                />
              </div>
              <a 
                href={`mailto:${contact.email}`}
                className="font-normal text-[18px] sm:text-[20px] lg:text-[24px] text-white tracking-[-1px] hover:text-[#0073ec] transition-colors"
              >
                {contact.email}
              </a>
            </div>
            <div className="flex gap-4 sm:gap-6 items-center">
              <div className="relative shrink-0 size-6 sm:size-8">
                <Image
                  src="/icons/call.svg"
                  alt="Phone"
                  width={32}
                  height={32}
                  className="w-full h-full"
                />
              </div>
              <a 
                href={`tel:${contact.phone}`}
                className="font-normal text-[18px] sm:text-[20px] lg:text-[24px] text-white tracking-[-1px] hover:text-[#0073ec] transition-colors"
              >
                {contact.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8 lg:pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 w-full">
          
          {/* Copyright and Legal Links */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 lg:gap-8 flex-1">
            <p className="font-light text-[14px] sm:text-[16px] text-[#a4a4a4] tracking-[-0.16px]">
              {copyright}
            </p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {links.legal.map((link, index) => (
                <div key={link.label} className="flex items-center gap-4 sm:gap-6">
                  {index > 0 && (
                    <div className="h-4 w-px bg-white/20" />
                  )}
                  <a 
                    href={link.href} 
                    className="font-light text-[14px] sm:text-[16px] text-[#a4a4a4] tracking-[-0.16px] hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-4 sm:gap-6 items-center">
            {['Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map((name) => (
              <a 
                key={name} 
                href="#" 
                className="relative shrink-0 size-6 sm:size-8 hover:opacity-70 transition-opacity"
              >
                <Image
                  src={socialIcons[name as keyof typeof socialIcons]}
                  alt={name}
                  width={32}
                  height={32}
                  className="w-full h-full"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Large background logo - appears after all content */}
        <div className="w-full pt-8 lg:pt-12 mt-8 lg:mt-12">
          <div className="relative w-full flex items-center justify-center opacity-5">
            <Image
              src="/images/bobcares.svg"
              alt="Bobcares Logo"
              width={1200}
              height={400}
              className="w-full h-auto object-contain max-w-[90%]"
              style={{
                filter: 'brightness(0) invert(1)',
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

