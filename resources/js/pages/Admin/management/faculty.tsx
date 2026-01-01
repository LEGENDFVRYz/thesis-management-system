import ManagementLayout from '@/pages/Admin/management/index';
import { AppHeader } from '@/components/app-header';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { faculty } from '@/routes/admin/management/index';

//SHARED COMPONENTS 
import { Button } from '@/components/ui/button';
import { NavFooter } from '@/components/nav-footer';
import  FilterSearchSection from '@/components/filter-search-section';
import { Filter1, Filter2, Sort1, Sort2, Sort3, SearchBar, RepoFilter } from '@/components/filter-search';



//ICONS 
import { UsersIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Faculty',
        href: faculty().url,
    },
];

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
    name: "Dr. Robert Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Thesis Adviser"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 002",
    name: "Dr. Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Thesis Coordinator"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    hasPhoto: true,
  },
  {
    id: "FAC - 003",
    name: "Dr. Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Thesis Adviser", "Panel Member"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 004",
    name: "Dr. Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Thesis Adviser", "Panel Member"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    hasPhoto: true,
  },
  {
    id: "FAC - 005",
    name: "Dr. Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Thesis Adviser"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 006",
    name: "Dr. Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Thesis Adviser"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    hasPhoto: true,
  },
  {
    id: "FAC - 007",
    name: "Dr. Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Thesis Adviser"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 008",
    name: "Dr. Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Thesis Adviser"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 009",
    name: "Dr. Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Full-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 010",
    name: "Dr. Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Part-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 011",
    name: "Dr. Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Part-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 012",
    name: "Dr. Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Part-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 013",
    name: "Dr. Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Part-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 014",
    name: "Dr. Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Part-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 015",
    name: "Dr. Robert A. Dela Cruz",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "Part-Time",
    dateAdded: "December 1, 2025",
    initials: "RD",
  },
  {
    id: "FAC - 016",
    name: "Engr. Joseph De Guzman",
    email: "radelacruz@pup.edu.ph",
    roles: ["Panel Member"],
    type: "External (Non-Faculty)",
    dateAdded: "December 1, 2025",
    initials: "JD",
  },
];

export default function DeadlinePage({ faculties }: { faculties: any[] }) {
    return (
        <ManagementLayout 
            breadcrumbs={breadcrumbs}
            title={
                <div className="flex items-center gap-2 text-[#FFBD00]">
                    <UsersIcon className="w-10 h-10 text-primary fill-primary" />
                    <span className="font-medium"> Faculty Management </span>
                </div>
            }
            description="Manage Faculty Accounts and Assign Roles"
        >
             <div>

                {/* 1. Filters & Search with Button */}
                
                <div className="bg-white p-2">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <FilterSearchSection variant="StudentManagement" />
                            <div className="flex justify-end mb-4 py-4">
                                <Button>
                                + Add Faculty
                                </Button>
                            </div>    
                        </div>
                    </div>
                </div>

                {/* 2. Data Table */}
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
                        {facultyData.map((faculty, index) => (
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
                        ))}
                    </div>
                </div>
                
                
                
            </div>
            {/* 3. Navigation Footer */}
                <div className="mt-8 -mx-6">
                    <NavFooter />
                </div>
        </ManagementLayout>
    );
}