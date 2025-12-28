import { useState } from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItemWithLabel } from "@/components/ui/radio-group-with-label";
import { CheckboxWithLabel } from "@/components/ui/checkbox-with-label";
import { Button } from "@/components/ui/button"; 
import { Search } from 'lucide-react';


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




export function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex items-center w-full relative" data-name="Search bar">
      {/* Search input field */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="flex-grow h-[44px] bg-white rounded-l-md border border-gray-400 px-3 text-gray-500 text-[16px] font-medium focus:outline-none"
        style={{ fontFamily: "var(--font-dm, 'DM Sans')", fontVariationSettings: "'opsz' 14" }}
      />

      {/* Search button */}
      <div className="flex items-center justify-center h-[44px] w-[46px] bg-primary rounded-r-md cursor-pointer">
        <Search className="w-6 h-6 text-white" />
      </div>
    </div>
  );
}
