import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";

export type EventType = {
  id: string;
  title: string;
  date: Date;
  time?: string;
  section: string;
};

interface DefenseCalendarProps {
  events?: EventType[];
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
  showLegend?: boolean;
}

const sectionColors: Record<string, string> = {
  "3-1": "#DBEAFE",
  "3-2": "#E5FEDB",
  "3-3": "#F8DBFE",
  "3-4": "#8DBEFF80",
  "3-5": "#FFE1B2",
  "3-6": "#A7ABFF",
  "4-1": "#8DBEFF80",
  "4-2": "#ADFFFF80",
  "4-3": "#ED9CFF80",
  "4-4": "#FDFF8180",
  "4-5": "#FFCC7A80",
  "4-6": "#757CFF80",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];



export function DefenseCalendar({
  events = [],
  value,
  onChange,
  className = "",
  showLegend = true,
}: DefenseCalendarProps) {
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);

  // Get calendar data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Navigation
  const navigateMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);
    onChange?.(newDate);
  };

  // Date checks
  const isToday = (day: number) => {
    const today = new Date();
    return (
      month === today.getMonth() &&
      year === today.getFullYear() &&
      day === today.getDate()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear() &&
      day === selectedDate.getDate()
    );
  };

  const getMonthIndicator = () => {
    const today = new Date();
    const monthDiff = (year - today.getFullYear()) * 12 + month - today.getMonth();

    if (monthDiff === 0) return "This Month";
    if (monthDiff === -1) return "Last Month";
    if (monthDiff === 1) return "Next Month";
    return monthDiff < 0
      ? `${Math.abs(monthDiff)} Months Ago`
      : `In ${monthDiff} Months`;
  };

  const getEventsForDate = (day: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
  };

  // Build calendar grid
  const emptyDaysBefore = Array(firstDayOfMonth).fill(null);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalCells = firstDayOfMonth + daysInMonth;
  const emptyDaysAfter = totalCells % 7 === 0 ? [] : Array(7 - (totalCells % 7)).fill(null);

  return (
    <div
      className={className}
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        fontFamily: "'DM Sans', sans-serif",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          padding: "12px 16px",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#730000",
            fontWeight: 600,
            fontSize: "18px",
          }}
        >
          {MONTHS[month]} {year}
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              backgroundColor: "#F3EFD0",
              color: "#730000",
              borderRadius: "6px",
              padding: "4px 8px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {getMonthIndicator()}
          </span>

          <button
            onClick={() => navigateMonth(-1)}
            aria-label="Previous month"
            style={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              border: "1px solid rgba(115,0,0,0.15)",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={18} color="#4b5563" />
          </button>

          <button
            onClick={() => navigateMonth(1)}
            aria-label="Next month"
            style={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              border: "1px solid rgba(115,0,0,0.15)",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={18} color="#4b5563" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{ padding: "16px" }}>
        {/* Day Names */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          {DAYS.map((day) => (
            <div
              key={day}
              style={{
                textAlign: "center",
                color: "#6b7280",
                fontWeight: 600,
                fontSize: "14px",
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
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "8px",
            minWidth: 0,
          }}
        >
          {/* Empty cells before month starts */}
          {emptyDaysBefore.map((_, i) => (
            <div key={`empty-before-${i}`} style={{ minHeight: 72 }} />
          ))}

          {/* Month days */}
          {monthDays.map((day) => {
            const dayEvents = getEventsForDate(day);
            const selected = isSelected(day);
            const today = isToday(day);

          return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                style={{
                  width: "100%",
                  minWidth: 0,
                  boxSizing: "border-box",
                  overflow: "hidden",
                  minHeight: 72,
                  padding: 8,
                  textAlign: "left",
                  borderRadius: "6px",
                  border: selected
                    ? "2px solid #730000"
                    : today
                    ? "1px solid #d1d5db"
                    : "1px solid #f3f4f6",
                  backgroundColor: selected ? "#f9f5ef" : today ? "#f3f4f6" : "#ffffff",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontWeight: 600, color: "#111827", marginBottom: 4, fontSize: "14px" }}>
                  {day}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                  {dayEvents.map((event) => {
                    const dateText = new Date(event.date).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });

                    return (
                      <Tooltip key={event.id}>
                        <TooltipTrigger asChild>
                          <div
                            style={{
                              fontSize: 11,
                              padding: "2px 4px",
                              borderRadius: "4px",
                              backgroundColor: sectionColors[event.section] || "#f0f0f0",
                              color: "#111827",
                              fontWeight: 500,
                              display: "block",
                              maxWidth: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              cursor: "help",
                            }}
                          >
                            {event.title}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-primary text-primary-foreground">
                          <div style={{ display: "grid", gap: 4 }}>
                            <strong style={{ fontSize: 12 }}>{event.title}</strong>
                            <span style={{ fontSize: 11 }}>{dateText}{event.time ? ` • ${event.time}` : ""}</span>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </button>
            );
          })}

          {/* Empty cells after month ends */}
          {emptyDaysAfter.map((_, i) => (
            <div key={`empty-after-${i}`} style={{ minHeight: 72 }} />
          ))}
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {["3", "4"].map((yearLevel) => (
            <div
              key={yearLevel}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
              }}
            >
              <span style={{ fontWeight: 600, color: "#111827" }}>
                {yearLevel}{yearLevel === "3" ? "rd" : "th"} Year:
              </span>

              {Object.entries(sectionColors)
                .filter(([key]) => key.startsWith(yearLevel))
                .map(([section, color]) => (
                  <div
                    key={section}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "4px",
                        backgroundColor: color,
                      }}
                    />
                    <span style={{ fontSize: 11, color: "#374151" }}>
                      BSCPE {section}
                    </span>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}