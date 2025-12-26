import React from "react"
import { Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils"

// 1. Base Spinner: Added explicit Lucide icon typing
export interface SpinnerProps extends React.ComponentProps<"svg"> {
    size?: number | string;
}

function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("animate-spin text-primary", className)}
      {...props}
    />
  )
}

// 2. Spinner Card: Useful for "Loading State" screens
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
      "flex flex-col items-center justify-center rounded-md p-8 border transition-colors",
      variant === 'red' 
        ? "bg-red-950/80 border-red-900" 
        : "bg-slate-500/10 border-slate-200"
    )}>
      <span className="text-[10px] text-muted-foreground mb-4 uppercase font-bold tracking-widest">
        {label || `${size} Spinner`}
      </span>
      <Spinner className={cn(sizeClasses[size], variant === 'red' ? "text-yellow-500" : "text-red-700")} />
    </div>
  )
}

// 3. Status Badge: For table rows or button states
const StatusBadge = ({ label, variant = 'red' }: { label: string, variant?: 'red' | 'yellow' | 'orange' }) => {
  const variants = {
    red: "bg-red-100 text-red-700 border-red-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
  }
  return (
    <div className={cn("inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold", variants[variant])}>
      <Spinner className="size-3 mr-2 animate-spin" />
      {label}
    </div>
  )
}

export { Spinner, SpinnerCard, StatusBadge }