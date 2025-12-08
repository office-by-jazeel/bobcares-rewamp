import Image from "next/image";

const services = [
  {
    icon: "📦",
    title: "End-to-End product Engineering",
    description: "We design, build, and scale complete digital products with full-cycle engineering that covers architecture, development, testing, deployment, and optimization."
  },
  {
    icon: "🔄",
    title: "Digital transformation",
    description: "We modernize your business systems with streamlined processes, upgraded technology, and smarter digital workflows that improve efficiency and performance."
  },
  {
    icon: "🤖",
    title: "Artificial intelligence services",
    description: "We develop intelligent AI solutions that improve decision-making, automate operations, and create new opportunities across your organization."
  },
  {
    icon: "⚙️",
    title: "Infrastructure optimization",
    description: "We optimize your IT infrastructure for reliability, speed, and scalability through continuous monitoring, performance tuning, and proactive upkeep."
  },
  {
    icon: "🚀",
    title: "DevOps & automation services",
    description: "We accelerate delivery with automated pipelines, improved deployment workflows, and DevOps practices that enhance stability and operational efficiency."
  },
  {
    icon: "🔒",
    title: "Cybersecurity & compliance services",
    description: "We design, build, and scale complete digital products with full-cycle engineering that covers architecture, development, testing, deployment, and optimization."
  },
  {
    icon: "🧪",
    title: "QA and test automation",
    description: "We optimize your IT infrastructure for reliability, speed, and scalability through continuous monitoring, performance tuning, and proactive upkeep."
  },
  {
    icon: "💬",
    title: "Outsourced support services",
    description: "We provide round-the-clock technical and customer support that keeps your operations running smoothly and ensures a great experience for your users."
  }
];

export default function Services() {
  return (
    <section className="bg-white flex flex-col items-center px-[180px] py-[140px]">
      <div className="flex flex-col gap-[96px] items-center w-full max-w-[1560px]">
        <div className="flex flex-col gap-[90px] items-start w-full">
          <div className="flex items-start justify-between w-full">
            <div className="flex items-center">
              <p className="font-medium text-[16px] text-black uppercase">What We Do</p>
            </div>
            <div className="flex flex-col gap-10 items-start w-[1031px]">
              <h2 className="font-semibold leading-[0.9] text-[96px] text-black tracking-[-0.96px] w-[900px]">
                <span>Choose how you want to make </span>
                <span className="text-[#0073ec]">an impact</span>
              </h2>
              <p className="font-normal leading-[1.6] text-[#4d4d4d] text-[24px] tracking-[-0.24px] w-[803px]">
                Build powerful, scalable digital products with an engineering approach that takes you from idea to launch—and beyond.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-[104px] items-start w-full">
            {/* First row - 3 services */}
            <div className="flex gap-[134px] items-start w-full">
              {services.slice(0, 3).map((service, index) => (
                <ServiceCard key={index} service={service} />
              ))}
            </div>
            
            {/* Second row - 3 services */}
            <div className="flex gap-[134px] items-start w-full">
              {services.slice(3, 6).map((service, index) => (
                <ServiceCard key={index + 3} service={service} />
              ))}
            </div>
            
            {/* Third row - 2 services + CTA card */}
            <div className="flex gap-[134px] items-start w-full">
              {services.slice(6, 8).map((service, index) => (
                <ServiceCard key={index + 6} service={service} />
              ))}
              <CTACard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: typeof services[0] }) {
  return (
    <div className="h-[381px] overflow-hidden relative w-[395px]">
      <div className="absolute content-stretch flex flex-col gap-10 items-start left-0 top-[45px] w-[395px]">
        <div className="relative shrink-0 size-16">
          <div className="absolute bg-[#f7f7f7] inset-0 rounded-[18px]" />
          <div className="absolute inset-[14px] flex items-center justify-center text-3xl">
            {service.icon}
          </div>
        </div>
        <div className="flex flex-col gap-6 items-start relative text-black w-full">
          <div className="flex flex-col gap-6 items-start w-full">
            <h3 className="font-bold leading-none text-[40px] w-full">
              {service.title.split(' ').map((word, i, arr) => (
                <span key={i}>
                  {word}
                  {i < arr.length - 1 && ' '}
                  {i === Math.floor(arr.length / 2) - 1 && <br />}
                </span>
              ))}
            </h3>
            <p className="font-normal leading-[1.5] text-[16px] w-full">
              {service.description}
            </p>
          </div>
          <a href="#" className="font-medium text-[20px] tracking-[-0.5px] underline w-full hover:text-[#0073ec] transition-colors">
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}

function CTACard() {
  return (
    <div className="bg-[#0073ec] flex flex-col gap-[43px] h-[381px] items-start justify-center overflow-hidden px-14 py-[72px] relative rounded-2xl w-[395px]">
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/images/services-cta-bg.jpg"
          alt="Services CTA background"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col items-start w-full relative z-10">
        <div className="flex flex-col gap-10 items-start w-full">
          <div className="relative shrink-0 size-10">
            <span className="text-4xl">🚨</span>
          </div>
          <div className="flex flex-col gap-10 items-start w-full">
            <h3 className="font-bold leading-none text-[40px] text-white w-full">
              Get actionable solutions for your business
            </h3>
            <button className="backdrop-blur-md bg-white flex items-center justify-center px-8 py-[18px] rounded-[45px] hover:bg-gray-100 transition-colors">
              <span className="font-medium text-[#0073ec] text-[20px] tracking-[-1px]">Free Consultation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

