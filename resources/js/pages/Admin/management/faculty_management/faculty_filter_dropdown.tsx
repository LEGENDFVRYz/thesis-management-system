import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItemWithLabel } from "@/components/ui/radio-group-with-label";
import { CheckboxWithLabel } from "@/components/ui/checkbox-with-label";

interface FilterState {
  roles: string[];
  facultyType: string;
}

interface FacultyFilterDropdownProps {
  onApply: (filters: FilterState) => void;
  onClose: () => void;
}

export function FacultyFilterDropdown({ onApply, onClose }: FacultyFilterDropdownProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [facultyType, setFacultyType] = useState("");

  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleClear = () => {
    setSelectedRoles([]);
    setFacultyType("");
  };

  const handleApply = () => {
    onApply({ roles: selectedRoles, facultyType });
    onClose();
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
          <CheckboxWithLabel 
            id="thesisCoordinator" 
            label="Thesis Coordinator"
            checked={selectedRoles.includes("Thesis Coordinator")}
            onCheckedChange={() => handleRoleToggle("Thesis Coordinator")}
          />
          <CheckboxWithLabel 
            id="thesisAdviser" 
            label="Thesis Adviser"
            checked={selectedRoles.includes("Thesis Adviser")}
            onCheckedChange={() => handleRoleToggle("Thesis Adviser")}
          />
          <CheckboxWithLabel 
            id="panelMember" 
            label="Panel Member"
            checked={selectedRoles.includes("Panel Member")}
            onCheckedChange={() => handleRoleToggle("Panel Member")}
          />
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
          {["Full-Time", "Part-Time", "External (Non-Faculty)"].map((type) => (
            <RadioGroupItemWithLabel
              key={type}
              id={type}
              value={type}
              label={type}
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