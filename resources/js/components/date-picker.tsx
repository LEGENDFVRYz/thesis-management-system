import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  className?: string;
  displayFormat?: "short" | "full"; // "Dec. 2024" vs "12-03-25"
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "Edit Date",
  className = "",
  displayFormat = "short",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    onChange?.(date);
    setIsOpen(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    if (displayFormat === "full") {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${month}-${day}-${year}`;
  };

  const formatShortMonth = (date: Date | null) => {
    if (!date) return "";
    const monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", fontFamily: '"DM Sans", sans-serif' }}
    >
      {/* Input */}
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={displayFormat === "short" ? formatShortMonth(selectedDate) : formatDate(selectedDate)}
          placeholder={placeholder}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          onFocus={(e) => {
            e.currentTarget.style.outline = "none";
            e.currentTarget.style.boxShadow = "0 0 0 2px #73000066";
            e.currentTarget.style.borderColor = "transparent";
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = "#d4c5a0";
          }}
          style={{
            width: "100%",
            padding: "0.5rem 0.75rem",
            paddingRight: "2.5rem",
            backgroundColor: "#f3efd0",
            border: "1px solid #d4c5a0",
            borderRadius: "0.25rem",
            cursor: "pointer",
            outline: "none",
            fontSize: "13.33px",
            color: "#333333",
            fontWeight: 600,
          }}
        />
        <CalendarIcon
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            width: "1rem",
            height: "1rem",
            color: "#730000",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div style={{ position: "absolute", zIndex: 50, marginTop: "0.5rem", left: 0 }}>
          <Calendar value={selectedDate || undefined} onChange={handleDateChange} />
        </div>
      )}
    </div>
  );
}