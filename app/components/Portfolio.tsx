import CloudinaryImage from "@/components/CloudinaryImage";
import portfolioData from "../../data/portfolio.json";

export default function Portfolio() {
  const { projects } = portfolioData;

  return (
    <section className="bg-white flex flex-col items-center px-6 sm:px-12 lg:px-[180px] py-[80px] lg:py-[140px]">
      <div className="w-full max-w-[1560px] flex flex-col gap-20">
        
        {/* Header */}
        <h2 className="font-semibold text-[40px] sm:text-[56px] lg:text-[96px] leading-[1] tracking-[-1px]">
          <span>Our </span>
          <span className="text-[#0073ec]">portfolio</span>
        </h2>

        {/* 3x3 Grid */}
        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-8 
          lg:gap-12
        ">
          {projects.slice(0, 9).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* View All Projects Button */}
        <div className="flex justify-center">
          <button className="
            border border-black border-solid 
            flex items-center justify-center 
            px-[38px] py-5 
            rounded-[45px] 
            hover:bg-black hover:text-white 
            transition-colors
          ">
            <span className="font-medium text-[20px] text-black tracking-[-1px]">
              View All Projects
            </span>
          </button>
        </div>

      </div>
    </section>
  );
}

function ProjectCard({ project }: { 
  project: { 
    id: number; 
    title: string; 
    category: string; 
    description: string;
    image: string; 
    imageCloudinaryId?: string;
  }; 
}) {
  return (
    <div className="group relative flex flex-col cursor-pointer">
      
      {/* Image Container */}
      <div className="relative w-full h-[280px] sm:h-[320px] lg:h-[360px] overflow-hidden rounded-2xl mb-6">
        <CloudinaryImage
          src={project.image}
          cloudinaryId={project.imageCloudinaryId}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4">
        {/* Category Badge */}
        <div className="inline-flex items-center justify-center px-4 py-2 bg-[#f7f7f7] rounded-full w-fit">
          <p className="font-normal text-[14px] sm:text-[16px] text-black">
            {project.category}
          </p>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-[24px] sm:text-[28px] lg:text-[32px] leading-[1.2] text-black">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-[15px] sm:text-[16px] text-[#4d4d4d] leading-[1.5] line-clamp-2">
          {project.description}
        </p>

        {/* View Project Link */}
        <a 
          href="#" 
          className="
            font-medium text-[18px] sm:text-[20px] 
            text-black 
            underline 
            hover:text-[#0073ec] 
            transition-colors
            w-fit
          "
        >
          View Project
        </a>
      </div>
    </div>
  );
}

