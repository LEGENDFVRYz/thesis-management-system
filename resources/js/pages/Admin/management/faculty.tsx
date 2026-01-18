import { useState, useMemo, useRef } from 'react';
import { Head } from '@inertiajs/react';
import ManagementLayout from '@/pages/Admin/management/index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Plus } from 'lucide-react';

// SHARED COMPONENTS 
import { NavFooter } from '@/components/nav-footer';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icon-index';
import FilterSearchSection from '@/components/filter-search-section';


// FACULTY COMPONENTS
import { FacultyTable } from '../../../components/temp/faculty_management/faculty_table';
import { Faculty } from '../../../components/temp/faculty_management/faculty_types';
import { AddFacultyModal } from '../../../components/temp/faculty_management/faculty_add_modal';
import { ViewEditFacultyModal } from '../../../components/temp/faculty_management/faculty_viewandedit_modal';
import { FacultyFilterSearch } from '@/components/temp/faculty_management/faculty_filter_search';

// Page Setup
const breadcrumbs: BreadcrumbItem[] = [
    { 
        title: 'Faculty Management', 
        href: '/admin/management/faculty'
    },
];

const pageHeader: PageHeaderProps = {
    title: "Faculty Management",
    subtitle: "Manage Faculty Accounts and Assign Roles",
    icon: (
        // paki coprrect nalang ng icon
        <Icon
            name="proponentsDefault"
            className="w-8 h-8 text-primary"
        />
    ),
};

// INTERFACE
interface RawFaculty {
    faculty_id: string;
    email: string;
    name_prefix: string;
    first_name: string;
    last_name: string;
    suffix: string | null;
    is_regular: number;
    date_added: string;
    roles: string | null;
}


export default function FacultyManagement({ faculties }: { faculties: RawFaculty[] }) {

    // TRANSFORM DATA: Map Laravel props to Frontend Interface
    const processedData: Faculty[] = useMemo(() => {
        return faculties.map((fac) => {
            // Construct full name for display purposes
            const fullName = `${fac.name_prefix} ${fac.first_name} ${fac.last_name} ${fac.suffix || ''}`.trim();

            return {
                id: fac.faculty_id,
                name: fullName, 
                firstName: fac.first_name,
                lastName: fac.last_name,
                prefix: fac.name_prefix,
                suffix: fac.suffix || '',
                email: fac.email,
                roles: fac.roles ? fac.roles.split(', ') : [], 
                type: fac.is_regular ? "Full-time" : "Part-time",
                dateAdded: fac.date_added,
                initials: (fac.first_name[0] + fac.last_name[0]).toUpperCase()
            };
        });
    }, [faculties]);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [addFacultyOpen, setAddFacultyOpen] = useState(false);
    const [viewEditFacultyOpen, setViewEditFacultyOpen] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
    
    const sortButtonRef = useRef<HTMLButtonElement>(null);
    const filterButtonRef = useRef<HTMLButtonElement>(null);

    // Apply search 
    const filteredAndSortedData = useMemo(() => {
        let result = [...processedData];

        // Apply search
        if (searchQuery) {
            result = result.filter(faculty =>
                faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faculty.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faculty.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return result;
    }, [processedData, searchQuery]);

    const handleClearSearch = () => {
        setSearchQuery("");
    };

    const handleViewEdit = (faculty: Faculty) => {
        setSelectedFaculty(faculty);
        setViewEditFacultyOpen(true);
    };

    const handleSortToggle = () => {
        setSortOpen(!sortOpen);
        setFilterOpen(false);
    };

    const handleFilterToggle = () => {
        setFilterOpen(!filterOpen);
        setSortOpen(false);
    };

    return (
        <>
            <ManagementLayout
                breadcrumbs={breadcrumbs}
                pageHeader={pageHeader}
            >
                {/* Filter & Search Section 
                    --- UPDATE: Used the existing Filter-Search component (StudentManagement variant)
                               Sort and filter is different for faculty management*/}
                
                <FilterSearchSection variant="StudentManagement" />

                {/* Self-made Filter & Search Component for Faculty Management */}
                {/* <FacultyFilterSearch 
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onClearSearch={handleClearSearch}
                    sortOpen={sortOpen}
                    filterOpen={filterOpen}
                    onSortToggle={handleSortToggle}
                    onFilterToggle={handleFilterToggle}
                    onSortClose={() => setSortOpen(false)}
                    onFilterClose={() => setFilterOpen(false)}
                />
            
            {/* Add Faculty Button */}
            <div className="flex justify-end mt-6 mb-6">
                <Button onClick={() => setAddFacultyOpen(true)}> 
                    <Plus className="w-4 h-4" />
                    Add Faculty 
                </Button>
            </div>
            
            {/* Faculty Data Table */}
            <FacultyTable 
                data={filteredAndSortedData}
                onViewEdit={handleViewEdit}
            />
            
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
        </ManagementLayout>
        
        {/* <NavFooter /> */}
    </>
    );
}


// PAST CODE: Soon to be resolve by kuru
// import ManagementLayout from '@/pages/Admin/management/index';
// import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
// import { type BreadcrumbItem } from '@/types';
// import { Head } from '@inertiajs/react';
// import { faculty } from '@/routes/admin/management/index';

// const breadcrumbs: BreadcrumbItem[] = [
//     {
//         title: 'Faculty',
//         href: faculty().url,
//     },
// ];

// export default function DeadlinePage({ faculties }: { faculties: any[] }) {
//     return (
//         <ManagementLayout 
//             breadcrumbs={breadcrumbs}
//             title="Faculty" 
//             description="Manage Faculty Accounts and Assign Roles"
//         >

//             {/*
//             * =============================================================================
//             * NOTICE: TEMPORARY UI / PLACEHOLDER DESIGN
//             * =============================================================================
//             * The layout and styles in this file are temporary placeholders intended solely
//             * to demonstrate backend logics, data rendering, and verify CRUD functionality.
//             * =============================================================================
//             */}
            
//             <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full text-left text-sm whitespace-nowrap">
//                         <thead className="uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
//                             <tr>
//                                 <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Faculty ID</th>
//                                 <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Name</th>
//                                 <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Email</th>
//                                 <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Roles</th>
//                                 <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Type</th>
//                                 <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Date Added</th>
//                             </tr>
//                         </thead>
                        
//                         <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                             {faculties && faculties.length > 0 ? (
//                                 faculties.map((fac, index) => (
//                                     <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
//                                         <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
//                                             {fac.faculty_id}
//                                         </td>
                                        
//                                         <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
//                                             <div className="font-medium text-gray-900 dark:text-gray-100">{fac.faculty_name}</div>
//                                         </td>
                                        
//                                         <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
//                                             {fac.email}
//                                         </td>
                                        
//                                         {/* Roles Column: Parsing the comma-separated string into badges */}
//                                         <td className="px-6 py-4">
//                                             {fac.roles ? (
//                                                 <div className="flex flex-wrap gap-1">
//                                                     {fac.roles.split(', ').map((role: string, idx: number) => (
//                                                         <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
//                                                             {role}
//                                                         </span>
//                                                     ))}
//                                                 </div>
//                                             ) : (
//                                                 <span className="text-gray-400 italic">No Roles</span>
//                                             )}
//                                         </td>
                                        
//                                         {/* Type Column: Conditional styling for Full-time vs Part-time */}
//                                         <td className="px-6 py-4">
//                                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
//                                                 ${fac.faculty_type === 'Full-time' 
//                                                     ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
//                                                     : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
//                                                 }`}>
//                                                 {fac.faculty_type}
//                                             </span>
//                                         </td>
                                        
//                                         <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
//                                             {fac.date_added}
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
//                                         No faculty members found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </ManagementLayout>
//     );
// }
