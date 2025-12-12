import CloudinaryImage from "@/components/CloudinaryImage";

export default function Trust() {
  return (
    <section className="bg-black overflow-hidden relative">
      <div className="container mx-auto px-5 sm:px-8 flex flex-col lg:flex-row items-start h-full w-full py-14 lg:py-[140px] gap-12 lg:gap-16">
        <div className="flex flex-col gap-8 sm:gap-12 items-start w-full lg:w-[40%]">
          <div className="flex flex-col gap-1 items-start w-full">
            <div className="flex items-center">
              <p className="font-normal text-[16px] text-white uppercase">Clients</p>
            </div>
            <h2 className="font-grotesque font-semibold leading-[0.95] text-[48px] lg:text-[96px] tracking-[-0.96px] w-full">
              <span className="text-[#6e6e6e]">Trusted by </span>
              <span className="text-white underline decoration-3 underline-offset-8">2.5k+ clients</span>
              <span className="text-[#6e6e6e]"> all around the world</span>
            </h2>
          </div>
          <div className="flex flex-col gap-8 sm:gap-12 items-start">
            <p className="font-normal leading-[1.6] text-[#cccccc] text-[16px] sm:text-[18px] w-full lg:w-[576px]">
              We support businesses across the globe with reliable, expert-driven solutions. Trusted for our consistency, speed, and commitment to quality.
            </p>
            <button className="bg-[#0073ec] flex items-center justify-center px-7 sm:px-[38px] py-4 rounded-[45px] hover:bg-[#005bb5] transition-colors">
              <span className="font-medium text-[18px] sm:text-[20px] text-white tracking-[-1px]">View More</span>
            </button>
          </div>
        </div>

        {/* World Map Graphic */}
        <div className="flex-1 mt-auto w-full">
          <CloudinaryImage
            src="/images/world-map.png"
            cloudinaryId="bobcares/world-map"
            alt="World map showing global clients"
            className="w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

