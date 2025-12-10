import CloudinaryImage from "@/components/CloudinaryImage";
import aboutData from "../../data/about.json";

export default function About() {
  const { stats, teamImage, teamImageCloudinaryId, backgroundImage, backgroundImageCloudinaryId } = aboutData;
  return (
    <section className="bg-black flex flex-col items-center px-6 sm:px-12 lg:px-[180px] py-[80px] lg:py-[140px] relative overflow-hidden">
      {/* Background with subtle grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <CloudinaryImage
          src={backgroundImage}
          cloudinaryId={backgroundImageCloudinaryId}
          alt="Background"
          fill
          className="object-cover"
        />
      </div>
      
      <div className="relative z-10 w-full max-w-[1560px]">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          
          {/* Left Section - Team Photo */}
          <div className="w-full lg:w-1/2 flex-shrink-0">
            <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden">
              <CloudinaryImage
                src={teamImage}
                cloudinaryId={teamImageCloudinaryId}
                alt="Team collaboration"
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          {/* Right Section - Content */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8 lg:gap-12">
            {/* Heading */}
            <p className="font-normal text-[14px] sm:text-[16px] text-[#9e9e9e] uppercase tracking-wide">
              OUR SUCCESS
            </p>
            
            {/* Tagline */}
            <h2 className="font-semibold leading-[1.1] text-[40px] sm:text-[56px] lg:text-[72px] xl:text-[96px] tracking-[-1px]">
              <span className="text-white">We love technology,</span>
              <br />
              <span className="text-[#6e6e6e]">giving back, and</span>
              <br />
              <span className="text-white">great experiences.</span>
            </h2>
            
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-16 mt-4">
              {stats.map((stat) => (
                <StatItem key={stat.id} stat={stat} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ stat }: { stat: { value: string; label: string } }) {
  return (
    <div className="flex flex-col gap-4 relative pl-8">
      {/* Blue accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#0073ec]"></div>
      
      {/* Stat value */}
      <p className="font-bold text-[48px] sm:text-[56px] lg:text-[64px] text-white tracking-[-0.64px] leading-[1]">
        {stat.value}
      </p>
      
      {/* Stat label */}
      <p className="font-normal text-[16px] sm:text-[18px] lg:text-[20px] text-[#9e9e9e] tracking-[-0.2px]">
        {stat.label}
      </p>
    </div>
  );
}

