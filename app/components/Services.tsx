'use client';

import Image from "next/image";
import servicesData from "../../data/services.json";
import { cn } from "@/lib/utils";
import { openSupportBoard } from "@/lib/support-board";

interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  href: string;
}

interface CTACard {
  title: string;
  buttonText: string;
}

export default function Services() {
  const { services, ctaCard } = servicesData;

  return (
    <section>
      <div className="bg-white">
        <div className="container mx-auto flex flex-col items-center py-14 lg:py-[140px]">
          <div className="w-full flex flex-col gap-5 md:gap-20">

            {/* Header */}
            <div className="flex flex-col justify-between items-start gap-3">
              {/* <p className="font-medium text-[14px] uppercase text-black">
                What We Do
              </p> */}

              <div className="flex flex-col gap-6 max-w-[900px]">
                <h2 className="font-grotesque font-semibold text-[48px] md:text-[96px] leading-[1.05] tracking-[-0.5px]">
                  Solutions Built for{" "}
                  <span className="text-[#0073ec]">Your Business</span>
                </h2>

                <p className="text-[#4D4D4D] text-[16px] sm:text-[18px] lg:text-[24px] leading-[1.6] max-w-[800px]">
                  Build the future with powerful digital solutions powered by a holistic end-to-end engineering approach
                </p>
              </div>
            </div>

            {/* Mobile list view */}
            <div className="md:hidden w-full">
              <div className="relative">
                {services.slice(0, 8).map((service, index) => (
                  <MobileServiceItem key={service.id} service={service} isLast={index === 7} />
                ))}
              </div>

              {/* View All Services button */}
              {/* <div className="mt-8 flex justify-center">
                <button className="border border-black rounded-full px-6 py-3 text-[16px] font-medium hover:bg-gray-50 transition-colors">
                  View All Services
                </button>
              </div> */}

              <CTACard ctaCard={ctaCard} className={"max-sm:aspect-square mt-10 px-[50px] py-[44px]"} />
            </div>

            {/* Desktop grid view */}
            <div className="hidden md:grid grid-cols-2 xl:grid-cols-3 gap-10 sm:gap-14 xl:gap-x-24 xl:gap-y-32">
              {services.slice(0, 8).map((service, index) => (
                <ServiceCard key={index} service={service} />
              ))}

              {/* CTA card appended last */}
              <CTACard ctaCard={ctaCard} />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}


function MobileServiceItem({ service, isLast }: { service: Service; isLast: boolean }) {
  return (
    <a href={service.href} className="block">
      <div className="py-4">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="relative size-12 shrink-0">
            <div className="absolute inset-0 bg-[#f7f7f7] rounded-lg" />
            <div className="absolute inset-2 flex items-center justify-center">
              {service.icon.startsWith("/") ? (
                <Image src={service.icon} alt={`${service.title} icon`} width={20} height={20} className="w-5 h-5" />
              ) : (
                <span className="text-xl">{service.icon}</span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="flex-1 font-grotesque font-bold text-[22px] leading-[1.2]">
            {service.title}
          </h3>

          {/* Chevron */}
          <div className="flex items-center justify-center size-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
              <path d="M4.175 5.575L0.275 1.675C0.0916667 1.49167 0 1.25833 0 0.975C0 0.691667 0.0916667 0.458333 0.275 0.275C0.458333 0.0916667 0.691667 0 0.975 0C1.25833 0 1.49167 0.0916667 1.675 0.275L6.275 4.875C6.375 4.975 6.44583 5.08333 6.4875 5.2C6.52917 5.31667 6.55 5.44167 6.55 5.575C6.55 5.70833 6.52917 5.83333 6.4875 5.95C6.44583 6.06667 6.375 6.175 6.275 6.275L1.675 10.875C1.49167 11.0583 1.25833 11.15 0.975 11.15C0.691667 11.15 0.458333 11.0583 0.275 10.875C0.0916667 10.6917 0 10.4583 0 10.175C0 9.89167 0.0916667 9.65833 0.275 9.475L4.175 5.575Z" fill="black" />
            </svg>
          </div>
        </div>

        {/* Divider */}
        {!isLast && (
          <div className="mt-4 border-t border-[#D9D9D9]" />
        )}
      </div>
    </a>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group relative">

      {/* Animated top line */}
      <div className="absolute -top-6 left-0 w-full h-px md:h-0.5 overflow-hidden z-20"><div className="bg-black h-full w-0 group-hover:w-full transition-[width] duration-150 ease-out"></div></div>
      <div className="absolute -top-6 left-0 w-full h-px md:h-0.5 overflow-hidden z-10"><div className="bg-[#D9D9D9] h-full w-full"></div></div>

      <div className="flex flex-col gap-6 pt-[11px]">
        {/* Icon */}
        <div className="relative size-14 sm:size-16 max-md:mb-4">
          <div className="absolute inset-0 bg-[#f7f7f7] rounded-[18px]" />
          <div className="absolute inset-[11px] sm:inset-[14px] flex items-center justify-center">
            {service.icon.startsWith("/") ? (
              <Image src={service.icon} alt={`${service.title} icon`} width={24} height={24} className="sm:size-7 size-6" />
            ) : (
              <span className="text-2xl sm:text-3xl">{service.icon}</span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-grotesque font-bold text-[36px] lg:text-[40px] leading-[1.1] line-clamp-2 md:min-h-[88px]">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-[15px] sm:text-[16px] text-[#4d4d4d] leading-relaxed line-clamp-3 min-h-[72px] hidden md:block">
          {service.description}
        </p>

        {/* Link */}
        <a
          href={service.href}
          className="
            underline underline-offset-3 text-[16px] sm:text-[18px] font-medium 
            group-hover:text-[#0073ec] transition-colors
          "
        >
          Learn More
        </a>
      </div>
    </div>
  );
}

function CTACard({ ctaCard, className }: { ctaCard: CTACard; className?: string }) {
  const handleButtonClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Check if button text is "Free Consultation"
    if (ctaCard.buttonText === "Free Consultation") {
      await openSupportBoard();
    }
  };

  return (
    <div className={cn("bg-[#0073EC] relative rounded-2xl p-8 sm:p-12 lg:p-14 flex flex-col gap-7 sm:gap-8 text-white overflow-hidden md:-mt-6", className)}>
      <div className="absolute w-full h-full -right-[20%] -bottom-[5%]">
        <Image
          src="/_next/icons/bob.svg"
          alt="Bobcares decorative logo"
          fill
          sizes="100vw"
          className="object-contain opacity-20"
        />
      </div>

      <div className="relative z-10 flex flex-col items-start gap-7 sm:gap-10">
        <Image
          src="/_next/icons/services/siren-icon.svg"
          alt="Emergency support icon"
          width={40}
          height={40}
        />

        <h3 className="font-grotesque text-[36px] lg:text-[40px] font-bold leading-[1.15]">
          {ctaCard.title}
        </h3>

        <button
          onClick={handleButtonClick}
          className="bg-white text-[#0073ec] px-6 py-3 sm:px-8 sm:py-4 rounded-[45px] text-[16px] sm:text-[18px] lg:text-[20px] font-medium hover:bg-gray-100 transition"
        >
          {ctaCard.buttonText}
        </button>
      </div>
    </div>
  );
}
