import * as React from 'react';
import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { AppContent } from '@/components/app-content';
import { NavFooter } from '@/components/nav-footer';
import { defenses as defensesRoute } from '@/routes/admin/management/index';
import FilterSearchSection from '@/components/filter-search-section';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icon-index';
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Calendar, TableIcon, X } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { DefenseCalendar } from '@/components/defense-calendar-monthly';

// INTERFACE
export interface Panelist {
  faculty_id: number;
  name_prefix: string;
  first_name: string;
  last_name: string;
}
export interface Defense {
  id: number;
  defense_room: string;
  thesis_title: string;
  block: string;
  group_code: string;
  defense_date: string;
  defense_time: string;
  defense_type: string;
  year_level: number;
  adviser_name: string;
  proponents_count: number;
  proponent_names: string;
  panelists: Panelist[];
  status: string;
}

/* SUB-COMPONENT: InfoField */
const InfoField = ({ label, value, icon, className = "" }: { label: string, value: React.ReactNode, icon?: string, className?: string }) => (
    <div className={cn("flex flex-col gap-1", className)}>
        <span className="text-base font-bold text-primary">{label}</span>
        <div className="flex items-center gap-2 text-foreground">
            {icon && <Icon name={icon as any} size={16} />}
            <span className={cn("font-medium", icon ? "text-sm" : "text-base")}>
                {value || <span className="text-muted-foreground italic">Not specified</span>}
            </span>
        </div>
    </div>
);


/**
 * SUB-COMPONENT: DefenseDetailsModal
 * Displays an overlay with comprehensive information regarding a specific defense.
 * Utilizes the custom scrollbar and theme variables from global.css.
 */
function DefenseDetailsModal({ open, onOpenChange, data }: { open: boolean, onOpenChange: (open: boolean) => void, data: Defense | null }) {
    if (!data) return null;

    // Helper to turn CSV strings into arrays for the UI tags
    const proponentList = data.proponent_names ? data.proponent_names.split(', ') : [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="gap-0 w-[900px] h-[605px] max-w-none bg-background rounded-[10px] border-[0.8px] border-border shadow-lg p-0 font-dm overflow-hidden">
                {/* Modal Header: Title and Description */}
                <div className="px-6 py-[17px] border-b border-border flex items-start justify-between bg-background z-20">
                    <div className="flex flex-col gap-1">
                        <DialogTitle className="text-alert-default text-xl">Defense Details</DialogTitle>
                        <DialogDescription className="text-[15px] font-medium text-alert-desc">Complete information about the thesis defense</DialogDescription>
                    </div>
                    <DialogClose className="opacity-70 hover:opacity-100"><X className="h-5 w-5 text-alert-desc" /></DialogClose>
                </div>

                {/* Modal Body: Scrollable content area */}
                <div className="p-6 flex flex-col gap-5 overflow-y-auto h-[calc(605px-85px)] custom-scrollbar">
                    <div className="flex items-center justify-between">
                        <InfoField label="Defense ID" value={`DEF-${data.group_code || data.id}`} />
                        {/* Status Badge */}
                        <div className={cn("bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs font-medium h-[21.59px] flex items-center capitalize", 
                            data.status === 'completed' 
                                ? "bg-green-600 text-white" // Change this color accordingly - temporary color only
                                : "bg-primary text-primary-foreground"
                        )}>
                            {data.status === 'completed' ? "Completed" : "Upcoming"}
                        </div>
                    </div>

                    <InfoField label="Thesis Title" value={data.thesis_title} className="leading-tight" />

                    <div className="grid grid-cols-3 gap-6">
                        <InfoField label="Date" value={data.defense_date || "TBA"} icon="calendarDefault" />
                        <InfoField label="Time" value={data.defense_time || "TBA"} />
                        <InfoField label="Venue" value={"Room " + data.defense_room + ", CEA" || "TBA"} />
                    </div>

                    {/* Proponents Section: Maps proponent names into rounded badges */}
                    <div className="flex flex-col gap-2">
                        <span className="text-base font-bold text-primary">Proponents</span>
                        <div className="flex flex-wrap gap-2">
                            { proponentList.length > 0 ? proponentList.map((name, i) => (
                                <div key={i} className="px-4 h-8 flex items-center bg-primary-foreground-2/20 border border-primary-foreground-2/30 rounded-full">
                                    <span className="text-sm font-medium">{name}</span>
                                </div>
                            )) : (
                                <span className="text-sm italic text-muted-foreground">No proponents listed</span>
                            )}
                        </div>
                    </div>

                    {/* Defense Panel: Lists panel members */}
                    <div className="flex flex-col gap-2 pb-4">
                        <span className="text-base font-bold text-primary">Defense Panel</span>
                        <div className="flex flex-col gap-2">
                            { data.panelists && data.panelists.length > 0 ?
                                data.panelists.map((panel) => (
                                    <div key={panel.faculty_id} className="flex items-center gap-3 p-[10px] bg-muted/30 rounded-[4px] border border-border">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold text-primary">{panel.first_name[0]}{panel.last_name[0]}</span>
                                        </div>
                                        <span className="text-base font-medium text-foreground">{panel.name_prefix} {panel.first_name} {panel.last_name}</span>
                                    </div>
                                )) : (
                                    <span className="text-sm italic text-muted-foreground">No panelists listed</span>
                                )
                            }
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/**
 * MAIN COMPONENT: DefenseTable
 * Orchestrates the Defense Management view, handling filtering, 
 * layout switching (Table vs Calendar), and detailed data inspection.
 */
export default function DefenseTable({ defenses }: { defenses: Defense[] }) {
    const [selectedDef, setSelectedDef] = useState<Defense | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // State for UI filters and view modes
    const [statusFilter, setStatusFilter] = useState<string>("upcoming");
    const [view, setView] = useState<string>("table");

    /**
     * Logic: UseMemo filters data based on the statusFilter state.
     * Uses MOCK_DEFENSES if the passed 'defenses' prop is empty.
     */
    const displayData = useMemo(() => {
        const sourceData = (defenses?.length > 0 && defenses[0].title) ? defenses : MOCK_DEFENSES;
        return sourceData.filter(def => {
            const status = def.status?.toLowerCase() || "upcoming";
            return statusFilter === "upcoming" ? (status === "upcoming") : status === "completed";
        });
    }, [defenses, statusFilter]);

    const handleViewDetails = (def: Defense) => {
        setSelectedDef(def);
        setIsModalOpen(true);
    };

     /**
     * Logic: Filtering data based on status toggle
     */
    const filteredData = defenses?.filter((def) => {
        const status = def.status?.toLowerCase();
        return statusFilter === "upcoming" ? (status === "upcoming" || !status) : status === "completed";
    }) || [];

    /**
     * Configuration: Columns for the table.
     * Rendering logic is centralized here for better maintainability.
     */
    const columns = [
        { label: "ID", render: (d: Defense) => d.id },
        { label: "Title", className: "px-6 text-left max-w-[280px] truncate", render: (d: Defense) => d.title },
        { label: "Proponents", render: (d: Defense) => (
            <div className="flex items-center justify-center gap-2 font-bold text-primary">
                <Icon name="proponentsDefault" size={18} />
                <span>{d.proponents_count || d.proponentList?.length || '0'}</span>
            </div>
        )},
        { label: "Adviser", className: "px-6", render: (d: Defense) => d.adviser },
        { label: "Block", render: (d: Defense) => d.block },
        { label: "Date & Time", render: (d: Defense) => (
            <div className="flex flex-col text-alert-desc">
                <span className="font-semibold text-alert-default">{d.defense_date}</span>
                <span className="text-[10px] font-bold uppercase opacity-60">{d.defense_time}</span>
            </div>
        )},
        { label: "Type", render: (d: Defense) => d.type || 'Title Defense' },
    ];

    return (
        <>
            <Head title="Defense Management" />
            <AppLayout breadcrumbs={[{ title: 'Management', href: '/admin/management' }, { title: 'Defense', href: defensesRoute().url }]}>
                <AppContent title="Defense Management" subtitle="Monitor schedules and assignments" icon={<Icon name="calendarDefault" className="w-8 h-8 text-primary" />} variant="header">
                    <div className="space-y-6 font-dm pb-10 flex flex-col items-center w-full">
                        
                        {/* Search and Advanced Filter Section */}
                        <FilterSearchSection variant="DefenseManagement" />
                        
                        {/* Control Bar: View Switcher and Status Toggles */}
                        <div className="w-full max-w-[1360px] mx-auto flex justify-between">
                            {/* Status Filter (Upcoming vs Completed) */}
                            <ToggleGroup type="single" value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)} className="bg-breadcrumb p-1 rounded-full border border-primary/10">
                                {["upcoming", "completed"].map(s => (
                                    <ToggleGroupItem key={s} value={s} className={cn("h-10 px-6 rounded-full font-bold text-xs uppercase whitespace-nowrap", statusFilter === s ? "bg-primary text-white shadow-md" : "text-primary")}>{s} Defenses</ToggleGroupItem>
                                ))}
                            </ToggleGroup>

                            {/* View Switcher (Table vs Calendar) */}
                            <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v)} className="bg-breadcrumb p-1 rounded-full border border-primary/10">
                                <ToggleGroupItem value="table" className={cn("gap-2 h-10 px-6 rounded-full text-xs font-bold uppercase", view === 'table' ? "bg-primary text-white" : "text-primary")}><TableIcon className="w-4 h-4" /> Table</ToggleGroupItem>
                                <ToggleGroupItem value="calendar" className={cn("gap-2 h-10 px-6 rounded-full text-xs font-bold uppercase", view === 'calendar' ? "bg-primary text-white" : "text-primary")}><Calendar className="w-4 h-4" /> Calendar</ToggleGroupItem>
                            </ToggleGroup>
                        </div>

                        {/* Data Visualization Container */}
                        <div className="w-full max-w-[1360px] mx-auto rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                            {view === 'table' ? (
                                <Table>
                                    <TableCaption className="pb-4 font-dm text-alert-desc">End of defense records.</TableCaption>
                                    <TableHeader className="bg-primary">
                                        <TableRow className="hover:bg-transparent border-none">
                                            {["ID", "Title", "Proponents", "Adviser", "Block", "Date & Time", "Type", "Action"].map((head) => (
                                                <TableHead key={head} className="text-primary-foreground text-center text-[13px] font-bold">
                                                    {head}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-border">
                                        {filteredData.length > 0 ? (
                                            filteredData.map((def, index) => (
                                                <TableRow key={index} className="hover:bg-accent/5 transition-colors group">
                                                    <TableCell className="text-center text-alert-desc font-medium">
                                                        {def.group_code}
                                                    </TableCell>
                                                    <TableCell className="px-6 text-foreground max-w-[280px] truncate font-medium text-left">
                                                        {def.thesis_title || 'Cannot Retrieve Title'}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-2 font-bold text-primary">
                                                            <Icon name="proponentsDefault" size={18} />
                                                            <span>{def.proponents_count || '0'}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-6 text-alert-desc text-left">
                                                        {def.adviser_name || 'Dr. Cherry D. Casuat'}
                                                    </TableCell>
                                                    <TableCell className="text-center text-alert-desc">
                                                        BSCPE {def.year_level}-{def.block}
                                                    </TableCell>
                                                    <TableCell className="text-center leading-tight">
                                                        <div className="flex flex-col text-alert-desc">
                                                            <span className="font-semibold text-alert-default">{def.defense_date}</span>
                                                            <span className="text-[10px] font-bold uppercase text-alert-desc/70">{def.defense_time}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center text-alert-desc">
                                                        {def.defense_type || 'Title Defense'}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {/* Using custom .tertiary-btn class defined in base layer */}
                                                        <Button 
                                                            variant="tertiary" 
                                                            className="tertiary-btn h-8 px-5 text-[11px] font-bold uppercase" 
                                                            onClick={() => handleViewDetails(def)}
                                                        >
                                                            View Details
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={8} className="py-20 text-center text-alert-desc font-medium">
                                                    No {statusFilter} defenses found in records.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            ) : (
                                /* CALENDAR VIEW: Shows defense events in a monthly calendar layout */
                                <CardContent className='w-full px-0'><DefenseCalendar value={new Date()} /></CardContent>
                            )}
                        </div>
                    </div>
                </AppContent>
            </AppLayout>
            <NavFooter />
            {/* Modal portal for viewing full defense details */}
            <DefenseDetailsModal open={isModalOpen} onOpenChange={setIsModalOpen} data={selectedDef} />
        </>
    );
}


// PAST CODE: (soon to be resolved by kuru)
// import * as React from 'react';
// import { useState } from 'react';
// import { Search, Filter, Users, Calendar, Table as TableIcon } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
// import ManagementLayout from '.';
// import { defenses as defensesRoute } from '@/routes/admin/management/index';
// import { cn } from '@/lib/utils';
// import FilterSearchSection from '@/components/filter-search-section';

// // Filter Object
// interface FilterParams {
//     search: string;
//     adviser: string;
//     block: string;
// }

// // Adviser Option
// interface AdviserOption {
//     id: number;
//     name: string;
// }

// // Main Props Interface
// interface DefenseProps {
//     defenses: any[];                    // The main table data
//     adviserOptions: AdviserOption[];    // Dropdown data
//     blockOptions: string[];             // Dropdown data
//     filters: FilterParams;              // Current active filters from URL
// }

// export default function Defense({ defenses, adviserOptions, blockOptions, filters }: DefenseProps) {
//     const [statusFilter, setStatusFilter] = useState('upcoming');
//     const [view, setView] = useState('table');

//     // --- MODAL STATE ---
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedDefense, setSelectedDefense] = useState<any>(null);

//     // --- MODAL HANDLERS ---
//     const openModal = (defense: any) => {
//         setSelectedDefense(defense);
//         setIsModalOpen(true); 
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setSelectedDefense(null);
//     };

//     return (
//         <ManagementLayout 
//             breadcrumbs={[{ title: 'Defense', href: defensesRoute().url }]}
//             title="Defense Management" 
//             description="Monitor all defense schedules and panel assignments"
//         >    
//             <div className="space-y-6">
                
//                 {/* 1. Filters & Search */}
//                 <FilterSearchSection variant="DefenseManagement" />

//                 {/* 2. Toggle Groups Row (Pill Style) */}
//                 <div className="flex flex-col md:flex-row justify-between items-center gap-4">
    
//                     {/* Status Toggle - Fit to Content */}
//                     <ToggleGroup 
//                         type="single" 
//                         value={statusFilter} 
//                         onValueChange={(val) => val && setStatusFilter(val)}
//                         className="bg-[#FDF8E7] p-1 rounded-full border border-amber-100 w-fit" 
//                     >
//                         <ToggleGroupItem 
//                             value="upcoming" 
//                             className={cn(
//                                 "h-10 px-6 rounded-full transition-all font-bold text-xs uppercase whitespace-nowrap",
//                                 statusFilter === 'upcoming' 
//                                     ? "bg-[#700000] text-white shadow-md" 
//                                     : "text-[#700000] hover:bg-amber-100/50"
//                             )}
//                         >
//                             Upcoming Defense
//                         </ToggleGroupItem>
//                         <ToggleGroupItem 
//                             value="completed" 
//                             className={cn(
//                                 "h-10 px-6 rounded-full transition-all font-bold text-xs uppercase whitespace-nowrap",
//                                 statusFilter === 'completed' 
//                                     ? "bg-[#700000] text-white shadow-md" 
//                                     : "text-[#700000] hover:bg-amber-100/50"
//                             )}
//                         >
//                             Completed Defenses
//                         </ToggleGroupItem>
//                     </ToggleGroup>

//                     {/* View Toggle - Fit to Content */}
//                     <ToggleGroup 
//                         type="single" 
//                         value={view} 
//                         onValueChange={(val) => val && setView(val)}
//                         className="bg-[#FDF8E7] p-1 rounded-full border border-amber-100 w-fit"
//                     >
//                         <ToggleGroupItem 
//                             value="table" 
//                             className={cn(
//                                 "gap-2 h-10 px-6 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all",
//                                 view === 'table' 
//                                     ? "bg-[#700000] text-white shadow-md" 
//                                     : "text-[#700000] hover:bg-amber-100/50"
//                             )}
//                         >
//                             <TableIcon className="w-4 h-4" /> Table View
//                         </ToggleGroupItem>
//                         <ToggleGroupItem 
//                             value="calendar" 
//                             className={cn(
//                                 "gap-2 h-10 px-6 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all",
//                                 view === 'calendar' 
//                                     ? "bg-[#700000] text-white shadow-md" 
//                                     : "text-[#700000] hover:bg-amber-100/50"
//                             )}
//                         >
//                             <Calendar className="w-4 h-4" /> Calendar View
//                         </ToggleGroupItem>
//                     </ToggleGroup>
//                 </div>

//                 {/* 3. Content Area */}
//                 <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//                     {view === 'table' ? (
//                         <div className="overflow-x-auto">
//                             <table className="w-full text-left text-sm">
//                                 <thead className="bg-[#800000] text-white uppercase text-[11px] font-bold tracking-[0.1em]">
//                                     <tr>
//                                         <th className="px-6 py-4 border-r border-white/10">Defense ID</th>
//                                         <th className="px-6 py-4 border-r border-white/10">Title</th>
//                                         <th className="px-6 py-4 border-r border-white/10">Proponents</th>
//                                         <th className="px-6 py-4 border-r border-white/10">Adviser</th>
//                                         <th className="px-6 py-4 border-r border-white/10">Block</th>
//                                         <th className="px-6 py-4 border-r border-white/10">Date & Time</th>
//                                         <th className="px-6 py-4 border-r border-white/10">Type</th>
//                                         <th className="px-6 py-4 text-center">Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-100">
//                                     {defenses && defenses.length > 0 ? (
//                                         defenses?.map((def, index) => (
//                                             <tr key={index} className="hover:bg-gray-50 transition-colors whitespace-nowrap">
                                                
//                                                 {/* Group Code */}
//                                                 <td className="px-6 py-4 text-gray-500 font-medium text-xs">
//                                                     {def.group_code}
//                                                 </td>
                                                
//                                                 {/* Title */}
//                                                 <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
//                                                     {def.thesis_title}
//                                                 </td>

//                                                 {/* Proponents Count */}
//                                                 <td className="px-6 py-4">
//                                                     <div className="flex items-center gap-2 text-[#800000] font-bold">
//                                                         <Users className="w-4 h-4" />
//                                                         {def.proponents_count}
//                                                     </div>
//                                                 </td>

//                                                 {/* Adviser Name */}
//                                                 <td className="px-6 py-4 text-gray-600">
//                                                     {def.adviser_name}
//                                                 </td>

//                                                 {/* Block */}
//                                                 <td className="px-6 py-4 text-gray-600">
//                                                     BSCPE {def.year_level}-{def.block}
//                                                 </td>

//                                                 {/* Defense Schedule */}
//                                                 <td className="px-6 py-4 text-gray-600 text-xs leading-tight">
//                                                     {def.defense_date} <br/> {def.defense_time}
//                                                 </td>

//                                                 {/* Defense Type Badge */}
//                                                 <td className="px-6 py-4 text-gray-700 font-medium text-xs">
//                                                     {def.defense_type}
//                                                 </td>
                                                
//                                                 {/* Action Button */}
//                                                 <td className="px-6 py-4 text-center">
//                                                     <Button variant="outline" onClick={() => openModal(def)} className="rounded-md border-[#800000]/30 text-[#800000] hover:bg-red-50 h-8 px-4 text-[10px] font-bold uppercase shadow-sm">
//                                                         View Details
//                                                     </Button>
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
//                                                 No defense schedules found.
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     ) : (
//                         <div className="p-20 text-center text-gray-400">
//                            {/* Calendar content */}
//                         </div>
//                     )}
//                 </div>
//             </div>
        
//             {/* SAMPLE MODAL - REPLACE DESIGN/MODAL COMPONENT LATER */}
//             {isModalOpen && selectedDefense && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
//                     <div className="w-full max-w-2xl rounded-xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]">
                        
//                         {/* Header */}
//                         <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
//                             <div>
//                                 <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
//                                     Defense Details
//                                 </h2>
//                                 <div className="flex items-center gap-2 mb-1">
//                                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Defense ID #{selectedDefense.id}</span>
//                                     <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
//                                         {selectedDefense.group_code}
//                                     </span>
//                                 </div>
//                             </div>
//                             <button onClick={closeModal} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
//                                 ✖
//                             </button>
//                         </div>

//                         {/* Scrollable Body */}
//                         <div className="p-6 overflow-y-auto space-y-8">
                            
//                             <div>
//                                 <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Thesis Title</h3>
//                                 <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-snug">
//                                     {selectedDefense.thesis_title}
//                                 </p>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
//                                 {/* SEPARATE DATE */}
//                                 <div className="flex items-start gap-3">
//                                     <div className="mt-0.5">🗓️</div>
//                                     <div>
//                                         <p className="text-xs font-medium text-gray-500 uppercase">Date</p>
//                                         <p className="font-semibold text-gray-900 dark:text-gray-100">
//                                             {selectedDefense.defense_date}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 {/* SEPARATE TIME */}
//                                 <div className="flex items-start gap-3">
//                                     <div className="mt-0.5">⏰</div>
//                                     <div>
//                                         <p className="text-xs font-medium text-gray-500 uppercase">Time</p>
//                                         <p className="font-semibold text-gray-900 dark:text-gray-100">
//                                             {selectedDefense.defense_time}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 {/* VENUE */}
//                                 <div className="flex items-start gap-3">
//                                     <div className="mt-0.5">📍</div>
//                                     <div>
//                                         <p className="text-xs font-medium text-gray-500 uppercase">Venue</p>
//                                         <p className="font-semibold text-gray-900 dark:text-gray-100">
//                                             Room {selectedDefense.defense_room || 'TBA'}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 {/* BLOCK */}
//                                 <div className="flex items-start gap-3">
//                                     <div className="mt-0.5">🎓</div>
//                                     <div>
//                                         <p className="text-xs font-medium text-gray-500 uppercase">Course / Block</p>
//                                         <p className="font-semibold text-gray-900 dark:text-gray-100">
//                                             BSCPE {selectedDefense.year_level}-{selectedDefense.block}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 {/* ADVISER */}
//                                 <div className="flex items-start gap-3">
//                                     <div className="mt-0.5">👨‍🏫</div>
//                                     <div>
//                                         <p className="text-xs font-medium text-gray-500 uppercase">Adviser</p>
//                                         <p className="font-semibold text-gray-900 dark:text-gray-100">{selectedDefense.adviser_name}</p>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                                 {/* PROPONENTS */}
//                                 <div>
//                                     <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
//                                         <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase">Proponents</h3>
//                                     </div>
//                                     <ul className="space-y-2">
//                                         {selectedDefense.proponent_names ? (
//                                             selectedDefense.proponent_names.split(', ').map((name: any, i: number) => (
//                                                 <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
//                                                     <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
//                                                     {name}
//                                                 </li>
//                                             ))
//                                         ) : (
//                                             <li className="text-sm text-gray-400 italic">No proponents listed</li>
//                                         )}
//                                     </ul>
//                                 </div>

//                                 {/* PANELISTS */}
//                                 <div>
//                                     <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
//                                         <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase">Panelists</h3>
//                                     </div>
//                                     <ul className="space-y-2">
//                                         {selectedDefense.panelist_names ? (
//                                             selectedDefense.panelist_names.split(', ').map((name: any, i: number) => (
//                                                 <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
//                                                     <div className="h-1.5 w-1.5 rounded-full bg-blue-500/60"></div>
//                                                     {name}
//                                                 </li>
//                                             ))
//                                         ) : (
//                                             <li className="text-sm text-gray-400 italic">Pending confirmation</li>
//                                         )}
//                                     </ul>
//                                 </div>
//                             </div>
//                         </div>
                        
//                         <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 flex justify-end">
//                             <button 
//                                 onClick={closeModal}
//                                 className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all shadow-sm"
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </ManagementLayout>

//         // * ===============================================================================================
//         // * NOTICE: THIS IS THE BACKEND LOGIC FOR SEARCH & FILTERING - KEEP FOR REFERENCE AND DO NOT DELETE
//         // * ===============================================================================================

//         // // --- FILTER STATE ---
//         // // Initialize with values from URL (filters prop) or defaults
//         // const [values, setValues] = useState({
//         //     search: filters.search || '',
//         //     adviser: filters.adviser || '',
//         //     block: filters.block || '',
//         // });

//         // // Helper to trigger the backend search
//         // const handleFilterChange = (key: string, value: string) => {
//         //     const newValues = { ...values, [key]: value };
//         //     setValues(newValues);

//         //     // This reloads the page with ?search=...&adviser=... 
//         //     // preserveState: true keeps your scroll position and modal state intact
//         //     router.get(window.location.pathname, newValues, {
//         //         preserveState: true,
//         //         preserveScroll: true,
//         //         replace: true, 
//         //     });
//         // };
        
//         // // Reset function
//         // const resetFilters = () => {
//         //     setValues({ search: '', adviser: '', block: '' });
//         //     router.get(window.location.pathname, {}, {
//         //         preserveScroll: true,
//         //     });
//         // };

//         // // --- SEARCH & FILTER BAR ---
//         // <div className="flex flex-row md:flex-row gap-4 bg-white dark:bg-gray-900 p-4">
            
//         //     {/* Search Input */}
//         //     <div className="flex-1">
//         //         <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
//         //             Search Title
//         //         </label>
//         //         <input
//         //             type="text"
//         //             placeholder="Search thesis title..."
//         //             value={values.search}
//         //             onChange={(e) => handleFilterChange('search', e.target.value)}
//         //             className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//         //         />
//         //     </div>

//         //     {/* Adviser Dropdown */}
//         //     <div className="w-full md:w-64">
//         //         <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
//         //             Filter by Adviser
//         //         </label>
//         //         <select
//         //             value={values.adviser}
//         //             onChange={(e) => handleFilterChange('adviser', e.target.value)}
//         //             className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//         //         >
//         //             <option value="">All Advisers</option>
//         //             {adviserOptions.map((adv: any) => (
//         //                 <option key={adv.id} value={adv.id}>
//         //                     {adv.name}
//         //                 </option>
//         //             ))}
//         //         </select>
//         //     </div>

//         //     {/* Block Dropdown */}
//         //     <div className="w-full md:w-32">
//         //         <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
//         //             Filter by Block
//         //         </label>
//         //         <select
//         //             value={values.block}
//         //             onChange={(e) => handleFilterChange('block', e.target.value)}
//         //             className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//         //         >
//         //             <option value="">All</option>
//         //             {blockOptions.map((block) => (
//         //                 <option key={block} value={block}>
//         //                     Block {block}
//         //                 </option>
//         //             ))}
//         //         </select>
//         //     </div>

//         //     {/* Reset Button */}
//         //     <div className="flex items-end">
//         //         <button
//         //             onClick={resetFilters}
//         //             className="h-10 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
//         //         >
//         //             Clear Filters
//         //         </button>
//         //     </div>
//         // </div>
//     );
// }