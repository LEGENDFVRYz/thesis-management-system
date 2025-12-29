import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ManagementLayout from '.';
import { defenses } from '@/routes/admin/management/index';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Defense',
        href: defenses().url,
    },
];

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
interface DashboardProps {
    defenses: any[];             // The main table data
    adviserOptions: AdviserOption[]; // Dropdown data
    blockOptions: string[];      // Dropdown data
    filters: FilterParams;       // Current active filters from URL
}

export default function Dashboard({ defenses, adviserOptions, blockOptions, filters }: DashboardProps) {
    
    // --- MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDefense, setSelectedDefense] = useState<any>(null);

    // --- FILTER STATE ---
    // Initialize with values from URL (filters prop) or defaults
    const [values, setValues] = useState({
        search: filters.search || '',
        adviser: filters.adviser || '',
        block: filters.block || '',
    });

    // Helper to trigger the backend search
    const handleFilterChange = (key: string, value: string) => {
        const newValues = { ...values, [key]: value };
        setValues(newValues);

        // This reloads the page with ?search=...&adviser=... 
        // preserveState: true keeps your scroll position and modal state intact
        router.get(window.location.pathname, newValues, {
            preserveState: true,
            preserveScroll: true,
            replace: true, 
        });
    };
    
    // Reset function
    const resetFilters = () => {
        setValues({ search: '', adviser: '', block: '' });
        router.get(window.location.pathname, {}, {
            preserveScroll: true,
        });
    };

    const openModal = (defense: any) => { setSelectedDefense(defense); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setSelectedDefense(null); };
    
    return (
        <ManagementLayout 
            breadcrumbs={breadcrumbs}
            title="Defense Management" 
            description="Monitor all defense schedules and panel assignments"
        >
            
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <div className="overflow-x-auto">

                    {/* --- SEARCH & FILTER BAR - TEMPORARY DESIGN --- */}
                    <div className="flex flex-row md:flex-row gap-4 bg-white dark:bg-gray-900 p-4">
                        
                        {/* Search Input */}
                        <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                                Search Title
                            </label>
                            <input
                                type="text"
                                placeholder="Search thesis title..."
                                value={values.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Adviser Dropdown */}
                        <div className="w-full md:w-64">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                                Filter by Adviser
                            </label>
                            <select
                                value={values.adviser}
                                onChange={(e) => handleFilterChange('adviser', e.target.value)}
                                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">All Advisers</option>
                                {adviserOptions.map((adv: any) => (
                                    <option key={adv.id} value={adv.id}>
                                        {adv.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Block Dropdown */}
                        <div className="w-full md:w-32">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                                Filter by Block
                            </label>
                            <select
                                value={values.block}
                                onChange={(e) => handleFilterChange('block', e.target.value)}
                                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">All</option>
                                {blockOptions.map((block) => (
                                    <option key={block} value={block}>
                                        Block {block}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Reset Button */}
                        <div className="flex items-end">
                            <button
                                onClick={resetFilters}
                                className="h-10 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    {/* --- TABLE SECTION - TEMPORARY DESIGN --- */}
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Group Code</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Thesis Title</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Proponents</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Adviser</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Block</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Schedule</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Type</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">Action</th>
                            </tr>
                        </thead>
                        
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {defenses && defenses.length > 0 ? (
                                defenses.map((def, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        
                                        {/* Group Code Badge */}
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                {def.group_code}
                                            </span>
                                        </td>

                                        {/* Title: Allowed to wrap if long, limited width */}
                                        <td className="px-6 py-4 text-gray-900 dark:text-gray-100 max-w-xs whitespace-normal truncate">
                                            <div className="line-clamp-2" title={def.thesis_title}>
                                                {def.thesis_title}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                            {def.proponents_count}
                                        </td>

                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            {def.adviser_name}
                                        </td>

                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            BSCPE {def.year_level}-{def.block}  
                                        </td>

                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                            <div className="font-medium text-gray-500 dark:text-gray-100">
                                                {def.defense_date}
                                            </div>
                                            <div className="text-xs text-gray-500 text-center">
                                                {def.defense_time}
                                            </div>
                                        </td>

                                        {/* Defense Type Badge */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${def.defense_type.includes('MOR') 
                                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                                                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                                                }`}>
                                                {def.defense_type}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => openModal(def)}
                                                className="inline-flex items-center justify-center rounded-md text-sm text-gray-500 dark:text-gray-100 font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                        No defense schedules found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* TEMPORARY MODAL TO SHOW DEFENSE DETAILS - CHANGE THE DESIGN LATER :>*/}
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
                                {/* 1. SEPARATE DATE */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">🗓️</div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Date</p>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                            {selectedDefense.defense_date}
                                        </p>
                                    </div>
                                </div>

                                {/* 2. SEPARATE TIME */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">⏰</div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Time</p>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                            {selectedDefense.defense_time}
                                        </p>
                                    </div>
                                </div>

                                {/* 3. VENUE */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">📍</div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Venue</p>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                            Room {selectedDefense.defense_room || 'TBA'}
                                        </p>
                                    </div>
                                </div>

                                {/* 4. BLOCK */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">🎓</div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Course / Block</p>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                            BSCPE {selectedDefense.year_level}-{selectedDefense.block}
                                        </p>
                                    </div>
                                </div>

                                {/* 5. ADVISER */}
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">👨‍🏫</div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Adviser</p>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedDefense.adviser_name}</p>
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

                                {/* Panelists List */}
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
    );
}
