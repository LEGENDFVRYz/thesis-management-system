import * as React from "react"
import { RadioGroupItem } from "./radio-group"
import { cn } from "@/lib/utils"

interface RadioGroupItemWithLabelProps extends React.ComponentProps<typeof RadioGroupItem> {
  label: string
  id: string
}

function RadioGroupItemWithLabel({
  label,
  id,
  className,
  value,
  ...props
}: RadioGroupItemWithLabelProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isChecked, setIsChecked] = React.useState(false)
  const itemRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    const checkState = () => {
      if (itemRef.current) {
        setIsChecked(itemRef.current.getAttribute('data-state') === 'checked')
      }
    }

    checkState()

    // Use MutationObserver to watch for state changes
    if (itemRef.current) {
      const observer = new MutationObserver(checkState)
      observer.observe(itemRef.current, { attributes: true, attributeFilter: ['data-state'] })
      return () => observer.disconnect()
    }
  }, [])

  return (
    <div
      className="flex w-fit items-center gap-[17px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <RadioGroupItem
        ref={itemRef}
        id={id}
        className={className}
        value={value}
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          "cursor-pointer transition-all font-['DM_Sans'] text-[18px] leading-normal select-none",
          // Default state: #444444 with font-weight 500
          !isChecked && !isHovered && "text-[#444444] font-medium",
          // Hover state (only when not checked): #444444 with 70% opacity
          !isChecked && isHovered && "text-[#444444B3] font-medium",
          // Selected state (overrides hover): #000000 with font-weight 600
          isChecked && "text-[#000000] font-semibold"
        )}
      >
        {label}
      </label>
    </div>
  )
}

export { RadioGroupItemWithLabel }
