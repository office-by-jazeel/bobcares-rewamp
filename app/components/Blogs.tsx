import CloudinaryImage from "@/components/CloudinaryImage";
import blogsData from "../../data/blogs.json";

export default function Blogs() {
  const { blogs } = blogsData;
  return (
    <section className="bg-white flex flex-col items-start px-[180px] py-[140px] relative">
      <div className="flex flex-col gap-16 items-start w-full">
        <div className="flex items-center justify-between w-[1560px]">
          <h2 className="font-semibold leading-[0.9] text-[96px] tracking-[-0.96px]">
            <span className="text-black">Trending</span>
            <span className="text-[#0073ec]"> blogs</span>
          </h2>
          <button className="border border-black border-solid flex items-center justify-center px-[38px] py-5 rounded-[45px] hover:bg-black hover:text-white transition-colors">
            <span className="font-medium text-[20px] text-black tracking-[-1px]">View All</span>
          </button>
        </div>
        <div className="flex gap-10 items-center">
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
    <div className="flex flex-col gap-10 items-start w-[493px]">
      <div className="aspect-[4/3] bg-[#ededed] overflow-hidden relative rounded-[16px] w-full">
        <CloudinaryImage
          src={post.image}
          cloudinaryId={post.imageCloudinaryId}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-8 items-start w-full">
        <div className="flex flex-col gap-6 items-start w-full">
          <div className="border border-black border-solid flex items-center justify-center px-4 py-3 rounded-[57px]">
            <p className="font-normal text-[16px] text-black">{post.category}</p>
          </div>
          <h3 className="font-semibold leading-none text-[36px] text-neutral-900 w-[494px]">
            {post.title}
          </h3>
        </div>
        <a href="#" className="h-6 relative w-[115px] hover:text-[#0073ec] transition-colors">
          <span className="font-medium text-[20px] text-black tracking-[-0.5px] underline">Learn More</span>
        </a>
      </div>
    </div>
  );
}

