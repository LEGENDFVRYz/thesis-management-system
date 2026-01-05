import * as React from 'react';
import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { AppContent } from '@/components/app-content';
import { NavFooter } from '@/components/nav-footer';
import { defenses as defensesRoute } from '@/routes/admin/management/index';
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Calendar, TableIcon, X } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { DefenseCalendar } from '@/components/defense-calendar-monthly';

/**
 * SUB-COMPONENT: DefenseDetailsModal
 * Displays an overlay with comprehensive information regarding a specific defense.
 * Utilizes the custom scrollbar and theme variables from global.css.
 */
function DefenseDetailsModal({ open, onOpenChange, data }: { open: boolean, onOpenChange: (open: boolean) => void, data: any }) {
    if (!data) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* Modal Container: Optimized for 900x605 layout per Figma specs */}
            <DialogContent className="gap-0 w-[900px] h-[605px] max-w-none bg-background rounded-[10px] border-[0.8px] border-border shadow-lg p-0 font-dm overflow-hidden">
                
                {/* Header Section: Sticky top with border-bottom divider */}
                <div className="px-6 py-[17px] border-b border-border flex items-start justify-between bg-background z-20">
                    <DialogHeader className="gap-1 text-left">
                        <DialogTitle className="text-alert-default text-xl text-left">
                            Defense Details
                        </DialogTitle>
                        <DialogDescription className="text-[15px] font-medium text-alert-desc">
                            Complete information about the thesis defense
                        </DialogDescription>
                    </DialogHeader>

                    <DialogClose className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
                        <X className="h-5 w-5 text-alert-desc" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </div>

                {/* Content Area: Scrollable with 'custom-scrollbar' utility */}
                <div className="p-6 flex flex-col gap-5 overflow-y-auto h-[calc(605px-85px)] custom-scrollbar">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-base font-bold text-primary">Defense ID</span>
                            <span className="text-base font-medium text-foreground">DEF-{data.id || "001"}</span>
                        </div>
                        {/* Status Badge: Using --primary background and white text */}
                        <div className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs font-medium h-[21.59px] flex items-center">
                            Upcoming
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-base font-bold text-primary">Thesis Title</span>
                        <span className="text-base font-medium text-foreground leading-tight">
                            {data.title || "Machine Learning Applications in Healthcare Diagnostics"}
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1">
                            <span className="text-base font-bold text-primary">Date</span>
                            <div className="flex items-center gap-2 text-foreground">
                                <Icon name="calendarDefault" size={16} />
                                <span className="text-sm font-medium">{data.defense_date || "11/25/2025"}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-base font-bold text-primary">Time</span>
                            <span className="text-sm font-medium text-foreground">{data.defense_time || "09:00 AM"}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-base font-bold text-primary">Venue</span>
                            <span className="text-sm font-medium text-foreground">{data.venue || "Room 313, CEA"}</span>
                        </div>
                    </div>

                    {/* Proponents: Styled with --primary-foreground-2 (Yellow accent) */}
                    <div className="flex flex-col gap-2">
                        <span className="text-base font-bold text-primary">Proponents</span>
                        <div className="flex flex-wrap gap-2">
                            {(data.proponents || ["John Doe", "Jane Smith", "Mike Johnson"]).map((name: string, i: number) => (
                                <div key={i} className="flex items-center px-4 h-8 bg-primary-foreground-2/20 border border-primary-foreground-2/30 rounded-full">
                                    <span className="font-dm text-sm text-foreground font-medium">{name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Defense Panel: List View */}
                    <div className="flex flex-col gap-2 pb-4">
                        <span className="text-base font-bold text-primary">Defense Panel</span>
                        <div className="flex flex-col gap-2">
                            {[1, 2, 3].map((num) => (
                                <div key={num} className="flex items-center gap-3 p-[10px] bg-muted/30 rounded-[4px] border border-border">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-primary">P{num}</span>
                                    </div>
                                    <span className="text-base font-medium text-foreground">Dr. Robert Chen</span>
                                </div>
                            ))}
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
export default function DefenseTable({ defenses }: { defenses: any[] }) {
    const [selectedDef, setSelectedDef] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("upcoming");
    const [view, setView] = useState<string>("table");

    const handleViewDetails = (def: any) => {
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

    return (
        <>
            <Head title="Defense Management" />
            
            <AppLayout breadcrumbs={[{ title: 'Management', href: '/admin/management' }, { title: 'Defense', href: defensesRoute().url }]}>
                    
                    <AppContent
                        title="Defense Management"
                        subtitle="Monitor all defense schedules and panel assignments"
                        icon={<Icon name="calendarDefault" className="w-8 h-8 text-primary" />}
                        variant="header"
                    >

                    <div className="space-y-6 font-dm pb-10 flex flex-col items-center w-full">
                    
                        {/* 1. Filter Section: Ensure it's centered */}
                        <div className="w-full flex justify-center">
                            <FilterSearchSection variant="DefenseManagement" />
                        </div>

                        {/* View Controls: Wrap in a matching width container */}
                        <div className="w-full max-w-[1360px] mx-auto px-1"> 
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
                                                "h-10 px-6 rounded-full transition-all font-bold text-xs uppercase whitespace-nowrap", 
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
                        </div>

                        {/* Data Visualization Area */}
                        <div className="w-full max-w-[1360px] mx-auto rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                            {view === 'table' ? (
                                <div className="relative h-[550px] overflow-y-auto custom-scrollbar">
                                <Table>
                                    <TableCaption className="pb-4 font-dm text-alert-desc">End of defense records.</TableCaption>
                                    <TableHeader className="bg-primary sticky top-0 z-20 shadow-sm">
                                        <TableRow className="hover:bg-transparent border-none sticky top-0 z-20 shadow-sm">
                                            {["ID", "Title", "Proponents", "Adviser", "Block", "Date & Time", "Type", "Action"].map((head) => (
                                                <TableHead key={head} className="text-primary-foreground text-center text-[13px] font-bold sticky top-0 z-20 shadow-sm">
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
                                                        {'3306'}
                                                    </TableCell>
                                                    <TableCell className="px-6 text-foreground max-w-[280px] truncate font-medium text-left">
                                                        {def.title || 'Machine Learning Applications in Healthcare Diagnostics'}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-2 font-bold text-primary">
                                                            <Icon name="proponentsDefault" size={18} />
                                                            <span>{def.proponents_count || '0'}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-6 text-alert-desc text-center">
                                                        {def.adviser || 'Dr. Cherry D. Casuat'}
                                                    </TableCell>
                                                    <TableCell className="text-center text-alert-desc">
                                                        {def.block}
                                                    </TableCell>
                                                    <TableCell className="text-center leading-tight">
                                                        <div className="flex flex-col text-alert-desc">
                                                            <span className="font-semibold text-alert-default">{def.defense_date}</span>
                                                            <span className="text-[10px] font-bold uppercase text-alert-desc/70">{def.defense_time}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center text-alert-desc">
                                                        {def.type || 'Title Defense'}
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
                                </Table> </div>
                            ) : (
                                <CardContent className='w-full px-0'>
                                    <DefenseCalendar events={filteredData} value={new Date()} />
                                </CardContent>
                            )}
                        </div>
                    </div>
                </AppContent>
            </AppLayout>
            <NavFooter />
            
            {/* Modal portal for defense details */}
            <DefenseDetailsModal 
                open={isModalOpen} 
                onOpenChange={setIsModalOpen} 
                data={selectedDef} 
            />
        </>
    );
}