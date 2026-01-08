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
import { Badge } from '@/components/badges-index';
import { sign } from 'crypto';


// PAGE PROPS
export interface Proposal {
    proposal_id: number;
    proposal_title: string;
    proposal_filepath: string;
    submitted_date: string;       
    advisor_name: string;
    block: number;
    my_status: string | null;     
    my_comment: string | null;    
    proponents: string;           
}

interface ProposalReviewProps {
    proposals: {
        pending: Proposal[];
        evaluated: Proposal[];
    };
}


export default function ProposalReview({ proposals }: ProposalReviewProps) {
    const [activeTab, setActiveTab] = useState<'endorsed' | 'changes'>('endorsed');

    const changeRequests = [
    { id: 1, title: "AI Analytics for Centralized Machine Learning Hub", type: "Methodology", date: "Jan 1", status: "Approved" },
    { id: 2, title: "Blockchain System for Secure Transactions", type: "Scope", date: "Jan 3", status: "Pending" },
    { id: 3, title: "Cloud Computing in Healthcare Stations", type: "Literature Review", date: "Jan 5", status: "Approved" },
    { id: 4, title: "Data Mining on Industrial Data for Predictive Maintenance", type: "Methodology", date: "Jan 7", status: "Pending" },
    { id: 5, title: "E-commerce Platform", type: "Objectives", date: "Jan 9", status: "Approved" },
    { id: 6, title: "Fintech Solutions for Financial Inclusion", type: "Methodology", date: "Jan 11", status: "Pending" },
    { id: 7, title: "Gaming Technologies for Educational Engagement", type: "Literature Review", date: "Jan 13", status: "Approved" },
    { id: 8, title: "Healthcare IT Systems for Patient Monitoring", type: "Scope", date: "Jan 15", status: "Pending" },
    { id: 9, title: "IoT Solutions for Smart Cities Infrastructure", type: "Objectives", date: "Jan 17", status: "Approved" },
    { id: 10, title: "JavaScript Frameworks for Modern Web Applications", type: "Methodology", date: "Jan 19", status: "Pending" },
    { id: 11, title: "Knowledge Management in Educational Institutions", type: "Literature Review", date: "Jan 21", status: "Approved" },
    { id: 12, title: "Logistics Systems", type: "Scope", date: "Jan 23", status: "Pending" },
    { id: 13, title: "Mobile Applications", type: "Objectives", date: "Jan 25", status: "Approved" },
    { id: 14, title: "Network Security", type: "Methodology", date: "Jan 27", status: "Pending" },
    { id: 15, title: "Open Source Software", type: "Literature Review", date: "Jan 29", status: "Approved" },
    ];

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

                {/* 3. MAIN CONTENT CONTAINER */}
                <div className="flex flex-row items-stretch gap-[30px] mb-10 w-full max-w-[1360px] mx-auto self-stretch grow-0 z-0">
                    
                    {/* LEFT: Lists */}
                    <div className="flex-1 space-y-8">
                        {activeTab === 'endorsed' ? (
                            <>
                                {renderProposalSection("Pending Evaluations", "bg-primary", proposals.pending.length, proposals.pending)}
                                {/* {renderProposalSection("Under Evaluation", "bg-primary-foreground-2", mockEvaluating.length, mockEvaluating)} */}
                                {renderProposalSection("Evaluated", "bg-completed-border", proposals.evaluated.length, proposals.evaluated)}
                            </>
                        ) : (
                            <div className="flex flex-col space-y-4 text-left">
                                
                                {/* Scrollable Container with Fixed Header */}
                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-[620px] flex flex-col">
                                    
                                    {/* RESTORED: Header is outside the scrollable div to stay fixed */}
                                    <MethodologyHeader 
                                        variant='dynamic' 
                                        columns={['Title', 'Type of Changes', 'Submitted', 'Status']} 
                                    />

                                    {/* SCROLLABLE BODY: Wraps the row mapping */}
                                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/5">
                                        {changeRequests.length > 0 ? (
                                            changeRequests.map((req) => (
                                                <MethodologyRow
                                                    key={req.id}
                                                    variant="dynamic"
                                                    data={[
                                                        { value: req.title },
                                                        { value: (
                                                            <Badge name={'changesBadgesMethodologyChange'}/>
                                                        )},
                                                        { value: req.date },
                                                        { value: (
                                                            <Badge name={
                                                                req.status === 'Approved' ? 'statusBadgeApproved' : 
                                                                req.status === 'Denied' ? 'statusBadgeDenied' : 
                                                                'statusBadgePendingReview'
                                                            } />
                                                        )}
                                                    ]}
                                                />
                                            ))
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
                                                <Icon name="docuDefault" size={48} className="opacity-20 mb-4" />
                                                <p className="text-sm font-bold uppercase tracking-tight">No change requests</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Preview Pane (Fixed width) */}
                    <div className="w-[400px]">
                        <div className="h-full sticky top-6 bg-white border border-slate-200 rounded-3xl min-h-[600px] flex flex-col items-center justify-center text-center p-8 text-slate-400 shadow-sm">
                            <Icon name={activeTab === 'endorsed' ? "docuDefault" : "editDefault"} size={48} className="opacity-20 mb-4" />
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-tight text-balance">
                                {activeTab === 'endorsed' ? 'Select a proposal to review' : 'Click a request to view details'}
                            </p>
                            <p className="text-xs mt-2 text-balance">Detailed evaluation metrics and documents will appear here.</p>
                        </div>
                    </div>
                </div>
            </div>

        </AppLayout><NavFooter /></>
    );
}


// COMPONENT: Redering logic of the cards
const renderProposalSection = (title: string, headerColor: string, count: number, data: Proposal[]) => {
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
                                key={item.proposal_id}
                                thesisTitle={item.proposal_title}
                                adviserName={item.advisor_name}
                                blockSection={`BSCPE 3-${item.block}`}
                                currentStage={0}

                                // Note: currently missed by the assigned backend, will soon revised (though the logic is good)
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