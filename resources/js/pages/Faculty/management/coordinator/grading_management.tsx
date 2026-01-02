import React, { useState, useEffect, useMemo } from 'react';
import { grading_management } from '@/routes/faculty/management/coordinator';
import { Head, useForm } from '@inertiajs/react';
import { 
    Calendar, CheckCircle, Clock, AlertCircle, 
    FileText, X, BookOpen, Users, UserCheck, Check,
    User, 
    LucideIcon
} from 'lucide-react';

// --- SHARED COMPONENTS ---
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { NavFooter } from '@/components/nav-footer';
import { Button } from '@/components/ui/button';

// --- TYPE DEFINITIONS ---
interface GradeComponent {
    label: string;
    weight: string;
    score: number;
    max: number;
}

interface Thesis {
    id: number;
    title: string;
    group: string;
    date: string;
    total: string;
    status: 'Pending Review' | 'Under Review' | 'Locked' | string;
    students: string[];
    adviser: string;
    components: GradeComponent[];
}

// --- MOCK DATA ---
const MOCK_THESIS_DATA: Thesis[] = [
    {
        id: 1,
        title: "AI-Powered Traffic Management System for Urban Areas",
        group: "Group 1",
        date: "Oct 24, 2025",
        total: "1.25",
        status: "Pending Review",
        students: ["John Doe", "Jane Smith", "Mark Evans"],
        adviser: "Dr. Roberto Garcia",
        components: [
            { label: "Technical Implementation", weight: "40%", score: 38, max: 40 },
            { label: "Oral Defense", weight: "30%", score: 25, max: 30 },
            { label: "Manuscript Quality", weight: "30%", score: 28, max: 30 }
        ]
    },
    {
        id: 2,
        title: "Blockchain-Based Secure Voting Protocol",
        group: "Group 5",
        date: "Oct 26, 2025",
        total: "1.50",
        status: "Under Review",
        students: ["Alice Wong", "Bob Richards"],
        adviser: "Engr. Sarah Lee",
        components: [
            { label: "Technical Implementation", weight: "40%", score: 35, max: 40 },
            { label: "Oral Defense", weight: "30%", score: 27, max: 30 },
            { label: "Manuscript Quality", weight: "30%", score: 25, max: 30 }
        ]
    },
    {
        id: 3,
        title: "IoT-Based Smart Agriculture Monitoring",
        group: "Group 12",
        date: "Oct 20, 2025",
        total: "1.00",
        status: "Locked",
        students: ["Chris Pratt", "Vin Diesel", "Paul Walker"],
        adviser: "Dr. Elena Gilbert",
        components: [
            { label: "Technical Implementation", weight: "40%", score: 40, max: 40 },
            { label: "Oral Defense", weight: "30%", score: 29, max: 30 },
            { label: "Manuscript Quality", weight: "30%", score: 30, max: 30 }
        ]
    }
];

const breadcrumb: BreadcrumbItem[] = [
    { title: 'Grade Management', href: grading_management.url() },
];

const StatCard = ({ icon: Icon, label, value, iconBgClass, iconColorClass }: any) => (
    <div className="bg-primary-foreground border border-primary/10 rounded-xl shadow-sm p-6 flex items-center gap-5 hover:shadow-md transition-all h-32">
        <div className={`w-14 h-14 rounded-2xl ${iconBgClass} flex items-center justify-center shrink-0`}>
            <Icon className={`w-8 h-8 ${iconColorClass}`} strokeWidth={2.5} />
        </div>
        <div>
            <h3 className="text-primary font-bold text-[14px] leading-none mb-2 tracking-tight">{label}</h3>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

export default function GradingManagement({ thesisData = MOCK_THESIS_DATA }: { thesisData?: Thesis[] }) {
    const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showConfirmLock, setShowConfirmLock] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const { data, setData, post, reset, processing } = useForm({
        id: null as number | null,
        remarks: '',
    });

    const stats = useMemo(() => ({
        pending: thesisData.filter(t => t.status === 'Pending Review').length,
        underReview: thesisData.filter(t => t.status === 'Under Review').length,
        locked: thesisData.filter(t => t.status === 'Locked').length,
        total: thesisData.length
    }), [thesisData]);

    const handleReviewClick = (thesis: Thesis) => {
        setSelectedThesis(thesis);
        setData({ id: thesis.id, remarks: '' });
        setIsModalOpen(true);
    };

    const confirmLock = () => {
        // Logic for POST request remains the same
        setShowConfirmLock(false);
        setIsModalOpen(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title="Grade Management" />

            <div className="flex flex-col min-h-screen -mt-4 -mx-4 -mb-4 md:-mt-4 md:-mx-6 md:-mb-6 lg:-mt-6 lg:-mx-8 lg:-mb-8 bg-primary-foreground">
                
                {/* Custom Header Section */}
                <div className="bg-primary-foreground border-b border-primary/20 px-8 py-10 mb-8">
                    <div className="max-w-7xl mx-auto flex items-center gap-5">
                        <div className="p-3 bg-primary rounded-xl shadow-lg shadow-primary/20">
                            <Calendar className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-primary-foreground-2 tracking-tight">
                                Grade Finalization
                            </h2>
                            <p className="text-muted-foreground text-sm font-medium">
                                System-wide audit and locking of final thesis performance metrics
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-8 w-full space-y-8 flex-grow">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard icon={Clock} label="Pending Review" value={stats.pending} iconBgClass="bg-amber-50" iconColorClass="text-amber-600" />
                        <StatCard icon={AlertCircle} label="Under Review" value={stats.underReview} iconBgClass="bg-indigo-50" iconColorClass="text-indigo-600" />
                        <StatCard icon={CheckCircle} label="Locked" value={stats.locked} iconBgClass="bg-emerald-50" iconColorClass="text-emerald-600" />
                        <StatCard icon={FileText} label="Total Groups" value={stats.total} iconBgClass="bg-slate-50" iconColorClass="text-slate-600" />
                    </div>

                    {/* Main Table */}
                    <div className="bg-primary-foreground rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-12">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-primary text-primary-foreground text-[15px] tracking-[0.15em]">
                                    <tr>
                                        <th className="px-6 py-5 font-bold text-center">Thesis Title</th>
                                        <th className="px-6 py-5 font-bold text-center">Group</th>
                                        <th className="px-6 py-5 font-bold text-center">Defense Date</th>
                                        <th className="px-6 py-5 font-bold text-center">GWA</th>
                                        <th className="px-6 py-5 font-bold text-center">Status</th>
                                        <th className="px-6 py-5 font-bold text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-[13px]">
                                    {thesisData.map((row) => (
                                        <tr key={row.id} className="hover:bg-[#FDFCF6]/50 transition-colors">
                                            <td className="px-6 py-5 font-semibold text-slate-800 max-w-xs truncate" title={row.title}>{row.title}</td>
                                            <td className="px-6 py-5 text-center font-bold text-foreground">{row.group}</td>
                                            <td className="px-6 py-5 text-center text-foreground">{row.date}</td>
                                            <td className="px-6 py-5 text-center font-black text-slate-900">{row.total}</td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                                                    row.status === 'Under Review' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                                    row.status === 'Locked' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <Button 
                                                    variant="outline" 
                                                    onClick={() => handleReviewClick(row)}
                                                    className="h-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-[11px] font-bold uppercase"
                                                >
                                                    Review
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer is now inside the flex column to stick to bottom correctly */}
                <div className="w-full mt-20">
                    <NavFooter />
                </div>
            </div>

            {/* --- MODAL LOGIC (Review / Confirm / Success) --- */}
            {isModalOpen && selectedThesis && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-primary-foreground w-full max-w-[500px] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative animate-in zoom-in-95">
                        <div className="bg-primary px-8 py-6 flex justify-between items-center text-primary-foreground shrink-0">
                            <h3 className="font-black text-lg tracking-widest uppercase">Grade Review</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 hover:rotate-90 transition-transform" /></button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <div className="mb-8">
                                <div className="flex items-center gap-4 text-primary font-black text-4xl mb-2">
                                    <User className="w-10 h-10 fill-current" /> 
                                    <span>{selectedThesis.group}</span>
                                </div>
                                <div className="text-[11px] text-slate-400 uppercase font-black tracking-[0.2em] pl-14">Academic Performance Audit</div>
                            </div>

                            <div className="space-y-4 mb-10 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex gap-4"><BookOpen className="w-4 h-4 text-primary shrink-0" /><span className="text-[13px] font-bold text-slate-700 leading-relaxed">{selectedThesis.title}</span></div>
                                <div className="flex gap-4"><Users className="w-4 h-4 text-slate-400 shrink-0" /><span className="text-[12px] text-slate-500 font-medium">{selectedThesis.students?.join(', ')}</span></div>
                                <div className="flex gap-4"><UserCheck className="w-4 h-4 text-slate-400 shrink-0" /><span className="text-[12px] text-slate-500 font-medium">Adviser: {selectedThesis.adviser}</span></div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <h4 className="text-primary font-black text-[11px] uppercase tracking-widest mb-4">Metric Breakdown</h4>
                                {selectedThesis.components.map((item, idx) => (
                                    <div key={idx} className="bg-primary-foreground border border-slate-100 rounded-2xl p-4 shadow-sm">
                                        <div className="flex justify-between text-[11px] font-black text-slate-800 mb-3 uppercase tracking-tighter">
                                            <span>{item.label}</span>
                                            <span className="text-primary">{item.weight}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${(item.score / item.max) * 100}%` }}></div>
                                        </div>
                                        <div className="mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Score: {item.score} / {item.max}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3">
                                <label className="text-primary font-black text-[11px] uppercase tracking-widest">Final Coordinator Remarks</label>
                                <textarea 
                                    className="w-full border border-slate-200 rounded-2xl p-5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" 
                                    placeholder="Enter audit remarks for the registrar..." rows={3}
                                    value={data.remarks}
                                    onChange={(e) => setData('remarks', e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <div className="p-8 flex justify-end gap-3 bg-primary-foreground border-t border-slate-50">
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="font-bold text-slate-400 uppercase text-[11px]">Cancel</Button>
                            <Button onClick={() => setShowConfirmLock(true)} className="bg-primary hover:bg-[#5a0000] text-primary-foreground font-black px-10 rounded-xl uppercase text-[11px] tracking-widest shadow-lg shadow-primary/20">Lock Grades</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Alert */}
            {showConfirmLock && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-primary/10 backdrop-blur-sm px-4">
                    <div className="bg-primary-foreground rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
                        <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-12">
                            <AlertCircle className="w-10 h-10 text-primary-foreground -rotate-12" />
                        </div>
                        <h3 className="font-black text-xl mb-3 text-slate-900 uppercase tracking-tighter">Finalize Grade?</h3>
                        <p className="text-sm text-slate-500 mb-10 leading-relaxed font-medium">This Group's grade will be transmitted to the official records. This action is <span className="text-primary font-bold uppercase">permanent</span>.</p>
                        <div className="flex flex-col gap-3">
                            <Button onClick={confirmLock} className="w-full bg-primary hover:bg-[#5a0000] text-primary-foreground rounded-2xl font-black h-12 uppercase tracking-widest">Confirm & Lock</Button>
                            <Button variant="ghost" onClick={() => setShowConfirmLock(false)} className="w-full text-slate-400 font-bold uppercase text-[11px]">Go Back</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none">
                    <div className="bg-primary-foreground rounded-[3rem] shadow-2xl p-10 max-w-xs w-full text-center animate-in fade-in zoom-in duration-500 border border-emerald-100">
                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                            <Check className="w-10 h-10 text-primary-foreground stroke-[4]" />
                        </div>
                        <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.3em]">Grade Locked</h3>
                        <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase">Official Record Updated</p>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}