import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItemWithLabel } from "@/components/ui/radio-group-with-label";
import { FilterState } from './student_interface';

interface StudentFilterAndSortProps {
  onApplyFilter: (filters: FilterState) => void;
  onApplySort: (sortOption: string) => void;
  onClose: () => void;
}

export function StudentFilterAndSort({ onApplyFilter, onApplySort, onClose }: StudentFilterAndSortProps) {
  // Filter states
  const [adviser, setAdviser] = useState("");
  const [block, setBlock] = useState("");
  const [specialization, setSpecialization] = useState("");
  
  // Sort state
  const [selectedSort, setSelectedSort] = useState("");

  const handleClear = () => {
    // Clear filters
    setAdviser("");
    setBlock("");
    setSpecialization("");
    // Clear sort
    setSelectedSort("");
  };

  const handleApply = () => {
    // Apply filters
    onApplyFilter({ 
      blocks: block ? [block] : [], 
      specializations: specialization ? [specialization] : [] 
    });
    // Apply sort
    onApplySort(selectedSort);
    onClose();
  };

  const filterSelects = [
    {
      label: "Adviser",
      value: adviser,
      setter: setAdviser,
      options: ["Dr. Cherry Casuat", "Engr. Rolito Mahaguay", "Dr. Robert Dela Cruz", "Engr. Robert Dela Cruz"],
    },
    {
      label: "Block",
      value: block,
      setter: setBlock,
      options: ["BSCPE 3-1", "BSCPE 3-3", "BSCPE 3-4", "BSCPE 4-1", "BSCPE 4-2", "BSCPE 4-3", "BSCPE 4-5", "BSCPE 4-6"],
    },
    {
      label: "Specialization",
      value: specialization,
      setter: setSpecialization,
      options: ["Big Data Analytics", "Machine Learning", "System Development", "Computer Networks"],
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md max-h-[80vh] overflow-y-auto">
      {/* Filter Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-3 text-primary">
          Apply Filter
        </h2>
        <div className="border-t my-4" />

        {filterSelects.map(({ label, value, setter, options }) => (
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
      </div>

      {/* Sort Section */}
      <div className="mb-6">
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
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t">
        <Button variant="tertiary" onClick={handleClear}>Reset All</Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="negative" onClick={handleApply}>Apply</Button>
        </div>
      </div>
    </div>
  );
}