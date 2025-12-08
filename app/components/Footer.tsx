import Image from "next/image";

const socialIcons = {
  Facebook: "/icons/facebook-icon.svg",
  Twitter: "/icons/twitter-icon.svg",
  LinkedIn: "/icons/linkedin-icon.svg",
  Instagram: "/icons/instagram-icon.svg",
  YouTube: "/icons/youtube-icon.svg"
};

export default function Footer() {
  return (
    <footer className="bg-[#080808] h-[1554px] overflow-hidden relative">
      <div className="absolute flex flex-col gap-14 items-start left-[180px] top-[140px] w-[1560px]">
        <div className="flex flex-col gap-14 items-start w-full">
          <div className="flex items-end justify-between w-full">
            <div className="flex flex-col gap-16 items-start w-[531px]">
              <h2 className="font-semibold leading-[0.9] text-[96px] text-white tracking-[-0.96px] w-full">
                Register to our newsletter
              </h2>
              <div className="bg-[#141414] border border-white/10 border-solid flex items-center justify-between pl-10 pr-2 py-2 rounded-[264px] w-full">
                <p className="font-normal text-[20px] text-gray-500">Email Address</p>
                <button className="bg-[#0073ec] flex items-center justify-center px-[38px] py-5 rounded-[45px] hover:bg-[#005bb5] transition-colors">
                  <span className="font-medium text-[20px] text-white tracking-[-1px]">Submit</span>
                </button>
              </div>
            </div>
            <div className="flex gap-10 items-center justify-end">
              <div className="flex gap-6 items-center w-[328px]">
                <div className="relative shrink-0 size-16">
                  <Image
                    src="/icons/email-icon.svg"
                    alt="Email"
                    width={64}
                    height={64}
                    className="w-full h-full"
                  />
                </div>
                <p className="font-normal text-[24px] text-white tracking-[-1px]">sales@bobcares.com</p>
              </div>
              <div className="flex h-[39px] items-center justify-center w-0">
                <div className="h-0 w-[39px] border-l border-white/20 rotate-90" />
              </div>
              <div className="flex gap-6 items-center">
                <div className="relative shrink-0 size-16">
                  <Image
                    src="/icons/phone-icon.svg"
                    alt="Phone"
                    width={64}
                    height={64}
                    className="w-full h-full"
                  />
                </div>
                <p className="font-normal text-[24px] text-white tracking-[-1px]">1-800-383-5193</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer bottom */}
        <div className="border-[#1a1a1a] border-t border-l-0 border-r-0 border-b-0 border-solid flex flex-col items-start px-0 py-6 w-full">
          <div className="flex gap-[187px] items-center w-full">
            <div className="flex gap-[282px] items-center">
              <p className="font-light leading-[1.5] text-[#a4a4a4] text-[16px] tracking-[-0.16px]">
                © 2025 Bobcares. All Rights Reserved.
              </p>
              <div className="flex items-center justify-between w-[545px]">
                <a href="#" className="font-light leading-[1.5] text-[#a4a4a4] text-[16px] tracking-[-0.16px] hover:text-white transition-colors">Privacy Policy</a>
                <div className="h-[14px] w-0 border-l border-white/20 rotate-90" />
                <a href="#" className="font-light leading-[1.5] text-[#a4a4a4] text-[16px] tracking-[-0.16px] hover:text-white transition-colors">Terms and Service</a>
                <div className="h-[14px] w-0 border-l border-white/20 rotate-90" />
                <a href="#" className="font-light leading-[1.5] text-[#a4a4a4] text-[16px] tracking-[-0.16px] hover:text-white transition-colors">GDPR</a>
                <div className="h-[14px] w-0 border-l border-white/20 rotate-90" />
                <a href="#" className="font-light leading-[1.5] text-[#a4a4a4] text-[16px] tracking-[-0.16px] hover:text-white transition-colors">Acceptable Use Policy</a>
              </div>
            </div>
            <div className="flex gap-6 items-center">
              {/* Social Media Icons */}
              {Object.entries(socialIcons).map(([name, iconPath]) => (
                <a key={name} href="#" className="relative shrink-0 size-6 hover:opacity-70 transition-opacity">
                  <Image
                    src={iconPath}
                    alt={name}
                    width={24}
                    height={24}
                    className="w-full h-full"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Large logo background */}
      <div className="absolute inset-[40%_6%_40%_9%] opacity-10">
        <Image
          src="/icons/logo-white.svg"
          alt="Bobcares Logo"
          width={500}
          height={200}
          className="w-full h-full object-contain"
        />
      </div>
    </footer>
  );
}

