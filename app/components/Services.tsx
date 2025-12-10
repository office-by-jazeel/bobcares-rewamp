import Image from "next/image";
import servicesData from "../../data/services.json";

export default function Services() {
  const { services, ctaCard } = servicesData;

  return (
    <section className="bg-white flex flex-col items-center px-6 sm:px-12 lg:px-[180px] py-[80px] lg:py-[140px]">
      <div className="w-full max-w-[1560px] flex flex-col gap-20">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          <p className="font-medium text-[14px] sm:text-[16px] uppercase text-black">
            What We Do
          </p>

          <div className="flex flex-col gap-8 max-w-[900px]">
            <h2 className="font-semibold text-[40px] sm:text-[56px] lg:text-[96px] leading-[1] tracking-[-1px]">
              Choose how you want to make{" "}
              <span className="text-[#0073ec]">an impact</span>
            </h2>

            <p className="text-[#4d4d4d] text-[18px] sm:text-[20px] lg:text-[24px] leading-[1.6] max-w-[750px]">
              Build powerful, scalable digital products with an engineering
              approach that takes you from idea to launch—and beyond.
            </p>
          </div>
        </div>

        {/* Responsive grid */}
        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-16 
          lg:gap-24
        ">
          {services.slice(0, 8).map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}

          {/* CTA card appended last */}
          <CTACard ctaCard={ctaCard} />
        </div>

      </div>
    </section>
  );
}


function ServiceCard({ service }: { service: any }) {
  return (
    <div className="group relative cursor-pointer">

      {/* Animated top line */}
      <div className="absolute -top-6 left-0 w-full h-[2px] overflow-hidden">
        <div className="
          bg-black h-full w-0 
          group-hover:w-full 
          transition-[width] duration-500 ease-out
        "></div>
      </div>

      <div className="flex flex-col gap-6 pt-10">
        
        {/* Icon */}
        <div className="relative size-16">
          <div className="absolute inset-0 bg-[#f7f7f7] rounded-[18px]" />
          <div className="absolute inset-[14px] flex items-center justify-center">
            {service.icon.startsWith("/") ? (
              <Image src={service.icon} alt="" width={28} height={28} />
            ) : (
              <span className="text-3xl">{service.icon}</span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-[28px] sm:text-[32px] lg:text-[40px] leading-[1.1]">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-[15px] sm:text-[16px] text-[#4d4d4d] leading-[1.5]">
          {service.description}
        </p>

        {/* Link */}
        <a
          href="#"
          className="
            underline text-[18px] sm:text-[20px] font-medium 
            hover:text-[#0073ec] transition-colors
          "
        >
          Learn More
        </a>
      </div>
    </div>
  );
}

function CTACard({ ctaCard }: { ctaCard: any }) {
  return (
    <div className="
      bg-[#0073ec] 
      relative 
      rounded-2xl 
      p-10 sm:p-12 lg:p-16 
      flex flex-col gap-8 text-white
    ">
      <div className="absolute inset-0 opacity-20">
        <Image src="/icons/bob.png" alt="" fill className="object-cover" />
      </div>

      <div className="relative z-10 flex flex-col gap-8">
        <Image
          src="/icons/siren-icon.svg"
          alt=""
          width={40}
          height={40}
          className="mb-2"
        />

        <h3 className="text-[32px] sm:text-[40px] font-bold leading-[1.1]">
          {ctaCard.title}
        </h3>

        <button className="
          bg-white text-[#0073ec] 
          px-6 py-3 sm:px-8 sm:py-4 
          rounded-[45px] 
          text-[18px] sm:text-[20px] 
          font-medium 
          hover:bg-gray-100 
          transition
        ">
          {ctaCard.buttonText}
        </button>
      </div>
    </div>
  );
}
