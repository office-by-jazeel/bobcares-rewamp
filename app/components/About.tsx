import Image from "next/image";

const stats = [
  { value: "3.5M", label: "Million Websites" },
  { value: "350+", label: "Active Employees" },
  { value: "200+", label: "Trusted Clients" },
  { value: "25+", label: "Years of Services" }
];

export default function About() {
  return (
    <section className="bg-black flex flex-col gap-2 items-start overflow-hidden pb-[160px] pt-[192px] px-[180px] relative">
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/images/about-tunnel-bg.jpg"
          alt="Background"
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute flex flex-col items-start w-full max-w-[1560px] z-10">
        <div className="flex flex-col items-start w-full">
          <div className="flex gap-[158px] items-center w-[1559px]">
            {/* Team Photo */}
            <div className="flex flex-row items-center self-stretch">
              <div className="bg-[#181818] h-full overflow-hidden relative rounded-3xl w-[636px]">
                <div className="absolute h-[660px] left-[-277px] top-0 w-[1172px]">
                  <Image
                    src="/images/about-team.jpg"
                    alt="Team collaboration"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex flex-[1_0_0] flex-col gap-10 items-start min-h-0 min-w-0">
              <p className="font-normal text-[16px] text-white uppercase">Our Success</p>
              <div className="flex flex-col gap-[120px] items-start w-full">
                <h2 className="font-semibold leading-[0.9] text-[96px] text-white tracking-[-0.96px] w-[765px]">
                  <span>We love technology, giving </span>
                  <span className="text-[#6e6e6e]">back, and great experiences.</span>
                </h2>
                <div className="flex items-center w-full">
                  <div className="flex flex-[1_0_0] flex-col gap-[88px] items-start min-h-0 min-w-0">
                    {stats.slice(0, 2).map((stat, index) => (
                      <StatItem key={index} stat={stat} />
                    ))}
                  </div>
                  <div className="flex flex-[1_0_0] flex-col gap-[88px] items-start min-h-0 min-w-0">
                    {stats.slice(2, 4).map((stat, index) => (
                      <StatItem key={index + 2} stat={stat} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ stat }: { stat: { value: string; label: string } }) {
  return (
    <div className="border-[#133de2] border-l-[6px] border-r-0 border-t-0 border-b-0 border-solid flex flex-col gap-8 items-start leading-[0.9] px-12 py-0 text-white w-full">
      <p className="font-bold text-[64px] tracking-[-0.64px] w-full">{stat.value}</p>
      <p className="font-normal text-[20px] tracking-[-0.2px] w-full">{stat.label}</p>
    </div>
  );
}

