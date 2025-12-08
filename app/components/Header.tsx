import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-[107px] bg-white/80 border-b border-[#e8e8e8] flex h-[100px] items-center justify-between px-[180px] py-4">
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-start pb-1 pt-0 px-1">
          <div className="h-[46.614px] w-[254.06px] relative">
            <Image
              src="/icons/logo.svg"
              alt="Bobcares Logo"
              width={254}
              height={47}
              className="h-full w-auto"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-5 items-center justify-end">
        <div className="flex gap-4 items-center">
          <button className="backdrop-blur-md bg-black/5 border border-white/20 border-solid flex items-center justify-center p-5 rounded-[45px] size-[60px] hover:bg-black/10 transition-colors">
            <Image
              src="/icons/search-icon.svg"
              alt="Search"
              width={26}
              height={26}
              className="size-[26px]"
            />
          </button>
          <button className="backdrop-blur-md bg-black/5 border border-white/20 border-solid flex items-center justify-center p-5 rounded-[45px] size-[60px] hover:bg-black/10 transition-colors">
            <Image
              src="/icons/phone-icon.svg"
              alt="Phone"
              width={26}
              height={26}
              className="size-[26px]"
            />
          </button>
          <button className="backdrop-blur-md bg-black/5 border border-white/20 border-solid flex items-center justify-center px-8 py-[18px] rounded-[45px] hover:bg-black/10 transition-colors">
            <span className="font-medium text-[20px] text-black/80">Emergency</span>
          </button>
        </div>
        <button className="h-3 w-10 relative">
          <Image
            src="/icons/menu-icon.svg"
            alt="Menu"
            fill
            className="object-contain"
          />
        </button>
      </div>
    </header>
  );
}

