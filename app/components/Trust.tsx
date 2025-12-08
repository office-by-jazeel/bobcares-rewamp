import CloudinaryImage from "@/components/CloudinaryImage";

export default function Trust() {
  return (
    <section className="bg-black h-[1026px] overflow-hidden relative">
      <div className="absolute flex flex-col gap-16 items-start left-[180px] top-[140px] w-[661px]">
        <div className="flex flex-col gap-10 items-start w-full">
          <div className="flex items-center">
            <p className="font-normal text-[16px] text-white uppercase">Clients</p>
          </div>
          <h2 className="font-semibold leading-[0.9] text-[96px] tracking-[-0.96px] w-full">
            <span className="text-[#6e6e6e]">Trusted by </span>
            <span className="text-white underline">2.5k+ clients</span>
            <span className="text-[#6e6e6e]"> all around the world</span>
          </h2>
        </div>
        <div className="flex flex-col gap-12 items-start">
          <p className="font-normal leading-[1.6] text-[#cccccc] text-[18px] w-[576px]">
            We support businesses across the globe with reliable, expert-driven solutions. Trusted for our consistency, speed, and commitment to quality.
          </p>
          <button className="bg-[#0073ec] flex items-center justify-center px-[38px] py-5 rounded-[45px] hover:bg-[#005bb5] transition-colors">
            <span className="font-medium text-[20px] text-white tracking-[-1px]">View More</span>
          </button>
        </div>
      </div>
      
      {/* World Map Graphic */}
      <div className="absolute left-[841px] top-[253px] w-[983px] h-[622px]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <CloudinaryImage
            src="/images/world-map.jpg"
            cloudinaryId="bobcares/world-map"
            alt="World map showing global clients"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

