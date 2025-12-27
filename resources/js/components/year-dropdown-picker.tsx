import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

interface YearDropdownPickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  className?: string;
}

export function YearDropdownPicker({
  value,
  onChange,
  placeholder = "Year",
  className = "",
}: YearDropdownPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<Date | null>(value || null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleYearChange = (year: number) => {
    const date = new Date(year, 0, 1);
    setSelectedYear(date);
    onChange?.(date);
    setIsOpen(false);
  };

  const formatYear = (date: Date | null) => (date ? date.getFullYear().toString() : "");

  const MIN_YEAR = 1900;
  const MAX_YEAR = 2025;

  const years = (() => {
    const ys: number[] = [];
    for (let y = MAX_YEAR; y >= MIN_YEAR; y--) ys.push(y);
    return ys;
  })();

  const selectedYearValue = selectedYear ? selectedYear.getFullYear() : currentYear;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        fontFamily: '"DM Sans", sans-serif',
        display: "inline-block",
      }}
    >
      {/* Input */}
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={formatYear(selectedYear)}
          placeholder={placeholder}
          readOnly
          onClick={() => setIsOpen((o) => !o)}
          style={{
            width: "100%",
            padding: "8px 12px",
            backgroundColor: "#f3efd0",
            border: "1px solid #d4c5a0",
            borderRadius: "6px",
            cursor: "pointer",
            outline: "none",
            color: "#730000",
            fontWeight: 600,
            fontSize: "13.33px",
          }}
        />
        <CalendarIcon
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            width: 16,
            height: 16,
            color: "#730000",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Year Dropdown */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            zIndex: 50,
            marginTop: 8,
            left: 0,
            width: "100%",
            backgroundColor: "#f3efd0",
            borderRadius: "8px",
            border: "1px solid #d4c5a0",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#730000",
              color: "#ffbd00",
              fontWeight: 600,
              padding: "8px 16px",
              textAlign: "center",
              fontSize: "13.33px",
            }}
          >
            {selectedYearValue}
          </div>

          {/* Year List */}
          <div style={{ maxHeight: 192, overflowY: "auto", backgroundColor: "#f3efd0" }}>
            {years.map((year) => {
              const isSelected = year === selectedYearValue;
              return (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  style={{
                    width: "100%",
                    padding: "8px 16px",
                    textAlign: "center",
                    border: "none",
                    backgroundColor: isSelected ? "#730000" : "transparent",
                    color: isSelected ? "#ffbd00" : "#730000",
                    fontSize: "13.33px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = "#e8e4c5";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}