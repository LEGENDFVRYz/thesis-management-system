import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const inputVariants = cva(
  [
    "bg-breadcrumb w-full rounded-[8px] border-[0.8px] border-transparent",
    "font-['DM_Sans:Medium',sans-serif] font-medium text-[#1a1a1a]",
    "outline-none transition-all shadow-xs",
    "placeholder:text-[#1a1a1a] placeholder:font-['DM_Sans:Medium',sans-serif] placeholder:font-medium",
    "hover:border-primary-foreground-2 hover:placeholder:text-primary-foreground-2",
    "focus-visible:border-primary focus-visible:placeholder:text-transparent",
    "focus-visible:ring-0 focus-visible:ring-offset-0",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
    "aria-invalid:border-primary aria-invalid:ring-primary/20",
  ],
  {
    variants: {
      inputSize: {
        default: "sm:w-[384px] h-[36px] px-[12px] py-[4px] text-[13.33px]",
        filter: "h-9 px-3 text-sm",
        full: "w-full h-[36px] px-[12px] py-[4px] text-[13.33px]",
      },
    },
    defaultVariants: {
      inputSize: "default",
    },
  }
)

interface InputProps
  extends Omit<React.ComponentProps<"input">, 'size'>,
    VariantProps<typeof inputVariants> {}

function Input({ className, type, inputSize, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ inputSize }), className)}
      {...props}
    />
  )
}

export { Input }