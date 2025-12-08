import Image from "next/image";

const testimonials = [
  {
    category: "Amazing support",
    quote: "I have used Bobcares team for building an MVP at the beginning of 2024 and building out full...",
    author: "Sai Kalur",
    role: "CEO, Sanatio Technologies Inc",
    bgColor: "#fbe9ac",
    image: "/images/testimonial-sai.jpg"
  },
  {
    category: "NO compliance forms",
    quote: "We had a quick turnaround support from Ameer from BobCares team to fix a Cname issue we were facing with email delivery. This was rectified by Ameer instantly...",
    author: "Shamil Abdul Latheef",
    role: "Sr. Manager - Digital Biz",
    bgColor: "#fabcb0",
    image: "/images/testimonial-shamil.jpg"
  },
  {
    category: "NO compliance forms",
    quote: "Bobcares helped me with the configuration of server side settings that allowed for our development team to use Github with cPanel.",
    author: "Matthew Owen",
    role: "Founder, FastTrack CEO",
    bgColor: "#cfeddf",
    image: "/images/testimonial-shamil.jpg"
  }
];

export default function Testimonials() {
  return (
    <section className="bg-[#110536] h-[1026px] overflow-hidden relative">
      <div className="absolute flex items-end justify-between left-[180px] top-[140px] w-[1560px]">
        <h2 className="font-semibold leading-[0.9] text-[96px] text-white tracking-[-0.96px] w-[693px]">
          <span>Kind words from </span>
          <span className="text-[#00e8e8]">valued clients</span>
        </h2>
        <button className="border border-solid border-white flex items-center justify-center px-[38px] py-5 rounded-[45px] hover:bg-white/10 transition-colors">
          <span className="font-medium text-[20px] text-white tracking-[-1px]">View All Testimonials</span>
        </button>
      </div>
      <div className="absolute h-[503px] left-1/2 overflow-hidden top-[378px] -translate-x-1/2 w-full">
        <div className="flex gap-6 items-start px-[180px] overflow-x-auto pb-4">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div 
      className="flex gap-[52px] items-start px-14 py-16 rounded-3xl shrink-0 w-[840px]"
      style={{ backgroundColor: testimonial.bgColor }}
    >
      <div className="flex flex-[1_0_0] flex-col gap-[52px] items-start min-h-0 min-w-0">
        <div className="flex flex-col gap-8 items-start w-full">
          <p className="font-medium leading-normal text-[16px] text-black uppercase w-full">
            {testimonial.category}
          </p>
          <p className="font-semibold leading-none text-[40px] text-black w-full">
            "{testimonial.quote}"
          </p>
          <a href="#" className="font-medium text-[20px] text-black tracking-[-0.5px] underline hover:text-[#0073ec] transition-colors">
            Read More
          </a>
        </div>
        <div className="flex gap-4 items-center w-[392px]">
          <div className="relative rounded-full shrink-0 size-14 overflow-hidden">
            <Image
              src={testimonial.image}
              alt={testimonial.author}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <div className="flex flex-[1_0_0] flex-col gap-1 items-start min-h-0 min-w-0 text-black">
            <p className="font-semibold text-[20px] w-full">{testimonial.author}</p>
            <p className="font-normal text-[16px] w-full">{testimonial.role}</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-300 overflow-hidden relative rounded-2xl self-stretch shrink-0 w-[284px]">
        <Image
          src={testimonial.image}
          alt={testimonial.author}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}

