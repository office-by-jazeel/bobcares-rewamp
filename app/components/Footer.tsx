'use client';

import { useState } from 'react';
import Image from "next/image";
import footerData from "../../data/footer.json";

const socialIcons = {
  Facebook: "/icons/facebook.svg",
  Twitter: "/icons/x.svg",
  LinkedIn: "/icons/link.svg",
  Instagram: "/icons/instagram.svg",
  Whatsapp: "/icons/whatsapp.svg"
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
    <footer>
      <div className="bg-black">
        <div className="container mx-auto px-5 sm:px-8 flex flex-col items-center py-12 lg:py-[140px]">
          <div className="w-full flex flex-col gap-14 lg:gap-16">

            {/* Top Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 lg:gap-12 w-full">

              {/* Newsletter Section */}
              <div className="flex flex-col gap-6 sm:gap-8 lg:gap-12 w-full lg:w-auto lg:max-w-[600px]">
                <h2 className="font-grotesque font-semibold leading-[1.05] text-[48px] md:text-[72px] xl:text-[96px] text-white tracking-[-1px]">
                  {newsletter.title}
                </h2>
                <form onSubmit={handleSubmit} className="flex gap-3 w-full">
                  <div className="relative w-full flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={newsletter.placeholder}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-full px-6 sm:px-8 lg:px-10 py-4 sm:py-5 text-white text-[15px] sm:text-[18px] lg:text-[20px] placeholder:text-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                      required
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0073ec] flex items-center justify-center px-7 sm:px-10 lg:px-[38px] py-3 rounded-full hover:bg-[#005bb5] transition-colors shrink-0"
                    >
                      <span className="font-medium text-[15px] sm:text-[18px] lg:text-[20px] text-white tracking-[-1px]">
                        {newsletter.buttonText}
                      </span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Contact Information */}
              <div className="flex flex-row flex-wrap md:gap-8 lg:gap-10 items-start sm:items-center max-md:w-full">
                <div className="flex gap-4 sm:gap-6 items-start md:items-center max-md:flex-col max-md:flex-1">
                  <div className="relative shrink-0 size-12 sm:size-16">
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
                    className="font-normal text-[16px] sm:text-[20px] lg:text-[24px] text-white tracking-[-1px] hover:text-[#0073ec] transition-colors"
                  >
                    {contact.email}
                  </a>
                </div>
                <div className="h-[68px] md:h-10 w-px bg-[#FFFFFF40] shrink-0 mx-auto max-md:mx-8"></div>
                <div className="flex gap-4 sm:gap-6 items-start md:items-center max-md:flex-col max-md:flex-1">
                  <div className="relative shrink-0 size-12 sm:size-16">
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
                    className="font-normal text-[16px] sm:text-[20px] lg:text-[24px] text-white tracking-[-1px] hover:text-[#0073ec] transition-colors"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-white/10 pt-8 flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-6 w-full">
              {/* Copyright and Legal Links */}
              <div className="relative max-md:w-full max-md:text-center">
                <p className="font-light text-[14px] sm:text-[16px] text-[#a4a4a4] tracking-[-0.16px]">
                  {copyright}
                </p>
                <div className="w-full h-px bg-[#1A1A1A] absolute top-12 left-0 block md:hidden"></div>
              </div>
              <div className="flex flex-wrap items-center gap-4 md:gap-6 justify-center md:justify-start">
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

              {/* Social Media Icons */}
              <div className="flex gap-4 sm:gap-6 items-center">
                {['Facebook', 'Instagram', 'Whatsapp', 'Twitter', 'LinkedIn'].map((name) => (
                  <a
                    key={name}
                    href="#"
                    className="relative shrink-0 size-6 hover:opacity-70 transition-opacity"
                  >
                    <Image
                      src={socialIcons[name as keyof typeof socialIcons]}
                      alt={name}
                      width={24}
                      height={24}
                      className="w-full h-full"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Large background logo - appears after all content */}
            <div className="w-full lg:pt-12 lg:mt-12">
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
        </div>
      </div>
    </footer>
  );
}

