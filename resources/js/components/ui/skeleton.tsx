import { cn } from "@/lib/utils"

interface SkeletonProps extends React.ComponentProps<"div"> {
  variant?: "default" | "scanning" | "progress" | "eval" | "contents" | "indeterminate" | "centered-pct" | "embedded"
  progress?: number 
  statusText?: string
}

function Skeleton({ className, variant = "default", progress = 0, statusText, ...props }: SkeletonProps) {
  const baseBar = "relative w-full overflow-hidden rounded-lg bg-muted/20 border border-border/5"

  const animations = (
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes fill-progress-solid { 0% { transform: scaleX(0); transform-origin: left; } 100% { transform: scaleX(1); transform-origin: left; } }
      @keyframes shimmer-scanning { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      @keyframes indeterminate-slide { 0% { left: -33%; } 100% { left: 100%; } }
    `}} />
  )

  // 1. Default Loading
  if (variant === "default") {
    return (
      <div className={cn(baseBar, "h-2", className)} {...props}>
        {animations}
        <div className="absolute inset-0 bg-primary" style={{ animation: 'fill-progress-solid 2s infinite linear' }} />
      </div>
    )
  }

  // 2. Scanning Loading
  if (variant === "scanning") {
    return (
      <div className={cn(baseBar, "h-2", className)} {...props}>
        {animations}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-[shimmer-scanning_2.5s_infinite_linear]" />
      </div>
    )
  }

  // 3. Upload Loading
  if (variant === "progress") {
    return (
      <div className={cn(baseBar, "h-2", className)} {...props}>
        <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
    )
  }

  // 4. Eval Progress (With Maroon/Green Steps)
  if (variant === "eval") {
    return (
      <div className={cn("flex flex-col space-y-1 w-full", className)}>
         <div className="flex justify-between text-xs text-muted-foreground uppercase">
            <span>Progress</span>
            <span>{Math.floor(progress)}/6</span>
         </div>
         <div className="w-full bg-muted/30 h-1.5 rounded-sm overflow-hidden">
            <div className="bg-chart-2 h-full transition-all duration-500" style={{ width: `${(progress / 6) * 100}%` }} />
         </div>
      </div>
    )
  }

  // 5. Loading with Contents and Progress
  if (variant === "contents") {
    return (
      <div className={cn("space-y-2 w-full", className)}>
        <div className="flex justify-between text-xs text-primary uppercase font-bold">
          <span>{statusText || 'Loading...'}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className={cn(baseBar, "h-1.5")}>
          <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
    )
  }

  // 6. Minimal Intermediate
  if (variant === "indeterminate") {
    return (
      <div className={cn(baseBar, "h-1.5", className)} {...props}>
        {animations}
        <div className="bg-primary h-full w-1/3 absolute rounded-full animate-[indeterminate-slide_1.5s_infinite_ease-in-out]" />
      </div>
    )
  }

  // 7. Centered Percentage
  if (variant === "centered-pct") {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
        <span className="text-xs font-bold text-primary">{Math.round(progress)}%</span>
        <div className={cn(baseBar, "h-1 w-90")}>
          <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
    )
  }

  // 8. Embedded Status
  if (variant === "embedded") {
    return (
      <div className={cn("relative w-full h-9 bg-muted/10 rounded-lg border border-border overflow-hidden", className)}>
        <div className="absolute inset-y-0 left-0 bg-primary/10 transition-all duration-500 border-r border-primary/30" style={{ width: `${progress}%` }} />
        <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-bold uppercase">
          <span className="text-foreground/60">{statusText}</span>
          <span className="text-primary">{Math.round(progress)}%</span>
        </div>
      </div>
    )
  }

  return null
}

export { Skeleton }