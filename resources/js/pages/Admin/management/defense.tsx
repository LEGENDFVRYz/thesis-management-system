import * as React from 'react';
import { useState } from 'react';
import { Search, Filter, Users, Calendar, Table as TableIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import ManagementLayout from '.';
import { defenses as defensesRoute } from '@/routes/admin/management/index';
import { cn } from '@/lib/utils';
import FilterSearchSection from '@/components/filter-search-section';

// Filter Object
interface FilterParams {
    search: string;
    adviser: string;
    block: string;
}

// Adviser Option
interface AdviserOption {
    id: number;
    name: string;
}

// Main Props Interface
interface DefenseProps {
    defenses: any[];                    // The main table data
    adviserOptions: AdviserOption[];    // Dropdown data
    blockOptions: string[];             // Dropdown data
    filters: FilterParams;              // Current active filters from URL
}

export default function Defense({ defenses, adviserOptions, blockOptions, filters }: DefenseProps) {
    const [statusFilter, setStatusFilter] = useState('upcoming');
    const [view, setView] = useState('table');

    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDefense, setSelectedDefense] = useState<any>(null);

    // --- MODAL HANDLERS ---
    const openModal = (defense: any) => {
        setSelectedDefense(defense);
        setIsModalOpen(true); 
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDefense(null);
    };

    return (
        <ManagementLayout 
            breadcrumbs={[{ title: 'Defense', href: defensesRoute().url }]}
            title="Defense Management" 
            description="Monitor all defense schedules and panel assignments"
        >    
            <div className="space-y-6">
                
                {/* 1. Filters & Search */}
                <FilterSearchSection variant="DefenseManagement" />

                {/* 2. Toggle Groups Row (Pill Style) */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
    
                    {/* Status Toggle - Fit to Content */}
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
                            Upcoming Defense
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
                            Completed Defenses
                        </ToggleGroupItem>
                    </ToggleGroup>

                    {/* View Toggle - Fit to Content */}
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
                                        <th className="px-6 py-4 border-r border-white/10">Defense ID</th>
                                        <th className="px-6 py-4 border-r border-white/10">Title</th>
                                        <th className="px-6 py-4 border-r border-white/10">Proponents</th>
                                        <th className="px-6 py-4 border-r border-white/10">Adviser</th>
                                        <th className="px-6 py-4 border-r border-white/10">Block</th>
                                        <th className="px-6 py-4 border-r border-white/10">Date & Time</th>
                                        <th className="px-6 py-4 border-r border-white/10">Type</th>
                                        <th className="px-6 py-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {defenses && defenses.length > 0 ? (
                                        defenses?.map((def, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors whitespace-nowrap">
                                                
                                                {/* Group Code */}
                                                <td className="px-6 py-4 text-gray-500 font-medium text-xs">
                                                    {def.group_code}
                                                </td>
                                                
                                                {/* Title */}
                                                <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
                                                    {def.thesis_title}
                                                </td>

                                                {/* Proponents Count */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-[#800000] font-bold">
                                                        <Users className="w-4 h-4" />
                                                        {def.proponents_count}
                                                    </div>
                                                </td>

                                                {/* Adviser Name */}
                                                <td className="px-6 py-4 text-gray-600">
                                                    {def.adviser_name}
                                                </td>

                                                {/* Block */}
                                                <td className="px-6 py-4 text-gray-600">
                                                    BSCPE {def.year_level}-{def.block}
                                                </td>

                                                {/* Defense Schedule */}
                                                <td className="px-6 py-4 text-gray-600 text-xs leading-tight">
                                                    {def.defense_date} <br/> {def.defense_time}
                                                </td>

                                                {/* Defense Type Badge */}
                                                <td className="px-6 py-4 text-gray-700 font-medium text-xs">
                                                    {def.defense_type}
                                                </td>
                                                
                                                {/* Action Button */}
                                                <td className="px-6 py-4 text-center">
                                                    <Button variant="outline" onClick={() => openModal(def)} className="rounded-md border-[#800000]/30 text-[#800000] hover:bg-red-50 h-8 px-4 text-[10px] font-bold uppercase shadow-sm">
                                                        View Details
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                                                No defense schedules found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-20 text-center text-gray-400">
                           {/* Calendar content */}
                        </div>
                    )}
                </div>
            </div>
        
            {/* SAMPLE MODAL - REPLACE DESIGN/MODAL COMPONENT LATER */}
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
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Defense ID #{selectedDefense.id}</span>
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
                                {/* SEPARATE DATE */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">🗓️</div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Date</p>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                            {selectedDefense.defense_date}
                                        </p>
                                    </div>
                                </div>

                                {/* SEPARATE TIME */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">⏰</div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Time</p>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                            {selectedDefense.defense_time}
                                        </p>
                                    </div>
                                </div>

                                {/* VENUE */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">📍</div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Venue</p>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                            Room {selectedDefense.defense_room || 'TBA'}
                                        </p>
                                    </div>
                                </div>

                                {/* BLOCK */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">🎓</div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Course / Block</p>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                            BSCPE {selectedDefense.year_level}-{selectedDefense.block}
                                        </p>
                                    </div>
                                </div>

                                {/* ADVISER */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">👨‍🏫</div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Adviser</p>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedDefense.adviser_name}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* PROPONENTS */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase">Proponents</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {selectedDefense.proponent_names ? (
                                            selectedDefense.proponent_names.split(', ').map((name: any, i: number) => (
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

                                {/* PANELISTS */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase">Panelists</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {selectedDefense.panelist_names ? (
                                            selectedDefense.panelist_names.split(', ').map((name: any, i: number) => (
                                                <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500/60"></div>
                                                    {name}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-sm text-gray-400 italic">Pending confirmation</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 flex justify-end">
                            <button 
                                onClick={closeModal}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all shadow-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ManagementLayout>

        // * ===============================================================================================
        // * NOTICE: THIS IS THE BACKEND LOGIC FOR SEARCH & FILTERING - KEEP FOR REFERENCE AND DO NOT DELETE
        // * ===============================================================================================

        // // --- FILTER STATE ---
        // // Initialize with values from URL (filters prop) or defaults
        // const [values, setValues] = useState({
        //     search: filters.search || '',
        //     adviser: filters.adviser || '',
        //     block: filters.block || '',
        // });

        // // Helper to trigger the backend search
        // const handleFilterChange = (key: string, value: string) => {
        //     const newValues = { ...values, [key]: value };
        //     setValues(newValues);

        //     // This reloads the page with ?search=...&adviser=... 
        //     // preserveState: true keeps your scroll position and modal state intact
        //     router.get(window.location.pathname, newValues, {
        //         preserveState: true,
        //         preserveScroll: true,
        //         replace: true, 
        //     });
        // };
        
        // // Reset function
        // const resetFilters = () => {
        //     setValues({ search: '', adviser: '', block: '' });
        //     router.get(window.location.pathname, {}, {
        //         preserveScroll: true,
        //     });
        // };

        // // --- SEARCH & FILTER BAR ---
        // <div className="flex flex-row md:flex-row gap-4 bg-white dark:bg-gray-900 p-4">
            
        //     {/* Search Input */}
        //     <div className="flex-1">
        //         <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
        //             Search Title
        //         </label>
        //         <input
        //             type="text"
        //             placeholder="Search thesis title..."
        //             value={values.search}
        //             onChange={(e) => handleFilterChange('search', e.target.value)}
        //             className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        //         />
        //     </div>

        //     {/* Adviser Dropdown */}
        //     <div className="w-full md:w-64">
        //         <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
        //             Filter by Adviser
        //         </label>
        //         <select
        //             value={values.adviser}
        //             onChange={(e) => handleFilterChange('adviser', e.target.value)}
        //             className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        //         >
        //             <option value="">All Advisers</option>
        //             {adviserOptions.map((adv: any) => (
        //                 <option key={adv.id} value={adv.id}>
        //                     {adv.name}
        //                 </option>
        //             ))}
        //         </select>
        //     </div>

        //     {/* Block Dropdown */}
        //     <div className="w-full md:w-32">
        //         <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
        //             Filter by Block
        //         </label>
        //         <select
        //             value={values.block}
        //             onChange={(e) => handleFilterChange('block', e.target.value)}
        //             className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        //         >
        //             <option value="">All</option>
        //             {blockOptions.map((block) => (
        //                 <option key={block} value={block}>
        //                     Block {block}
        //                 </option>
        //             ))}
        //         </select>
        //     </div>

        //     {/* Reset Button */}
        //     <div className="flex items-end">
        //         <button
        //             onClick={resetFilters}
        //             className="h-10 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
        //         >
        //             Clear Filters
        //         </button>
        //     </div>
        // </div>
    );
}