import CloudinaryImage from "@/components/CloudinaryImage";
import blogsData from "../../data/blogs.json";

export default function Blogs() {
  const { blogs } = blogsData;
  return (
    <section>
      <div className="bg-white">
        <div className="container mx-auto flex flex-col items-center py-14 lg:py-[140px]">
          <div className="w-full flex flex-col gap-12 lg:gap-16">

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 w-full">
              <h2 className="font-grotesque font-semibold leading-[1.05] text-[48px] lg:text-[72px] xl:text-[96px] tracking-[-1px]">
                <span className="text-black">Trending</span>
                <span className="text-[#0073ec]"> blogs</span>
              </h2>
              <button className="hidden border border-black border-solid md:flex items-center justify-center px-7 sm:px-[32px] lg:px-[38px] py-3 lg:py-4 rounded-[45px] hover:bg-[#0073EC] hover:text-white hover:border-[#0073EC] transition-colors shrink-0">
                <span className="font-medium text-[16px] sm:text-[18px] lg:text-[20px] tracking-[-1px]">
                  View All
                </span>
              </button>
            </div>

            {/* Blog Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {blogs.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
              <button className="w-fit mx-auto flex md:hidden border border-black border-solid items-center justify-center px-7 sm:px-[32px] lg:px-[38px] py-3 lg:py-4 rounded-[45px] hover:bg-[#0073EC] hover:text-white hover:border-[#0073EC] transition-colors shrink-0">
                <span className="font-medium text-[16px] sm:text-[18px] lg:text-[20px] tracking-[-1px]">
                  View All
                </span>
              </button>
            </div>
          </div>
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
        <div className="flex flex-col gap-3 sm:gap-6 items-start w-full">
          {/* Category Tag */}
          <div className="border border-black border-solid flex items-center justify-center px-4 py-2 rounded-full w-fit">
            <p className="font-normal text-[13px] sm:text-[16px] text-black leading-none">{post.category}</p>
          </div>

          {/* Title */}
          <h3 className="font-grotesque font-semibold leading-[1.1] text-[22px] sm:text-[26px] lg:text-[32px] xl:text-[36px] text-black w-full line-clamp-2 max-h-[72px]">
            {post.title}
          </h3>
        </div>

        {/* Learn More Link */}
        <a
          href="#"
          className="font-medium text-[16px] sm:text-[18px] text-[#0073ec] md:text-black tracking-[-0.5px] underline underline-offset-4 hover:text-[#0073ec] transition-colors"
        >
          Learn More
        </a>
      </div>
    </div>
  );
}

