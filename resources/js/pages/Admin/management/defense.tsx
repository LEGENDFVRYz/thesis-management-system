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
interface Defense {
    id: number;
    title?: string;
    proponents?: string[];
    proponents_count?: number;
    adviser?: string;
    block?: string | number;
    defense_date: string;
    defense_time: string;
    venue?: string;
    type?: string;
    status?: string;
    panel?: string[];
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

/* SUB-COMPONENT: DefenseDetailsModal */
function DefenseDetailsModal({ open, onOpenChange, data }: { open: boolean, onOpenChange: (open: boolean) => void, data: Defense | null }) {
    if (!data) return null;

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
                        <InfoField label="Defense ID" value={`DEF-${data.id}`} />
                        {/* Status Badge */}
                        <div className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs font-medium h-[21.59px] flex items-center capitalize">{data.status}</div>
                    </div>

                    <InfoField label="Thesis Title" value={data.title} className="leading-tight" />

                    <div className="grid grid-cols-3 gap-6">
                        <InfoField label="Date" value={data.defense_date} icon="calendarDefault" />
                        <InfoField label="Time" value={data.defense_time} />
                        <InfoField label="Venue" value={data.venue} />
                    </div>

                    {/* Proponents Section: Maps proponent names into rounded badges */}
                    <div className="flex flex-col gap-2">
                        <span className="text-base font-bold text-primary">Proponents</span>
                        <div className="flex flex-wrap gap-2">
                            {data.proponents?.map((name, i) => (
                                <div key={i} className="px-4 h-8 flex items-center bg-primary-foreground-2/20 border border-primary-foreground-2/30 rounded-full">
                                    <span className="text-sm font-medium">{name}</span>
                                </div>
                            )) || <span className="text-sm italic text-muted-foreground">No proponents listed</span>}
                        </div>
                    </div>

                    {/* Defense Panel: Lists panel members */}
                    <div className="flex flex-col gap-2 pb-4">
                        <span className="text-base font-bold text-primary">Defense Panel</span>
                        <div className="flex flex-col gap-2">
                            {(data.panel && data.panel.length > 0) ? data.panel.map((member, i) => (
                                <div key={i} className="flex items-center gap-3 p-[10px] bg-muted/30 rounded-[4px] border border-border">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-primary">P{i + 1}</span>
                                    </div>
                                    <span className="text-base font-medium text-foreground">{member}</span>
                                </div>
                            )) : (
                                <span className="text-sm italic text-muted-foreground">No panel members assigned</span>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* MAIN COMPONENT: DefenseTable */
export default function DefenseTable({ defenses = [] }: { defenses?: Defense[] }) {
    // State for managing the Modal and selection
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
                <span>{d.proponents_count || d.proponents?.length || '0'}</span>
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
                                <div className="flex flex-col h-[550px]">
                                    {/* FIXED HEADER */}
                                    <div className="bg-primary w-full shrink-0">
                                        <Table>
                                            <TableHeader className="bg-primary">
                                                <TableRow className="hover:bg-transparent border-none">
                                                    {columns.map(col => (
                                                        <TableHead key={col.label} className={cn("text-primary-foreground text-center font-bold", col.className)}>
                                                            {col.label}
                                                        </TableHead>
                                                    ))}
                                                    <TableHead className="text-primary-foreground text-center font-bold">Action</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                        </Table>
                                    </div>

                                    {/* SCROLLABLE BODY */}
                                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                                        <Table>
                                            <TableBody className="divide-y divide-border">
                                                {displayData.length > 0 ? (
                                                    displayData.map((def) => (
                                                        <TableRow key={def.id} className="hover:bg-accent/5 transition-colors group">
                                                            {columns.map((col) => (
                                                                <TableCell key={col.label} className={cn("text-center text-alert-desc font-medium", col.className)}>
                                                                    {col.render(def)}
                                                                </TableCell>
                                                            ))}
                                                            <TableCell className="text-center">
                                                                <Button variant="tertiary" className="tertiary-btn h-8 px-5 text-[11px] font-bold uppercase" onClick={() => { setSelectedDef(def); setIsModalOpen(true); }}>View Details</Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    )) 
                                                ) : ( 
                                                    /* Empty State logic */
                                                    <TableRow>
                                                        <TableCell colSpan={columns.length + 1} className="py-20 text-center font-dm text-alert-desc font-medium">No {statusFilter} defenses found in records.</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                        <div className="py-4 text-center">
                                            <span className="text-sm text-alert-desc opacity-70">End of {statusFilter} defenses.</span>
                                        </div>
                                    </div>
                                </div>
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

/**
 * MOCK DATA: Used as fallback for demonstration/development purposes.
 */
const MOCK_DEFENSES = [
    {
        id: 3301,
        title: "AI-Driven Predictive Maintenance for Industrial IoT",
        proponents: ["Alice Johnson", "Bob Smith", "Charlie Day"],
        proponents_count: 3,
        adviser: "Dr. Cherry D. Casuat",
        block: "BSCPE 3-3",
        defense_date: "January 8, 2026",
        defense_time: "3:35 PM",
        venue: "Room 313, CEA",
        type: "Title Defense",
        status: "upcoming",
        panel: ["Dr. Robert Chen", "Prof. Jane Smith", "Engr. John Doe"]
    },
    {
        id: 4506,
        title: "Blockchain-Based Secure Voting System",
        proponents: ["Charlie Brown", "Dana White", "Eve Adams"],
        proponents_count: 3,
        adviser: "Dr. Robert Chen",
        block: "BSCPE 4-5",
        defense_date: "January 8, 2026",
        defense_time: "9:47 PM",
        venue: "Virtual Room A",
        type: "Title Defense",
        status: "upcoming",
        panel: ["Dr. Cherry Casuat", "Dr. Mike Ross", "Prof. Sarah Zain"]
    },
    {
        id: 3102,
        title: "Smart Agriculture: Automated Irrigation with Soil Moisture Sensors",
        proponents: ["Liam Neeson", "Emma Watson"],
        proponents_count: 2,
        adviser: "Engr. Mark Tolentino",
        block: "BSCPE 3-1",
        defense_date: "January 9, 2026",
        defense_time: "8:00 AM",
        venue: "Lab 1, CEA",
        type: "Title Defense",
        status: "upcoming",
        panel: ["Dr. Cherry Casuat", "Prof. Sarah Zain", "Engr. John Doe"]
    },
    {
        id: 4590,
        title: "Development of a Low-Cost Air Quality Monitoring System",
        proponents: ["James Bond", "Vesper Lynd", "Felix Leiter"],
        proponents_count: 3,
        adviser: "Prof. Sarah Zain",
        block: "BSCPE 4-2",
        defense_date: "January 9, 2026",
        defense_time: "10:30 AM",
        venue: "Room 402, CEA",
        type: "Design Defense",
        status: "upcoming",
        panel: ["Dr. Robert Chen", "Engr. Mark Tolentino", "Dr. Mike Ross"]
    },
    {
        id: 4123,
        title: "Real-time Sign Language Translator using Computer Vision",
        proponents: ["Peter Parker", "Mary Jane", "Harry Osborn", "Gwen Stacy"],
        proponents_count: 4,
        adviser: "Dr. Mike Ross",
        block: "BSCPE 3-4",
        defense_date: "January 10, 2026",
        defense_time: "1:00 PM",
        venue: "Room 201, CEA",
        type: "Title Defense",
        status: "upcoming",
        panel: ["Prof. Jane Smith", "Engr. Mark Tolentino", "Dr. Cherry Casuat"]
    },
    {
        id: 4842,
        title: "Cybersecurity Framework for Small Business Networks",
        proponents: ["Bruce Wayne", "Clark Kent"],
        proponents_count: 2,
        adviser: "Dr. Robert Chen",
        block: "BSCPE 4-1",
        defense_date: "January 10, 2026",
        defense_time: "4:15 PM",
        venue: "Virtual Room B",
        type: "Final Defense",
        status: "completed",
        panel: ["Engr. John Doe", "Prof. Sarah Zain", "Dr. Mike Ross"]
    },
    {
        id: 3731,
        title: "Automated Traffic Violation Detection System",
        proponents: ["Tony Stark", "Steve Rogers", "Natasha Romanoff"],
        proponents_count: 3,
        adviser: "Engr. Mark Tolentino",
        block: "BSCPE 3-2",
        defense_date: "January 12, 2026",
        defense_time: "9:00 AM",
        venue: "Room 313, CEA",
        type: "Title Defense",
        status: "upcoming",
        panel: ["Dr. Cherry Casuat", "Prof. Jane Smith", "Dr. Robert Chen"]
    },
    {
        id: 3004,
        title: "Smart Home Energy Management using Zigbee Protocol",
        proponents: ["Wanda Maximoff", "Vision"],
        proponents_count: 2,
        adviser: "Prof. Jane Smith",
        block: "BSCPE 4-3",
        defense_date: "January 12, 2026",
        defense_time: "2:45 PM",
        venue: "Lab 2, CEA",
        type: "Design Defense",
        status: "upcoming",
        panel: ["Engr. Mark Tolentino", "Dr. Mike Ross", "Prof. Sarah Zain"]
    },
    {
        id: 3921,
        title: "RFID-Based Automated Library Management System",
        proponents: ["Barry Allen", "Iris West", "Cisco Ramon"],
        proponents_count: 3,
        adviser: "Dr. Cherry D. Casuat",
        block: "BSCPE 3-3",
        defense_date: "January 13, 2026",
        defense_time: "11:00 AM",
        venue: "Room 310, CEA",
        type: "Title Defense",
        status: "upcoming",
        panel: ["Dr. Robert Chen", "Engr. John Doe", "Prof. Jane Smith"]
    },
    {
        id: 4412,
        title: "Wearable Health Monitor for Elderly Patients",
        proponents: ["Stephen Strange", "Christine Palmer"],
        proponents_count: 2,
        adviser: "Dr. Mike Ross",
        block: "BSCPE 4-5",
        defense_date: "January 14, 2026",
        defense_time: "1:30 PM",
        venue: "Virtual Room A",
        type: "Final Defense",
        status: "completed",
        panel: ["Dr. Cherry Casuat", "Prof. Sarah Zain", "Engr. Mark Tolentino"]
    },
    {
        id: 3720,
        title: "Solar-Powered Water Purification System",
        proponents: ["Arthur Curry", "Mera"],
        proponents_count: 2,
        adviser: "Engr. John Doe",
        block: "BSCPE 3-1",
        defense_date: "January 15, 2026",
        defense_time: "8:30 AM",
        venue: "Field Site A",
        type: "Design Defense",
        status: "upcoming",
        panel: ["Dr. Robert Chen", "Prof. Jane Smith", "Dr. Mike Ross"]
    },
    {
        id: 3055,
        title: "Gesture-Controlled Robotic Arm for Hazardous Environments",
        proponents: ["Victor Stone", "Silas Stone"],
        proponents_count: 2,
        adviser: "Engr. Mark Tolentino",
        block: "BSCPE 4-2",
        defense_date: "January 15, 2026",
        defense_time: "3:00 PM",
        venue: "Lab 3, CEA",
        type: "Title Defense",
        status: "upcoming",
        panel: ["Dr. Cherry Casuat", "Engr. John Doe", "Prof. Sarah Zain"]
    },
    {
        id: 3019,
        title: "AI-Based Facial Recognition for Campus Security",
        proponents: ["Scott Lang", "Hope van Dyne", "Luis"],
        proponents_count: 3,
        adviser: "Dr. Robert Chen",
        block: "BSCPE 4-4",
        defense_date: "January 16, 2026",
        defense_time: "10:00 AM",
        venue: "Room 313, CEA",
        type: "Design Defense",
        status: "upcoming",
        panel: ["Prof. Jane Smith", "Dr. Mike Ross", "Engr. Mark Tolentino"]
    },
    {
        id: 3629,
        title: "Underwater Wireless Communication using Acoustic Sensors",
        proponents: ["Jack Sparrow", "Will Turner", "Elizabeth Swann"],
        proponents_count: 3,
        adviser: "Prof. Sarah Zain",
        block: "BSCPE 3-2",
        defense_date: "January 16, 2026",
        defense_time: "2:00 PM",
        venue: "Virtual Room C",
        type: "Title Defense",
        status: "upcoming",
        panel: ["Dr. Cherry Casuat", "Dr. Robert Chen", "Engr. John Doe"]
    },
    {
        id: 3281,
        title: "IoT-Based Waste Management System for Smart Cities",
        proponents: ["Bilbo Baggins", "Frodo Baggins", "Samwise Gamgee"],
        proponents_count: 3,
        adviser: "Engr. John Doe",
        block: "BSCPE 4-1",
        defense_date: "January 19, 2026",
        defense_time: "9:30 AM",
        venue: "Room 405, CEA",
        type: "Final Defense",
        status: "completed",
        panel: ["Dr. Mike Ross", "Prof. Jane Smith", "Engr. Mark Tolentino"]
    },
    {
        id: 3340,
        title: "Voice-Activated Wheelchair with Obstacle Avoidance",
        proponents: ["Charles Xavier", "Erik Lehnsherr", "Raven Darkholme"],
        proponents_count: 3,
        adviser: "Dr. Mike Ross",
        block: "BSCPE 3-4",
        defense_date: "January 20, 2026",
        defense_time: "11:15 AM",
        venue: "Lab 1, CEA",
        type: "Design Defense",
        status: "upcoming",
        panel: ["Dr. Cherry Casuat", "Dr. Robert Chen", "Prof. Sarah Zain"]
    },
    {
        id: 3392,
        title: "Deep Learning for Autonomous Drone Navigation",
        proponents: ["Carol Danvers", "Monica Rambeau"],
        proponents_count: 2,
        adviser: "Dr. Robert Chen",
        block: "BSCPE 4-5",
        defense_date: "January 20, 2026",
        defense_time: "4:00 PM",
        venue: "Roof Deck, CEA",
        type: "Title Defense",
        status: "upcoming",
        panel: ["Engr. John Doe", "Prof. Jane Smith", "Engr. Mark Tolentino"]
    }
];