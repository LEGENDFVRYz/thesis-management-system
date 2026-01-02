import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { AppContent } from '@/components/app-content';
import { FileText, Search, Edit3} from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { Icon } from '@/components/icon-index';
import { CommitteeCard } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import FilterSearchSection from '@/components/filter-search-section';
import { Button } from '@/components/ui/button';
import { Table, TableCaption } from '@/components/ui/table';
import { MethodologyHeader } from '@/components/ui/headers';
import { MethodologyRow } from '@/components/ui/rows';

export default function ProposalReview() {
    const [activeTab, setActiveTab] = useState<'endorsed' | 'changes'>('endorsed');

    // Mock Data for rendering cards
    const mockEndorsed = Array(8).fill({
        title: "Mobile App for Mental Health Support in Universities",
        adviser: "Dr. Lisa Fernandez",
        block: "BSCPE 3-3",
        stage: 0
    }).map((item, i) => ({ ...item, id: i }));

    const mockEvaluating = Array(15).fill({
        title: "Live Polling System Using Blockchain Technology",
        adviser: "Dr. Andrei Hidalgo",
        block: "BSCPE 3-1",
        stage: 0
    }).map((item, i) => ({ ...item, id: i }));

    const renderProposalSection = (title: string, headerColor: string, count: number, data: any[]) => {
        const isRed = headerColor === "bg-primary";
        const isGold = headerColor === "bg-primary-foreground-2";
        const isGreen = headerColor === "bg-completed-border";

        return (
            <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                {/* Header: Fixed height header */}
                <div className={cn("p-3 flex justify-between items-center px-5 shrink-0", headerColor)}>
                    <span className={cn(
                        "font-bold text-sm", 
                        isGold ? "text-white" : "text-white" // Gold header gets Maroon text, others get White
                    )}>
                        {title}
                    </span>

                    {/* Badge: White circle with text matching the header's primary color */}
                    <div className="bg-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center justify-center min-w-[20px]">
                        <span className={cn(
                            "font-bold",
                            isRed && "text-primary",      // Maroon text for Maroon section
                            isGold && "text-primary-foreground-2",     // Gold text for Gold section
                            isGreen && "text-completed-border",    // Green text for Green section
                            !isRed && !isGold && !isGreen && "text-gray" // Fallback
                        )}>
                            {count}
                        </span>
                    </div>
                </div>

                {/* Content Area */}
                {/* CHANGE HEIGHT HERE: 
                    h-[620px] is roughly 3 rows. 
                    Adjust this pixel value to fit more or fewer rows based on your card height.
                */}
                <div className="p-4 overflow-y-auto h-[420px] bg-slate-50/10 custom-scrollbar">
                    {data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                            {data.map((item) => (
                                <CommitteeCard
                                    key={item.id}
                                    thesisTitle={item.title}
                                    adviserName={item.adviser}
                                    blockSection={item.block}
                                    currentStage={item.stage}
                                    totalStages={6} progress={3}
                                />
                            ))}
                        </div>
                    ) : (
                        /* --- EMPTY STATE --- */
                        <div className="h-full flex flex-col items-center justify-center py-12 text-slate-400">
                            <div className="bg-slate-100 p-4 rounded-full mb-3">
                                <Icon name="docuDefault" size={32} className="opacity-40" />
                            </div>
                            <p className="text-sm font-semibold text-slate-500">No proposals found</p>
                            <p className="text-xs">There are currently no items in the {title.toLowerCase()} category.</p>
                        </div>
                    )}
                </div>
            </section>
        );
    };

    return (
        <><AppLayout breadcrumbs={[{ title: 'Proposal Review', href: '/proposal-review' }, { title: activeTab === 'endorsed' ? 'Endorsed Proposals' : 'Change Requests' } as BreadcrumbItem]}>
            <Head title="Proposal Review" />

            <AppContent
                title="Proposal Review"
                subtitle="Review and evaluate thesis proposals submitted for committee approval"
                icon={<FileText className="w-8 h-8 text-[#FFBD00]" />}
                variant="header"
                className='w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]'
            />

            <div className="px-6 max-w-[1440px] mx-auto w-full space-y-6">
                
                {/* 1. TABS */}
                <div className="flex border-b border-slate-200 w-full">
                    <Button variant="ghost" onClick={() => setActiveTab('endorsed')} className={cn("flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all", "rounded-b-none", activeTab === 'endorsed' ? "border-b-2 border-[#800000] text-[#800000]" : "text-slate-500 hover:bg-slate-50")}>
                        <Icon name={activeTab === 'endorsed' ? "docuClicked" : "docuDefault"} size={16} />
                        Endorsed Proposal
                    </Button>
                    <Button variant="ghost" onClick={() => setActiveTab('changes')} className={cn("flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all", "rounded-b-none", activeTab === 'changes' ? "border-b-2 border-[#800000] text-[#800000]" : "text-slate-500 hover:bg-slate-50")}>
                        <Icon name={activeTab === 'changes' ? "editClicked" : "editDefault"} size={16} />
                        Change Requests
                    </Button>
                </div>

                {/* 2. FILTER & SEARCH */}
                <FilterSearchSection variant='Notifications'/>

                {/* 3. MAIN CONTENT CONTAINER (Applying your CSS) */}
                <div 
                    className="flex flex-row items-stretch gap-[30px] mb-10 w-full max-w-[1360px] mx-auto self-stretch grow-0 z-0"
                >
                    {/* LEFT: Lists (Flex: 1 to take remaining space) */}
                    <div className="flex-1 space-y-8">
                        {activeTab === 'endorsed' ? (
                            <>
                                {renderProposalSection("Pending Evaluations", "bg-[#800000]", mockEndorsed.length, mockEndorsed)}
                                {renderProposalSection("Under Evaluation", "bg-[#FFBD00]", mockEvaluating.length, mockEvaluating)}
                                {renderProposalSection("Evaluated", "bg-[#2D6A4F]", 0, [])}
                            </>
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-full">
                                <Table>
                                    <MethodologyHeader />
                                    <MethodologyRow />
                                </Table>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Preview Pane (Fixed width) */}
                    <div className="w-[400px]">
                        <div className="h-full sticky top-6 bg-white border border-slate-200 rounded-3xl min-h-[600px] flex flex-col items-center justify-center text-center p-8 text-slate-400 shadow-sm">
                            <Icon name={activeTab === 'endorsed' ? "docuDefault" : "editDefault"} size={48} className="opacity-20 mb-4" />
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-tight">
                                {activeTab === 'endorsed' ? 'Select a proposal to review' : 'Click a request to view details'}
                            </p>
                            <p className="text-xs mt-2">Detailed evaluation metrics and documents will appear here.</p>
                        </div>
                    </div>
                </div>
            </div>

        </AppLayout><NavFooter /></>
    );
}