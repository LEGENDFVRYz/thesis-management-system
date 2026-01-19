import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { Calendar, Clock, Check, User } from 'lucide-react';
import ThesisMonitoringLayout from '.';
import FilterSearchSection from '@/components/filter-search-section';
import StageSwitchToggle from '@/components/stage-toggle';
import { registry } from '@/routes/faculty/coordinator/thesis/index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import FolderIcon from '@/Components/Icons/folder-open.svg';
import eyeDefault from '@/components/icons/ic_eyeopen-Default.svg';
import eyeHover from '@/components/icons/ic_eyeopen-Hover.svg';
import eyeClicked from '@/components/icons/ic_eyeopen-Clicked.svg';
import notifyDefault from '@/components/icons/ic_notify-Default.svg';
import notifyHover from '@/components/icons/ic_notify-Hover.svg';
import notifyClicked from '@/components/icons/ic_notify-Clicked.svg';

type Stage = 'mor' | 'dp1' | 'dp2';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Thesis Registry', href: registry().url }
];

const pageHeader: PageHeaderProps = {
    title: "Thesis Registry",
    subtitle: "View all ongoing and completed theses across all stages and batches",
    icon: <img src={FolderIcon} className="w-8 h-8" alt="Registry Icon" />,
};

const allTheses = [
    { id: '3301', title: "AI-Powered Enrollment Forecasting", adviser: "Dr. Cherry D. Casuat", block: "BSCPE 4-1", date: "January 02, 2026", time: "10:30 AM", status: "On-Track", stage: 'mor', proponents: ["Alice Doe", "Bob Smith", "Charlie Sy", "Diana Hood"] },
    { id: '3302', title: "Blockchain Academic Records", adviser: "Engr. Maria Santos", block: "BSCPE 4-2", date: "January 01, 2026", time: "02:15 PM", status: "At-Risk", stage: 'mor', proponents: ["Edward Ray", "Fiona Glen", "George Tan", "Hannah Lee"] },
    { id: '4401', title: "IoT Smart Agriculture System", adviser: "Dr. Arvin dela Cruz", block: "BSCPE 4-1", date: "December 15, 2025", time: "09:00 AM", status: "On-Track", stage: 'dp1', proponents: ["Ian Wright", "Julia Roberts", "Kevin Hart", "Luna Smith"] },
    { id: '4402', title: "Cybersecurity Threat Detection", adviser: "Engr. Julius Cansino", block: "BSCPE 4-3", date: "December 12, 2025", time: "11:00 AM", status: "At-Risk", stage: 'dp1', proponents: ["Mike Ross", "Nina Dobrev", "Oscar Isaac", "Paula Garcia"] },
    { id: '4501', title: "Autonomous Delivery Drone", adviser: "Dr. Rufo Marasigan Jr.", block: "BSCPE 4-2", date: "November 20, 2025", time: "01:30 PM", status: "On-Track", stage: 'dp2', proponents: ["Quinn Fabray", "Riley Reid", "Steve Jobs", "Erica Sinclair"] },
    { id: '4602', title: "Real-time Sign Language Translator", adviser: "Engr. Adelino Racusa", block: "BSCPE 4-4", date: "November 18, 2025", time: "03:45 PM", status: "At-Risk", stage: 'dp2', proponents: ["Uma Thurman", "Victor Magtanggol", "Wendy Smith", "Ford Collins"] },
];

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
            onMouseDown={() => { setCurrentSrc(clickedSrc); onClick?.(); }}
            onMouseUp={() => setCurrentSrc(hoverSrc)}
        />
    );
};

/** --- MAIN COMPONENT --- */
export default function Dashboard() {
    const [selectedThesis, setSelectedThesis] = useState<any>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isNotifySuccessOpen, setIsNotifySuccessOpen] = useState(false);
    const [activeStage, setActiveStage] = useState<Stage>('mor');

    const filteredTheses = useMemo(() => 
        allTheses.filter(t => t.stage === activeStage), 
    [activeStage]);

    return (
        <ThesisMonitoringLayout breadcrumbs={breadcrumbs} pageHeader={pageHeader}>
            <Head title="Thesis Registry" />

            <div className="flex flex-col min-h-screen -mt-4 -mx-4 -mb-4 bg-primary-foreground p-4 pt-0 gap-6">
                <div className="flex justify-end w-full">
                    <StageSwitchToggle 
                        value={activeStage} 
                        onChange={(stage) => setActiveStage(stage)} 
                    />
                </div>

                <FilterSearchSection variant="DefenseManagement" />

                {/* Table Section */}
                <div className="rounded-lg border border-sidebar-border/70 overflow-hidden bg-card shadow-sm">
                    <Table>
                        <TableHeader className="bg-primary">
                            <TableRow className="border-none hover:bg-primary">
                                <TableHead className="text-primary-foreground text-center">Defense ID</TableHead>
                                <TableHead className="text-primary-foreground text-center">Thesis Title</TableHead>
                                <TableHead className="text-primary-foreground text-center">Adviser</TableHead>
                                <TableHead className="text-primary-foreground text-center">Block</TableHead>
                                <TableHead className="text-primary-foreground text-center">Last Updated</TableHead>
                                <TableHead className="text-primary-foreground text-center">Status</TableHead>
                                <TableHead className="text-primary-foreground text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTheses.map((item) => (
                                <TableRow key={item.id} className="text-center">
                                    <TableCell className="text-[13px] font-dm">{item.id}</TableCell>
                                    <TableCell className="text-left py-4 min-w-[200px]">
                                        <span className="text-[13px] line-clamp-2 font-dm">{item.title}</span>
                                    </TableCell>
                                    <TableCell className="text-[13px] font-dm">{item.adviser}</TableCell>
                                    <TableCell className="text-[13px] font-dm">{item.block}</TableCell>
                                    <TableCell className="text-[13px] font-dm leading-tight">
                                        <div className="flex flex-col">
                                            <span>{item.date}</span>
                                            <span>{item.time}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span 
                                            className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[13px] font-dm border min-w-[90px]"
                                            style={{
                                                backgroundColor: `var(--${item.status === 'On-Track' ? 'completed' : 'canceled'}-bg)`,
                                                borderColor: `var(--${item.status === 'On-Track' ? 'completed' : 'canceled'}-border)`,
                                                color: `var(--${item.status === 'On-Track' ? 'completed' : 'canceled'}-font-color)`
                                            }}
                                        >
                                            {item.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-4">
                                            <InteractiveSvgIcon 
                                                defaultSrc={eyeDefault} hoverSrc={eyeHover} clickedSrc={eyeClicked} 
                                                alt="View" onClick={() => { setSelectedThesis(item); setIsViewOpen(true); }} 
                                            />
                                            <InteractiveSvgIcon 
                                                defaultSrc={notifyDefault} hoverSrc={notifyHover} clickedSrc={notifyClicked} 
                                                alt="Notify" onClick={() => setIsNotifySuccessOpen(true)} 
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableCaption className="border-t py-4 text-[16px] font-medium text-muted-foreground bg-white/50">
                            {filteredTheses.length} of {filteredTheses.length} Theses
                        </TableCaption>
                    </Table>
                </div>
            </div>

            {/* View Details Modal */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-md rounded-[20px] p-8 border-none shadow-2xl space-y-6">
                    {selectedThesis && (
                        <>
                            <section>
                                <h4 className="text-[16px] font-bold text-primary mb-1 uppercase font-dm">Defense ID</h4>
                                <p className="text-[16px]">{selectedThesis.id}</p>
                            </section>

                            <section>
                                <h4 className="text-[16px] font-bold text-primary mb-1 uppercase font-dm">Thesis Title</h4>
                                <p className="text-[16px] leading-snug">{selectedThesis.title}</p>
                            </section>

                            <div className="grid grid-cols-2 gap-4">
                                <section>
                                    <h4 className="text-[16px] font-bold text-primary mb-1 uppercase font-dm">Block</h4>
                                    <span className="px-3 py-1 bg-muted rounded-md border text-[16px] inline-block">{selectedThesis.block}</span>
                                </section>
                                <section>
                                    <h4 className="text-[16px] font-bold text-primary mb-1 uppercase font-dm">Thesis Adviser</h4>
                                    <p className="text-[16px]">{selectedThesis.adviser}</p>
                                </section>
                            </div>

                            <section>
                                <h4 className="text-[16px] font-bold text-primary mb-3 uppercase font-dm">Proponents</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedThesis.proponents.map((name: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-1.5 bg-[#FFF9E5] border border-[#F5D67B] px-3 py-1.5 rounded-lg">
                                            <User className="w-3 h-3 text-[#A67C00]" />
                                            <span className="text-[11px] font-bold text-[#A67C00]">{name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {activeStage !== 'mor' && (
                                <div className="pt-4 border-t border-dashed border-border/60 space-y-4">
                                    <div className="space-y-2">
                                        <h4 className="text-[16px] font-bold text-primary uppercase font-dm">MOR Completed</h4>
                                        <div className="flex gap-8">
                                            <div>
                                                <span className="text-[12px] font-bold text-primary block uppercase font-dm">Date</span>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                    <Calendar className="w-4 h-4" /> {selectedThesis.date}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-[12px] font-bold text-primary block uppercase font-dm">Time</span>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                    <Clock className="w-4 h-4" /> {selectedThesis.time}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {activeStage === 'dp2' && (
                                        <div className="space-y-2 pt-4 border-t border-dashed border-border/60">
                                            <h4 className="text-[16px] font-bold text-primary uppercase font-dm">DP1 Completed</h4>
                                            <div className="flex gap-8">
                                                <div>
                                                    <span className="text-[12px] font-bold text-primary block uppercase font-dm">Date</span>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                        <Calendar className="w-4 h-4" /> {selectedThesis.date}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-[12px] font-bold text-primary block uppercase font-dm">Time</span>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                        <Clock className="w-4 h-4" /> {selectedThesis.time}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Success Notification Modal */}
            <Dialog open={isNotifySuccessOpen} onOpenChange={setIsNotifySuccessOpen}>
                <DialogContent className="max-w-[320px] rounded-[24px] p-10 flex flex-col items-center justify-center border-none shadow-2xl">
                    <div className="w-16 h-16 bg-alert-success rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <Check className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <p className="text-[16px] text-center text-foreground font-bold font-dm">
                        The reminder has been sent.
                    </p>
                </DialogContent>
            </Dialog>
        </ThesisMonitoringLayout>
    );
}