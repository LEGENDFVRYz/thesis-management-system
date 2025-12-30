import React from "react"
import { Loader2Icon, LoaderIcon, RefreshCwIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SpinnerProps extends React.ComponentProps<"svg"> {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    type?: 'ring' | 'dots' | 'pulse' | 'spokes' | 'bars-pulse' | 'bars-scale';
}

function Spinner({ className, size = 'sm', type = 'ring', ...props }: SpinnerProps) {
  // Global Size Definitions
  const sizeClasses = {
    sm: "size-4",
    md: "size-6",
    lg: "size-10",
    xl: "size-16",
  };

  const icons = {
    // Standard Circular
    ring: <Loader2Icon className={cn("animate-spin", sizeClasses[size], className)} {...props} />,

    // Spokes Spinner (Dashed Circle)
    spokes: <LoaderIcon className={cn("animate-spin", sizeClasses[size], className)} {...props} />,

    // Refresh Spinner (Rotating Arrows)
    pulse: <RefreshCwIcon className={cn("animate-spin", sizeClasses[size], className)} {...props} />,

    // Bouncing Dots Spinner
    dots: (
      <div className="flex gap-1 items-center justify-center">
        <div className="size-1 bg-current rounded-full animate-bounce [animation-delay:-0.5s]"></div>
        <div className="size-1 bg-current rounded-full animate-bounce [animation-delay:-0.18s]"></div>
        <div className="size-1 bg-current rounded-full animate-bounce"></div>
      </div>
    ),

    // Pulsing Bars
    "bars-pulse": (
      <div className={cn("flex items-center gap-1", sizeClasses[size])}>
        <div className="w-3/5 bg-current animate-pulse h-5 [animation-delay:-0.4s]"></div>
        <div className="w-3/5 bg-current animate-pulse h-5 [animation-delay:-0.3s]"></div>
        <div className="w-3/5 bg-current animate-pulse h-5 [animation-delay:-0.2s]"></div>
        <div className="w-3/5 bg-current animate-pulse h-5 [animation-delay:-0.1s]"></div>
        <div className="w-3/5 bg-current animate-pulse h-5"></div>
      </div>
    ),

    // Scaling Bars
    "bars-scale": (
      <div className={cn("flex items-center gap-1", sizeClasses[size])}>
        {[0.4, 0.3, 0.2, 0.1, 0].map((delay, i) => (
          <div 
            key={i}
            className="w-1/5 bg-current h-full rounded-full"
            style={{
                animation: `spinner-scale 1s ease-in-out infinite`,
                animationDelay: `-${delay}s`
            }}
          />
        ))}
        <style>{`
            @keyframes spinner-scale {
                0%, 100% { transform: scaleY(0.4); }
                50% { transform: scaleY(1); }
            }
        `}</style>
      </div>
    )
  };

  return (
    <div role="status" aria-label="Loading" className="inline-flex items-center justify-center">
       {icons[type]}
    </div>
  )
}

// --- SETTINGS: Spinner Card (Container Styles) ---
// This handles the background box, the label text, and theme colors
interface SpinnerCardProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'gray' | 'red';
  type?: SpinnerProps['type'];
  label?: string;
}

const SpinnerCard = ({ size = 'md', variant = 'gray', type = 'ring', label }: SpinnerCardProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-md p-6 min-w-[140px] border transition-colors",
      variant === 'red' 
        ? "bg-primary/60 border-primary text-secondary-foreground-2" // Dark Mode
        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-primary dark:text-primary" // Light Mode
    )}>
      <Spinner type={type} size={size} className="mb-4" />
      <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">
        {label || "Loading"}
      </span>
    </div>
  )
}

// Status Badge (Inline Styles)
const StatusBadge = ({ label, variant = 'yellow' }: { label: string, variant?: 'red' | 'yellow' | 'orange' }) => {
  const variants = {
    red: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    orange: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  }
  return (
    <div className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold", variants[variant])}>
      <Spinner type="ring" size="sm" className="mr-1.5" />
      {label}
    </div>
  )
}

export { Spinner, SpinnerCard, StatusBadge }