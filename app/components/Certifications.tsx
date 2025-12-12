import CloudinaryImage from "@/components/CloudinaryImage";
import certificationsData from "../../data/certifications.json";

export default function Certifications() {
  const { certifications } = certificationsData;

  return (
    <section>
      <div className="bg-white">
        <div className="container mx-auto px-5 sm:px-8 flex flex-col items-center py-14 lg:py-[140px]">
          <div className="w-full flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-16 items-center">

            {/* Left Section - Text */}
            <div className="flex flex-col gap-6 sm:gap-8 lg:gap-14 items-start text-black w-full lg:w-auto lg:max-w-[45%]">
              <div className="flex flex-col gap-4 lg:gap-1 items-start w-full">
                <p className="font-medium text-[14px] sm:text-[16px] uppercase">Our Achievements</p>
                <h2 className="font-grotesque font-semibold leading-[1.05] text-[48px] lg:text-[72px] xl:text-[96px] tracking-[-1px]">
                  <span>Industry-leading </span>
                  <span className="text-[#133de2]">certifications</span> {' '}
                  <span>prove our commitment</span>
                </h2>
              </div>
              <p className="font-normal leading-[1.6] text-[15px] sm:text-[18px] lg:text-[20px] hidden md:block">
                Our certifications reflect our expertise and dedication to delivering trusted, high-quality solutions.
              </p>
            </div>

            {/* Right Section - Scrollable Cards */}
            <div className="w-full lg:w-auto lg:flex-1 overflow-hidden">
              <div className="flex md:gap-[22px] items-center overflow-x-auto pb-4 scrollbar-hide">
                {certifications.map((cert) => (
                  <CertCard key={cert.id} cert={cert} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CertCard({ cert }: { cert: { id: number; provider: string; title: string; level: string; icon: string; iconCloudinaryId?: string; logoIcon?: string } }) {
  return (
    <>
      <div className="aspect-square size-[162px] border border-[#EFEFEF] items-center justify-center flex md:hidden">
        <div className="size-[100px] block md:hidden">
          <CloudinaryImage
            src={cert.logoIcon || cert.icon}
            alt={cert.provider}
            className="object-cover"
          />
        </div>
      </div>
      <div className="hidden md:flex bg-[#f6f8fc] flex-col h-[300px] sm:h-[340px] lg:h-[361px] items-start justify-between p-6 sm:p-8 relative rounded-3xl shrink-0 w-[280px] sm:w-[300px] lg:w-[329px]">
        <div className="flex gap-4 sm:gap-[18px] items-center w-full">
          <div className="relative shrink-0 size-12 sm:size-14 lg:size-16 overflow-hidden rounded-full">
            <CloudinaryImage
              src={cert.icon}
              cloudinaryId={cert.iconCloudinaryId}
              alt={cert.provider}
              fill
              className="object-cover"
            />
          </div>
          <p className="font-bold leading-[1.2] text-[20px] sm:text-[24px] lg:text-[28px] text-black tracking-[-0.28px] flex-1">
            {cert.provider}
          </p>
        </div>
        <div className="border-[#dee4ef] border-t border-l-0 border-r-0 border-b-0 border-solid flex items-start w-full">
          <div className="flex flex-1 flex-col items-start justify-end pt-4 sm:pt-5 w-full">
            <div className="flex flex-col gap-2 sm:gap-[7px] items-start leading-[1.4] w-full">
              <p className="font-semibold text-[18px] sm:text-[20px] text-black">{cert.title}</p>
              <p className="font-medium text-[#4d4d4d] text-[14px] sm:text-[16px]">{cert.level}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

