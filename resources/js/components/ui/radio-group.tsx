import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        // Default state: circle with #444444E5 border
        "aspect-square rounded-full border-2 shrink-0 transition-all outline-none",
        "w-[21.67px] h-[21.67px]",
        "border-[#444444E5]",
        // Hover state: border changes to #730000
        "hover:border-[#730000]",
        // Selected state: stroke width 2.5px with #730000 (solid, same as hover)
        "data-[state=checked]:border-[2.5px] data-[state=checked]:border-[#730000]",
        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center w-full h-full"
      >
        {/* Inner circle when selected - 8px × 8px */}
        <div className="w-2 h-2 rounded-full bg-[#730000]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
