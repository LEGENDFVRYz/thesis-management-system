import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface YearPickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}

export function YearPicker({
  value,
  onChange,
  className = "",
}: YearPickerProps) {
  const MIN_YEAR = 1900;
  const MAX_YEAR = 2040;
  const RANGE_SIZE = 9;

  const currentYear = new Date().getFullYear();
  const initialStartYear = value
    ? Math.floor(value.getFullYear() / RANGE_SIZE) * RANGE_SIZE
    : Math.floor(currentYear / RANGE_SIZE) * RANGE_SIZE;

  const [startYear, setStartYear] = useState(initialStartYear);
  const [selectedYear, setSelectedYear] = useState<number | null>(
    value ? value.getFullYear() : null
  );

  const endYear = Math.min(startYear + RANGE_SIZE - 1, MAX_YEAR);
  const canGoPrev = startYear > MIN_YEAR;
  const canGoNext = endYear < MAX_YEAR;

  const years = Array.from(
    { length: RANGE_SIZE },
    (_, i) => startYear + i
  ).filter((year) => year >= MIN_YEAR && year <= MAX_YEAR);

  const handlePrevRange = () => {
    if (canGoPrev) setStartYear((prev) => Math.max(prev - RANGE_SIZE, MIN_YEAR));
  };

  const handleNextRange = () => {
    if (canGoNext) setStartYear((prev) => Math.min(prev + RANGE_SIZE, MAX_YEAR - RANGE_SIZE + 1));
  };

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
    onChange?.(new Date(year, 0, 1));
  };

  return (
    <div className={`inline-block w-[260px] bg-[#f3efd0] rounded-xl border border-[#d4c5a0] shadow-md overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-[#730000] text-[#ffbd00] font-semibold px-4 py-2.5 flex items-center justify-between" style={{ fontSize: "13.33px" }}>
        <button
          onClick={handlePrevRange}
          disabled={!canGoPrev}
          className="hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous year range"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 text-center">
          {startYear} – {endYear}
        </div>
        <button
          onClick={handleNextRange}
          disabled={!canGoNext}
          className="hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next year range"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Year Grid */}
      <div className="p-4 bg-[#F3EFD0]">
        <div className="grid grid-cols-3 gap-3">
          {years.map((year) => {
            const selected = selectedYear === year;
            return (
              <button
                key={year}
                onClick={() => handleYearClick(year)}
                className={`py-3 rounded transition-colors flex items-center justify-center ${
                  selected
                    ? "bg-[#730000]/10 text-[#730000] font-semibold"
                    : "text-[#444444] hover:bg-[#e8e4c5]"
                }`}
                style={{ fontSize: "13.33px" }}
              >
                {year}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}