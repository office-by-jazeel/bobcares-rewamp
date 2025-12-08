import Image from "next/image";
import portfolioData from "../../data/portfolio.json";

export default function Portfolio() {
  const { projects } = portfolioData;

  return (
    <section className="bg-white h-[1074px] overflow-hidden relative">
      <div className="absolute flex flex-col gap-16 items-start left-[179px] top-[177px] w-[1562px]">
        <div className="flex items-center justify-between w-full">
          <h2 className="font-semibold leading-[0.9] text-[96px] text-black tracking-[-0.96px] w-[639px]">
            <span>Our </span>
            <span className="text-[#0073ec]">portfolio</span>
          </h2>
          <button className="border border-black border-solid flex items-center justify-center px-[38px] py-5 rounded-[45px] hover:bg-black hover:text-white transition-colors">
            <span className="font-medium text-[20px] text-black tracking-[-1px]">View All Projects</span>
          </button>
        </div>
        <div className="flex gap-4 items-start w-[1560px] overflow-x-auto pb-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} isFirst={project.featured} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, isFirst }: { project: { title: string; category: string; featured: boolean; image: string }; isFirst: boolean }) {
  return (
    <div className={`bg-[#ececec] h-[591px] overflow-hidden relative rounded-2xl shrink-0 ${isFirst ? 'w-[992px]' : 'w-[173px]'}`}>
      {isFirst && (
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover opacity-80"
        />
      )}
      <div className="absolute bottom-12 left-12 flex flex-col gap-8 items-start w-[884px] z-10">
        <div className="flex flex-col gap-6 items-start w-full">
          <div className="border border-solid border-white flex items-center justify-center px-4 py-3 rounded-[57px]">
            <p className="font-normal text-[16px] text-white">{project.category}</p>
          </div>
          <h3 className="font-semibold leading-[1.1] text-[48px] text-white w-full">
            {project.title}
          </h3>
        </div>
        <a href="#" className="font-medium text-[20px] text-white tracking-[-0.5px] underline hover:text-[#0073ec] transition-colors">
          View Project
        </a>
      </div>
    </div>
  );
}

