import Image from "next/image";
import heroData from "../../data/hero.json";

export default function Hero() {
  const { title, description, ratings, buttons, backgroundImage } = heroData;
  
  return (
    <section className="relative bg-[#fbfbfb] h-[975px] overflow-hidden">
      {/* Background Image with overlay */}
      <div className="absolute h-[1180px] right-[-171px] top-[-25px] w-[2115px]">
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 from-[16%] to-black to-[87%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/10" />
        </div>
      </div>
      
      {/* Gradient overlay at top */}
      <div className="absolute bg-gradient-to-b from-black from-[16%] to-transparent to-[87%] h-[243px] left-1/2 -translate-x-1/2 top-0 w-full" />
      
      {/* Content */}
      <div className="absolute flex flex-col gap-8 items-start justify-end left-[180px] top-[337px] w-[903px] z-10">
        <div className="flex flex-col gap-10 items-start justify-center w-full">
          <h1 className="font-bold leading-[0.8] text-[96px] text-white tracking-[-1.92px] whitespace-pre-wrap">
            <span className="block mb-0">{title.line1}</span>
            <span className="block">{title.line2}</span>
          </h1>
          <div className="flex flex-col gap-6 items-start">
            <p className="font-normal leading-[1.5] text-[20px] text-white w-[508px] whitespace-pre-wrap">
              <span className="block mb-0">{description.line1}</span>
              <span className="block">{description.line2}</span>
            </p>
            <div className="backdrop-blur-[2px] flex flex-col items-start px-0 py-[21px] rounded-[70px]">
              <div className="flex gap-[34px] items-center">
                {ratings.map((rating, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    {index > 0 && (
                      <div className="flex h-6 items-center justify-center w-0">
                        <div className="h-0 w-6 border-l border-white/20" />
                      </div>
                    )}
                    <div className="flex gap-[10px] items-center">
                      <div className="h-7 w-7 relative">
                        <span className="text-white text-xl">{rating.icon}</span>
                      </div>
                      <span className="font-normal text-[20px] text-white tracking-[-1px]">{rating.platform}</span>
                    </div>
                    <div className="flex gap-[5px] items-center">
                      {[...Array(Math.floor(rating.rating))].map((_, i) => (
                        <svg key={i} className="size-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <span className="font-normal text-[20px] text-white tracking-[-1px]">{rating.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          {buttons.map((button, index) => (
            <button
              key={index}
              className={button.variant === "primary" 
                ? "bg-[#0073ec] flex items-center justify-center px-[38px] py-5 rounded-[45px] hover:bg-[#005bb5] transition-colors"
                : "border border-solid border-white flex items-center justify-center px-[38px] py-5 rounded-[45px] hover:bg-white/10 transition-colors"
              }
            >
              <span className="font-medium text-[20px] text-white tracking-[-1px]">{button.text}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

