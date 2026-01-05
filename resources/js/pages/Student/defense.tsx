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

/**
 * MAIN COMPONENT: Student Defense Schedule
 * Displays defense schedules in a simple table format for students
 */
export default function StudentDefense({ defenses }: { defenses?: any[] }) {
    const [statusFilter, setStatusFilter] = useState<string>("upcoming");
    const [view, setView] = useState<string>("table");

    const defensesData = defenses || DEFENSE_SCHEDULES;

    /**
     * Logic: Filtering data based on status toggle
     */
    const filteredData = defensesData?.filter((def) => {
        const status = def.status?.toLowerCase();
        return statusFilter === "upcoming" ? (status === "upcoming" || !status) : status === "completed";
    }) || [];

    return (
        <>
            <Head title="Defense Schedule" />

            <AppLayout breadcrumbs={[{ title: 'Defense Schedule', href: '/student/defense' }]}>
                <AppContent
                    title="Defense Schedule"
                    subtitle="View your upcoming thesis defense schedules"
                    icon={<Icon name="calendarDefault" className="w-8 h-8 text-primary" />}
                    variant="header"
                    className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]"
                >
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
                                            {["Title", "Stage", "Room", "Panel", "Date & Time", "Action"].map((head) => (
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
                                                    <TableCell className="px-6 text-foreground max-w-[280px] truncate font-medium text-left">
                                                        {defense.title}
                                                    </TableCell>
                                                    <TableCell className="px-6 text-alert-desc text-center">
                                                        {defense.stage}
                                                    </TableCell>
                                                    <TableCell className="text-center text-alert-desc">
                                                        {defense.room}
                                                    </TableCell>
                                                    <TableCell className="px-6 text-alert-desc text-center">
                                                        {defense.panel}
                                                    </TableCell>
                                                    <TableCell className="text-center leading-tight">
                                                        <div className="flex flex-col text-alert-desc">
                                                            <span className="font-semibold text-alert-default">{defense.defense_date}</span>
                                                            <span className="text-[10px] font-bold uppercase text-alert-desc/70">{defense.defense_time}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Button
                                                            variant="tertiary"
                                                            className="tertiary-btn h-8 px-5 text-[11px] font-bold uppercase"
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
                </AppContent>
            </AppLayout>
            <NavFooter />
        </>
    );
}
