import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[10px] font-['DM_Sans:Medium',sans-serif] font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-transparent text-primary data-[state=on]:bg-primary data-[state=on]:text-white hover:bg-white hover:border hover:border-primary data-[state=on]:hover:bg-primary data-[state=on]:hover:border-0",
        outline:
          "border border-input bg-transparent shadow-xs text-primary data-[state=on]:bg-primary data-[state=on]:text-white hover:bg-white hover:border-primary data-[state=on]:hover:bg-primary",
      },
      size: {
        default: "h-[31px] px-4 text-[12px]",
        sm: "h-[26px] px-3 text-[11px]",
        lg: "h-[36px] px-5 text-[13px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
