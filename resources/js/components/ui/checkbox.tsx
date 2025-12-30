import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Default state: 19px box with black border, rounded corners
        "flex flex-col justify-center items-center gap-[10px] shrink-0 transition-all outline-none p-[2px]",
        "w-[19px] h-[19px]",
        "rounded-[5px] border-2 border-black",
        // Hover state: border changes to rgba(68, 68, 68, 0.80)
        "hover:border-[#444444CC]",
        // Checked state: background primary, no border
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center w-full h-full"
      >
        {/* Custom check icon - 12px × 9px with primary-foreground-2 stroke */}
        <svg
          width="12"
          height="9"
          viewBox="0 0 12 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="[&_path]:stroke-primary-foreground-2"
        >
          <path
            d="M1 4.5L4.5 8L11 1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
