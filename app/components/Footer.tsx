'use client';

import { useState } from 'react';
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { executeRecaptcha } from "@/lib/recaptcha";
import footerData from "../../data/footer.json";

const socialIcons = {
  Facebook: "/_next/icons/social/facebook.svg",
  Twitter: "/_next/icons/social/x.svg",
  LinkedIn: "/_next/icons/social/link.svg",
  Instagram: "/_next/icons/social/instagram.svg",
  Whatsapp: "/_next/icons/social/whatsapp.svg"
};

const socialLinks = {
  Facebook: "https://www.facebook.com/Bobcares",
  Twitter: "https://twitter.com/BobCaresTweets",
  LinkedIn: "https://www.linkedin.com/company/bobcares"
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const { newsletter, contact, links, copyright, services } = footerData;

  /**
   * Validate email format
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validate email input
   * Returns error message if invalid, null if valid
   */
  const validateEmail = (emailValue: string): string | null => {
    const trimmedEmail = emailValue.trim();

    if (!trimmedEmail) {
      return 'Email is required';
    }

    if (!isValidEmail(trimmedEmail)) {
      return 'Invalid email format';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset message
    setMessage(null);

    // Client-side validation
    const trimmedEmail = email.trim();
    const validationError = validateEmail(trimmedEmail);

    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }

    setIsLoading(true);

    try {
      // Execute reCAPTCHA v3 (optional - will be null if keys are not configured)
      const recaptchaToken = await executeRecaptcha('newsletter');

      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
          ...(recaptchaToken && { recaptchaToken })
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: 'success', text: data.message || 'Successfully subscribed!' });
        setEmail('');
        // Clear message after 5 seconds
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to subscribe. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to subscribe. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSection = (sectionTitle: string) => {
    if (expandedSections.has(sectionTitle)) {
      setExpandedSections(new Set());
    } else {
      setExpandedSections(new Set([sectionTitle]));
    }
  };

  return (
    <footer>
      <div className="bg-black">
        <div className="container mx-auto flex flex-col items-center py-12 lg:py-[140px]">
          <div className="w-full flex flex-col gap-10 lg:gap-16">

            {/* Top Section */}
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 lg:gap-12 w-full">

              {/* Newsletter Section */}
              <div className="flex flex-col gap-6 sm:gap-8 lg:gap-12 w-full lg:w-auto lg:max-w-[600px]">
                <h2 className="font-grotesque font-semibold leading-[1.05] text-[48px] md:text-[72px] xl:text-[96px] text-white tracking-[-1px]">
                  {newsletter.title}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col w-full">
                  <div className="relative w-full flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        // Clear message when user starts typing
                        if (message) setMessage(null);
                      }}
                      placeholder={newsletter.placeholder}
                      disabled={isLoading}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-full px-6 sm:px-8 lg:px-10 py-4 sm:py-5 text-white text-[15px] sm:text-[18px] lg:text-[20px] placeholder:text-gray-500 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0073ec] flex items-center justify-center px-7 sm:px-10 lg:px-[38px] py-3 rounded-full hover:bg-[#005bb5] transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                    >
                      <span className="font-medium text-[15px] sm:text-[18px] lg:text-[20px] text-white tracking-[-1px]">
                        {isLoading ? '...' : newsletter.buttonText}
                      </span>
                    </button>
                    {message && (
                      <div
                        className={cn(
                          "absolute top-full left-5 mt-2 z-20 px-4 py-2 rounded-lg text-[14px] sm:text-[16px] transition-all duration-200",
                          message.type === 'success'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        )}
                      >
                        {message.text}
                      </div>
                    )}
                  </div>
                </form>
              </div>

              {/* Contact Information */}
              <div className="flex flex-row flex-wrap md:gap-8 lg:gap-10 items-start sm:items-center max-md:w-full">
                <div className="flex gap-4 sm:gap-6 items-start md:items-center max-md:flex-col max-md:flex-1">
                  <div className="relative shrink-0 size-12 sm:size-16">
                    <Image
                      src="/_next/icons/navigation/mail.svg"
                      alt="Email"
                      width={32}
                      height={32}
                      className="w-full h-full"
                    />
                  </div>
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-normal text-[16px] sm:text-[20px] lg:text-[24px] text-white tracking-[-1px] transition-colors"
                  >
                    {contact.email}
                  </a>
                </div>
                <div className="h-[68px] md:h-10 w-px bg-[#FFFFFF40] shrink-0 mx-8"></div>
                <div className="flex gap-4 sm:gap-6 items-start md:items-center max-md:flex-col max-md:flex-1">
                  <div className="relative shrink-0 size-12 sm:size-16">
                    <Image
                      src="/_next/icons/navigation/call.svg"
                      alt="Phone"
                      width={32}
                      height={32}
                      className="w-full h-full"
                    />
                  </div>
                  <a
                    href={`tel:${contact.phone}`}
                    className="font-normal text-[16px] sm:text-[20px] lg:text-[24px] text-white tracking-[-1px] transition-colors"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Services Section */}
            <div className="w-full md:border-t md:border-white/10 md:pt-14">
              {/* Desktop: 6-column grid */}
              <div className="hidden lg:grid lg:grid-cols-6 gap-12">
                {services.map((service) => (
                  <div key={service.title} className="flex flex-col gap-12">
                    <a
                      href={service.href || "#"}
                      className="font-medium text-[16px] text-white uppercase leading-[1.54] tracking-normal min-h-[50px] line-clamp-2 transition-colors"
                    >
                      {service.title}
                    </a>
                    <div className="flex flex-col gap-[32px]">
                      {service.items.map((item, index) => (
                        <a
                          key={index}
                          href={typeof item === 'string' ? '#' : item.href}
                          className="font-light text-[18px] text-[#a4a4a4] leading-normal tracking-[-0.18px] hover:text-white transition-colors"
                        >
                          {typeof item === 'string' ? item : item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile: Accordion */}
              <div className="lg:hidden flex flex-col">
                {services.map((service, index) => {
                  const isExpanded = expandedSections.has(service.title);

                  return (
                    <div
                      key={service.title}
                      className={cn(
                        "border-b",
                        isExpanded ? "border-white pb-[48px] pt-[32px]" : "border-[#1c1c1c] py-[24px]"
                      )}
                    >
                      <button
                        onClick={() => toggleSection(service.title)}
                        className="w-full flex items-center justify-between"
                        aria-label={isExpanded ? `Collapse ${service.title}` : `Expand ${service.title}`}
                      >
                        {service.href ? (
                          <a
                            href={service.href}
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                              "font-medium text-[16px] uppercase leading-[1.1] tracking-normal text-left hover:text-[#0073ec] transition-colors",
                              isExpanded ? "text-[#e6e6e6]" : "text-[#8a8a8a]"
                            )}
                          >
                            {service.title}
                          </a>
                        ) : (
                          <h3
                            className={cn(
                              "font-medium text-[16px] uppercase leading-[1.1] tracking-normal text-left",
                              isExpanded ? "text-[#e6e6e6]" : "text-[#8a8a8a]"
                            )}
                          >
                            {service.title}
                          </h3>
                        )}
                        <div className="relative shrink-0 size-6">
                          {isExpanded ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          )}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            layout
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              type: "spring",
                              mass: 0.8,
                              stiffness: 200,
                              damping: 25,
                            }}
                            className="overflow-hidden will-change-[height,opacity]"
                          >
                            <div className="flex items-start justify-between gap-8 mt-[32px]">
                              <div className="flex flex-col gap-[32px] flex-1">
                                {service.items.slice(0, Math.ceil(service.items.length / 2)).map((item, itemIndex) => (
                                  <a
                                    key={itemIndex}
                                    href={typeof item === 'string' ? '#' : item.href}
                                    className="font-light text-[14px] text-[#a4a4a4] leading-normal tracking-[-0.14px] hover:text-white transition-colors"
                                  >
                                    {typeof item === 'string' ? item : item.label}
                                  </a>
                                ))}
                              </div>
                              <div className="flex flex-col gap-[32px] flex-1">
                                {service.items.slice(Math.ceil(service.items.length / 2)).map((item, itemIndex) => (
                                  <a
                                    key={itemIndex}
                                    href={typeof item === 'string' ? '#' : item.href}
                                    className="font-light text-[14px] text-[#a4a4a4] leading-normal tracking-[-0.14px] hover:text-white transition-colors"
                                  >
                                    {typeof item === 'string' ? item : item.label}
                                  </a>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Section */}
            <div className="md:border-t md:border-white/10 md:pt-8 flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-6 w-full">
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
                {['Facebook', 'Twitter', 'LinkedIn'].map((name) => (
                  <a
                    key={name}
                    href={socialLinks[name as keyof typeof socialLinks]}
                    target="_blank"
                    rel="noopener noreferrer"
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
            <div className="w-full lg:mt-8">
              <div className="relative w-full flex items-center justify-center">
                <Image
                  src="/_next/icons/bobcares.svg"
                  alt="Bobcares Logo"
                  width={1200}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

