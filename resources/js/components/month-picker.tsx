import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthPickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
}

export function MonthPicker({
  value,
  onChange,
  className = "",
}: MonthPickerProps) {
  const [currentYear, setCurrentYear] = useState(
    value?.getFullYear() || new Date().getFullYear(),
  );
  const [selectedMonth, setSelectedMonth] = useState<
    number | null
  >(value ? value.getMonth() : null);
  const [selectedYear, setSelectedYear] = useState<
    number | null
  >(value ? value.getFullYear() : null);

  const months = [
    ["Jan", "Feb", "Mar"],
    ["Apr", "May", "Jun"],
    ["Jul", "Aug", "Sep"],
    ["Oct", "Nov", "Dec"],
  ];

  const monthMapping: { [key: string]: number } = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const handlePrevYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  const handleMonthClick = (month: string) => {
    const monthIndex = monthMapping[month];
    setSelectedMonth(monthIndex);
    setSelectedYear(currentYear);
    const newDate = new Date(currentYear, monthIndex, 1);
    onChange?.(newDate);
  };

  const isSelected = (month: string) => {
    const monthIndex = monthMapping[month];
    return (
      selectedMonth === monthIndex &&
      selectedYear === currentYear
    );
  };

  return (
    <div
      className={`inline-block w-[260px] bg-[#f3efd0] rounded-xl shadow-md overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-[#730000] text-[#ffbd00] font-semibold px-4 py-2.5 flex items-center justify-between" style={{ fontSize: "13.33px" }}>
        <button
          onClick={handlePrevYear}
          className="hover:opacity-80 transition-opacity"
          aria-label="Previous year"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 text-center month-picker-header-center">
          {currentYear}
        </div>
        <button
          onClick={handleNextYear}
          className="hover:opacity-80 transition-opacity"
          aria-label="Next year"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Month Grid */}
      <div className="p-4 bg-[#F3EFD0]">
        <div className="grid gap-3">
          {months.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-3 gap-3"
            >
              {row.map((month) => (
                <button
                  key={month}
                  onClick={() => handleMonthClick(month)}
                  className={`px-6 py-2 rounded transition-colors month-picker-button ${isSelected(month) ? "bg-[#730000]/10 text-[#730000] font-semibold" : "text-[#444444] hover:bg-[#e8e4c5]"}`}
                  style={{ fontSize: "13.33px" }}
                >
                  {month}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}