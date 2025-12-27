import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";

export type WeeklyEventType = {
  id: string;
  title: string;
  date: Date;
  time: string;
  section: string;
};

interface DefenseCalendarWeeklyProps {
  events?: WeeklyEventType[];
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
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

export function DefenseCalendarWeekly({
  events = [],
  value,
  onChange,
  className = "",
}: DefenseCalendarWeeklyProps) {
  const [currentDate, setCurrentDate] = useState(value || new Date());

  // Get the start of the week (Sunday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
  };

  // Get all 7 days of the week
  const getWeekDays = () => {
    const weekStart = getWeekStart(currentDate);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      return day;
    });
  };

  // Navigate weeks
  const navigateWeek = (weeks: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + weeks * 7);
    setCurrentDate(newDate);
    onChange?.(newDate);
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Get week indicator text
  const getWeekIndicator = () => {
    const today = new Date();
    const todayWeek = getWeekStart(today).getTime();
    const currentWeek = getWeekStart(currentDate).getTime();
    const weeksDiff = Math.round((currentWeek - todayWeek) / (7 * 24 * 60 * 60 * 1000));

    if (weeksDiff === 0) return "This Week";
    if (weeksDiff === -1) return "Last Week";
    if (weeksDiff === 1) return "Next Week";
    return weeksDiff < 0
      ? `${Math.abs(weeksDiff)} Weeks Ago`
      : `In ${weeksDiff} Weeks`;
  };

  const weekDays = getWeekDays();
  const today = new Date().toDateString();

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
            fontWeight: 600,
            fontSize: "18px",
            color: "#730000",
          }}
        >
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              backgroundColor: "#F3EFD0",
              color: "#730000",
              fontWeight: 600,
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "12px",
            }}
          >
            {getWeekIndicator()}
          </span>

          <button
            onClick={() => navigateWeek(-1)}
            aria-label="Previous week"
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
            onClick={() => navigateWeek(1)}
            aria-label="Next week"
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

      {/* Week Grid */}
      <div style={{ overflowX: "auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            minWidth: "600px",
          }}
        >
          {weekDays.map((date, idx) => {
            const dayEvents = getEventsForDate(date);
            const isToday = date.toDateString() === today;

            return (
              <div
                key={idx}
                style={{
                  borderRight: idx === 6 ? "none" : "1px solid #e5e7eb",
                  backgroundColor: isToday ? "#f9fafb" : "#ffffff",
                }}
              >
                {/* Day Header */}
                <div
                  style={{
                    padding: "8px 12px",
                    borderBottom: "1px solid #e5e7eb",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 500,
                      fontSize: "13px",
                      color: "#4b5563",
                    }}
                  >
                    {DAYS[date.getDay()]}
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: isToday ? "#111827" : "#374151",
                    }}
                  >
                    {date.getDate()}
                  </div>
                </div>

                {/* Events */}
                <div
                  style={{
                    padding: "8px",
                    minHeight: "200px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
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
                              borderRadius: "6px",
                              padding: "8px",
                              backgroundColor: sectionColors[event.section] || "#f0f0f0",
                              cursor: "help",
                              maxWidth: "100%",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: "13px",
                                marginBottom: "4px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {event.title}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "11px",
                                color: "#4b5563",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              <Clock size={12} />
                              {event.time}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <div
                            style={{
                              color: "#ffffff",
                              padding: "8px 10px",
                              borderRadius: 6,
                              boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                              maxWidth: 260,
                              fontSize: 12,
                            }}
                          >
                            <div style={{ fontWeight: 600, marginBottom: 4 }}>{event.title}</div>
                            <div style={{ opacity: 0.9 }}>
                              {dateText}{event.time ? ` • ${event.time}` : ""}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {["3", "4"].map((year) => (
          <div
            key={year}
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
            }}
          >
            <span style={{ fontWeight: 600, color: "#111827" }}>
              {year}{year === "3" ? "rd" : "th"} Year:
            </span>

            {Object.entries(sectionColors)
              .filter(([key]) => key.startsWith(year))
              .map(([section, color]) => (
                <div
                  key={section}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
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
                  <span style={{ fontSize: "11px", color: "#374151" }}>
                    BSCPE {section}
                  </span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}