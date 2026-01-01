import * as React from 'react';
import { useState } from 'react';
import { defenses as defensesRoute } from '@/routes/admin/management/index';
import ManagementLayout from '.';
import FilterSearchSection from '@/components/filter-search-section';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icon-index';
import { cn } from "@/lib/utils";
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
import { NavFooter } from '@/components/nav-footer';

/* ==========================================================
   SUB-COMPONENT: DefenseDetailsModal
   ========================================================== */
function DefenseDetailsModal({ open, onOpenChange, data }: { open: boolean, onOpenChange: (open: boolean) => void, data: any }) {
    if (!data) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[900px] h-[605px] max-w-none bg-background rounded-[10px] border-[0.8px] border-black/10 shadow-lg p-0 font-dm overflow-hidden">
                
                {/* FIXED HEADER WITH WORKING X BUTTON */}
                <div className="px-6 py-[17px] border-b border-border flex items-start justify-between bg-background z-20">
                    <DialogHeader className="gap-2">
                        <DialogTitle className="text-alert-default">
                            Defense Details
                        </DialogTitle>
                        <DialogDescription className="text-[15px] font-medium text-alert-desc">
                            Complete information about the thesis defense
                        </DialogDescription>
                    </DialogHeader>

                    <DialogClose className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none">
                        <X className="h-5 w-5 text-alert-desc" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </div>

                {/* SCROLLABLE CONTENT */}
                <div className="p-6 flex flex-col gap-5 overflow-y-auto h-[calc(605px-85px)] custom-scrollbar">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-base font-bold text-primary">Defense ID</span>
                            <span className="text-base font-medium text-foreground">DEF-{data.id || "001"}</span>
                        </div>
                        <div className="bg-primary text-background px-3 py-1 rounded-lg text-xs font-medium h-[21.59px] flex items-center">
                            Upcoming
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-base font-bold text-primary">Thesis Title</span>
                        <span className="text-base font-medium text-foreground leading-tight">
                            {data.title || "Machine Learning Applications in Healthcare Diagnostics"}
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-base font-bold text-primary">Date</span>
                            <div className="flex items-center gap-2 text-foreground">
                                <Icon name="calendarDefault" size={16} />
                                <span className="text-base font-medium">{data.defense_date || "11/25/2025"}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-base font-bold text-primary">Time</span>
                            <span className="text-base font-medium text-foreground">{data.defense_time || "09:00 AM"}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-base font-bold text-primary">Venue</span>
                            <span className="text-base font-medium text-foreground">{data.venue || "Room 313, CEA"}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2">
                            <span className="text-base font-bold text-primary">Block</span>
                            <div className="w-fit px-[10px] py-[5px] border border-black/10 rounded-lg text-xs font-medium text-foreground">
                                {data.block || "BSCPE 3-3"}
                            </div>
                        </div>
                        <div className="col-span-2 flex flex-col gap-1">
                            <span className="text-base font-bold text-primary">Thesis Adviser</span>
                            <span className="text-base font-medium text-foreground">{data.adviser || "Dr. Maria Santos"}</span>
                        </div>
                    </div>

                    {/* PROPONENTS SECTION - BADGES REMOVED */}
                    <div className="flex flex-col gap-2">
                        <span className="text-base font-bold text-primary">Proponents</span>
                        <div className="flex flex-wrap gap-2">
                            {(data.proponents || ["John Doe", "Jane Smith", "Mike Johnson"]).map((name: string, i: number) => (
                                <div key={i} className="flex items-center px-4 h-8 bg-primary-foreground-2/50 rounded-full">
                                    <span className="font-dm text-sm text-[#030213] font-medium">{name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pb-4">
                        <span className="text-base font-bold text-primary">Defense Panel</span>
                        <div className="flex flex-col gap-2">
                            {[1, 2, 3].map((num) => (
                                <div key={num} className="flex items-center gap-3 p-[10px] bg-[#F9FAFB] rounded-[4px]">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <span className="text-base font-medium text-primary">P{num}</span>
                                    </div>
                                    <span className="text-base font-medium text-[#0A0A0A]">Dr. Robert Chen</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* ==========================================================
   MAIN COMPONENT: DefenseManagement
   ========================================================== */
export default function DefenseTable({ defenses }: { defenses: any[] }) {
    const [selectedDef, setSelectedDef] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("upcoming");
    const [view, setView] = useState<string>("table");

    const sampleEvents = defenses.map((def) => ({
        date: new Date(def.defense_date || '2025-11-28'),
        title: def.title,
        id: def.id,
        section: def.block || 'N/A',
    }));

    const handleViewDetails = (def: any) => {
        setSelectedDef(def);
        setIsModalOpen(true);
    };

    return (
        <><ManagementLayout
            breadcrumbs={[{ title: 'Defense', href: defensesRoute().url }]}
            title="Defense Management"
            description="Monitor all defense schedules and panel assignments"
        >
            <div className="space-y-6 font-dm">
                <FilterSearchSection variant="DefenseManagement" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <ToggleGroup
                        type="single"
                        value={statusFilter}
                        onValueChange={(val) => val && setStatusFilter(val)}
                        className="bg-[#FDF8E7] p-1 rounded-full border border-amber-100 w-fit"
                    >
                        <ToggleGroupItem value="upcoming" className={cn("h-10 px-6 rounded-full transition-all font-bold text-xs uppercase whitespace-nowrap", statusFilter === 'upcoming' ? "bg-[#700000] text-white shadow-md" : "text-[#700000] hover:bg-amber-100/50")}>
                            Upcoming Defense
                        </ToggleGroupItem>
                        <ToggleGroupItem value="completed" className={cn("h-10 px-6 rounded-full transition-all font-bold text-xs uppercase whitespace-nowrap", statusFilter === 'completed' ? "bg-[#700000] text-white shadow-md" : "text-[#700000] hover:bg-amber-100/50")}>
                            Completed Defenses
                        </ToggleGroupItem>
                    </ToggleGroup>

                    <ToggleGroup
                        type="single"
                        value={view}
                        onValueChange={(val) => val && setView(val)}
                        className="bg-[#FDF8E7] p-1 rounded-full border border-amber-100 w-fit"
                    >
                        <ToggleGroupItem value="table" className={cn("gap-2 h-10 px-6 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all", view === 'table' ? "bg-[#700000] text-white shadow-md" : "text-[#700000] hover:bg-amber-100/50")}>
                            <TableIcon className="w-4 h-4" /> Table View
                        </ToggleGroupItem>
                        <ToggleGroupItem value="calendar" className={cn("gap-2 h-10 px-6 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all", view === 'calendar' ? "bg-[#700000] text-white shadow-md" : "text-[#700000] hover:bg-amber-100/50")}>
                            <Calendar className="w-4 h-4" /> Calendar View
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>

                <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                    {view === 'table' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-center text-[13.33px] border-collapse">
                                <thead className="bg-[#730000] text-white font-[DM Sans] font-medium tracking-wider">
                                    <tr>
                                        <th className="px-4 py-4 border-r border-white/10">Defense ID</th>
                                        <th className="px-6 py-4 border-r border-white/10">Title</th>
                                        <th className="px-4 py-4 border-r border-white/10">Proponents</th>
                                        <th className="px-6 py-4 border-r border-white/10">Adviser</th>
                                        <th className="px-4 py-4 border-r border-white/10">Block</th>
                                        <th className="px-6 py-4 border-r border-white/10">Date & Time</th>
                                        <th className="px-4 py-4 border-r border-white/10">Type</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {defenses?.map((def, index) => (
                                        <tr key={index} className="hover:bg-accent/5 transition-colors whitespace-nowrap group">
                                            <td className="px-4 py-4 text-alert-desc font-medium">{def.id || '3306'}</td>
                                            <td className="px-6 py-4 text-[#1A1A1A] max-w-[280px] truncate font-medium text-left">{def.title || 'Machine Learning System Implementation for...'}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-center gap-2 font-bold text-primary">
                                                    <Icon name="proponentsDefault" size={18} />
                                                    <span>{def.proponents_count || '4'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[#364153] text-left">{def.adviser || 'Dr. Cherry D. Casuat'}</td>
                                            <td className="px-4 py-4 text-[#364153]">{def.block || 'BSCPE 3-3'}</td>
                                            <td className="px-6 py-4 leading-tight">
                                                <div className="flex flex-col text-[#364153]">
                                                    <span className="font-semibold text-alert-default">Nov 28, 2025</span>
                                                    <span className="text-[11px] text-alert-desc font-medium">09:00 AM</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-alert-desc">{def.type || 'Title Defense'}</td>
                                            <td className="px-6 py-4">
                                                <Button variant="tertiary" className="h-8 px-5 text-[11px] font-bold uppercase transition-all rounded-md" onClick={() => handleViewDetails(def)}>
                                                    View Details
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <CardContent className='w-full px-0'>
                            <DefenseCalendar
                                events={sampleEvents}
                                value={new Date(2025, 10, 24)} />
                        </CardContent>
                    )}
                </div>
            </div>

            <DefenseDetailsModal open={isModalOpen} onOpenChange={setIsModalOpen} data={selectedDef} />

        </ManagementLayout><NavFooter /></>
    );
}