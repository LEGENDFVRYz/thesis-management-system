import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Info, CheckCircle2, TriangleAlert, XCircle, X } from "lucide-react"

const toastVariants = cva(
  "relative flex w-full rounded-lg border",
  {
    variants: {
      variant: {
        info: "bg-blue-50 text-blue-900", 
        success: "bg-[#EFF6FF] text-green-900", 
        warning: "bg-primary-foreground-2 text-primary", 
        error: "bg-primary text-primary-foreground-2", 
        default: "bg-background text-foreground", 
        destructive: "bg-background text-primary",
      },
      size: {
        small: "px-3 py-1 gap-2 text-sm max-w-xs",     
        medium: "px-4 py-2 gap-3 text-base max-w-sm",  
        large: "px-6 py-4 gap-4 text-lg max-w-",     
      },
    },
    defaultVariants: {
      variant: "default",
      size: "medium",
    },
  }
)

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: XCircle,
  default: Info,
  destructive: XCircle,
}

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  size?: "small" | "medium" | "large"
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    const [open, setOpen] = React.useState(true)
    const Icon = icons[variant || "default"]

    if (!open) return null

    const iconSizes = { small: 12, medium: 16, large: 20 }
    const closeSizes = { small: 12, medium: 16, large: 20 }
    const iconSize = iconSizes[size || "medium"]
    const closeSize = closeSizes[size || "medium"]

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(toastVariants({ variant, size }), className)}
        {...props}
      >
        <Icon className={`h-[${iconSize}px] w-[${iconSize}px] mt-0.5`} />

        <div className="flex-1">{children}</div>

        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 opacity-70 hover:opacity-100"
        >
          <X className={`h-[${closeSize}px] w-[${closeSize}px]`} />
        </button>
      </div>
    )
  }
)
Toast.displayName = "Toast"

const ToastTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn("mb-1 font-semibold leading-none", className)} {...props} />
))
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
))
ToastDescription.displayName = "ToastDescription"

export { Toast, ToastTitle, ToastDescription }

