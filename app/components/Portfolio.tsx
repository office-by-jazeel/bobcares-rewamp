import CloudinaryImage from "@/components/CloudinaryImage";
import portfolioData from "../../data/portfolio.json";

export default function Portfolio() {
  const { projects } = portfolioData;

  return (
    <section>
      <div className="bg-white">
        <div className="container mx-auto px-5 sm:px-8 flex flex-col items-center py-14 lg:py-[80px]">
          <div className="w-full flex flex-col gap-10 lg:gap-16">

            {/* Header */}
            <h2 className="font-grotesque font-semibold text-[48px] lg:text-[96px] tracking-[-1px] leading-none">
              <span>Our </span>
              <span className="text-[#0073ec]">portfolio</span>
            </h2>

            {/* 3x3 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {projects.slice(0, 9).map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  className={index >= 3 ? "hidden sm:block" : ""}
                />
              ))}
            </div>

            {/* View All Projects Button */}
            <div className="flex justify-center">
              <button className="
            border border-black border-solid 
            flex items-center justify-center 
            flex items-center justify-center 
            px-[32px] sm:px-[38px] py-3 sm:py-4
            rounded-[45px] 
            hover:bg-[#0073EC] hover:text-white hover:border-[#0073EC]
            transition-colors
          ">
                <span className="font-medium text-[18px] sm:text-[20px] tracking-[-1px]">
                  View All Projects
                </span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, className = "" }: {
  project: {
    id: number;
    title: string;
    category: string;
    description: string;
    image: string;
    imageCloudinaryId?: string;
  };
  className?: string;
}) {
  return (
    <div className={`group relative flex flex-col cursor-pointer ${className}`}>
      {/* Image Container */}
      <div className="relative w-full aspect-square overflow-hidden rounded-2xl mb-6">
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
        <div className="inline-flex items-center justify-center px-4 py-2 border border-[#4D4D4D] rounded-full w-fit">
          <p className="font-normal text-[13px] sm:text-[16px] text-[#171717]">
            {project.category}
          </p>
        </div>

        {/* Title */}
        <h3 className="font-grotesque font-semibold text-[32px] lg:text-[40px] leading-[1.1] text-black line-clamp-3 md:min-h-[82px]">
          {project.title}
        </h3>

        {/* View Project Link */}
        <a
          href="#"
          className="font-medium text-[18px] text-[#0073ec]  md:text-black  underline underline-offset-4 decoration-1 hover:text-[#0073ec]  transition-colors w-fit"
        >
          View Project
        </a>
      </div>
    </div>
  );
}

