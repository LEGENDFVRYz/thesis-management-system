import { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  className?: string;
}

export default function TimePicker({
  value,
  onChange,
  placeholder = "Select Time",
  className = "",
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync internal state if prop changes
  useEffect(() => {
    if (value) setSelectedDate(value);
  }, [value]);

  const handleTimeChange = (type: "hour" | "minute" | "ampm", val: string) => {
    const newDate = selectedDate ? new Date(selectedDate) : new Date();
    // Default to current date/time if null
    if (!selectedDate) {
        const now = new Date();
        newDate.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
        newDate.setHours(12, 0, 0, 0); // Default to 12:00 PM
    }

    let currentHours = newDate.getHours();
    let currentMinutes = newDate.getMinutes();

    if (type === "hour") {
      const hour = parseInt(val, 10);
      const isPM = currentHours >= 12;
      if (isPM && hour !== 12) currentHours = hour + 12;
      else if (!isPM && hour === 12) currentHours = 0;
      else if (isPM && hour === 12) currentHours = 12;
      else currentHours = hour;
    } else if (type === "minute") {
      currentMinutes = parseInt(val, 10);
    } else if (type === "ampm") {
      if (val === "PM" && currentHours < 12) currentHours += 12;
      else if (val === "AM" && currentHours >= 12) currentHours -= 12;
    }

    newDate.setHours(currentHours);
    newDate.setMinutes(currentMinutes);
    
    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getSelection = () => {
    if (!selectedDate) return { hour: 12, minute: 0, ampm: "AM" };
    let hour = selectedDate.getHours();
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12; 
    return { hour, minute: selectedDate.getMinutes(), ampm };
  };

  const selection = getSelection();

  // CSS classes to hide scrollbar cross-browser
  const noScrollbarClass = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", fontFamily: '"DM Sans", sans-serif' }}
    >
      {/* Input Field */}
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={formatTime(selectedDate)}
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
            height: "100%", 
            minHeight: "38px"
          }}
        />
        <Clock
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

      {/* Time Selector Dropdown */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            zIndex: 50,
            marginTop: "0.5rem",
            left: 0,
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            padding: "0.5rem",
            display: "flex",
            gap: "0.5rem",
            height: "200px",
          }}
        >
          {/* Hours Column */}
          <div className={`flex flex-col overflow-y-auto w-16 border-r border-gray-100 ${noScrollbarClass}`}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
              <button
                key={h}
                onClick={() => handleTimeChange("hour", h.toString())}
                className={`p-2 text-sm text-center hover:bg-gray-100 rounded shrink-0 ${
                  selection.hour === h ? "bg-[#800000] text-white hover:bg-[#800000]" : "text-gray-700"
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          {/* Minutes Column */}
          <div className={`flex flex-col overflow-y-auto w-16 border-r border-gray-100 ${noScrollbarClass}`}>
            {Array.from({ length: 60 }, (_, i) => i).map((m) => (
              <button
                key={m}
                onClick={() => handleTimeChange("minute", m.toString())}
                className={`p-2 text-sm text-center hover:bg-gray-100 rounded shrink-0 ${
                  selection.minute === m ? "bg-[#800000] text-white hover:bg-[#800000]" : "text-gray-700"
                }`}
              >
                {m.toString().padStart(2, "0")}
              </button>
            ))}
          </div>

          {/* AM/PM Column */}
          <div className="flex flex-col w-16">
            {["AM", "PM"].map((period) => (
              <button
                key={period}
                onClick={() => handleTimeChange("ampm", period)}
                className={`p-2 text-sm text-center hover:bg-gray-100 rounded flex-1 flex items-center justify-center ${
                  selection.ampm === period ? "bg-[#800000] text-white hover:bg-[#800000]" : "text-gray-700"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}