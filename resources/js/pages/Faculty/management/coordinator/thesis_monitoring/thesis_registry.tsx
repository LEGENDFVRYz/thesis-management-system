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
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"; 
import AppLayout from '@/layouts/app-layout';
import { registry } from '@/routes/faculty/coordinator/thesis/index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FolderOpen, Calendar, Clock, Check, User } from 'lucide-react';

// SVG File Imports
import eyeDefault from '@/components/icons/ic_eyeopen-Default.svg';
import eyeHover from '@/components/icons/ic_eyeopen-Hover.svg';
import eyeClicked from '@/components/icons/ic_eyeopen-Clicked.svg';

import notifyDefault from '@/components/icons/ic_notify-Default.svg';
import notifyHover from '@/components/icons/ic_notify-Hover.svg';
import notifyClicked from '@/components/icons/ic_notify-Clicked.svg';
import ThesisMonitoringLayout from '.';

// Setup
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Thesis Registry',
        href: registry().url,
    },
];

const pageHeader: PageHeaderProps = {
    title: "Thesis Registry",
    subtitle: "View all ongoing and completed theses across all stages and batches",
    icon: (
        // pa correct nalang
        <FolderOpen className="w-8 h-8 text-primary" />
    ),
};


// Helper component for Interactive SVG Icons
const InteractiveSvgIcon = ({ defaultSrc, hoverSrc, clickedSrc, alt, onClick }: any) => {
    const [currentSrc, setCurrentSrc] = useState(defaultSrc);

    return (
        <img
            src={currentSrc}
            alt={alt}
            className="w-6 h-6 cursor-pointer transition-transform active:scale-90"
            onMouseEnter={() => setCurrentSrc(hoverSrc)}
            onMouseLeave={() => setCurrentSrc(defaultSrc)}
            onMouseDown={() => {
                setCurrentSrc(clickedSrc);
                if (onClick) onClick();
            }}
            onMouseUp={() => setCurrentSrc(hoverSrc)}
        />
    );
};

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


export default function Dashboard() {
    const [selectedThesis, setSelectedThesis] = useState<any>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isNotifySuccessOpen, setIsNotifySuccessOpen] = useState(false);
    
    const totalTheses = theses.length;          // remove when the backend exist
    const displayedTheses = theses.length;      // remove when the backend exist

    const handleNotify = () => {
        setIsNotifySuccessOpen(true);
    };

    const handleViewDetails = (thesis: any) => {
        setSelectedThesis(thesis);
        setIsViewOpen(true);
    };

    return (
        <ThesisMonitoringLayout 
            breadcrumbs={breadcrumbs}
            pageHeader={pageHeader}
        >
            <Head title="Thesis Registry" />
            
            <div className="flex flex-col min-h-screen -mt-4 -mx-4 -mb-4 bg-primary-foreground">
                {/* <HeaderCard 
                    title="Thesis Registry" 
                    description="View all ongoing and completed theses across all stages and batches"
                    icon={<FolderOpen className="w-8 h-8 text-primary" />}
                    className="w-full rounded-none border-t-0 border-x-0" 
                /> */}

                <div className="flex flex-1 flex-col gap-6 p-4 pt-0 w-full">
                    <div className="flex justify-end w-full">
                        <StageSwitchToggle />
                    </div>

                    <div className="w-full [&>*]:max-w-full">
                        <FilterSearchSection variant="DefenseManagement" />
                    </div>

                    <div className="rounded-lg border border-sidebar-border/70 overflow-hidden bg-card shadow-sm w-full">
                        <Table>
                            {/* TABLE CAPTION ADDED HERE */}
                            <TableCaption className="border-t py-4 text-[16px] font-medium text-muted-foreground bg-white/50">
                                {displayedTheses} of {totalTheses} Theses
                            </TableCaption>
                            
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
                                        <TableCell className="text-[13px] font-dm text-foreground">{item.id}</TableCell>
                                        <TableCell className="text-left py-4">
                                            <span className="text-[13px] line-clamp-2 min-w-[200px] font-dm">{item.title}</span>
                                        </TableCell>
                                        <TableCell className="text-[13px] font-dm text-foreground">{item.adviser}</TableCell>
                                        <TableCell className="text-[13px] font-dm text-foreground">{item.block}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col font-dm text-foreground leading-tight">
                                                <span>{item.date}</span>
                                                <span>{item.time}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span 
                                                className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[13px] font-dm border min-w-[90px]"
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
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-4">
                                                <InteractiveSvgIcon 
                                                    defaultSrc={eyeDefault} 
                                                    hoverSrc={eyeHover} 
                                                    clickedSrc={eyeClicked}
                                                    alt="View"
                                                    onClick={() => handleViewDetails(item)}
                                                />
                                                <InteractiveSvgIcon 
                                                    defaultSrc={notifyDefault} 
                                                    hoverSrc={notifyHover} 
                                                    clickedSrc={notifyClicked}
                                                    alt="Notify"
                                                    onClick={handleNotify}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* <div className="w-full mt-[120px]">
                    <NavFooter />
                </div> */}
            </div>

            {/* Modal: View Thesis Details */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-md rounded-[20px] p-8 border-none shadow-2xl">
                    {selectedThesis && (
                        <div className="space-y-6">
                            <section>
                                <h4 className="text-[16px] font-bold text-primary mb-1 uppercase tracking-tight font-dm">Defense ID</h4>
                                <p className="text-[16px] text-foreground">{selectedThesis.id}</p>
                            </section>

                            <section>
                                <h4 className="text-[16px] font-bold text-primary mb-1 uppercase tracking-tight font-dm">Thesis Title</h4>
                                <p className="text-[16px] leading-snug text-foreground">{selectedThesis.title}</p>
                            </section>

                            <div className="grid grid-cols-2 gap-4">
                                <section>
                                    <h4 className="text-[16px] font-bold text-primary mb-1 uppercase tracking-tight font-dm">Block</h4>
                                    <span className="px-3 py-1 bg-muted rounded-md text-[16px] border border-border">{selectedThesis.block}</span>
                                </section>
                                <section>
                                    <h4 className="text-[16px] font-bold text-primary mb-1 uppercase tracking-tight font-dm">Thesis Adviser</h4>
                                    <p className="text-[16px] text-foreground">{selectedThesis.adviser}</p>
                                </section>
                            </div>

                            <section>
                                <h4 className="text-[16px] font-bold text-primary mb-3 uppercase tracking-tight font-dm">Proponents</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedThesis.proponents?.map((name: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-1.5 bg-[#FFF9E5] border border-[#F5D67B] px-3 py-1.5 rounded-lg">
                                            <User className="w-3 h-3 text-[#A67C00]" />
                                            <span className="text-[11px] font-bold text-[#A67C00]">{name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="space-y-4 pt-2 border-t border-dashed border-border/60">
                                <div className="space-y-2">
                                    <h4 className="text-[16px] font-bold text-primary uppercase tracking-tight font-dm">MOR Completed</h4>
                                    <div className="flex gap-8">
                                        <div>
                                            <span className="text-[16px] font-bold text-primary block uppercase font-dm">Date</span>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                <Calendar className="w-4 h-4" /> {selectedThesis.date}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-[16px] font-bold text-primary block uppercase font-dm">Time</span>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                <Clock className="w-4 h-4" /> {selectedThesis.time}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal: Notification Success */}
            <Dialog open={isNotifySuccessOpen} onOpenChange={setIsNotifySuccessOpen}>
                <DialogContent className="max-w-[320px] rounded-[24px] p-10 flex flex-col items-center justify-center border-none shadow-2xl">
                    <div className="w-16 h-16 bg-alert-success rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <Check className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <p className="text-[16px] text-center text-foreground font-bold font-dm">The reminder has been sent.</p>
                </DialogContent>
            </Dialog>
        </ThesisMonitoringLayout>
    );
}