import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FilterState } from './student_interface';

interface StudentFilterWrapperProps {
  onApply: (filters: FilterState) => void;
  onClose: () => void;
}

export function StudentFilterWrapper({ onApply, onClose }: StudentFilterWrapperProps) {
  const [adviser, setAdviser] = useState("");
  const [block, setBlock] = useState("");
  const [specialization, setSpecialization] = useState("");

  const handleClear = () => {
    setAdviser("");
    setBlock("");
    setSpecialization("");
  };

  const handleApply = () => {
    onApply({ 
      blocks: block ? [block] : [], 
      specializations: specialization ? [specialization] : [] 
    });
    onClose();
  };

  const selects = [
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