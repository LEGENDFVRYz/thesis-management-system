import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { AppContent } from '@/components/app-content';
import { FileText, Search, Edit3, ArrowRight, CheckCircle2, MessageSquare, XCircle } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { Icon } from '@/components/icon-index';
import { CommitteeCard } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import FilterSearchSection from '@/components/filter-search-section';
import { Button } from '@/components/ui/button';
import { MethodologyHeader } from '@/components/ui/headers';
import { MethodologyRow } from '@/components/ui/rows';
import { Badge } from '@/components/badges-index';
import { Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

/**
 * SECTION 1: Endorsed Proposals View
 * Displays three categorized tiers of proposals. 
 * Uses theme variables: --primary (Maroon), --primary-foreground-2 (Yellow), and --evaluated-border (Green).
 */
const EndorsedProposalsSection = ({ mockEndorsed, mockEvaluating, selectedItem, setSelectedItem, renderProposalSection }: any) => (
    <div className="flex-1 space-y-8 font-dm">
        {renderProposalSection("Pending Evaluations", "bg-primary", mockEndorsed.length, mockEndorsed)}
        {renderProposalSection("Under Evaluation", "bg-primary-foreground-2", mockEvaluating.length, mockEvaluating)}
        {renderProposalSection("Evaluated", "bg-completed-border", 0, [])}
    </div>
);

/**
 * SECTION 2: Change Requests View
 * Tabular layout for tracking methodology and scope revisions.
 * Utilizes custom-scrollbar from base layer.
 */
const ChangeRequestsSection = ({ changeRequests, selectedItem, setSelectedItem }: any) => (
    <div className="flex flex-col space-y-4 text-left flex-1 font-dm">
        <div className="bg-background rounded-xl border border-border overflow-hidden shadow-sm h-[620px] flex flex-col">
            <MethodologyHeader variant='dynamic' columns={['Title', 'Type of Changes', 'Submitted', 'Status']} />
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-muted/5">
                {changeRequests.map((req: any) => (
                    <div 
                        key={req.id} 
                        onClick={() => setSelectedItem(req)}
                        className={cn(
                            "cursor-pointer transition-colors border-b border-border/50", 
                            selectedItem?.id === req.id ? "bg-primary/5" : "hover:bg-muted/30"
                        )}
                    >
                        <MethodologyRow
                            variant="dynamic"
                            data={[
                                { value: <span className="text-foreground text-sm">{req.title}</span> },
                                { value: <Badge name={'changesBadgesMethodologyChange'} className='text-sm px-4 py-2'/> },
                                { value: <span className="text-alert-desc text-sm">{req.date}</span> },
                                { value: <Badge name={req.status === 'Approved' ? 'statusBadgeApproved' : req.status === 'Denied' ? 'statusBadgeDenied' : 'statusBadgePendingReview'} /> }
                            ]}
                        />
                    </div>
                ))}
            </div>
        </div>
    </div>
);

/**
 * SECTION 3: Dynamic Right Action Pane
 * Interactive feedback system for approving or rejecting submissions.
 */
const RightActionPane = ({ selectedItem, activeTab }: any) => {
    // State to track the local status of the current change request
    // In a real app, this would likely come from your 'selectedItem.status'
    const [actionState, setActionState] = useState<'idle' | 'approved' | 'rejected' | 'clarifying'>('idle');
    const [clarificationText, setClarificationText] = useState("");

    // Reset state when the selected item changes
    React.useEffect(() => {
        setActionState('idle');
        setClarificationText("");
    }, [selectedItem?.id]);

    if (!selectedItem) {
        return (
            <div className={cn(
                "bg-background border border-border rounded-3xl flex flex-col items-center justify-center text-center p-8 text-alert-desc shadow-sm font-dm",
                activeTab === 'endorsed' ? "h-[1460px]" : "h-[620px]"
            )}>
                <Icon name={activeTab === 'endorsed' ? "docuDefault" : "editDefault"} size={48} className="opacity-20 mb-4" />
                <p className="text-sm font-bold text-alert-desc uppercase tracking-tight mt-5">
                    {activeTab === 'endorsed' ? 'Select a proposal to review' : 'Click a request to view details'}
                </p>
            </div>
        );
    }

    if (activeTab === 'endorsed') {
        return (
            <div className="flex flex-col gap-4 h-[1460px] font-dm">
                {/* Proposal Details Card */}
                <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                    <h3 className="text-md font-bold text-primary mb-4 border-b border-border pb-2">Proposal Details</h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-alert-desc">Title:</p>
                            <p className="text-sm font-bold text-foreground leading-tight">{selectedItem.title}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-alert-desc">Proponents:</p>
                            <p className="text-sm font-medium text-foreground">Sofia Torres, Miguel Lopez, Ana Garcia</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-alert-desc">Adviser:</p>
                                <p className="text-[11px] text-foreground font-medium truncate">{selectedItem.adviser}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-alert-desc">Block:</p>
                                <p className="text-[11px] text-foreground font-medium">{selectedItem.block}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-alert-desc">Submitted:</p>
                                <p className="text-[11px] text-foreground font-medium">Nov 30, 2025</p>
                            </div>
                        </div>
                        <Button variant="outline" className="tertiary-btn w-full mt-2 h-9 text-xs font-bold gap-2">
                            <Eye className="w-4 h-4" /> View Proposal
                        </Button>
                    </div>
                </div>

                {/* Evaluation Progress Card */}
                <div className="bg-background border border-border rounded-xl p-5 shadow-sm">
                    <h3 className="text-md font-bold text-primary mb-4">Evaluation Progress</h3>
                    <Skeleton variant="eval" progress={4} />
                    <p className="text-xs text-muted-foreground uppercase mb-2 mt-3">Pending evaluation:</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {['Dr. Maria Santos', 'Dr. Juan Cruz', 'Dr. Lisa Fernandez', 'Dr. Robert Chen', 'Dr. Anna Reyes', 'Dr. Carlos Gomez'].map(name => (
                            <div key={name} className="flex items-center gap-2">
                                <Checkbox id="names" className='h-4 w-4'/>
                                <Label htmlFor="names" className="font-normal cursor-pointer text-foreground">
                                    {name}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comments & Feedback Card */}
                <div className="bg-background border border-border rounded-xl p-5 shadow-sm flex-1 flex flex-col">
                    <h3 className="text-md font-bold text-primary mb-4 border-b border-border pb-2">Comments & Feedback</h3>
                    <div className="flex-1 flex flex-col items-center justify-center text-alert-desc">
                         <p className="text-xs">No Comments yet</p>
                    </div>
                    <div className="mt-4 space-y-3">
                        <p className="text-sm font-medium text-alert-desc">Provide your feedback and submit your decision</p>
                        <Input className="h-[200px] pt-1 pb-[140px] leading-tight" inputSize="full" placeholder="Text field input..." onChange={(e) => console.log(e.target.value)} />
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant={'tertiary'} className="bg-alert-success/15 text-alert-success border-alert-success opacity-90 h-10 hover:bg-alert-success hover:text-white">
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                            </Button>
                            <Button variant={'tertiary'} className="bg-alert-warning/15 text-alert-warning border-alert-warning opacity-90 h-10 hover:bg-alert-warning hover:text-white">
                                <XCircle className="w-4 h-4 mr-2" /> Reject
                            </Button>
                        </div>
                        <Button variant="outline" className="tertiary-btn w-full h-10 font-bold">
                             <Edit3 className="w-4 h-4 mr-2" /> Request Revision
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm h-[620px] overflow-y-auto custom-scrollbar flex flex-col gap-4 font-dm">
            <div>
                <h3 className="text-md font-bold text-primary">Request Details</h3>
                <p className="text-[13px] text-foreground font-medium mt-1 leading-tight">{selectedItem.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-background border border-border rounded-xl p-4 shadow-sm">
                <div>
                    <p className="text-[10px] uppercase font-bold text-alert-desc">Adviser</p>
                    <p className="text-[13px] font-bold text-foreground">{selectedItem.adviser || 'Dr. Maria Santos'}</p>
                </div>
                <div>
                    <p className="text-[10px] uppercase font-bold text-alert-desc">Section</p>
                    <p className="text-[13px] font-bold text-foreground">{selectedItem.block || 'BSCPE 4-2'}</p>
                </div>
            </div>

            {/* Current vs Proposed - Static Example from Image */}
            <div className="space-y-3">
                <div className="bg-muted/10 border border-border rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <ArrowRight className="w-3.5 h-3.5 text-alert-desc" />
                        <span className="text-[10px] font-bold text-alert-desc uppercase">Current Version (DP1)</span>
                    </div>
                    <p className="text-[12px] text-foreground">Initial methodology involves data collection from surveys.</p>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <ArrowRight className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-bold text-primary uppercase">Proposed Change (DP2)</span>
                    </div>
                    <p className="text-[12px] text-foreground">Change data collection to include both surveys and interviews.</p>
                </div>
            </div>

            <div className="bg-under-eval-bg border border-under-eval-border rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                    <ArrowRight className="w-3.5 h-3.5 text-under-eval-font-color" />
                    <span className="text-[10px] font-bold text-under-eval-font-color uppercase">Justification</span>
                </div>
                <p className="text-[12px] text-foreground leading-relaxed">Interviews will provide deeper insights into student performance.</p>
            </div>

            <div className="bg-evaluated-bg border border-evaluated-border rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                    <ArrowRight className="w-3.5 h-3.5 text-evaluated-font-color" />
                    <span className="text-[10px] font-bold text-evaluated-font-color uppercase">Adviser Recommendation</span>
                </div>
                <p className="text-[12px] text-foreground leading-relaxed">Consider conducting a pilot study to validate the new methodology.</p>
            </div>

            {/* DYNAMIC SECTION BASED ON ACTION */}
            <div className="mt-auto pt-4 space-y-3">
                {actionState === 'idle' && (
                    <div className="grid grid-cols-3 gap-2">
                        <Button 
                            onClick={() => setActionState('approved')}
                            className="bg-alert-success/10 text-alert-success border border-alert-success/50 hover:bg-alert-success hover:text-white text-[11px] font-bold h-10 shadow-none"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                        </Button>
                        <Button 
                            onClick={() => setActionState('clarifying')}
                            variant="outline" 
                            className="text-alert-desc text-[11px] font-bold h-10 border-border"
                        >
                            <MessageSquare className="w-3.5 h-3.5 mr-1" /> Clarify
                        </Button>
                        <Button 
                            onClick={() => setActionState('rejected')}
                            className="bg-alert-warning/10 text-alert-warning border border-alert-warning/50 hover:bg-alert-warning hover:text-white text-[11px] font-bold h-10 shadow-none"
                        >
                            <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                    </div>
                )}

                {actionState === 'clarifying' && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
                        <p className="text-[11px] font-bold text-primary uppercase">Clarify...</p>
                        <Input 
                            className="h-[100px] bg-white pt-2 align-top text-xs" 
                            placeholder="Text field input..." 
                            value={clarificationText}
                            onChange={(e) => setClarificationText(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <Badge name="statusBadgePendingReview" className="bg-primary/20 text-primary border-primary/30">
                                <Edit3 className="w-3 h-3 mr-1" /> For Revision
                            </Badge>
                        </div>
                    </div>
                )}

                {(actionState === 'approved' || actionState === 'rejected') && (
                    <div className="bg-muted/30 border border-border rounded-xl p-4 flex flex-col items-center text-center space-y-3">
                        <div className="flex items-center gap-3 text-left w-full">
                            <CheckCircle2 className={cn("w-6 h-6", actionState === 'approved' ? "text-alert-info" : "text-alert-warning")} />
                            <div>
                                <p className="text-sm font-bold text-foreground">Submitted</p>
                                <p className="text-[11px] text-alert-desc leading-none">You have responded to this request.</p>
                            </div>
                        </div>
                        <div className="pt-3 border-t border-border w-full flex justify-center">
                            <div className={cn(
                                "text-[10px] font-bold px-4 py-1 rounded-full flex items-center gap-1.5 border",
                                actionState === 'approved' 
                                    ? "bg-evaluated-bg text-evaluated-font-color border-evaluated-border" 
                                    : "bg-alert-warning/10 text-alert-warning border-alert-warning/30"
                            )}>
                                {actionState === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                {actionState === 'approved' ? 'Approved' : 'Rejected'}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function ProposalReview() {
    const [activeTab, setActiveTab] = useState<'endorsed' | 'changes'>('endorsed');
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Filter/Mock data remains unchanged to preserve functionality
    const changeRequests = [
        { id: 101, title: "AI Analytics for Centralized Machine Learning Hub", type: "Methodology", date: "Jan 1", status: "Approved" },
        { id: 102, title: "Blockchain System for Secure Transactions", type: "Scope", date: "Jan 3", status: "Pending" },
        { id: 103, title: "Cloud Computing in Healthcare Stations", type: "Literature Review", date: "Jan 5", status: "Approved" },
        { id: 104, title: "Data Mining on Industrial Data for Predictive Maintenance", type: "Methodology", date: "Jan 7", status: "Pending" },
        { id: 105, title: "E-commerce Platform", type: "Objectives", date: "Jan 9", status: "Approved" },
        { id: 106, title: "Fintech Solutions for Financial Inclusion", type: "Methodology", date: "Jan 11", status: "Pending" },
        { id: 107, title: "Gaming Technologies for Educational Engagement", type: "Literature Review", date: "Jan 13", status: "Approved" },
        { id: 108, title: "Healthcare IT Systems for Patient Monitoring", type: "Scope", date: "Jan 15", status: "Pending" },
        { id: 109, title: "IoT Solutions for Smart Cities Infrastructure", type: "Objectives", date: "Jan 17", status: "Approved" },
        { id: 110, title: "JavaScript Frameworks for Modern Web Applications", type: "Methodology", date: "Jan 19", status: "Pending" },
        { id: 111, title: "Knowledge Management in Educational Institutions", type: "Literature Review", date: "Jan 21", status: "Approved" },
        { id: 112, title: "Logistics Systems", type: "Scope", date: "Jan 23", status: "Pending" },
        { id: 113, title: "Mobile Applications", type: "Objectives", date: "Jan 25", status: "Approved" },
        { id: 114, title: "Network Security", type: "Methodology", date: "Jan 27", status: "Pending" },
        { id: 115, title: "Open Source Software", type: "Literature Review", date: "Jan 29", status: "Approved" },
    ];
    
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
    }).map((item, i) => ({ ...item, id: i + 20 }));

    const renderProposalSection = (title: string, headerColor: string, count: number, data: any[]) => {
        return (
            <section className="bg-background rounded-2xl border border-border overflow-hidden shadow-sm flex flex-col font-dm">
                <div className={cn("p-3 flex justify-between items-center px-5 shrink-0", headerColor)}>
                    <span className="font-bold text-sm text-white">{title}</span>
                    <div className="bg-white/90 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center justify-center min-w-[20px]">
                        <span className={cn(
                            "font-bold",
                            headerColor === "bg-primary" ? "text-primary" : headerColor === "bg-primary-foreground-2" ? "text-alert-yellow-selected" : "text-alert-success"
                        )}>{count}</span>
                    </div>
                </div>

                <div className="p-4 overflow-y-auto h-[420px] bg-muted/5 custom-scrollbar">
                    {data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                            {data.map((item) => (
                                <div 
                                    key={item.id} 
                                    onClick={() => setSelectedItem(item)} 
                                    className={cn(
                                        "cursor-pointer transition-all duration-200 rounded-xl",
                                        selectedItem?.id === item.id ? "ring-2 ring-primary ring-offset-2" : "hover:opacity-90"
                                    )}
                                >
                                    <CommitteeCard
                                        thesisTitle={item.title}
                                        adviserName={item.adviser}
                                        blockSection={item.block}
                                        currentStage={item.stage}
                                        totalStages={6} progress={3}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center py-12 text-alert-desc">
                            <div className="bg-muted p-4 rounded-full mb-3">
                                <Icon name="docuDefault" size={32} className="opacity-40" />
                            </div>
                            <p className="text-sm font-semibold">No proposals found</p>
                        </div>
                    )}
                </div>
            </section>
        );
    };

    return (
        <>
            <AppLayout breadcrumbs={[{ title: 'Proposal Review', href: '/proposal-review' }, { title: activeTab === 'endorsed' ? 'Endorsed Proposals' : 'Change Requests' } as BreadcrumbItem]}>
                <Head title="Proposal Review" />

                <AppContent
                    title="Proposal Review"
                    subtitle="Review and evaluate thesis proposals submitted for committee approval"
                    icon={<FileText className="w-8 h-8 text-primary-foreground-2" />}
                    variant="header"
                />

                <div className="px-6 max-w-[1440px] mx-auto w-full space-y-6 font-dm pb-10">
                    <div className="flex border-b border-border w-full">
                        <Button 
                            variant="ghost" 
                            onClick={() => {setActiveTab('endorsed'); setSelectedItem(null);}} 
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all rounded-b-none border-b-2", 
                                activeTab === 'endorsed' ? "border-primary text-primary" : "border-transparent text-alert-desc hover:bg-muted"
                            )}
                        >
                            <Icon name={activeTab === 'endorsed' ? "docuClicked" : "docuDefault"} size={16} />
                            Endorsed Proposal
                        </Button>
                        <Button 
                            variant="ghost" 
                            onClick={() => {setActiveTab('changes'); setSelectedItem(null);}} 
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all rounded-b-none border-b-2", 
                                activeTab === 'changes' ? "border-primary text-primary" : "border-transparent text-alert-desc hover:bg-muted"
                            )}
                        >
                            <Icon name={activeTab === 'changes' ? "editClicked" : "editDefault"} size={16} />
                            Change Requests
                        </Button>
                    </div>

                    <FilterSearchSection variant='Notifications'/>

                    <div className="flex flex-row items-start gap-[30px] w-full max-w-[1360px] mx-auto">
                        {activeTab === 'endorsed' ? (
                            <EndorsedProposalsSection 
                                mockEndorsed={mockEndorsed} 
                                mockEvaluating={mockEvaluating} 
                                selectedItem={selectedItem} 
                                setSelectedItem={setSelectedItem} 
                                renderProposalSection={renderProposalSection}
                            />
                        ) : (
                            <ChangeRequestsSection 
                                changeRequests={changeRequests} 
                                selectedItem={selectedItem} 
                                setSelectedItem={setSelectedItem} 
                            />
                        )}

                        <div className="w-[400px] shrink-0">
                            <div className="sticky top-6 flex flex-col gap-4">
                                <RightActionPane 
                                    selectedItem={selectedItem} 
                                    activeTab={activeTab} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </AppLayout>
            <NavFooter />
        </>
    );
}