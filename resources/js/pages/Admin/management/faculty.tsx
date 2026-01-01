import { useState, useMemo, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { AppHeader } from '@/components/app-header';
import { AppContent } from '@/components/app-content';
import { NavFooter } from '@/components/nav-footer';

//SHARED COMPONENTS 
import { Button } from '@/components/ui/button';
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItemWithLabel } from "@/components/ui/radio-group-with-label";
import { CheckboxWithLabel } from "@/components/ui/checkbox-with-label";
import { Filter as FilterIcon } from 'lucide-react';
import { Icon } from '@/components/icon-index';
import { SearchBar } from '@/components/filter-search';

//ICONS 
import { UsersIcon } from 'lucide-react';

interface Faculty {
  id: string;
  name: string;
  email: string;
  roles: string[];
  type: string;
  dateAdded: string;
  initials?: string;
  hasPhoto?: boolean;
}

const facultyData: Faculty[] = [
  {
    id: "FAC - 001",
    name: "Angelo Dela Cruz",
    email: "aadelacruz@pup.edu.ph",
    roles: ["Thesis Adviser"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    initials: "AD",
  },
  {
    id: "FAC - 002",
    name: "Carlo A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Thesis Coordinator"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    hasPhoto: true,
  },
  {
    id: "FAC - 003",
    name: "Benedict A. Dela Cruz",
    email: "badelacruz@pup.edu.ph",
    roles: ["Thesis Adviser", "Panel Member"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    initials: "BD",
  },
  {
    id: "FAC - 004",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Thesis Adviser", "Panel Member"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    hasPhoto: true,
  },
  {
    id: "FAC - 005",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Thesis Adviser"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 006",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Thesis Adviser"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    hasPhoto: true,
  },
  {
    id: "FAC - 007",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Thesis Adviser"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 008",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Thesis Adviser"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 009",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 010",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Part-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 011",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Part-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 012",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Part-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 013",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Part-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 014",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Part-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 015",
    name: "Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Part-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 016",
    name: "Joseph De Guzman",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "External (Non-Faculty)",
    dateAdded: "December 1, 2025",
    initials: "JD",
  },
];

interface FilterState {
  roles: string[];
  facultyType: string;
}

// Custom Dropdown Wrapper Component
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

// Filter Component (Based on Filter1 from shared components)
function FacultyFilterDropdown({ 
  onApply, 
  onClose 
}: { 
  onApply: (filters: FilterState) => void; 
  onClose: () => void;
}) {
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

// Sort Component (Based on Sort1 from shared components)
function FacultySortDropdown({ 
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

export default function FacultyManagement({ faculties }: { faculties?: any[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<FilterState>({ roles: [], facultyType: "" });
    const [sortOption, setSortOption] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    
    const sortButtonRef = useRef<HTMLButtonElement>(null);
    const filterButtonRef = useRef<HTMLButtonElement>(null);

    // Apply filtering and sorting
    const filteredAndSortedData = useMemo(() => {
        let result = [...facultyData];

        // Apply search
        if (searchQuery) {
            result = result.filter(faculty =>
                faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faculty.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faculty.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply role filter
        if (filters.roles.length > 0) {
            result = result.filter(faculty =>
                faculty.roles.some(role => filters.roles.includes(role))
            );
        }

        // Apply faculty type filter
        if (filters.facultyType) {
            result = result.filter(faculty => faculty.type === filters.facultyType);
        }

        // Apply sorting
        if (sortOption === "faculty-id-asc") {
            result.sort((a, b) => a.id.localeCompare(b.id));
        } else if (sortOption === "faculty-id-desc") {
            result.sort((a, b) => b.id.localeCompare(a.id));
        } else if (sortOption === "faculty-name-a-z") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === "faculty-name-z-a") {
            result.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortOption === "date-oldest") {
            result.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime());
        } else if (sortOption === "date-newest") {
            result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        }

        return result;
    }, [searchQuery, filters, sortOption]);

    const handleClearFilters = () => {
        setSearchQuery("");
        setFilters({ roles: [], facultyType: "" });
        setSortOption("");
    };

    return (
        <>
            <Head title="Faculty Management" />
            <AppHeader variant="admin" />

            <AppContent
                title={
                    <div className="flex items-center gap-2 text-[#FFBD00]">
                        <span className="font-medium">Faculty Management</span>
                    </div>
                }
                subtitle="Manage Faculty Accounts and Assign Roles"
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
                                    placeholder="Search by name, email, or ID..." 
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
                                        <FacultySortDropdown 
                                            onApply={setSortOption}
                                            onClose={() => setSortOpen(false)}
                                        />
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
                                        <FacultyFilterDropdown 
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

                {/* Add Faculty Button */}
                <div className="flex justify-end mb-6">
                    <Button>
                        + Add Faculty
                    </Button>
                </div>

                {/* Results Info */}
                {(searchQuery || filters.roles.length > 0 || filters.facultyType) && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 font-['DM_Sans']">
                            Found {filteredAndSortedData.length} faculty member{filteredAndSortedData.length !== 1 ? 's' : ''} matching your filters
                        </p>
                    </div>
                )}

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <div className="min-w-[1360px]">
                        {/* Table Header */}
                        <div className="grid grid-cols-7 h-10 rounded-t-lg bg-primary">
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    Faculty ID
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    Faculty Name
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    PUP Webmail
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    Role(s)
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    Faculty Type
                                </span>
                            </div>
                            <div className="flex items-center justify-center p-2.5">
                                <span className="text-white text-center font-sans text-[13.33px] font-medium">
                                    Date Added
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
                            filteredAndSortedData.map((faculty) => (
                                <div
                                    key={faculty.id}
                                    className="grid grid-cols-7 min-h-10 bg-white border-b border-gray-100 hover:bg-breadcrumb transition-colors"
                                >
                                    {/* Faculty ID */}
                                    <div className="flex items-center justify-center p-2.5">
                                        <span className="text-black text-center text-[13.33px] font-medium">
                                            {faculty.id}
                                        </span>
                                    </div>

                                    {/* Faculty Name */}
                                    <div className="flex items-center justify-center p-2.5 gap-2">
                                        {faculty.hasPhoto ? (
                                            <img
                                                src=""
                                                alt=""
                                                className="w-8 h-8 rounded-full"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#ECECF0]">
                                                <span className="text-[#0A0A0A] font-arimo text-sm">
                                                    {faculty.initials}
                                                </span>
                                            </div>
                                        )}
                                        <span className="text-[#0A0A0A] text-center text-[13.33px] font-medium">
                                            {faculty.name}
                                        </span>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-center justify-center p-2.5">
                                        <span className="text-[#0A0A0A] text-center text-[13.33px] font-medium">
                                            {faculty.email}
                                        </span>
                                    </div>

                                    {/* Roles */}
                                    <div className="flex items-center justify-center p-2.5 gap-1 flex-wrap">
                                        {faculty.roles.map((role, idx) => (
                                            <span
                                                key={idx}
                                                className={`px-1.5 py-0.5 rounded-lg text-sm ${
                                                    role === "Thesis Coordinator"
                                                        ? "bg-primary text-primary-foreground-2"
                                                        : role === "Thesis Adviser"
                                                        ? "bg-primary-foreground-2 text-primary"
                                                        : "bg-breadcrumb text-primary"
                                                }`}
                                            >
                                                {role}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Faculty Type */}
                                    <div className="flex items-center justify-center p-2.5">
                                        <span
                                            className={`text-center font-sans text-[13.33px] font-medium ${
                                                faculty.type === "External (Non-Faculty)"
                                                    ? "text-primary"
                                                    : "text-black"
                                            }`}
                                        >
                                            {faculty.type}
                                        </span>
                                    </div>

                                    {/* Date Added */}
                                    <div className="flex items-center justify-center p-2.5">
                                        <span className="text-[#0A0A0A] text-center text-[13.33px] font-medium">
                                            {faculty.dateAdded}
                                        </span>
                                    </div>

                                    {/* Action */}
                                    <div className="flex items-center justify-center p-2.5">
                                        <Button variant="outline" className='border-primary text-primary'>
                                            View & Edit
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 bg-white">
                                <p className="text-gray-500 font-['DM_Sans']">
                                    No faculty members found matching your search.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </AppContent>

            <NavFooter />
        </>
    );
}