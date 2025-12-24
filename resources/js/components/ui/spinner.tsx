import React from "react"
import { Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils"

// --- Base Spinner Component ---
function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

// --- Spinner Card Wrapper (Matches your UI) ---
interface SpinnerCardProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'gray' | 'red';
  label?: string;
}

const SpinnerCard = ({ size = 'md', variant = 'gray', label }: SpinnerCardProps) => {
  const sizeClasses = {
    sm: "size-4",
    md: "size-8",
    lg: "size-12",
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-md p-8 min-w-[150px] border transition-colors",
      variant === 'red' 
        ? "bg-red-950/80 border-red-900" 
        : "bg-slate-500/20 border-white/5"
    )}>
      <span className="text-[10px] text-gray-500 mb-6 self-start uppercase font-semibold tracking-tighter">
        {label || `${size.charAt(0).toUpperCase() + size.slice(1)}Spinner`}
      </span>
      <Spinner 
        className={cn(
          sizeClasses[size], 
          variant === 'red' ? "text-yellow-500" : "text-red-700"
        )} 
      />
    </div>
  )
}

// --- Progress Bar ---
const ProgressBar = ({ label, percent, className }: { label: string, percent: number, className?: string }) => (
  <div className={cn("w-full mb-4", className)}>
    <div className="flex justify-between mb-1.5">
      <span className="text-[10px] uppercase tracking-tighter text-red-800 font-bold">{label}</span>
      <span className="text-[10px] text-red-800 font-bold">{percent}%</span>
    </div>
    <div className="w-full bg-black/30 rounded-full h-1">
      <div 
        className="bg-red-700 h-full rounded-full transition-all duration-1000 ease-in-out" 
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
)

// --- Status Badge ---
const StatusBadge = ({ label, variant }: { label: string, variant: 'red' | 'yellow' | 'orange' }) => {
  const variants = {
    red: "bg-red-950/50 text-red-500 border-red-900",
    yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-700/50",
    orange: "bg-orange-500/10 text-orange-500 border-orange-700/50",
  }
  return (
    <div className={cn("flex items-center px-2.5 py-1 rounded border text-[10px] font-medium", variants[variant])}>
      <Spinner className="size-3 mr-2" />
      {label}
    </div>
  )
}

export { Spinner, SpinnerCard, ProgressBar, StatusBadge }