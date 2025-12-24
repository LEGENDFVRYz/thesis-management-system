import { cn } from "@/lib/utils"

interface SkeletonProps extends React.ComponentProps<"div"> {
  variant?: "default" | "progress" | "eval" | "contents"
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
            "relative h-2 w-full overflow-hidden rounded-md bg-gray-200 dark:bg-gray-800", 
            className
          )}
          {...props}
        >
          {/* The Shimmer Element */}
          <div 
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent"
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
      <div className={cn("w-full bg-gray-700 rounded-full h-2 overflow-hidden", className)}>
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
         <div className="w-full bg-gray-800 h-1.5 rounded-sm border border-white/5">
            <div 
              className="bg-chart-2 h-full rounded-sm transition-all duration-500" 
              style={{ width: `${(progress / 6) * 100}%` }} 
            />
         </div>
      </div>
    )
  }

  // 4. Loading Contents (With Percentage Status)
  if (variant === "contents") {
    return (
      <div className="space-y-2 w-full">
        <div className="flex justify-between text-[10px] text-primary uppercase tracking-wider">
          <span>{statusText || 'Loading...'}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    )
  }

  return null
}

export { Skeleton }