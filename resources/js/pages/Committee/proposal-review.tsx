import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { AppContent } from '@/components/app-content';
import { FileText, Search, ArrowUpDown, Trash2, User, Grid, Edit3 } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { Icon } from '@/components/icon-index';
import { CommitteeCard } from '@/components/ui/card';
import { Badge } from '@/components/badges-index';
import { cn } from '@/lib/utils';

// --- DATA TYPES ---
interface ProposalData {
    id: number;
    title: string;
    adviser: string;
    block: string;
    stage: number;
}

interface ChangeRequestData {
    id: number;
    title: string;
    type: string;
    date: string;
    status: string;
}

export default function ProposalReview() {
    // 1. STATE FOR TAB SWITCHING
    const [activeTab, setActiveTab] = useState<'endorsed' | 'changes'>('endorsed');

    // --- MOCK DATA ---
    const pendingProposals: ProposalData[] = [
        { id: 1, title: "Mobile App for Mental Health Support in Universities", adviser: "Dr. Lisa Fernandez", block: "BSCPE 3-3", stage: 0 },
        { id: 2, title: "IoT-Based Smart Campus Energy Management", adviser: "Dr. Maria Santos", block: "BSCPE 3-2", stage: 0 },
    ];

    const changeRequests: ChangeRequestData[] = [
        { id: 1, title: "AI-Powered Student Performance Analytics System", type: "Methodology Change", date: "December 2, 2025", status: "Pending Review" },
        { id: 2, title: "Blockchain-Based Academic Credential Verification", type: "Scope Change", date: "October 16, 2025", status: "Approved" },
        { id: 3, title: "Mobile App for Mental Health Support in Universities", type: "Title Change", date: "August 5, 2025", status: "Denied" },
    ];

    // --- REUSABLE SECTION RENDERER (For Endorsed Tab) ---
    const renderProposalSection = (title: string, headerColor: string, count: number, data: ProposalData[]) => {
        const isGold = headerColor === "bg-[#FFBD00]";
        return (
            <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className={cn("p-3 flex justify-between items-center px-5", headerColor)}>
                    <span className={cn("font-bold text-sm", isGold ? "text-[#800000]" : "text-white")}>{title}</span>
                    <div className="bg-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center justify-center">
                        <span className={cn(isGold ? "text-[#FFBD00]" : headerColor.replace('bg-', 'text-'))}>{count}</span>
                    </div>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 bg-slate-50/10">
                    {data.map((item) => (
                        <CommitteeCard
                            key={item.id}
                            thesisTitle={item.title}
                            adviserName={item.adviser}
                            blockSection={item.block}
                            currentStage={item.stage}
                            totalStages={6} progress={0}                        />
                    ))}
                </div>
            </section>
        );
    };

    return (
        <>
            <AppLayout breadcrumbs={[
                { title: 'Proposal Review', href: '/proposal-review' }, 
                { title: activeTab === 'endorsed' ? 'Endorsed Proposals' : 'Change Requests' } as BreadcrumbItem
            ]}>
                <Head title="Proposal Review" />

                <AppContent
                    title="Proposal Review"
                    subtitle="Review and evaluate thesis proposals submitted for committee approval"
                    icon={<FileText className="w-8 h-8 text-[#FFBD00]" />}
                    variant="header"
                />

                <div className="px-6 pb-10 max-w-[1600px] mx-auto w-full mt-6 space-y-6">
                    
                    {/* 1. TABS SECTION */}
                    <div className="flex border-b border-slate-200 w-full">
                        <button 
                            onClick={() => setActiveTab('endorsed')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all",
                                activeTab === 'endorsed' ? "border-b-2 border-[#800000] text-[#800000]" : "text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            <FileText className="w-4 h-4" />
                            Endorsed Proposal
                        </button>
                        <button 
                            onClick={() => setActiveTab('changes')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all",
                                activeTab === 'changes' ? "border-b-2 border-[#800000] text-[#800000]" : "text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            <Edit3 className="w-4 h-4" />
                            Change Requests
                        </button>
                    </div>

                    {/* 2. CONDITIONAL CONTENT RENDER */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        
                        <div className="flex-1 space-y-8">
                            {activeTab === 'endorsed' ? (
                                <>
                                    {/* FILTER SECTION (Only for Endorsed) */}
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-end text-left">
                                        <div className="md:col-span-4 space-y-2">
                                            <label className="text-xs font-bold text-slate-500">Search</label>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input className="w-full pl-10 pr-4 py-2 bg-[#F2EBD4]/30 border border-[#F2EBD4] rounded-lg text-sm outline-none" placeholder="Keywords, Terms..." />
                                            </div>
                                        </div>
                                        {/* ... other filters ... */}
                                        <div className="md:col-span-2 flex gap-2">
                                            <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#800000] text-white rounded-lg text-sm font-bold">
                                                <Trash2 className="w-4 h-4" />
                                                Clear Filter
                                            </button>
                                        </div>
                                    </div>

                                    {/* SECTIONS */}
                                    {renderProposalSection("Pending Evaluations", "bg-[#800000]", 12, pendingProposals)}
                                    {renderProposalSection("Under Evaluation", "bg-[#FFBD00]", 6, pendingProposals.slice(0, 1))}
                                </>
                            ) : (
                                <div className="space-y-4 text-left">
                                    <h3 className="text-sm font-bold text-slate-600">Change Requests</h3>
                                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-[#800000] text-white text-[11px] uppercase tracking-wider">
                                                <tr>
                                                    <th className="px-6 py-3 font-bold">Title</th>
                                                    <th className="px-6 py-3 font-bold">Type of Changes</th>
                                                    <th className="px-6 py-3 font-bold">Submitted</th>
                                                    <th className="px-6 py-3 font-bold">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {changeRequests.map((req) => (
                                                    <tr key={req.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                                                        <td className="px-6 py-4 font-bold text-[#800000]">{req.title}</td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-purple-600 font-medium text-xs bg-purple-50 px-2 py-1 rounded-full border border-purple-100">
                                                                {req.type}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-500 font-medium">{req.date}</td>
                                                        <td className="px-6 py-4">
                                                            <Badge name={req.status === 'Approved' ? 'statusBadgeApproved' : req.status === 'Denied' ? 'statusBadgeDenied' : 'statusBadgePendingReview'} size={80} />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. RIGHT COLUMN: Preview Pane (Universal) */}
                        <div className="w-full lg:w-[400px] shrink-0">
                            <div className="sticky top-6 bg-white border border-slate-200 rounded-3xl min-h-[600px] flex flex-col items-center justify-center text-center p-8 text-slate-400 shadow-sm">
                                <div className="bg-slate-50 p-6 rounded-full mb-4">
                                    {activeTab === 'endorsed' ? <FileText className="w-12 h-12 opacity-20" /> : <Edit3 className="w-12 h-12 opacity-20" />}
                                </div>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-tight">
                                    {activeTab === 'endorsed' ? 'Select a proposal to review' : 'Click a request to view details'}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </AppLayout>
            <NavFooter />
        </>
    );
}