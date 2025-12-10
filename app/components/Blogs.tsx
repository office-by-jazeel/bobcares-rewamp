import CloudinaryImage from "@/components/CloudinaryImage";
import blogsData from "../../data/blogs.json";

export default function Blogs() {
  const { blogs } = blogsData;
  return (
    <section className="bg-white flex flex-col items-center px-6 sm:px-12 lg:px-[180px] py-[80px] lg:py-[140px]">
      <div className="w-full max-w-[1560px] flex flex-col gap-12 lg:gap-16">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 w-full">
          <h2 className="font-semibold leading-[1.1] text-[40px] sm:text-[56px] lg:text-[72px] xl:text-[96px] tracking-[-1px]">
            <span className="text-black">Trending</span>
            <span className="text-[#0073ec]"> blogs</span>
          </h2>
          <button className="
            border border-black border-solid 
            flex items-center justify-center 
            px-8 sm:px-[38px] 
            py-4 sm:py-5 
            rounded-[45px] 
            hover:bg-black hover:text-white 
            transition-colors
            shrink-0
          ">
            <span className="font-medium text-[18px] sm:text-[20px] text-black tracking-[-1px]">
              View All
            </span>
          </button>
        </div>

        {/* Blog Cards Grid */}
        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-8 
          lg:gap-10
        ">
          {blogs.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: { id: number; category: string; title: string; image: string; imageCloudinaryId?: string } }) {
  return (
    <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 items-start w-full">
      {/* Image */}
      <div className="aspect-[4/3] bg-[#ededed] overflow-hidden relative rounded-2xl w-full">
        <CloudinaryImage
          src={post.image}
          cloudinaryId={post.imageCloudinaryId}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 sm:gap-8 items-start w-full">
        <div className="flex flex-col gap-4 sm:gap-6 items-start w-full">
          {/* Category Tag */}
          <div className="border border-black border-solid flex items-center justify-center px-4 py-2 sm:py-3 rounded-full w-fit">
            <p className="font-normal text-[14px] sm:text-[16px] text-black">{post.category}</p>
          </div>
          
          {/* Title */}
          <h3 className="font-semibold leading-[1.2] text-[24px] sm:text-[28px] lg:text-[32px] xl:text-[36px] text-black w-full">
            {post.title}
          </h3>
        </div>
        
        {/* Learn More Link */}
        <a 
          href="#" 
          className="font-medium text-[18px] sm:text-[20px] text-black tracking-[-0.5px] underline hover:text-[#0073ec] transition-colors"
        >
          Learn More
        </a>
      </div>
    </div>
  );
}

