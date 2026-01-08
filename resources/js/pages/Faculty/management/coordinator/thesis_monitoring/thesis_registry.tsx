import React, { useState } from 'react';
import FilterSearchSection from '@/components/filter-search-section';
import StageSwitchToggle from '@/components/stage-toggle';
import { NavFooter } from '@/components/nav-footer';
import { HeaderCard } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { thesis_registry } from '@/routes/faculty/management/coordinator/thesis_monitoring';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FolderOpen } from 'lucide-react';

// SVG File Imports
import eyeDefault from '@/components/icons/ic_eyeopen-Default.svg';
import eyeHover from '@/components/icons/ic_eyeopen-Hover.svg';
import eyeClicked from '@/components/icons/ic_eyeopen-Clicked.svg';

import notifyDefault from '@/components/icons/ic_notify-Default.svg';
import notifyHover from '@/components/icons/ic_notify-Hover.svg';
import notifyClicked from '@/components/icons/ic_notify-Clicked.svg';

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Thesis Registry',
        href: thesis_registry().url,
    },
];

// Sample Data (move it here)
const theses = [
    { 
        id: '3301', 
        title: "Development of an AI-Powered Enrollment Forecasting System", 
        adviser: "Dr. Juan Dela Cruz", 
        block: "BSCPE 4-1", 
        date: "Jan 02, 2026", 
        time: "10:30 AM", 
        status: "On-Track" 
    },
    { 
        id: '3302', 
        title: "Blockchain-Based Academic Record Verification", 
        adviser: "Engr. Maria Santos", 
        block: "BSCPE 4-2", 
        date: "Jan 01, 2026", 
        time: "02:15 PM", 
        status: "At-Risk" 
    },
];


// Helper component for Interactive SVG Icons
const InteractiveSvgIcon = ({ defaultSrc, hoverSrc, clickedSrc, alt }: any) => {
    const [currentSrc, setCurrentSrc] = useState(defaultSrc);

    return (
        <img
            src={currentSrc}
            alt={alt}
            className="w-6 h-6 cursor-pointer transition-transform active:scale-90"
            onMouseEnter={() => setCurrentSrc(hoverSrc)}
            onMouseLeave={() => setCurrentSrc(defaultSrc)}
            onMouseDown={() => setCurrentSrc(clickedSrc)}
            onMouseUp={() => setCurrentSrc(hoverSrc)}
        />
    );
};

export default function Dashboard() {

    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title="Thesis Registry" />
            
            <div className="flex flex-col min-h-screen -mt-4 -mx-4 -mb-4 md:-mt-4 md:-mx-6 md:-mb-6 lg:-mt-6 lg:-mx-8 lg:-mb-8 bg-primary-foreground">
                
                {/* Header Section */}
                <HeaderCard 
                    title="Thesis Registry" 
                    description="View all ongoing and completed theses across all stages and batches"
                    icon={<FolderOpen className="w-8 h-8 text-primary" />}
                    className="w-full lg:w-full rounded-none border-t-0 border-x-0" 
                />

                {/* Main Content Area */}
                <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 w-full">
                    
                    <div className="flex justify-end w-full">
                        <StageSwitchToggle />
                    </div>

                    <div className="w-full [&>*]:max-w-full">
                        <FilterSearchSection variant="DefenseManagement" />
                    </div>

                    {/* Table Section */}
                    <div className="rounded-lg border border-sidebar-border/70 overflow-hidden bg-card shadow-sm w-full">
                        <Table>
                            <TableHeader className="bg-primary">
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="text-primary-foreground font-medium h-12 text-center">Defense ID</TableHead>
                                    <TableHead className="text-primary-foreground font-medium h-12 text-center">Thesis Title</TableHead>
                                    <TableHead className="text-primary-foreground font-medium h-12 text-center">Adviser</TableHead>
                                    <TableHead className="text-primary-foreground font-medium h-12 text-center">Block</TableHead>
                                    <TableHead className="text-primary-foreground font-medium h-12 text-center">Last Updated</TableHead>
                                    <TableHead className="text-primary-foreground font-medium h-12 text-center">Status</TableHead>
                                    <TableHead className="text-primary-foreground font-medium h-12 text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {theses.map((item) => (
                                    <TableRow key={item.id} className="text-center">
                                        <TableCell className="font-bold">{item.id}</TableCell>
                                        <TableCell className="text-left py-4">
                                            <span className="font-semibold line-clamp-2 min-w-[200px]">{item.title}</span>
                                        </TableCell>
                                        <TableCell>{item.adviser}</TableCell>
                                        <TableCell>{item.block}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col leading-tight">
                                                <span className="font-medium text-foreground">{item.date}</span>
                                                <span className="font-medium text-foreground">{item.time}</span>
                                            </div>
                                        </TableCell>

                                        {/* Status Badge  */}
                                        <TableCell>
                                            <span 
                                                className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-bold border min-w-[90px]"
                                                style={item.status === 'On-Track' ? {
                                                    backgroundColor: 'var(--completed-bg)', 
                                                    borderColor: 'var(--completed-border)', 
                                                    color: 'var(--completed-font-color)' 
                                                } : {
                                                    backgroundColor: 'var(--canceled-bg)', 
                                                    borderColor: 'var(--canceled-border)', 
                                                    color: 'var(--canceled-font-color)' 
                                                }}
                                            >
                                                {item.status}
                                            </span>
                                        </TableCell>

                                        {/* Action Icons */}
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-4">
                                                <InteractiveSvgIcon 
                                                    defaultSrc={eyeDefault} 
                                                    hoverSrc={eyeHover} 
                                                    clickedSrc={eyeClicked}
                                                    alt="View"
                                                />
                                                <InteractiveSvgIcon 
                                                    defaultSrc={notifyDefault} 
                                                    hoverSrc={notifyHover} 
                                                    clickedSrc={notifyClicked}
                                                    alt="Notify"
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableCaption className="border-t py-4 text-xs font-medium text-muted-foreground">
                                {theses.length} of {theses.length} Theses
                            </TableCaption>
                        </Table>
                    </div>
                </div>

                {/* Footer */}
                <div className="w-full mt-[120px]">
                    <NavFooter />
                </div>
            </div>
        </AppLayout>
    );
}