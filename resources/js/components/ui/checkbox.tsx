import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cn } from "@/lib/utils"

interface CheckboxProps
  extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  locked?: boolean
}

function Checkbox({
  className,
  locked = false,
  ...props
}: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      disabled={props.disabled || locked}
      className={cn(
        "flex items-center justify-center shrink-0 transition-all outline-none",
        "w-[19px] h-[19px] p-[2px]",
        "rounded-[5px] border-2 border-black",
        // hover only when NOT disabled/locked
        !locked && "hover:border-[#444444CC]",
        // checked
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
        // disabled / locked
        (props.disabled || locked) && "cursor-not-allowed opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="flex items-center justify-center w-full h-full"
      >
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