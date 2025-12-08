import CloudinaryImage from "@/components/CloudinaryImage";
import certificationsData from "../../data/certifications.json";

export default function Certifications() {
  const { certifications } = certificationsData;
  return (
    <section className="bg-white flex gap-16 items-center px-[180px] py-[140px] relative">
      <div className="flex flex-col gap-14 items-start text-black w-[703px]">
        <div className="flex flex-col gap-10 items-start w-full">
          <p className="font-medium text-[16px] uppercase">Our Achievements</p>
          <h2 className="font-semibold leading-[0.9] text-[96px] tracking-[-0.96px] w-[818px]">
            <span>Industry-leading </span>
            <span className="text-[#133de2]">certifications</span>
            <span> prove our commitment</span>
          </h2>
        </div>
        <p className="font-normal leading-[1.6] text-[20px] w-[591px]">
          Our certifications reflect our expertise and dedication to delivering trusted, high-quality solutions.
        </p>
      </div>
      <div className="flex gap-[22px] items-center overflow-x-auto overflow-y-clip w-[793px] pb-4">
        {certifications.map((cert) => (
          <CertCard key={cert.id} cert={cert} />
        ))}
      </div>
    </section>
  );
}

function CertCard({ cert }: { cert: { id: number; provider: string; title: string; level: string; icon: string; iconCloudinaryId?: string } }) {
  return (
    <div className="bg-[#f6f8fc] flex flex-col h-[361px] items-start justify-between p-8 relative rounded-3xl shrink-0 w-[329px]">
      <div className="flex gap-[18px] items-center w-full">
        <div className="relative shrink-0 size-16 overflow-hidden rounded-full">
          <CloudinaryImage
            src={cert.icon}
            cloudinaryId={cert.iconCloudinaryId}
            alt={cert.provider}
            fill
            className="object-cover"
          />
        </div>
        <p className="font-bold leading-8 text-[28px] text-black tracking-[-0.28px] w-[226px]">
          {cert.provider}
        </p>
      </div>
      <div className="border-[#dee4ef] border-t border-l-0 border-r-0 border-b-0 border-solid flex items-start w-full">
        <div className="flex flex-[1_0_0] flex-col items-start justify-end min-h-0 min-w-0 pb-0 pt-5 px-0">
          <div className="flex flex-col gap-[7px] items-start leading-[1.4] w-full">
            <p className="font-semibold text-[20px] text-black">{cert.title}</p>
            <p className="font-medium text-[#4d4d4d] text-[16px] text-right">{cert.level}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

