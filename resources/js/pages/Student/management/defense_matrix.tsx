import { useState } from 'react';
import { Calendar, Table as TableIcon, Users, Search, Filter } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import StudentManagementLayout from './index'; // Using your Student Wrapper
import { type BreadcrumbItem } from '@/types';
import { defense_matrix } from '@/routes/student/management';
import FilterSearchSection from '@/components/filter-search-section';

// --- Interfaces based on your Controller Data ---
interface DefenseSchedule {
    defense_matrix_id: number;
    group_code: string;
    thesis_title: string;
    adviser_name: string;
    section: string; // or number
    year_level: number;
    defense_date: string;
    defense_time_range: string;
    members: string; // Comma separated string
    panelists: string; // Comma separated string
}

interface Props {
    schedules: DefenseSchedule[];
    mySection?: string | number;
    yearLevel: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Defense Matrix',
        href: defense_matrix().url,
    },
];

export default function DefenseMatrix({ schedules, mySection, yearLevel }: Props) {
    // --- STATE ---
    const [statusFilter, setStatusFilter] = useState('upcoming');
    const [view, setView] = useState('table');
    const [searchTerm, setSearchTerm] = useState('');

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

    // Calculate proponents count from the comma-separated string
    const getProponentCount = (membersStr: string | null) => {
        if (!membersStr) return 0;
        return membersStr.split(',').length;
    };

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
        <StudentManagementLayout
            breadcrumbs={breadcrumbs}
            title="Defense Matrix" 
            description={`View defense schedules for BSCPE ${yearLevel}-${mySection}`}
        >
            <div className="space-y-6">
                
                {/* 1. Filters & Search */}
                {/* <FilterSearchSection variant="DefenseManagement" /> */}

                {/* 2. Toggle Groups Row */}
                <div className="flex flex-col md:flex-row justify-end items-center gap-4">
                    
                    {/* Status Toggle
                    <ToggleGroup 
                        type="single" 
                        value={statusFilter} 
                        onValueChange={(val) => val && setStatusFilter(val)}
                        className="bg-[#FDF8E7] p-1 rounded-full border border-amber-100 w-fit" 
                    >
                        <ToggleGroupItem 
                            value="upcoming" 
                            className={cn(
                                "h-10 px-6 rounded-full transition-all font-bold text-xs uppercase whitespace-nowrap",
                                statusFilter === 'upcoming' 
                                    ? "bg-[#700000] text-white shadow-md" 
                                    : "text-[#700000] hover:bg-amber-100/50"
                            )}
                        >
                            Upcoming
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                            value="completed" 
                            className={cn(
                                "h-10 px-6 rounded-full transition-all font-bold text-xs uppercase whitespace-nowrap",
                                statusFilter === 'completed' 
                                    ? "bg-[#700000] text-white shadow-md" 
                                    : "text-[#700000] hover:bg-amber-100/50"
                            )}
                        >
                            Completed
                        </ToggleGroupItem>
                    </ToggleGroup> */}

                    {/* View Toggle */}
                    <ToggleGroup 
                        type="single" 
                        value={view} 
                        onValueChange={(val) => val && setView(val)}
                        className="bg-[#FDF8E7] p-1 rounded-full border border-amber-100 w-fit"
                    >
                        <ToggleGroupItem 
                            value="table" 
                            className={cn(
                                "gap-2 h-10 px-6 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all",
                                view === 'table' 
                                    ? "bg-[#700000] text-white shadow-md" 
                                    : "text-[#700000] hover:bg-amber-100/50"
                            )}
                        >
                            <TableIcon className="w-4 h-4" /> Table View
                        </ToggleGroupItem>
                        <ToggleGroupItem 
                            value="calendar" 
                            className={cn(
                                "gap-2 h-10 px-6 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all",
                                view === 'calendar' 
                                    ? "bg-[#700000] text-white shadow-md" 
                                    : "text-[#700000] hover:bg-amber-100/50"
                            )}
                        >
                            <Calendar className="w-4 h-4" /> Calendar View
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>

                {/* 3. Content Area */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {view === 'table' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#800000] text-white uppercase text-[11px] font-bold tracking-[0.1em]">
                                    <tr>
                                        <th className="px-6 py-4 text-center border-r border-white/10">Defense Date</th> 
                                        <th className="px-6 py-4 text-center border-r border-white/10">Timeslot</th>
                                        <th className="px-6 py-4 text-center border-r border-white/10">Group Code</th>
                                        <th className="px-6 py-4 text-center border-r border-white/10">Title</th>
                                        <th className="px-6 py-4 text-center border-r border-white/10">Members</th>
                                        <th className="px-6 py-4 text-center border-r border-white/10">Panelists</th>
                                        <th className="px-6 py-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {schedules && schedules.length > 0 ? (
                                        schedules.map((def, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors whitespace-nowrap">
                                                <td className="px-6 py-4 text-center text-gray-600 leading-tight">
                                                    {def.defense_date}<br/>
                                                </td>
                                                <td className="px-6 py-4 text-center text-gray-600 leading-tight">
                                                    {def.defense_time_range}<br/>
                                                </td>
                                                <td className="px-6 py-4 text-center text-gray-600">
                                                    {def.group_code}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={def.thesis_title}>
                                                    {def.thesis_title}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 text-center max-w-xs truncate">
                                                    {renderList(def.members, 'No members')}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 text-center max-w-xs truncate">
                                                    {renderList(def.panelists, 'No panelists assigned')}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Button 
                                                        variant="outline" 
                                                        onClick={() => openModal(def)} 
                                                        className="rounded-md border-[#800000]/30 text-[#800000] hover:bg-red-50 h-8 px-4 text-[10px] font-bold uppercase shadow-sm"
                                                    >
                                                        View Details
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                                No defense schedules found for your section.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-20 text-center text-gray-400">
                            Calendar View coming soon
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL --- */}
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
    );
}