import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}

export function Calendar({
  value,
  onChange,
  className = "",
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);

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

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getPreviousMonthDays = (date: Date) => {
    const firstDay = getFirstDayOfMonth(date);
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    const prevMonth = new Date(date.getFullYear(), date.getMonth(), 0);
    const prevMonthDays = prevMonth.getDate();
    return Array.from(
      { length: adjustedFirstDay },
      (_, i) => prevMonthDays - adjustedFirstDay + i + 1,
    );
  };

  const getNextMonthDays = (date: Date) => {
    const daysInMonth = getDaysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    const totalDays = adjustedFirstDay + daysInMonth;
    const remainingDays = totalDays % 7 === 0 ? 0 : 7 - (totalDays % 7);
    return Array.from({ length: remainingDays }, (_, i) => i + 1);
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const handleDateClick = (day: number, isCurrentMonth: boolean = true) => {
    if (!isCurrentMonth) return;
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const prevMonthDays = getPreviousMonthDays(currentDate);
  const nextMonthDays = getNextMonthDays(currentDate);

  const isToday = (day: number) => {
    const today = new Date();
    return (
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear() &&
      day === today.getDate()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear() &&
      day === selectedDate.getDate()
    );
  };

  return (
    <div
      className={className}
      style={{
        display: "inline-block",
        backgroundColor: "#f3efd0",
        borderRadius: "0.5rem",
        border: "1px solid #d4c5a0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.25)",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#730000",
          color: "#ffbd00",
          padding: "0.625rem 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={handlePrevMonth}
          aria-label="Previous month"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.8")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
        >
          <ChevronLeft size={16} />
        </button>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: "13.33px",
          }}
        >
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <button
          onClick={handleNextMonth}
          aria-label="Next month"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.8")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div style={{ padding: "1rem", backgroundColor: "#f3efd0" }}>
        {/* Day Headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gap: "0.25rem",
            marginBottom: "0.5rem",
          }}
        >
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div
              key={day}
              style={{
                textAlign: "center",
                color: "#666666",
                padding: "0.25rem 0",
                fontSize: "11px",
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gap: "0.25rem",
          }}
        >
          {/* Previous month days */}
          {prevMonthDays.map((day, idx) => (
            <div
              key={`prev-${idx}`}
              style={{
                aspectRatio: "1 / 1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#cccccc",
                cursor: "default",
                fontSize: "13.33px",
              }}
            >
              {day}
            </div>
          ))}

          {/* Current month days */}
          {days.map((day) => {
            const selected = isSelected(day);
            const today = isToday(day);
            const baseStyle: React.CSSProperties = {
              aspectRatio: "1 / 1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "9999px",
              transition: "background-color 0.2s, color 0.2s",
              border: "none",
              fontSize: "13.33px",
              cursor: "pointer",
              backgroundColor: selected
                ? "rgba(115, 0, 0, 0.1)"
                : today
                  ? "rgba(128, 128, 128, 0.2)"
                  : "transparent",
              color: selected ? "#730000" : today ? "#444444" : "#444444",
              fontWeight: selected ? 600 : 400,
            };
            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                style={baseStyle}
                onMouseEnter={(e) => {
                  if (!selected && !today) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#e8e4c5";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selected && !today) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  }
                }}
              >
                {day}
              </button>
            );
          })}

          {/* Next month days */}
          {nextMonthDays.map((day, idx) => (
            <div
              key={`next-${idx}`}
              style={{
                aspectRatio: "1 / 1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#cccccc",
                cursor: "default",
                fontSize: "13.33px",
              }}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}