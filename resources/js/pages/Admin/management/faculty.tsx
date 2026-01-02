import { useState, useMemo, useRef } from 'react';
import { Head } from '@inertiajs/react';

//SHARED COMPONENTS 
import { AppHeader } from '@/components/app-header';
import { AppContent } from '@/components/app-content';
import { NavFooter } from '@/components/nav-footer';
import { Button } from '@/components/ui/button';
import { Filter as FilterIcon } from 'lucide-react';
import { Icon } from '@/components/icon-index';
import { SearchBar } from '@/components/filter-search';

// 
import { Dropdown } from './faculty-management-page/faculty_dropdown';
import { FacultyFilterDropdown } from './faculty-management-page/faculty_filter_dropdown';
import { FacultySortDropdown } from './faculty-management-page/faculty_sort_dropdown';
import { AddFacultyModal } from './faculty-management-page/faculty_add_modal';
import { ViewEditFacultyModal } from './faculty-management-page/faculty_viewandedit_modal';
import { FacultyTable } from './faculty-management-page/faculty_table';
import { Faculty, FilterState } from './faculty-management-page/faculty_types';

//SAMPLE DATA
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

export default function FacultyManagement({ faculties }: { faculties?: any[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<FilterState>({ roles: [], facultyType: "" });
    const [sortOption, setSortOption] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [addFacultyOpen, setAddFacultyOpen] = useState(false);
    const [viewEditFacultyOpen, setViewEditFacultyOpen] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
    
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

    const handleViewEdit = (faculty: Faculty) => {
        setSelectedFaculty(faculty);
        setViewEditFacultyOpen(true);
    };

    return (
        <>
            <Head title="Faculty Management" />
            <AppHeader/>
            <AppContent title="Faculty Management" subtitle='Manage Faculty Accounts and Assign Roles'>
                
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
                    <Button onClick={() => setAddFacultyOpen(true)}> + Add Faculty </Button>
                </div>
                
                {/* Data Table */}
                <FacultyTable 
                    data={filteredAndSortedData}
                    onViewEdit={handleViewEdit}
                />
            </AppContent>
            
            {/* Modals */}
            <AddFacultyModal 
                isOpen={addFacultyOpen} 
                onClose={() => setAddFacultyOpen(false)} 
            />
            
            <ViewEditFacultyModal 
                isOpen={viewEditFacultyOpen} 
                onClose={() => {
                    setViewEditFacultyOpen(false);
                    setSelectedFaculty(null);
                }}
                faculty={selectedFaculty}
            />
            
            <NavFooter />
        </>
    );
}