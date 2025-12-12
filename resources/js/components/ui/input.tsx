import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "bg-[#f3efd0] w-full sm:w-[384px] h-[36px] px-[12px] py-[4px] rounded-[8px] border-[0.8px] border-transparent",
        "font-['DM_Sans:Medium',sans-serif] font-medium text-[#1a1a1a] text-[13.33px]",
        "outline-none transition-all shadow-xs",
        "placeholder:text-[#1a1a1a] placeholder:font-['DM_Sans:Medium',sans-serif] placeholder:font-medium",
        "hover:border-[#ffbd00] hover:placeholder:text-[#ffbd00]",
        "focus-visible:border-[#730000] focus-visible:placeholder:text-transparent",
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        "aria-invalid:border-[#730000] aria-invalid:ring-[#730000]/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }