import * as React from "react"
import { Checkbox } from "./checkbox"
import { cn } from "@/lib/utils"

interface CheckboxWithLabelProps extends React.ComponentProps<typeof Checkbox> {
  label: string
  id: string
}

function CheckboxWithLabel({
  label,
  id,
  className,
  ...props
}: CheckboxWithLabelProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isChecked, setIsChecked] = React.useState(false)
  const checkboxRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    const checkState = () => {
      if (checkboxRef.current) {
        setIsChecked(checkboxRef.current.getAttribute('data-state') === 'checked')
      }
    }

    checkState()

    // Use MutationObserver to watch for state changes
    if (checkboxRef.current) {
      const observer = new MutationObserver(checkState)
      observer.observe(checkboxRef.current, { attributes: true, attributeFilter: ['data-state'] })
      return () => observer.disconnect()
    }
  }, [])

  return (
    <div
      className="inline-flex items-center gap-[15px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Checkbox
        ref={checkboxRef}
        id={id}
        className={className}
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          "cursor-pointer transition-all font-['DM_Sans'] text-[15px] leading-normal select-none",
          // Default state: #000000 with font-weight 500
          !isChecked && !isHovered && "text-black font-medium",
          // Hover state (only when not checked): rgba(68, 68, 68, 0.80)
          !isChecked && isHovered && "text-[#444444CC] font-medium",
          // Checked state: stays black with font-weight 500
          isChecked && "text-black font-medium"
        )}
      >
        {label}
      </label>
    </div>
  )
}

export { CheckboxWithLabel }
