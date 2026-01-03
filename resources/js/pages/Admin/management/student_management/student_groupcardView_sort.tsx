import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItemWithLabel } from "@/components/ui/radio-group-with-label";

interface GroupSortWrapperProps {
  onApply: (sortOption: string) => void;
  onClose: () => void;
}

export function GroupSortWrapper({ onApply, onClose }: GroupSortWrapperProps) {
  const [selectedSort, setSelectedSort] = useState("");

  const handleClear = () => {
    setSelectedSort("");
  };

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

      {/* Group Code */}
      <div className="mb-4">
        <label className="block text-gray-900 mb-2 font-medium">Group Code</label>
        <RadioGroup value={selectedSort} onValueChange={setSelectedSort} className="flex flex-col gap-3">
          <RadioGroupItemWithLabel id="group-code-asc" value="group-code-asc" label="Ascending" />
          <RadioGroupItemWithLabel id="group-code-desc" value="group-code-desc" label="Descending" />
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

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t">
        <Button variant="tertiary" onClick={handleClear}>Reset</Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="negative" onClick={handleApply}>Apply</Button>
        </div>
      </div>
    </div>
  );
}