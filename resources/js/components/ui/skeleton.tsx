import { cn } from "@/lib/utils"

interface SkeletonProps extends React.ComponentProps<"div"> {
  variant?: "default" | "progress" | "eval" | "contents" | "indeterminate" | "centered-pct" | "embedded"
  progress?: number 
  statusText?: string
}

function Skeleton({ className, variant = "default", progress = 0, statusText, ...props }: SkeletonProps) {
  // 1. Default Loading (Self-contained Shimmer Animation)
  if (variant === "default") {
    return (
      <>
        <div
          data-slot="skeleton"
          className={cn(
            "relative h-2 w-full overflow-hidden rounded-md bg-muted-foreground/25 dark:bg-foreground", 
            className
          )}
          {...props}
        >
          {/* The Shimmer Element */}
          <div 
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/50 dark:via-secondary/50 to-transparent"
            style={{
              animation: 'shimmer-slide 2s infinite linear'
            }}
          />
        </div>

        {/* This <style> block injects the keyframes directly into the page */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes shimmer-slide {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}} />
      </>
    )
  }

  // 2. Upload / Loading Contents
  if (variant === "progress") {
    return (
      <div className={cn("w-full bg-muted-foreground/25 rounded-full h-2 overflow-hidden", className)}>
        <div 
          className="bg-primary h-full transition-all duration-300 ease-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    )
  }

  // 3. Eval Progress (Green, divisible by 6)
  if (variant === "eval") {
    return (
      <div className={cn("flex flex-col space-y-1 w-full", className)}>
         <div className="flex justify-between text-[10px] font-mono text-gray-400">
            <span>Progress</span>
            <span>{progress}/6</span>
         </div>
         <div className="w-full bg-muted-foreground/25 h-1.5 rounded-sm border border-white/5">
            <div 
              className="bg-chart-2 h-full rounded-sm transition-all duration-500" 
              style={{ width: `${(progress / 6) * 100}%` }} 
            />
         </div>
      </div>
    )
  }

  // 4. Loading Contents With Percentage Status
  if (variant === "contents") {
    return (
      <div className="space-y-2 w-full">
        <div className="flex justify-between text-[10px] text-primary uppercase tracking-wider">
          <span>{statusText || 'Loading...'}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-muted-foreground/25 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    )
  }

  // 5. Added: Infinite/Indeterminate
  // Use this for processes where you don't know the exact time (e.g. "Connecting...")
  if (variant === "indeterminate") {
    return (
      <div className={cn("w-full bg-muted-foreground/25 rounded-full h-1.5 overflow-hidden relative", className)}>
        <div 
          className="bg-primary h-full w-1/3 absolute rounded-full" 
          style={{
            animation: 'indeterminate-slide 1.5s infinite ease-in-out'
          }}
        />
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes indeterminate-slide {
            0% { left: -33%; }
            100% { left: 100%; }
          }
        `}} />
      </div>
    )
  }

  // 6. Added: Loading with just percentage in the middle
  if (variant === "centered-pct") {
    return (
      <div className={cn("relative w-full flex flex-col items-center justify-center space-y-2", className)}>
        <span className="text-xs font-bold text-primary animate-pulse">{Math.round(progress)}%</span>
        <div className="w-1/2 bg-muted-foreground/25 h-1 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    )
  }

  // 7. Added: Loading with percentage and status text inside the skeleton
  if (variant === "embedded") {
    return (
      <div className={cn("relative w-full h-8 bg-muted-foreground/10 rounded-lg overflow-hidden border border-white/5", className)}>
        {/* Progress Fill */}
        <div 
          className="absolute inset-y-0 left-0 bg-primary/20 transition-all duration-500 ease-out border-r border-primary/50" 
          style={{ width: `${progress}%` }} 
        />
        {/* Label Layer */}
        <div className="absolute inset-0 flex items-center justify-between px-3 text-[10px] font-medium tracking-tight uppercase">
          <span className="text-foreground/70">{statusText}</span>
          <span className="text-primary font-bold">{Math.round(progress)}%</span>
        </div>
      </div>
    )
  }
  return null
}

export { Skeleton }