import { cn } from "@/lib/utils";

interface MuteButtonProps {
    isMuted: boolean;
    onClick: () => void;
    className?: string;
}

export default function MuteButton({ isMuted, onClick, className }: MuteButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "backdrop-blur-md border border-white/20 border-solid flex items-center justify-center p-3 rounded-[45px] size-[60px] hover:bg-black/10 transition-all",
                className
            )}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
            {isMuted ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-[26px]"
                >
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-[26px]"
                >
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
            )}
        </button>
    );
}

