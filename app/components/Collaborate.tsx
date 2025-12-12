import CloudinaryImage from "@/components/CloudinaryImage";

export default function Collaborate() {
  return (
    <section className="bg-black overflow-hidden relative">
      {/* Background graphic */}
      <div className="absolute left-1/2 size-[900px] sm:size-[1100px] lg:size-[1316px] top-1/2 -translate-x-1/2 -translate-y-1/2">
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
      <div className="relative container mx-auto px-5 sm:px-8 py-14 lg:py-24 flex flex-col gap-10 items-center text-center text-white z-10">
        <div className="flex flex-col gap-6 sm:gap-10 items-center text-center text-white w-full">
          <h2 className="font-grotesque font-semibold leading-[1.02] text-[48px] lg:text-[96px] tracking-[-0.96px] max-w-[680px]">
            <span className="text-white">Collaborate with </span>
            <span className="text-[#0073ec]">Bobcares</span>
          </h2>
          <p className="font-normal leading-[1.6] w-full text-[18px] sm:text-[20px] lg:text-[24px] tracking-[-0.12px] max-w-[520px]">
            Get actionable solutions for your business
          </p>
        </div>
        <div className="flex items-start">
          <button className="border border-solid border-white flex items-center justify-center px-7 sm:px-[38px] py-4 sm:py-5 rounded-[45px] hover:bg-white text-white hover:text-[#0073EC] transition-colors">
            <span className="font-medium text-[18px] sm:text-[20px] tracking-[-1px]">Book My Free Consultation</span>
          </button>
        </div>
      </div>
    </section>
  );
}

