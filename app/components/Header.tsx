export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-[107px] bg-white/80 border-b border-[#e8e8e8] flex h-[100px] items-center justify-between px-[180px] py-4">
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-start pb-1 pt-0 px-1">
          <div className="h-[46.614px] w-[254.06px] relative">
            <span className="text-2xl font-bold text-black">bobcares</span>
          </div>
        </div>
      </div>
      <div className="flex gap-5 items-center justify-end">
        <div className="flex gap-4 items-center">
          <button className="backdrop-blur-md bg-black/5 border border-white/20 border-solid flex items-center justify-center p-5 rounded-[45px] size-[60px] hover:bg-black/10 transition-colors">
            <svg className="size-[26px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="backdrop-blur-md bg-black/5 border border-white/20 border-solid flex items-center justify-center p-5 rounded-[45px] size-[60px] hover:bg-black/10 transition-colors">
            <svg className="size-[26px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button className="backdrop-blur-md bg-black/5 border border-white/20 border-solid flex items-center justify-center px-8 py-[18px] rounded-[45px] hover:bg-black/10 transition-colors">
            <span className="font-medium text-[20px] text-black/80">Emergency</span>
          </button>
        </div>
        <button className="h-3 w-10 relative">
          <div className="absolute bottom-0 left-0 right-0 top-[-25%]">
            <svg className="w-full h-full" fill="none" viewBox="0 0 40 12">
              <rect width="40" height="2" fill="black" />
              <rect y="5" width="40" height="2" fill="black" />
              <rect y="10" width="40" height="2" fill="black" />
            </svg>
          </div>
        </button>
      </div>
    </header>
  );
}

