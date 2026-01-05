import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItemWithLabel } from "@/components/ui/radio-group-with-label";

interface FacultySortDropdownProps {
  onApply: (sortOption: string) => void;
  onClose: () => void;
}

export function FacultySortDropdown({ onApply, onClose }: FacultySortDropdownProps) {
  const [selectedSort, setSelectedSort] = useState("");

  const handleReset = () => setSelectedSort("");
  
  const handleApply = () => {
    onApply(selectedSort);
    onClose();
  };

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
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="negative" onClick={handleApply}>Apply</Button>
      </div>
    </div>
  );
}