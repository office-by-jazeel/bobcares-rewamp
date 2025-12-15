import Image from "next/image";
import servicesData from "../../data/services.json";

interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
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
          <div className="w-full flex flex-col gap-14 lg:gap-20">

            {/* Header */}
            <div className="flex flex-col justify-between items-start gap-3">
              <p className="font-medium text-[14px] uppercase text-black">
                What We Do
              </p>

              <div className="flex flex-col gap-6 max-w-[900px]">
                <h2 className="font-grotesque font-semibold text-[48px] md:text-[96px] leading-[1.05] tracking-[-0.5px]">
                  Choose how you want to make{" "}
                  <span className="text-[#0073ec]">an impact</span>
                </h2>

                <p className="text-[#4D4D4D] text-[16px] sm:text-[18px] lg:text-[24px] leading-[1.6] max-w-[800px]">
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
          gap-10 
          sm:gap-14
          lg:gap-24
          lg:gap-y-32
        ">
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


function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group relative cursor-pointer">

      {/* Animated top line */}
      <div className="absolute -top-6 left-0 w-full h-px md:h-0.5 overflow-hidden z-20"><div className="bg-black h-full w-0 group-hover:w-full transition-[width] duration-150 ease-out"></div></div>
      <div className="absolute -top-6 left-0 w-full h-px md:h-0.5 overflow-hidden z-10"><div className="bg-[#D9D9D9] h-full w-full"></div></div>

      <div className="flex flex-col gap-6 pt-[11px]">
        {/* Icon */}
        <div className="relative size-14 sm:size-16 max-md:mb-4">
          <div className="absolute inset-0 bg-[#f7f7f7] rounded-[18px]" />
          <div className="absolute inset-[11px] sm:inset-[14px] flex items-center justify-center">
            {service.icon.startsWith("/") ? (
              <Image src={service.icon} alt="" width={24} height={24} className="sm:size-7 size-6" />
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
          href="#"
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

function CTACard({ ctaCard }: { ctaCard: CTACard }) {
  return (
    <div className="
      bg-[#0073EC] 
      relative 
      rounded-2xl 
      p-8 sm:p-12 lg:p-14 
      flex flex-col gap-7 sm:gap-8 text-white
      overflow-hidden
    ">
      <div className="absolute w-full h-full -right-[20%] -bottom-[5%]">
        <img src="/images/bob.svg" alt="" className="w-full h-full object-cover opacity-20" />
      </div>

      <div className="relative z-10 flex flex-col items-start gap-7 sm:gap-10">
        <Image
          src="/icons/siren-icon.svg"
          alt=""
          width={40}
          height={40}
        />

        <h3 className="font-grotesque text-[28px] sm:text-[36px] lg:text-[40px] font-bold leading-[1.15]">
          {ctaCard.title}
        </h3>

        <button className="
          bg-white text-[#0073ec] 
          px-6 py-3 sm:px-8 sm:py-4 
          rounded-[45px] 
          text-[16px] sm:text-[18px] lg:text-[20px] 
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
