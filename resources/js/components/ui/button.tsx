import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:opacity-90 active:opacity-80",
        primary: "bg-primary text-primary-foreground shadow hover:bg-destructive border border-primary text-background active:bg-primary-foreground-2 border border-primary text-background",
        secondary: "bg-breadcrumb text-primary shadow-sm hover:bg-background border border-primary/15 text-primary active:bg-primary-foreground-2 border border-primary-15 text-primary",
        tertiary: "border border-primary/15 text-primary hover:bg-breadcrumb border border-primarytext-primary active:bg-primary-foreground-2 border border-primary text-primary",
        negative: "bg-sidebar-gradient-mid text-white hover:bg-destructive active:bg-primary",
        negativelight: "bg-white border border-primary/15 text-destructive hover:bg-breadcrumb active:bg-primary/35",
        ghost: "text-foreground hover:bg-secondary-foreground-2 active:bg-background active:border border-secondary-foreground-2 active:text-secondary-foreground-2",
        link: "text-primary underline-offset-4 hover:underline underline-destructive hover:text-destructive active:text-secondary-foreground-2",
        outline: "rounded-lg border-[0.8px] border-primary/15 text-[#1A1A1A] font-['DM_Sans'] text-[13.33px] font-medium leading-normal px-4 py-2 hover:bg-breadcrumb active:bg-primary/10",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({ className, variant, size, asChild = false, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}

export { Button, buttonVariants }