import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import YearRangePicker from '@/components/acad-year-range-picker';
import { Button } from '@/components/ui/button';
import FilterIcon from '@/components/icons/filter-icon';
import { RepoFilter } from '@/components/filter-search';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RepositoryFilterBarProps {
  onFilterChange?: (filters: {
    searchTerm: string;
    selectedYear: Date | undefined;
    selectedSpecialization: string;
    tags: string[];
  }) => void;
}

export function RepositoryFilterBar({ onFilterChange }: RepositoryFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<Date | undefined>(undefined);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterIconPosition, setFilterIconPosition] = useState<{ top: number; right: number } | null>(null);
  const filterIconRef = React.useRef<HTMLButtonElement>(null);

  const handleClearFilter = () => {
    setSearchTerm('');
    setSelectedYear(undefined);
    setSelectedSpecialization('');
    setTags([]);
    onFilterChange?.({
      searchTerm: '',
      selectedYear: undefined,
      selectedSpecialization: '',
      tags: []
    });
  };

  const handleApplyFilters = (appliedTags: string[]) => {
    setTags(appliedTags);
    onFilterChange?.({
      searchTerm,
      selectedYear,
      selectedSpecialization,
      tags: appliedTags
    });
  };

  React.useEffect(() => {
    onFilterChange?.({
      searchTerm,
      selectedYear,
      selectedSpecialization,
      tags
    });
  }, [searchTerm, selectedYear, selectedSpecialization]);

  const handleFilterIconClick = () => {
    if (filterIconRef.current) {
      const rect = filterIconRef.current.getBoundingClientRect();
      setFilterIconPosition({
        top: rect.bottom + 20,
        right: window.innerWidth - rect.right
      });
    }
    setIsFilterOpen(true);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      if (isFilterOpen) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isFilterOpen]);

  return (
    <>
      <div className="w-full bg-white">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto_auto] gap-4 items-end">
          {/* Search */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-900 font-['DM_Sans']">
              Search
            </label>
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Keywords, Terms..."
              className="bg-breadcrumb"
            />
          </div>

          {/* Academic Year */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-900 font-['DM_Sans']">
              Academic Year
            </label>
            <YearRangePicker
              value={selectedYear}
              onChange={setSelectedYear}
              placeholder="Academic Year"
              mode="dropdown"
            />
          </div>

          {/* Specialization */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-900 font-['DM_Sans']">
              Specialization
            </label>
            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by Specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="big-data">Big Data</SelectItem>
                <SelectItem value="computer-network">Computer Network</SelectItem>
                <SelectItem value="machine-learning">Machine Learning</SelectItem>
                <SelectItem value="system-development">System Development</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Icon */}
          <button
            ref={filterIconRef}
            onClick={handleFilterIconClick}
            className="flex-shrink-0 w-[36px] h-[36px] flex items-center justify-center"
          >
            <FilterIcon className="w-[36px] h-[36px]" />
          </button>

          {/* Clear Filter Button */}
          <Button
            variant="negative"
            onClick={handleClearFilter}
            className="!h-[36px] !min-h-[36px] !max-h-[36px] px-4 !py-0 font-['DM_Sans'] flex items-center gap-2 flex-shrink-0"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4L12 12M4 12L12 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Clear Filter
          </Button>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterOpen && filterIconPosition && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setIsFilterOpen(false)}
        >
          <div
            className="absolute"
            style={{
              top: `${filterIconPosition.top}px`,
              right: `${filterIconPosition.right}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <RepoFilter
              onClose={() => setIsFilterOpen(false)}
              onApply={handleApplyFilters}
            />
          </div>
        </div>
      )}
    </>
  );
}
