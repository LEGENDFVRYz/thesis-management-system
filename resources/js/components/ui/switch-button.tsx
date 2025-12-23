import { useState } from "react";

interface SwitchButtonProps {
  option1: string;
  option2: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SwitchButton({
  option1,
  option2,
  value,
  onChange,
  className = "",
}: SwitchButtonProps) {
  const [internalValue, setInternalValue] = useState(option1);
  const currentValue = value || internalValue;

  const handleToggle = (newValue: string) => {
    if (!value) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const isOption1Active = currentValue === option1;

  return (
    <div
      className={`inline-flex rounded-full overflow-hidden ${className}`}
      style={{
        fontFamily: "DM Sans, sans-serif",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <button
        onClick={() => handleToggle(option1)}
        className="px-4 py-1.5 transition-all duration-200 flex-1"
        style={{
          backgroundColor: isOption1Active
            ? "#FFBD00"
            : "#F3EFD0",
          color: isOption1Active ? "#730000" : "#717182",
          fontSize: "12px",
          fontWeight: isOption1Active ? 600 : 500,
          borderTopLeftRadius: "9999px",
          borderBottomLeftRadius: "9999px",
          whiteSpace: "nowrap",
          textAlign: "center",
        }}
      >
        {option1}
      </button>
      <button
        onClick={() => handleToggle(option2)}
        className="px-4 py-1.5 transition-all duration-200 flex-1"
        style={{
          backgroundColor: !isOption1Active
            ? "#FFBD00"
            : "#F3EFD0",
          color: !isOption1Active ? "#730000" : "#717182",
          fontSize: "12px",
          fontWeight: !isOption1Active ? 600 : 500,
          borderTopRightRadius: "9999px",
          borderBottomRightRadius: "9999px",
          whiteSpace: "nowrap",
          textAlign: "center",
        }}
      >
        {option2}
      </button>
    </div>
  );
}