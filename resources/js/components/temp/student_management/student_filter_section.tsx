//UPDATE: Used the existing filter search component variant for Student Management
import FilterSearchSection from '@/components/filter-search-section';

interface FilterSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterOpen: boolean;
  sortOpen: boolean;
  onFilterToggle: () => void;
  onSortToggle: () => void;
  onFilterClose: () => void;
  onSortClose: () => void;
  
  onApplySort: (sortOption: string) => void;
  onClearFilters: () => void;
  view: string;
}

export function StudentFilterSection({
  searchQuery,
  onSearchChange,
  filterOpen,
  sortOpen,
  onFilterToggle,
  onSortToggle,
  onFilterClose,
  onSortClose,
  
  onApplySort,
  onClearFilters,
  view
}: FilterSectionProps) {
  return (
    <div className="mb-4">
      <FilterSearchSection variant="StudentManagement" />
    </div>
  );
}