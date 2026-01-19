// Filter Search

import { useState } from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItemWithLabel } from "@/components/ui/radio-group-with-label";
import { CheckboxWithLabel } from "@/components/ui/checkbox-with-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import YearRangePicker from "@/components/acad-year-range-picker";
import { Search, X, Calendar, Plus, Icon, ArrowUpDown } from 'lucide-react';
import { SecondarySort } from './Icons/secondary-sort';
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";

/* =======================
   FILTER 1
======================= */
export function Filter1() {
  const [facultyType, setFacultyType] = useState("");

  const handleClear = () => {
    setFacultyType("");
  };

  const handleApply = () => {
    console.log("Filter 1 applied. Selected faculty type:", facultyType);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
    <h2 className="text-2xl font-bold mb-3 text-primary">
        Apply Filter
    </h2>
    <div className="border-t my-4" />


      {/* Roles */}
      <div className="space-y-3 mb-4">
        <label className="font-medium">Roles</label>
        <div className="flex flex-col gap-3">
          <CheckboxWithLabel id="thesisCoordinator" label="Thesis Coordinator" />
          <CheckboxWithLabel id="thesisAdviser" label="Thesis Adviser" />
          <CheckboxWithLabel id="panelMember" label="Panel Member" />
        </div>
      </div>

      <div className="border-t my-4" />

      {/* Faculty Type */}
      <div className="space-y-3">
        <label className="font-medium">Faculty Type</label>
        <RadioGroup
          value={facultyType}
          onValueChange={setFacultyType}
          className="flex flex-col gap-3"
        >
          {["Full-time", "Part-time", "External"].map((type) => (
            <RadioGroupItemWithLabel
              key={type}
              id={type}
              value={type}
              label={type.replace("-", " ")}
            />
          ))}
        </RadioGroup>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="tertiary" className="flex items-center justify-center" onClick={handleClear}>
          Reset
        </Button>
        <Button variant="negative" className="flex items-center justify-center" onClick={handleApply}>
          Apply
        </Button>
      </div>
    </div>
  );
}

/* =======================
   FILTER 2
======================= */
export function Filter2() {
  const [adviser, setAdviser] = useState("");
  const [block, setBlock] = useState("");
  const [specialization, setSpecialization] = useState("");

  const handleClear = () => {
    setAdviser("");
    setBlock("");
    setSpecialization("");
  };

  const handleApply = () => {
    console.log("Filter 2 applied:", { adviser, block, specialization });
  };

  const selects = [
    {
      label: "Adviser",
      value: adviser,
      setter: setAdviser,
      options: ["Dr. Cherry Casuat", "Engr. Rolito Mahaguay"],
    },
    {
      label: "Block",
      value: block,
      setter: setBlock,
      options: ["BSCpE 4-3", "BSCpE 4-2"],
    },
    {
      label: "Specialization",
      value: specialization,
      setter: setSpecialization,
      options: ["Big Data Analytics", "Networks"],
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
    <h2 className="text-2xl font-bold mb-3 text-primary">
        Apply Filter
    </h2>
    <div className="border-t my-4" />

      {selects.map(({ label, value, setter, options }) => (
        <div key={label} className="mb-4">
          <label className="font-medium">{label}</label>
          <select
            value={value}
            onChange={(e) => setter(e.target.value)}
            className="w-full mt-1 p-2 bg-yellow-50 rounded"
          >
            <option value="">Select {label}</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      ))}

      <div className="flex justify-between mt-6">
        <Button variant="tertiary" className="flex items-center justify-center" onClick={handleClear}>
          Reset
        </Button>
        <Button variant="negative" className="flex items-center justify-center" onClick={handleApply}>
          Apply
        </Button>
      </div>
    </div>
  );
}

/* =======================
   SORT COMPONENTS
======================= */

export function Sort1() {
  const [selectedSort, setSelectedSort] = useState("");

  const handleReset = () => setSelectedSort("");
  const handleApply = () => console.log("Sort 1 applied:", selectedSort);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
    <h2 className="text-2xl font-bold mb-3 text-primary">
        Sort By
    </h2>
    <div className="border-t my-4" />

      {/* Faculty ID */}
      <div className="mb-4">
        <label className="block text-gray-900 mb-2 font-medium">Faculty ID</label>
        <RadioGroup value={selectedSort} onValueChange={setSelectedSort} className="flex flex-col gap-3">
          <RadioGroupItemWithLabel id="faculty-id-asc" value="faculty-id-asc" label="Ascending" />
          <RadioGroupItemWithLabel id="faculty-id-desc" value="faculty-id-desc" label="Descending" />
        </RadioGroup>
      </div>

      {/* Faculty Name */}
      <div className="mb-4">
        <label className="block text-gray-900 mb-2 font-medium">Faculty Name</label>
        <RadioGroup value={selectedSort} onValueChange={setSelectedSort} className="flex flex-col gap-3">
          <RadioGroupItemWithLabel id="faculty-name-a-z" value="faculty-name-a-z" label="First Name (A-Z)" />
          <RadioGroupItemWithLabel id="faculty-name-z-a" value="faculty-name-z-a" label="First Name (Z-A)" />
        </RadioGroup>
      </div>

      {/* Date Added */}
      <div className="mb-4">
        <label className="block text-gray-900 mb-2 font-medium">Date Added</label>
        <RadioGroup value={selectedSort} onValueChange={setSelectedSort} className="flex flex-col gap-3">
          <RadioGroupItemWithLabel id="date-oldest" value="date-oldest" label="Oldest to Newest" />
          <RadioGroupItemWithLabel id="date-newest" value="date-newest" label="Newest to Oldest" />
        </RadioGroup>
      </div>

      <div className="flex items-center justify-end gap-2 mt-6">
        <Button variant="tertiary" onClick={handleReset}>Reset</Button>
        <Button variant="secondary">Cancel</Button>
        <Button variant="negative" onClick={handleApply}>Apply</Button>
      </div>
    </div>
  );
}

/* =======================
   SORT 2 - Student
======================= */
export function Sort2() {
  const [selectedSort, setSelectedSort] = useState("");

  const handleReset = () => setSelectedSort("");
  const handleApply = () => console.log("Sort 2 applied:", selectedSort);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
    <h2 className="text-2xl font-bold mb-3 text-primary">
        Sort By
    </h2>
    <div className="border-t my-4" />

      {/* Student ID */}
      <div className="mb-4">
        <label className="block text-gray-900 mb-2 font-medium">Student ID</label>
        <RadioGroup value={selectedSort} onValueChange={setSelectedSort} className="flex flex-col gap-3">
          <RadioGroupItemWithLabel id="student-id-asc" value="student-id-asc" label="Ascending" />
          <RadioGroupItemWithLabel id="student-id-desc" value="student-id-desc" label="Descending" />
        </RadioGroup>
      </div>

      {/* Student Name */}
      <div className="mb-4">
        <label className="block text-gray-900 mb-2 font-medium">Student Name</label>
        <RadioGroup value={selectedSort} onValueChange={setSelectedSort} className="flex flex-col gap-3">
          <RadioGroupItemWithLabel id="student-name-a-z" value="student-name-a-z" label="First Name (A-Z)" />
          <RadioGroupItemWithLabel id="student-name-z-a" value="student-name-z-a" label="First Name (Z-A)" />
        </RadioGroup>
      </div>

      {/* Group Code */}
      <div className="mb-4">
        <label className="block text-gray-900 mb-2 font-medium">Group Code</label>
        <RadioGroup value={selectedSort} onValueChange={setSelectedSort} className="flex flex-col gap-3">
          <RadioGroupItemWithLabel id="group-code-asc-s2" value="group-code-asc" label="Ascending" />
          <RadioGroupItemWithLabel id="group-code-desc-s2" value="group-code-desc" label="Descending" />
        </RadioGroup>
      </div>

      <div className="flex items-center justify-end gap-2 mt-6">
        <Button variant="tertiary" onClick={handleReset}>Reset</Button>
        <Button variant="secondary">Cancel</Button>
        <Button variant="negative" onClick={handleApply}>Apply</Button>
      </div>
    </div>
  );
}

/* =======================
   SORT 3 - Thesis
======================= */
export function Sort3() {
  const [selectedSort, setSelectedSort] = useState("");

  const handleReset = () => setSelectedSort("");
  const handleApply = () => console.log("Sort 3 applied:", selectedSort);

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
    <h2 className="text-2xl font-bold mb-3 text-primary">
        Sort By
    </h2>
    <div className="border-t my-4" />

      {/* Group Code */}
      <div className="mb-4">
        <label className="block text-gray-900 mb-2 font-medium">Group Code</label>
        <RadioGroup value={selectedSort} onValueChange={setSelectedSort} className="flex flex-col gap-3">
          <RadioGroupItemWithLabel id="group-code-asc-s3" value="group-code-asc" label="Ascending" />
          <RadioGroupItemWithLabel id="group-code-desc-s3" value="group-code-desc" label="Descending" />
        </RadioGroup>
      </div>

      {/* Thesis Title */}
      <div className="mb-4">
        <label className="block text-gray-900 mb-2 font-medium">Thesis Title</label>
        <RadioGroup value={selectedSort} onValueChange={setSelectedSort} className="flex flex-col gap-3">
          <RadioGroupItemWithLabel id="thesis-title-a-z" value="thesis-title-a-z" label="A-Z" />
          <RadioGroupItemWithLabel id="thesis-title-z-a" value="thesis-title-z-a" label="Z-A" />
        </RadioGroup>
      </div>

      <div className="flex items-center justify-end gap-2 mt-6">
        <Button variant="tertiary" onClick={handleReset}>Reset</Button>
        <Button variant="secondary">Cancel</Button>
        <Button variant="negative" onClick={handleApply}>Apply</Button>
      </div>
    </div>
  );
}

/* =======================
   SORT - GENERAL
======================= */
export function GeneralSort({ onClose, onApply }: { onClose?: () => void; onApply?: (sort: string) => void }) {
  const [selectedSort, setSelectedSort] = useState("");

  const handleReset = () => setSelectedSort("");
  
  const handleApply = () => {
    onApply?.(selectedSort); 
    onClose?.(); 
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-[320px] max-w-md">
    <h2 className="text-2xl font-bold mb-3 text-primary">
        Sort By
    </h2>
    <div className="border-t my-4" />

      {/* General Sort Options */}
      <div className="mb-4">
        <label className="block text-gray-900 mb-2 font-medium">Sort By</label>
        <RadioGroup value={selectedSort} onValueChange={setSelectedSort} className="flex flex-col gap-3">
          <RadioGroupItemWithLabel id="option-1" value="option-1" label="Ascending" />
          <RadioGroupItemWithLabel id="option-2" value="option-2" label="Descending" />
          <RadioGroupItemWithLabel id="option-3" value="option-3" label="Newest" />
          <RadioGroupItemWithLabel id="option-4" value="option-4" label="Oldest" />
        </RadioGroup>
      </div>

      <div className="flex items-center justify-end gap-2 mt-6">
        <Button variant="outline" onClick={handleReset}>Reset</Button>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleApply}>Apply</Button>
      </div>
    </div>
  );
} 

/* =======================
   SEARCH BAR VARIANTS
======================= */
interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  variant?: 'default' | 'filter-section';
}

export function SearchBar({ 
  placeholder = "Search...", 
  value, 
  onChange, 
  variant = 'default' 
}: SearchBarProps) {
  const [internalQuery, setInternalQuery] = useState("");

  const query = value !== undefined ? value : internalQuery;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (onChange) onChange(val);
    else setInternalQuery(val);
  };

  // Variant: Filter Section (Figma: 36px height, bg-breadcrumb [#F3EFD0])
  if (variant === 'filter-section') {
    return (
      <div 
        className={cn(
          "flex flex-row items-center",
          "h-9 w-full max-w-[1153.4px]", // Height: 36px
          "bg-breadcrumb border-[0.8px] border-primary/30 rounded-lg", // bg: #F3EFD0, border: rgba(115, 0, 0, 0.3)
          "hover:bg-breadcrumb/50 focus-within:border-primary", // hover & focus effects
          "pl-5 pr-3 py-1", 
          "flex-1 order-0 grow",
          "transition-colors duration-200"
        )}
        data-name="Search Bar - No Icon Variant"
      >
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "h-7 w-full bg-transparent border-none outline-none focus:ring-0",
            "text-[13.33px] font-medium leading-[17px] text-alert-desc placeholder:text-alert-desc", // font: DM Sans, size: 13.33px
            "font-dm"
          )}
        />
      </div>
    );
  }

  // Default Variant (44px height design)
  return (
    <div className="flex items-center w-full relative" data-name="Search bar - Default">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "flex-grow h-[44px] bg-white rounded-l-md border border-input px-3 text-foreground text-base font-medium focus:outline-none",
          "font-dm"
        )}
      />
      <div className="flex items-center justify-center h-[44px] w-[46px] bg-primary rounded-r-md cursor-pointer hover:bg-sidebar-gradient-mid transition-colors">
        <Search className="w-6 h-6 text-primary-foreground" />
      </div>
    </div>
  );
}

/* =======================
   REPO FILTER - Repository Filter
======================= */
export function RepoFilter({ onClose, onApply }: { onClose?: () => void; onApply?: (tags: string[]) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<Date | undefined>(new Date(2024, 0, 1));
  const [removableTags, setRemovableTags] = useState([
    "Computer Vision",
    "Deep Learning",
    "Internet of Things",
    "Machine Learning",
    "Neural Networks"
  ]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [sortState, setSortState] = useState<'default' | 'hovered' | 'clicked'>('default');

  const specializationOptions = [
    "Big Data",
    "Computer Network",
    "Machine Learning",
    "System Development"
  ];

  const handleRemoveTag = (tagToRemove: string) => {
    setRemovableTags(removableTags.filter(tag => tag !== tagToRemove));
  };

  const handleToggleSpecialization = (spec: string) => {
    if (selectedSpecializations.includes(spec)) {
      setSelectedSpecializations(selectedSpecializations.filter(s => s !== spec));
    } else {
      setSelectedSpecializations([...selectedSpecializations, spec]);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedYear(new Date(2024, 0, 1));
    setRemovableTags([]);
    setSelectedSpecializations([]);
  };

  const handleApplyClick = () => {
    onApply?.(removableTags);
    onClose?.();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      {/* Header with Close Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary font-['DM_Sans']">
          Apply Filter
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="border-t mb-6" />

      {/* Search Term */}
      <div className="mb-6">
        <label className="block font-medium text-gray-900 mb-2 font-['DM_Sans']">
          Search Term
        </label>
        <Input
          type="text"
          inputSize="filter"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Keywords, Titles, Students..."
        />
      </div>

      {/* Year */}
      <div className="mb-6">
        <label className="block font-medium text-gray-900 mb-2 font-['DM_Sans']">
          Year
        </label>
        <YearRangePicker
          value={selectedYear}
          onChange={setSelectedYear}
          placeholder="Academic Year"
          mode="dropdown"
          inputSize="filter"
        />
      </div>

      {/* Removable Tags */}
      <div className="mb-6">
        <label className="block font-medium text-gray-900 mb-2 font-['DM_Sans']">
          Removable Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {removableTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-primary text-primary rounded-full text-xs font-medium font-['DM_Sans']"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:bg-primary/10 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-dashed border-gray-400 text-gray-600 rounded-full text-xs font-medium font-['DM_Sans'] hover:border-primary hover:text-primary transition-colors">
            <Plus className="w-3 h-3" />
            Add Tag
          </button>
        </div>
      </div>

      {/* Specialization */}
      <div className="mb-6">
        <label className="block font-medium text-gray-900 mb-2 font-['DM_Sans']">
          Specialization
        </label>
        <div className="flex flex-wrap gap-2">
          {specializationOptions.map((spec) => (
            <button
              key={spec}
              onClick={() => handleToggleSpecialization(spec)}
              className={`px-3 py-1 rounded-full text-xs font-medium font-['DM_Sans'] transition-colors ${
                selectedSpecializations.includes(spec)
                  ? 'bg-primary text-white border border-primary'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-primary hover:text-primary'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <button
          onClick={() => {
            setSortState('clicked');
            setTimeout(() => setSortState('default'), 200);
            console.log('Sort clicked');
          }}
          onMouseEnter={() => sortState === 'default' && setSortState('hovered')}
          onMouseLeave={() => sortState === 'hovered' && setSortState('default')}
          className="transition-colors"
        >
          <SecondarySort state={sortState} />
        </button>
        <Button
          variant="outline"
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button
          variant="secondary"
          onClick={onClose}
          className="font-['DM_Sans']"
        >
          Cancel
        </Button>
        <Button
          variant="negative"
          onClick={handleApplyClick}
          className="font-['DM_Sans']"
        >
          Apply All Filters
        </Button>
      </div>
    </div>
  );
}

/* =======================
    DEFENSE MANAGEMENT FILTER
======================= */

interface DefenseFilterState {
    adviser: string;
    month: string;
    year: string;
    block: string;
    tags: string[];
}

export function DefenseManagementFilter({ 
    onClose, 
    onApply 
}: { 
    onClose?: () => void; 
    onApply?: (filters: DefenseFilterState) => void 
}) {
    const [adviser, setAdviser] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [block, setBlock] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const tagsList = ["Title Defense", "DP1 Defense", "DP2 Defense", "Title Re-defense", "DP1 Re-defense", "DP2 Re-defense"];

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const handleClearAll = () => {
        setAdviser(""); setMonth(""); setYear(""); setBlock(""); setSelectedTags([]);
    };

    const handleApplyClick = () => {
        // Pass the actual filter object back to the parent
        onApply?.({
            adviser,
            month,
            year,
            block,
            tags: selectedTags
        });
        if (onClose) onClose();
    };

  function handleApplyGeneralSort(sort: string): void {
    throw new Error("Function not implemented.");
  }

    return (
        <div className="bg-white rounded-lg shadow-2xl p-6 w-[380px] font-dm flex flex-col border border-border animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-1 text-primary">Apply Filter</h2>
            <div className="border-t border-primary/10 my-4" />

            {/* Content Area - Removed fixed height for Popover compatibility */}
            <div className="flex flex-col gap-4">
                <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-[#1A1A1A] uppercase tracking-wider">Adviser</label>
                    <Select value={adviser} onValueChange={setAdviser}>
                        <SelectTrigger className="bg-breadcrumb border-none h-9 w-full text-[13px]">
                            <SelectValue placeholder="Filter by Adviser" />
                        </SelectTrigger>
                        <SelectContent className="w-[var(--radix-select-trigger-width)]">
                            <SelectItem value="Casuat">Dr. Cherry D. Casuat</SelectItem>
                            <SelectItem value="Mahaguay">Engr. Rolito Mahaguay</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-3">
                    <div className="flex-1 space-y-1.5">
                        <label className="text-[12px] font-semibold text-[#1A1A1A] uppercase tracking-wider">Month</label>
                        <Select value={month} onValueChange={setMonth}>
                            <SelectTrigger className="bg-breadcrumb border-none h-9 w-full text-[13px]">
                                <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent className="w-[var(--radix-select-trigger-width)]">
                                {["January", "February", "March", "April", "May", "June"].map(m => (
                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 space-y-1.5">
                        <label className="text-[12px] font-semibold text-[#1A1A1A] uppercase tracking-wider">Year</label>
                        <Select value={year} onValueChange={setYear}>
                            <SelectTrigger className="bg-breadcrumb border-none h-9 w-full text-[13px]">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent className="w-[var(--radix-select-trigger-width)]">
                                {["2024", "2025", "2026"].map(y => (
                                    <SelectItem key={y} value={y}>{y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-[#1A1A1A] uppercase tracking-wider">Block</label>
                    <Select value={block} onValueChange={setBlock}>
                        <SelectTrigger className="bg-breadcrumb border-none h-9 w-full text-[13px]">
                            <SelectValue placeholder="Filter by Block" />
                        </SelectTrigger>
                        <SelectContent className="w-[var(--radix-select-trigger-width)]">
                            {["BSCPE 3-1", "BSCPE 3-2", "BSCPE 3-3", "BSCPE 3-4"].map(b => (
                                <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2 pt-2 border-t border-primary/5">
                    <div className="text-[12px] font-bold text-[#1A1A1A]">TYPE TAGS</div>
                    <div className="flex flex-wrap gap-1.5">
                        {tagsList.map((tag, index) => (
                            <button
                                key={index}
                                onClick={() => toggleTag(tag)}
                                className={cn(
                                    "px-2.5 py-1 border rounded-md text-[11px] font-medium transition-all",
                                    selectedTags.includes(tag) 
                                        ? "bg-primary text-white border-primary" 
                                        : "bg-white text-primary border-primary/30 hover:bg-primary/5"
                                )}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-primary/10 flex items-center justify-between gap-2">
                
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-lg border-none">
                            <ArrowUpDown name="sortDefault" size={16}/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                        side="left" 
                        align="end" 
                        sideOffset={30}
                        className="w-fit p-0 border-none shadow-2xl"
                    >
                        <GeneralSort 
                            onClose={() => {}} 
                            onApply={handleApplyGeneralSort} 
                        />
                    </PopoverContent>
                </Popover>

                <Button 
                    variant="outline" 
                    onClick={handleClearAll} 
                    className="h-9 px-3 text-[12px] border-primary/20 hover:bg-primary/5 text-primary"
                >
                    Reset
                </Button>

                <div className="flex gap-2 flex-1 justify-end">
                    <Button 
                        variant="secondary" 
                        onClick={onClose} 
                        className="h-9 px-3 text-[12px] bg-breadcrumb text-primary border-none"
                    >
                        Cancel
                    </Button>

                    <Button 
                        variant="negative" 
                        onClick={handleApplyClick} 
                        className="h-9 px-4 text-[12px] flex-grow shadow-md"
                    >
                        Apply Filters
                    </Button>
                </div>
            </div>
        </div>
    );
}