import { cn } from "@/utils/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={cn("w-10 h-10", className)} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a273ff" />
          <stop offset="100%" stopColor="#7c22ff" />
        </linearGradient>
      </defs>
      {/* Outer Hexagon */}
      <path d="M50 10 L85 30 V70 L50 90 L15 70 V30 L50 10Z" fill="url(#brandGrad)" />
      {/* Top Face */}
      <path d="M50 10 L85 30 L50 50 L15 30 L50 10Z" fill="white" fillOpacity="0.25" />
      {/* Left Face */}
      <path d="M15 30 L50 50 V90 L15 70 V30Z" fill="black" fillOpacity="0.15" />
      {/* Inner Gem */}
      <path d="M50 40 L65 48 V65 L50 73 L35 65 V48 L50 40Z" fill="white" />
      <path d="M50 50 L58 54 V61 L50 65 L42 61 V54 L50 50Z" fill="url(#brandGrad)" />
      {/* Sparkles */}
      <circle cx="80" cy="20" r="4" fill="#FCD34D" />
      <circle cx="25" cy="80" r="3" fill="#FCD34D" />
    </svg>
  );
}
