import { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface YearRangePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  range?: [number, number];   // fixed range [min, max]
  placeholder?: string;
  className?: string;
  mode?: "dropdown" | "grid";
  inputSize?: "default" | "filter";
}

export default function YearRangePicker({
  value,
  onChange,
  range,    // fixed range (backend will give valid range)
  placeholder = "Academic Year",
  className = "",
  mode = "dropdown",
  inputSize = "default",
}: YearRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<Date | null>(
    value || null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // For grid mode
  const currentYear = new Date().getFullYear();
  const MIN_YEAR = range?.[0] ?? 1900; // Set a reasonable minimum year
  const MAX_YEAR = range?.[1] ?? 2026; // Set a reasonable maximum year

  const initialStartYear = value
    ? Math.floor(value.getFullYear() / 9) * 9
    : Math.floor(currentYear / 9) * 9;
  const [startYear, setStartYear] = useState(initialStartYear);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, []);

  const handleYearChange = (year: number) => {
    const date = new Date(year, 0, 1);
    setSelectedYear(date);
    onChange?.(date);
    setIsOpen(false);
  };

  const formatYearRange = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    return `${year} - ${year + 1}`;
  };

  // Generate year ranges for dropdown
  const generateYearRanges = () => {
    const ranges = [];
    for (let year = MAX_YEAR; year >= MIN_YEAR; year--) {
      ranges.push({ start: year, end: year + 1 });
    }
    return ranges;
  };

  const yearRanges = generateYearRanges();
  const selectedYearValue = selectedYear
    ? selectedYear.getFullYear()
    : currentYear;

  // For grid mode
  const years = Array.from(
    { length: 9 },
    (_, i) => startYear + i,
  ).filter((year) => year >= MIN_YEAR && year <= MAX_YEAR);

  const handlePrevRange = () => {
    const prevStart = startYear - 9;
    if (prevStart >= MIN_YEAR) {
      setStartYear(prevStart);
    }
  };

  const handleNextRange = () => {
    const nextStart = startYear + 9;
    if (nextStart + 8 <= MAX_YEAR) {
      setStartYear(nextStart);
    }
  };

  const isSelected = (year: number) => {
    return selectedYear && selectedYear.getFullYear() === year;
  };

  const inputSizeClasses = inputSize === "filter"
    ? "h-9 px-3 text-sm"
    : "py-2 px-3";

  return (
    <div
      ref={containerRef}
      className={`relative ${className} year-range-picker-root`}
    >
      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={formatYearRange(selectedYear)}
          placeholder={placeholder}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full pr-10 bg-breadcrumb border border-[#d4c5a0] rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary font-semibold year-range-picker-input ${inputSizeClasses}`}
          style={inputSize === "default" ? { fontSize: "13.33px" } : undefined}
        />
        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
      </div>

      {/* Year Range Dropdown */}
      {isOpen && mode === "dropdown" && (
        <div className="absolute z-50 mt-2 left-0 w-full bg-breadcrumb rounded-lg border border-[#d4c5a0] shadow-lg overflow-hidden">
          {/* Header -- Remove for more visual readability */}
          {/* <div style={{ fontSize: "13.33px" }} className="bg-primary text-primary-foreground-2 font-semibold px-4 py-2 text-center year-range-picker-dropdown-header">
            {selectedYearValue} - {selectedYearValue + 1}
          </div> */}

          {/* Year Range List */}
          <div className="max-h-48 overflow-y-auto bg-breadcrumb">
            {yearRanges.map((range, idx) => (
              <button
                key={idx}
                onClick={() => handleYearChange(range.start)}
                style={{ fontSize: "13.33px" }}
                className={`
                  w-full px-4 py-2 text-center transition-colors year-range-picker-dropdown-button
                  ${
                    range.start === selectedYearValue
                      ? "bg-primary text-primary-foreground-2"
                      : "text-primary hover:bg-[#e8e4c5]"
                  }
                `}
              >
                {range.start} - {range.end}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Year Grid Dropdown */}
      {isOpen && mode === "grid" && (
        <div className="absolute z-50 mt-2 left-0 bg-breadcrumb rounded-lg border border-[#d4c5a0] shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground-2 px-4 py-2.5 flex items-center justify-between">
            <button
              onClick={handlePrevRange}
              className="hover:opacity-80 transition-opacity"
              aria-label="Previous year range"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex-1 text-center year-range-picker-grid-header-center">
              {startYear} – {startYear + 8}
            </div>
            <button
              onClick={handleNextRange}
              className="hover:opacity-80 transition-opacity"
              aria-label="Next year range"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Year Grid */}
          <div className="p-4 bg-breadcrumb">
            <div className="grid grid-cols-3 gap-3">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={`
                    px-6 py-3 rounded transition-colors year-range-picker-grid-button
                    ${
                      isSelected(year)
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-[#444444] hover:bg-[#e8e4c5]"
                    }
                  `}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}