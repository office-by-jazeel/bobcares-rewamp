import CloudinaryImage from "@/components/CloudinaryImage";

export default function Collaborate() {
  return (
    <section className="bg-black h-[753px] overflow-hidden relative">
      {/* Background graphic */}
      <div className="absolute left-1/2 size-[1316px] top-1/2 -translate-x-1/2 -translate-y-1/2">
        <CloudinaryImage
          src="/images/collaborate-bg.jpg"
          cloudinaryId="bobcares/collaborate-bg"
          alt="Collaborate background"
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
      </div>
      
      {/* Content */}
      <div className="absolute flex flex-col gap-[57px] items-center left-[672px] top-1/2 -translate-y-1/2 w-[576px] z-10">
        <div className="flex flex-col gap-10 items-center text-center text-white w-full">
          <h2 className="font-semibold leading-[0.9] text-[96px] tracking-[-0.96px] w-[627px]">
            <span className="text-white">Collaborate with </span>
            <span className="text-[#0073ec]">Bobcares</span>
          </h2>
          <p className="font-normal leading-[1.6] min-w-full text-[24px] tracking-[-0.24px]">
            Get actionable solutions for your business
          </p>
        </div>
        <div className="flex items-start">
          <button className="border border-solid border-white flex items-center justify-center px-[38px] py-5 rounded-[45px] hover:bg-white/10 transition-colors">
            <span className="font-medium text-[20px] text-white tracking-[-1px]">Book My Free Consultation</span>
          </button>
        </div>
      </div>
    </section>
  );
}

