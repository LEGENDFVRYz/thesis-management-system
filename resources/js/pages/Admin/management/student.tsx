import { useState, useMemo, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';

//SHARED COMPONENTS 
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/filter-search';
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItemWithLabel } from "@/components/ui/radio-group-with-label";
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AppHeader } from '@/components/app-header';
import { AppContent } from '@/components/app-content';
import { NavFooter } from '@/components/nav-footer';
import { Icon } from '@/components/icon-index';
import { GroupCard } from '@/components/ui/card';

import { Table as TableIcon, LayoutGrid } from 'lucide-react';
import { Filter as FilterIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Student {
  studentNumber: string;
  name: string;
  email: string;
  groupCode: string;
  block: string;
  specialization: string;
  adviser: string;
  hasPhoto?: boolean;
}

interface GroupData {
  groupCode: string;
  thesisTitle: string;
  thesisStage: string;
  members: string[];
  adviser: string;
  specialization: string;
  block: string;
}

 //Sample Data
const studentData: Student[] = [
  {
    studentNumber: "2022-00001-MN-0",
    name: "Rena Dela Cruz",
    email: "ronadelacruz@iskolarngbayan.pup.edu.ph",
    groupCode: "3I01",
    block: "BSCPE 3-1",
    specialization: "Machine Learning",
    adviser: "Dr. Robert Dela Cruz",
  },
  {
    studentNumber: "2022-00002-MN-0",
    name: "John Santos",
    email: "johnsantos@iskolarngbayan.pup.edu.ph",
    groupCode: "3I01",
    block: "BSCPE 3-1",
    specialization: "Machine Learning",
    adviser: "Dr. Robert Dela Cruz",
  },
  {
    studentNumber: "2022-00003-MN-0",
    name: "Maria Garcia",
    email: "mariagarcia@iskolarngbayan.pup.edu.ph",
    groupCode: "3I01",
    block: "BSCPE 3-1",
    specialization: "Machine Learning",
    adviser: "Dr. Robert Dela Cruz",
  },
  {
    studentNumber: "2022-00004-MN-0",
    name: "Pedro Reyes",
    email: "pedroreyes@iskolarngbayan.pup.edu.ph",
    groupCode: "3I02",
    block: "BSCPE 3-3",
    specialization: "Big Data Analytics",
    adviser: "Engr. Robert Dela Cruz",
    hasPhoto: true,
  },
  {
    studentNumber: "2022-00005-MN-0",
    name: "Ana Lopez",
    email: "analopez@iskolarngbayan.pup.edu.ph",
    groupCode: "3I02",
    block: "BSCPE 3-3",
    specialization: "Big Data Analytics",
    adviser: "Engr. Robert Dela Cruz",
  },
  {
    studentNumber: "2022-00006-MN-0",
    name: "Carlos Mendoza",
    email: "carlosmendoza@iskolarngbayan.pup.edu.ph",
    groupCode: "3I02",
    block: "BSCPE 3-3",
    specialization: "Big Data Analytics",
    adviser: "Engr. Robert Dela Cruz",
  },
  {
    studentNumber: "2022-00007-MN-0",
    name: "Sofia Torres",
    email: "sofiatorres@iskolarngbayan.pup.edu.ph",
    groupCode: "4I01",
    block: "BSCPE 4-3",
    specialization: "Big Data Analytics",
    adviser: "Dr. Robert Dela Cruz",
  },
  {
    studentNumber: "2022-00008-MN-0",
    name: "Miguel Cruz",
    email: "miguelcruz@iskolarngbayan.pup.edu.ph",
    groupCode: "4I01",
    block: "BSCPE 4-3",
    specialization: "Big Data Analytics",
    adviser: "Dr. Robert Dela Cruz",
    hasPhoto: true,
  },
  {
    studentNumber: "2022-00009-MN-0",
    name: "Isabella Ramos",
    email: "isabellaramos@iskolarngbayan.pup.edu.ph",
    groupCode: "4I01",
    block: "BSCPE 4-3",
    specialization: "Big Data Analytics",
    adviser: "Dr. Robert Dela Cruz",
  },
  {
    studentNumber: "2022-00010-MN-0",
    name: "Luis Fernandez",
    email: "luisfernandez@iskolarngbayan.pup.edu.ph",
    groupCode: "4I02",
    block: "BSCPE 4-2",
    specialization: "Big Data Analytics",
    adviser: "Engr. Robert Dela Cruz",
    hasPhoto: true,
  },
  {
    studentNumber: "2022-00011-MN-0",
    name: "Carmen Diaz",
    email: "carmendiaz@iskolarngbayan.pup.edu.ph",
    groupCode: "4I02",
    block: "BSCPE 4-2",
    specialization: "Big Data Analytics",
    adviser: "Engr. Robert Dela Cruz",
  },
  {
    studentNumber: "2022-00012-MN-0",
    name: "Rafael Silva",
    email: "rafaelsilva@iskolarngbayan.pup.edu.ph",
    groupCode: "4I02",
    block: "BSCPE 4-2",
    specialization: "Big Data Analytics",
    adviser: "Engr. Robert Dela Cruz",
  },
  {
    studentNumber: "2022-00013-MN-0",
    name: "Elena Martinez",
    email: "elenamartinez@iskolarngbayan.pup.edu.ph",
    groupCode: "4I03",
    block: "BSCPE 4-1",
    specialization: "Machine Learning",
    adviser: "Dr. Robert Dela Cruz",
  },
  {
    studentNumber: "2022-00014-MN-0",
    name: "Diego Morales",
    email: "diegomorales@iskolarngbayan.pup.edu.ph",
    groupCode: "4I03",
    block: "BSCPE 4-1",
    specialization: "Machine Learning",
    adviser: "Dr. Robert Dela Cruz",
    hasPhoto: true,
  },
  {
    studentNumber: "2022-00015-MN-0",
    name: "Lucia Herrera",
    email: "luciaherrera@iskolarngbayan.pup.edu.ph",
    groupCode: "4I03",
    block: "BSCPE 4-1",
    specialization: "Machine Learning",
    adviser: "Dr. Robert Dela Cruz",
  },
  {
    studentNumber: "2022-00016-MN-0",
    name: "Antonio Vargas",
    email: "antoniovargas@iskolarngbayan.pup.edu.ph",
    groupCode: "4I04",
    block: "BSCPE 4-6",
    specialization: "System Development",
    adviser: "Engr. Robert Dela Cruz",
    hasPhoto: true,
  },
  {
    studentNumber: "2022-00017-MN-0",
    name: "Gabriela Ortiz",
    email: "gabrielaortiz@iskolarngbayan.pup.edu.ph",
    groupCode: "4I04",
    block: "BSCPE 4-6",
    specialization: "System Development",
    adviser: "Engr. Robert Dela Cruz",
  },
  {
    studentNumber: "2022-00018-MN-0",
    name: "Fernando Castro",
    email: "fernandocastro@iskolarngbayan.pup.edu.ph",
    groupCode: "4I04",
    block: "BSCPE 4-6",
    specialization: "System Development",
    adviser: "Engr. Robert Dela Cruz",
  },
  {
    studentNumber: "2022-00019-MN-0",
    name: "Valentina Ruiz",
    email: "valentinaruiz@iskolarngbayan.pup.edu.ph",
    groupCode: "3I03",
    block: "BSCPE 3-3",
    specialization: "Big Data Analytics",
    adviser: "Dr. Robert Dela Cruz",
  },
  {
    studentNumber: "2022-00020-MN-0",
    name: "Sebastian Flores",
    email: "sebastianflores@iskolarngbayan.pup.edu.ph",
    groupCode: "3I03",
    block: "BSCPE 3-3",
    specialization: "Big Data Analytics",
    adviser: "Dr. Robert Dela Cruz",
    hasPhoto: true,
  },
  {
    studentNumber: "2021-00021-MN-0",
    name: "Camila Jimenez",
    email: "camilajimenez@iskolarngbayan.pup.edu.ph",
    groupCode: "3I03",
    block: "BSCPE 3-3",
    specialization: "Big Data Analytics",
    adviser: "Dr. Robert Dela Cruz",
  },
  {
    studentNumber: "2022-00022-MN-0",
    name: "Mateo Gonzalez",
    email: "mateogonzalez@iskolarngbayan.pup.edu.ph",
    groupCode: "3I04",
    block: "BSCPE 3-4",
    specialization: "Big Data Analytics",
    adviser: "Engr. Robert Dela Cruz",
  },
  {
    studentNumber: "2022-00023-MN-0",
    name: "Natalia Romero",
    email: "nataliaromero@iskolarngbayan.pup.edu.ph",
    groupCode: "3I04",
    block: "BSCPE 3-4",
    specialization: "Big Data Analytics",
    adviser: "Engr. Robert Dela Cruz",
    hasPhoto: true,
  },
  {
    studentNumber: "2022-00024-MN-0",
    name: "Alejandro Suarez",
    email: "alejandrosuarez@iskolarngbayan.pup.edu.ph",
    groupCode: "3I04",
    block: "BSCPE 3-4",
    specialization: "Big Data Analytics",
    adviser: "Engr. Robert Dela Cruz",
  },
  {
    studentNumber: "2022-00025-MN-0",
    name: "Victoria Ramirez",
    email: "victoriaramirez@iskolarngbayan.pup.edu.ph",
    groupCode: "4I05",
    block: "BSCPE 4-3",
    specialization: "Big Data Analytics",
    adviser: "Dr. Robert Dela Cruz",
    hasPhoto: true,
  },
  {
    studentNumber: "2022-00026-MN-0",
    name: "Daniel Medina",
    email: "danielmedina@iskolarngbayan.pup.edu.ph",
    groupCode: "4I05",
    block: "BSCPE 4-3",
    specialization: "Big Data Analytics",
    adviser: "Dr. Robert Dela Cruz",
  },
  {
    studentNumber: "2022-00027-MN-0",
    name: "Andrea Guzman",
    email: "andreaguzman@iskolarngbayan.pup.edu.ph",
    groupCode: "4I05",
    block: "BSCPE 4-3",
    specialization: "Big Data Analytics",
    adviser: "Dr. Robert Dela Cruz",
  },
  {
    studentNumber: "2022-00028-MN-0",
    name: "Pablo Rivera",
    email: "pablorivera@iskolarngbayan.pup.edu.ph",
    groupCode: "4I06",
    block: "BSCPE 4-5",
    specialization: "Computer Networks",
    adviser: "Engr. Robert Dela Cruz",
  },
  {
    studentNumber: "2022-00029-MN-0",
    name: "Laura Nunez",
    email: "lauranunez@iskolarngbayan.pup.edu.ph",
    groupCode: "4I06",
    block: "BSCPE 4-5",
    specialization: "Computer Networks",
    adviser: "Engr. Robert Dela Cruz",
    hasPhoto: true,
  },
  {
    studentNumber: "2022-00030-MN-0",
    name: "Javier Campos",
    email: "javiercampos@iskolarngbayan.pup.edu.ph",
    groupCode: "4I06",
    block: "BSCPE 4-5",
    specialization: "Computer Networks",
    adviser: "Engr. Robert Dela Cruz",
  },
];

interface FilterState {
  blocks: string[];
  specializations: string[];
}

function Dropdown({ 
  isOpen, 
  onClose, 
  children, 
  triggerRef 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  children: React.ReactNode;
  triggerRef: React.RefObject<HTMLButtonElement>;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 z-50"
      style={{ minWidth: '400px' }}
    >
      {children}
    </div>
  );
}

//Sort and Filter
function StudentFilterWrapper({ 
  onApply, 
  onClose 
}: { 
  onApply: (filters: FilterState) => void; 
  onClose: () => void;
}) {
  const [adviser, setAdviser] = useState("");
  const [block, setBlock] = useState("");
  const [specialization, setSpecialization] = useState("");

  const handleClear = () => {
    setAdviser("");
    setBlock("");
    setSpecialization("");
  };

  const handleApply = () => {
    // Convert the filter selections to the FilterState format
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

function StudentSortWrapper({ 
  onApply, 
  onClose 
}: { 
  onApply: (sortOption: string) => void; 
  onClose: () => void;
}) {
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
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="negative" onClick={handleApply}>Apply</Button>
      </div>
    </div>
  );
}

// Sorting for Group Card View
function GroupSortWrapper({ 
  onApply, 
  onClose 
}: { 
  onApply: (sortOption: string) => void; 
  onClose: () => void;
}) {
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
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="negative" onClick={handleApply}>Apply</Button>
      </div>
    </div>
  );
}

export default function StudentManagement({ students }: { students?: any[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<FilterState>({ blocks: [], specializations: [] });
    const [sortOption, setSortOption] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [view, setView] = useState("table");
    
    const sortButtonRef = useRef<HTMLButtonElement>(null);
    const filterButtonRef = useRef<HTMLButtonElement>(null);

    // Grouping students by group code for the group card view
    const groupedData = useMemo(() => {
        const groups: { [key: string]: GroupData } = {};
        
        studentData.forEach(student => {
            if (!groups[student.groupCode]) {
                groups[student.groupCode] = {
                    groupCode: student.groupCode,
                    thesisTitle: "Machine Learning Applications in Healthcare Diagnostics",
                    thesisStage: "Title Proposal",
                    members: [],
                    adviser: student.adviser,
                    specialization: student.specialization,
                    block: student.block
                };
            }
            groups[student.groupCode].members.push(student.name);
        });
        
        return Object.values(groups);
    }, []);

    // Apply filtering and sorting for groups (in group card view)
    const filteredAndSortedGroups = useMemo(() => {
        let result = [...groupedData];

        // Apply block filter
        if (filters.blocks.length > 0) {
            result = result.filter(group =>
                filters.blocks.includes(group.block)
            );
        }

        // Apply specialization filter
        if (filters.specializations.length > 0) {
            result = result.filter(group => 
                filters.specializations.includes(group.specialization)
            );
        }

        // Apply sorting for groups
        if (sortOption === "group-code-asc") {
            result.sort((a, b) => a.groupCode.localeCompare(b.groupCode));
        } else if (sortOption === "group-code-desc") {
            result.sort((a, b) => b.groupCode.localeCompare(a.groupCode));
        } else if (sortOption === "thesis-title-a-z") {
            result.sort((a, b) => a.thesisTitle.localeCompare(b.thesisTitle));
        } else if (sortOption === "thesis-title-z-a") {
            result.sort((a, b) => b.thesisTitle.localeCompare(a.thesisTitle));
        }

        return result;
    }, [groupedData, filters, sortOption]);

    // Apply filtering and sorting
    const filteredAndSortedData = useMemo(() => {
        let result = [...studentData];

        // Apply search
        if (searchQuery) {
            result = result.filter(student =>
                student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.studentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.groupCode.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply block filter
        if (filters.blocks.length > 0) {
            result = result.filter(student =>
                filters.blocks.includes(student.block)
            );
        }

        // Apply specialization filter
        if (filters.specializations.length > 0) {
            result = result.filter(student => 
                filters.specializations.includes(student.specialization)
            );
        }

        // Apply sorting
        if (sortOption === "student-id-asc") {
            result.sort((a, b) => a.studentNumber.localeCompare(b.studentNumber));
        } else if (sortOption === "student-id-desc") {
            result.sort((a, b) => b.studentNumber.localeCompare(a.studentNumber));
        } else if (sortOption === "student-name-a-z") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === "student-name-z-a") {
            result.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortOption === "group-code-asc") {
            result.sort((a, b) => a.groupCode.localeCompare(b.groupCode));
        } else if (sortOption === "group-code-desc") {
            result.sort((a, b) => b.groupCode.localeCompare(a.groupCode));
        }

        return result;
    }, [searchQuery, filters, sortOption]);

    const handleClearFilters = () => {
        setSearchQuery("");
        setFilters({ blocks: [], specializations: [] });
        setSortOption("");
    };

    return (
        <>
            <Head title="Student Management" />
            <AppHeader/>

            <AppContent
                title={
                    <div className="flex items-center gap-2 text-[#FFBD00]">
                        <span className="font-medium">Student Management</span>
                    </div>
                }
                subtitle="View and Manage Student Accounts and Thesis Group Assignments"
            >
                {/* Filter & Search Section */}
                <div className="mb-4">
                    <div className="flex flex-col items-start self-stretch w-full max-w-[1360px] bg-card rounded-[10px] border-[0.8px] border-primary/20 shadow-sm h-[134px] p-[24.8px] gap-4 font-dm">
                        {/* Header */}
                        <div className="flex flex-row items-center gap-2 self-stretch w-full h-6">
                            <FilterIcon className="w-5 h-5 text-primary" />
                            <h2 className="font-dm font-normal text-base leading-6 text-primary">
                                Search, Sort, & Filter
                            </h2>
                        </div>

                        {/* Controls Row */}
                        <div className="flex flex-row items-center gap-[10px] self-stretch w-full">
                            {/* Search Bar */}
                            <div className="flex-1">
                                <SearchBar 
                                    variant="filter-section" 
                                    placeholder="Search by name, email, student number, or group code..." 
                                    value={searchQuery} 
                                    onChange={setSearchQuery} 
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-row items-center gap-[10px]">
                                {/* Sort Button with Dropdown */}
                                <div className="relative">
                                    <Button 
                                        ref={sortButtonRef}
                                        variant="secondary" 
                                        size="icon" 
                                        className="rounded-lg border-none"
                                        onClick={() => {
                                            setSortOpen(!sortOpen);
                                            setFilterOpen(false);
                                        }}
                                    >
                                        <Icon name="sortDefault" size={16} />
                                    </Button>
                                    <Dropdown 
                                        isOpen={sortOpen} 
                                        onClose={() => setSortOpen(false)}
                                        triggerRef={sortButtonRef}
                                    >
                                        {view === 'table' ? (
                                            <StudentSortWrapper 
                                                onApply={setSortOption}
                                                onClose={() => setSortOpen(false)}
                                            />
                                        ) : (
                                            <GroupSortWrapper 
                                                onApply={setSortOption}
                                                onClose={() => setSortOpen(false)}
                                            />
                                        )}
                                    </Dropdown>
                                </div>

                                {/* Filter Button with Dropdown */}
                                <div className="relative">
                                    <Button 
                                        ref={filterButtonRef}
                                        variant="secondary" 
                                        size="icon" 
                                        className="rounded-lg border-none"
                                        onClick={() => {
                                            setFilterOpen(!filterOpen);
                                            setSortOpen(false);
                                        }}
                                    >
                                        <FilterIcon className="w-4 h-4" />
                                    </Button>
                                    <Dropdown 
                                        isOpen={filterOpen} 
                                        onClose={() => setFilterOpen(false)}
                                        triggerRef={filterButtonRef}
                                    >
                                        <StudentFilterWrapper 
                                            onApply={setFilters}
                                            onClose={() => setFilterOpen(false)}
                                        />
                                    </Dropdown>
                                </div>

                                {/* Clear Filter Button */}
                                <Button 
                                    variant="negative" 
                                    className="px-4 py-2 gap-2 h-9 rounded-lg min-w-[101px]"
                                    onClick={handleClearFilters}
                                >
                                    <span className="text-[13.33px] font-medium">Clear Filter</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* View Toggle and Import Button */}
                <div className="flex justify-between items-center mb-6">
                    {/* View Toggle Buttons */}
                    <div className="flex gap-2">
                        <Button
                            variant={view === 'table' ? 'default' : 'outline'}
                            size="sm"
                            className={cn(
                                "gap-2",
                                view === 'table' 
                                    ? "bg-primary text-white hover:bg-primary/90" 
                                    : "border-gray-300 hover:bg-gray-50"
                            )}
                            onClick={() => setView('table')}
                        >
                            <TableIcon className="w-4 h-4" /> Table View
                        </Button>
                        <Button
                            variant={view === 'card' ? 'default' : 'outline'}
                            size="sm"
                            className={cn(
                                "gap-2",
                                view === 'card' 
                                    ? "bg-primary text-white hover:bg-primary/90" 
                                    : "border-gray-300 hover:bg-gray-50"
                            )}
                            onClick={() => setView('card')}
                        >
                            <LayoutGrid className="w-4 h-4" /> Group Card View
                        </Button>
                    </div>

                    {/* Import Button */}
                    <Button>
                        Import
                    </Button>
                </div>

                {/* Results Info */}
                {(searchQuery || filters.blocks.length > 0 || filters.specializations.length > 0) && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 font-['DM_Sans']">
                            Found {filteredAndSortedData.length} student{filteredAndSortedData.length !== 1 ? 's' : ''} matching your filters
                        </p>
                    </div>
                )}

                {/* Data Table */}
                {view === 'table' ? (
                <div className="overflow-x-auto">
                    <div className="min-w-[1360px]">
                        
                        {/* Table Header*/}
                        <div className="grid grid-cols-8 h-10 rounded-t-lg bg-primary transition-colors duration-200 hover:bg-destructive-foreground">
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    Student ID
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    Student Name
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    PUP Webmail
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    Group Code
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    Block
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    Specialization
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    Thesis Adviser
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    Action
                                </span>
                            </div>
                        </div>

                        {/* Table Rows */}
                        {filteredAndSortedData.length > 0 ? (
                            filteredAndSortedData.map((student, index) => (
                                <div
                                    key={`${student.studentNumber}-${index}`}
                                    className="grid grid-cols-8 min-h-10 bg-white border-b border-gray-100 hover:bg-breadcrumb transition-colors"
                                >
                                    {/* Student ID */}
                                    <div className="flex items-center justify-center p-2.5">
                                        <span className="text-black text-center text-[13.33px] font-medium">
                                            {student.studentNumber}
                                        </span>
                                    </div>

                                    {/* Student Name */}
                                    <div className="flex items-center justify-center p-2.5">
                                        <span className="text-center text-[13.33px] font-medium">
                                            {student.name}
                                        </span>
                                    </div>

                                    {/* PUP Webmail */}
                                    <div className="flex items-center justify-center p-2.5">
                                        <p className="text-center text-[13.33px] font-medium truncate leading-tight">
                                            {student.email}
                                        </p>
                                    </div>

                                    {/* Group Code */}
                                    <div className="flex items-center justify-center p-2.5">
                                        <span className="text-sm">
                                            {student.groupCode}
                                        </span>
                                    </div>

                                    {/* Block */}
                                    <div className="flex items-center justify-center p-2.5">
                                        <span className="text-black text-center font-sans text-[13.33px] font-medium">
                                            {student.block}
                                        </span>
                                    </div>

                                    {/* Specialization */}
                                    <div className="flex items-center justify-center p-2.5">
                                        <span className="text-center text-[13.33px] font-medium">
                                            {student.specialization}
                                        </span>
                                    </div>

                                    {/* Thesis Adviser */}
                                    <div className="flex items-center justify-center p-2.5">
                                        <span className="text-center text-[13.33px] font-medium">
                                            {student.adviser}
                                        </span>
                                    </div>

                                    {/* Action */}
                                    <div className="flex items-center justify-center p-2.5">
                                        <Button variant="outline" className='border-primary text-primary'>
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 bg-white">
                                <p className="text-gray-500 font-['DM_Sans']">
                                    No students found matching your search.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-4">
                        {filteredAndSortedGroups.map((group, index) => (
                            <GroupCard
                                key={`${group.groupCode}-${index}`}
                                groupCode={group.groupCode}
                                groupDescription={`${group.block} | ${group.specialization}`}
                                thesisTitle={group.thesisTitle}
                                thesisStage={group.thesisStage}
                                members={group.members}
                                adviserName={group.adviser}
                            />
                        ))}
                    </div>
                )}
            </AppContent>
            <NavFooter />
        </>
    );
}