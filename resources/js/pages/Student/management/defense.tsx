import * as React from 'react';
import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { AppContent } from '@/components/app-content';
import { NavFooter } from '@/components/nav-footer';
import FilterSearchSection from '@/components/filter-search-section';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icon-index';
import { cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Calendar, TableIcon } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { DefenseCalendar } from '@/components/defense-calendar-monthly';
import { BreadcrumbItem, PageHeaderProps } from '@/types';
import StudentManagementLayout from '.';

interface DefenseSchedule {
    defense_matrix_id: number;
    group_code: string;
    thesis_title: string;
    adviser_name: string;
    section: string;
    year_level: number;
    defense_date: string;       
    defense_time_range: string; 
    members: string;            
    panelists: string;          
    status?: string;            
}

/**
 * SAMPLE DATA: Defense schedules for student view
 */
const DEFENSE_SCHEDULES = [
    {
        id: 1,
        title: 'Machine learning something with...',
        stage: 'Methods of Research',
        room: 'Room 315',
        panel: 'Flores, Garcia, Mendoza',
        defense_date: 'November 28, 2025',
        defense_time: '9:00 AM',
        status: 'upcoming',
    },
    {
        id: 2,
        title: 'Machine learning something with...',
        stage: 'Design Project 1',
        room: 'Room 315',
        panel: 'Flores, Garcia, Mendoza',
        defense_date: 'November 28, 2025',
        defense_time: '9:00 AM',
        status: 'upcoming',
    },
    {
        id: 3,
        title: 'Machine learning something with...',
        stage: 'Design Project 2',
        room: 'Room 315',
        panel: 'Flores, Garcia, Mendoza',
        defense_date: 'November 28, 2025',
        defense_time: '9:00 AM',
        status: 'upcoming',
    },
];

// Setup
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Defense Schedule", 
        href: '/student/defense',
    },
];

const pageHeader: PageHeaderProps = {
    title: "Defense Schedule",
    subtitle: "View your upcoming thesis defense schedules",
    icon: (
        // pa correct nalang
        <Icon name="calendarDefault" className="w-8 h-8 text-primary" />
    ),
};


/**
 * MAIN COMPONENT: Student Defense Schedule
 * Displays defense schedules in a simple table format for students
 */
export default function StudentDefense({ schedules }: { schedules: DefenseSchedule[] }) {
    const [statusFilter, setStatusFilter] = useState<string>("upcoming");
    const [view, setView] = useState<string>("table");

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDefense, setSelectedDefense] = useState<DefenseSchedule | null>(null);

    // --- HANDLERS ---
    const openModal = (defense: DefenseSchedule) => {
        setSelectedDefense(defense);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDefense(null);
    };

    const defensesData = schedules || [];

    /**
     * Logic: Filtering data based on status toggle
     * TEMPORARY LOGIC - this will be change by status later
     */
    const filteredData = defensesData?.filter((def) => {
        const defDate = new Date(def.defense_date);
        const today = new Date();
        today.setHours(0,0,0,0); 

        const isUpcoming = defDate >= today;
        
        return statusFilter === "upcoming" ? isUpcoming : !isUpcoming;
    }) || [];

    // --- HELPER TO RENDER STACKED NAMES ---
    const renderList = (str: string | null, emptyMsg: string = '-') => {
        if (!str) return <span className="text-gray-400 italic text-xs">{emptyMsg}</span>;
        
        return (
            <div className="flex flex-col gap-0.5">
                {str.split(', ').map((name, i) => (
                    <span key={i} className="block whitespace-nowrap">
                        {name}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <>
            <StudentManagementLayout
                breadcrumbs={breadcrumbs}
                pageHeader={pageHeader}
            >

                    <Head title="Defense Schedule" />

                    <div className="space-y-6 font-dm pb-10">
                        {/* Global Search & Search Filters */}
                        <FilterSearchSection variant="DefenseManagement" />

                        {/* View Controls: Toggle pill-style UI */}
                        <div className="flex flex-row justify-between items-center gap-4 w-full">

                            {/* Status Filter Toggle Group */}
                            <ToggleGroup
                                type="single"
                                value={statusFilter}
                                onValueChange={(val) => val && setStatusFilter(val)}
                                className="bg-breadcrumb p-1 rounded-full border border-primary/10"
                            >
                                {["upcoming", "completed"].map((status) => (
                                    <ToggleGroupItem
                                        key={status}
                                        value={status}
                                        className={cn(
                                            "h-10 px-6 rounded-full transition-all font-bold text-xs uppercase",
                                            statusFilter === status ? "bg-primary text-white shadow-md" : "text-primary hover:bg-white/50"
                                        )}
                                    >
                                        {status} Defenses
                                    </ToggleGroupItem>
                                ))}
                            </ToggleGroup>

                            {/* Switcher: Table View vs Calendar View */}
                            <ToggleGroup
                                type="single"
                                value={view}
                                onValueChange={(val) => val && setView(val)}
                                className="bg-breadcrumb p-1 rounded-full border border-primary/10"
                            >
                                <ToggleGroupItem
                                    value="table"
                                    className={cn(
                                        "gap-2 h-10 px-6 rounded-full text-xs font-bold uppercase transition-all",
                                        view === 'table' ? "bg-primary text-white shadow-md" : "text-primary hover:bg-white/50"
                                    )}
                                >
                                    <TableIcon className="w-4 h-4" /> Table
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value="calendar"
                                    className={cn(
                                        "gap-2 h-10 px-6 rounded-full text-xs font-bold uppercase transition-all",
                                        view === 'calendar' ? "bg-primary text-white shadow-md" : "text-primary hover:bg-white/50"
                                    )}
                                >
                                    <Calendar className="w-4 h-4" /> Calendar
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>

                        {/* Data Visualization Area */}
                        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                            {view === 'table' ? (
                                <Table>
                                    <TableCaption className="pb-4 font-dm text-alert-desc">End of defense records.</TableCaption>
                                    <TableHeader className="bg-primary">
                                        <TableRow className="hover:bg-transparent border-none">
                                            {["Date and Timeslot", "Group Code", "Title", "Members", "Panelists", "Action"].map((head) => (
                                                <TableHead key={head} className="text-primary-foreground text-center text-[13px] font-bold">
                                                    {head}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-border">
                                        {filteredData.length > 0 ? (
                                            filteredData.map((defense, index) => (
                                                <TableRow key={index} className="hover:bg-accent/5 transition-colors group">
                                                    <TableCell className="text-center leading-tight">
                                                        <div className="flex flex-col text-alert-desc">
                                                            <span className="font-semibold text-alert-default">{defense.defense_date}</span>
                                                            <span className="text-[10px] font-bold uppercase text-alert-desc/70">{defense.defense_time_range}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center text-alert-desc">
                                                        {defense.group_code}
                                                    </TableCell>
                                                    <TableCell className="px-6 text-alert-desc text-center">
                                                        {defense.thesis_title}
                                                    </TableCell>
                                                    <TableCell className="px-6 text-alert-desc text-center">
                                                        {renderList(defense.members, 'No members')}
                                                    </TableCell>
                                                    <TableCell className="px-6 text-alert-desc text-center">
                                                        {renderList(defense.panelists, 'No panelists assigned')}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Button
                                                            variant="tertiary"
                                                            className="tertiary-btn h-8 px-5 text-[11px] font-bold uppercase" 
                                                            onClick={() => openModal(defense)}  // Temporary Function - Shows defense details
                                                        >
                                                            Download Schedule
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="py-20 text-center text-alert-desc font-medium">
                                                    No {statusFilter} defenses found in records.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            ) : (
                                <CardContent className='w-full px-0'>
                                    <DefenseCalendar events={filteredData} value={new Date()} showLegend={false} />
                                </CardContent>
                            )}
                        </div>
                    </div>
            
                {/* --- TEMPORARY MODAL FOR SHOWING DEFENSE DETAILS --- */}
                {isModalOpen && selectedDefense && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]">
                            
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                                        Defense Details
                                    </h2>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">ID #{selectedDefense.defense_matrix_id}</span>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                            {selectedDefense.group_code}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={closeModal} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                    ✖
                                </button>
                            </div>

                            {/* Scrollable Body */}
                            <div className="p-6 overflow-y-auto space-y-8">
                                
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Thesis Title</h3>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-snug">
                                        {selectedDefense.thesis_title}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                    {/* Date & Time */}
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">🗓️</div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase">Schedule</p>
                                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                                                {selectedDefense.defense_date}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {selectedDefense.defense_time_range}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Adviser */}
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">👨‍🏫</div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase">Adviser</p>
                                            <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedDefense.adviser_name}</p>
                                        </div>
                                    </div>

                                    {/* Block */}
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">🎓</div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase">Course / Block</p>
                                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                                                BSCPE {selectedDefense.section}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Proponents List */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                                            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase">Proponents</h3>
                                        </div>
                                        <ul className="space-y-2">
                                            {selectedDefense.members ? (
                                                selectedDefense.members.split(', ').map((name, i) => (
                                                    <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
                                                        {name}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-sm text-gray-400 italic">No proponents listed</li>
                                            )}
                                        </ul>
                                    </div>

                                    {/* Panelists List */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                                            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase">Panelists</h3>
                                        </div>
                                        <ul className="space-y-2">
                                            {selectedDefense.panelists ? (
                                                selectedDefense.panelists.split(', ').map((name, i) => (
                                                    <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500/60"></div>
                                                        {name}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-sm text-gray-400 italic">To be announced</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 flex justify-end">
                                <button 
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </StudentManagementLayout>

            {/* <NavFooter /> */}
        </>
    );
}
