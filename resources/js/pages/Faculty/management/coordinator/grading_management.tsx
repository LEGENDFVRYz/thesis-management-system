import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { NavFooter } from '@/components/nav-footer';
import { HeaderCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { 
    Calendar, 
    Clock, 
    AlertCircle, 
    CheckCircle2, 
    Users, 
    BookOpen, 
    User, 
    AlertCircleIcon, 
    Check 
} from 'lucide-react';
import { grading_management } from '@/routes/faculty/management/coordinator';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableCaption,
} from "@/components/ui/table";

const breadcrumb: BreadcrumbItem[] = [
    { title: 'Grade Management', href: grading_management().url },
];

export default function GradingManagement() {
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedThesis, setSelectedThesis] = useState<any>(null);

    const [theses] = useState([
        { id: 1, title: "AI-Powered Student Performance Analytics System", groupCode: "3310", defenseDate: "November 29, 2025", grade: "69%", status: "For Review" },
        { id: 2, title: "AI-Powered Student Performance Analytics System", groupCode: "3310", defenseDate: "November 29, 2025", grade: "69%", status: "For Review" },
        { id: 3, title: "AI-Powered Student Performance Analytics System", groupCode: "3310", defenseDate: "November 29, 2025", grade: "69%", status: "Under Evaluation" },
        { id: 4, title: "AI-Powered Student Performance Analytics System", groupCode: "3310", defenseDate: "November 29, 2025", grade: "69%", status: "Evaluated" },
        { id: 5, title: "AI-Powered Student Performance Analytics System", groupCode: "3310", defenseDate: "November 29, 2025", grade: "69%", status: "For Review" },
        { id: 6, title: "AI-Powered Student Performance Analytics System", groupCode: "3310", defenseDate: "November 29, 2025", grade: "69%", status: "For Review" },
        { id: 7, title: "AI-Powered Student Performance Analytics System", groupCode: "3310", defenseDate: "November 29, 2025", grade: "69%", status: "Evaluated" },
        { id: 8, title: "AI-Powered Student Performance Analytics System", groupCode: "3310", defenseDate: "November 29, 2025", grade: "69%", status: "For Review" },
        { id: 9, title: "AI-Powered Student Performance Analytics System", groupCode: "3310", defenseDate: "November 29, 2025", grade: "69%", status: "For Review" },
    ]);

    {/* Button Handlers */}
    const handleOpenReview = (thesis: any) => {
        setSelectedThesis(thesis);
        setIsReviewOpen(true);
    };

    const handleCancelReview = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsReviewOpen(false);
    };

    const handleLockGradeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsReviewOpen(false);
        setIsConfirmOpen(true);
        setIsSuccess(false);
    };

    const handleConfirmSave = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsSuccess(true);
    };

    const stats = [
        { label: "Pending Review", value: theses.filter(t => t.status === "For Review").length, icon: <Clock className="w-5 h-5 text-primary-foreground-2" />, bgColor: "bg-primary-foreground-2/20" },
        { label: "Under Review", value: theses.filter(t => t.status === "Under Evaluation").length, icon: <AlertCircle className="w-5 h-5 text-changes-badge-font-color" />, bgColor: "bg-changes-badge-font-color/20" },
        { label: "Locked", value: theses.filter(t => t.status === "Evaluated").length, icon: <CheckCircle2 className="w-5 h-5 text-evaluated-font-color" />, bgColor: "bg-evaluated-font-color/20" },
        { label: "Total Submissions", value: theses.length, icon: <CheckCircle2 className="w-5 h-5 text-evaluated-font-color" />, bgColor: "bg-evaluated-font-color/20" },
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'For Review': return "bg-revision-bg border-revision-border text-revision-font-color";
            case 'Under Evaluation': return "bg-under-eval-bg border-under-eval-border text-under-eval-font-color";
            case 'Evaluated': return "bg-evaluated-bg border-evaluated-border text-evaluated-font-color";
            default: return "bg-gray-100 border-gray-200 text-gray-600";
        }
    };

    const GradeBar = ({ label, percentage, score }: { label: string, percentage: string, score: string }) => (
        <div className="bg-[#FFFDF5] border border-primary/10 rounded-lg p-3 shadow-sm mb-3">
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-[13px] font-bold text-primary">{label}</span>
                <span className="text-[13px] font-bold text-primary">({percentage})</span>
            </div>
            <div className="w-full bg-[#E0E0E0] rounded-full h-2.5 overflow-hidden">
                <div className="bg-primary h-full" style={{ width: '60%' }}></div>
            </div>
            <div className="mt-1">
                <span className="text-[11px] text-primary/60 font-medium">Weighted Score: {score}</span>
            </div>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title="Grade Management" />
            
            <div className="flex flex-col min-h-screen -mt-4 -mx-4 -mb-4 md:-mt-4 md:-mx-6 md:-mb-6 lg:-mt-6 lg:-mx-8 lg:-mb-8 bg-primary-foreground">
                <HeaderCard 
                    title="Grade Management"
                    description="Monitor student academic performance and oversee final evaluations."
                    icon={<Calendar className="w-8 h-8 text-primary" />}
                    className="w-full lg:w-full rounded-none border-t-0 border-x-0 border-b-sidebar-gradient-mid" 
                />

                <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8 w-full">
                    {/* Status Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-primary-foreground border border-primary/10 rounded-xl p-4 flex items-center gap-4 shadow-sm">
                                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center shrink-0`}>
                                    {stat.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[22px] font-dm text-primary/80 leading-tight tracking-tight">{stat.label}</span>
                                    <span className="text-[22px] text-primary font-dm">{stat.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table */}
                    <div className="rounded-lg border border-sidebar-border/70 overflow-hidden bg-card shadow-sm w-full mt-4">
                        <Table>
                            <TableCaption className="pb-4">
                                {theses.length} of {theses.length} of Theses
                            </TableCaption>
                            <TableHeader className="bg-primary">
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="text-primary-foreground font-dm h-12 text-center">Thesis Title</TableHead>
                                    <TableHead className="text-primary-foreground font-dm h-12 text-center">Group Code</TableHead>
                                    <TableHead className="text-primary-foreground font-dm h-12 text-center">Defense Date</TableHead>
                                    <TableHead className="text-primary-foreground font-dm h-12 text-center">Overall Grade</TableHead>
                                    <TableHead className="text-primary-foreground font-dm h-12 text-center">Status</TableHead>
                                    <TableHead className="text-primary-foreground font-dm h-12 text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {theses.map((item, idx) => (
                                    <TableRow key={idx} className="text-center hover:bg-primary/5 transition-colors">
                                        <TableCell className="text-left py-4 px-6 max-w-[300px]">
                                            <span className="text-[13px] font-dm text-foreground line-clamp-2">{item.title}</span>
                                        </TableCell>
                                        <TableCell className="text-[13px] font-dm text-foreground text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Users className="w-4 h-4 text-primary" />
                                                {item.groupCode}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[13px] font-dm text-foreground">{item.defenseDate}</TableCell>
                                        <TableCell className="text-[13px] font-dm text-foreground">{item.grade}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[12px] font-dm border min-w-[120px] tracking-tighter ${getStatusStyle(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Button 
                                                variant="tertiary" 
                                                onClick={() => handleOpenReview(item)}
                                                className="h-8 px-4 text-[12px] font-dm border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                                            >
                                                Review
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Modal: Grade Review */}
                <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                    <DialogContent className="max-w-[420px] p-0 border-none rounded-xl overflow-hidden shadow-2xl">
                        <DialogHeader className="bg-primary p-4 flex flex-row items-center justify-between text-primary-foreground">
                            <DialogTitle className="text-[18px] font-dm font-bold text-primary-foreground">Grade Review</DialogTitle>
                        </DialogHeader>
                        
                        <div className="p-6 bg-primary-foreground max-h-[70vh] overflow-y-auto">
                            {selectedThesis && (
                                <>
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="bg-primary/10 p-2 rounded-lg"><Users className="w-6 h-6 text-primary" /></div>
                                        <div>
                                            <h3 className="text-[24px] font-bold text-primary leading-none">Group {selectedThesis.groupCode}</h3>
                                            <p className="text-[12px] text-primary/60 font-medium">BS CPE 3-1 | Machine Learning</p>
                                        </div>
                                    </div>
                                    <hr className="border-primary/10 mb-5" />
                                    <div className="space-y-3 mb-6">
                                        <h4 className="text-[13px] font-bold text-primary uppercase tracking-wider">Thesis Information</h4>
                                        <div className="flex gap-3 items-start">
                                            <BookOpen className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                            <span className="text-[13px] text-foreground font-medium">{selectedThesis.title}</span>
                                        </div>
                                        <div className="flex gap-3 items-start">
                                            <User className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                            <span className="text-[13px] text-foreground font-medium">Rona Dela Cruz, Jane Ramos, Jane Santos, Jane Reyes</span>
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <h4 className="text-[13px] font-bold text-primary uppercase tracking-wider mb-4">Grade Components</h4>
                                        <GradeBar label="Engineering Investigation" percentage="20%" score="18.00" />
                                        <GradeBar label="Teamwork & Leadership" percentage="20%" score="18.00" />
                                        <GradeBar label="Problem Analysis" percentage="20%" score="18.00" />
                                        <GradeBar label="Communication Skills" percentage="20%" score="18.00" />
                                        <GradeBar label="Lifelong Learning" percentage="20%" score="18.00" />
                                    </div>
                                    <div className="space-y-2 mb-2">
                                        <h4 className="text-[13px] font-bold text-primary uppercase tracking-wider">Remarks</h4>
                                        <textarea placeholder="comments" className="w-full border border-primary/20 rounded-lg p-3 text-[14px] h-24 focus:outline-none" />
                                    </div>
                                </>
                            )}
                        </div>

                        <DialogFooter className="p-4 bg-primary-foreground border-t border-primary/10 flex flex-row sm:justify-between items-center gap-4">
                            <Button 
                                type="button"
                                onClick={handleCancelReview} 
                                className="flex-1 bg-[#FDF8E7] text-primary border-none hover:bg-[#F9F1D0] font-bold h-10"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="button"
                                onClick={handleLockGradeClick}
                                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-10"
                            >
                                Lock Grade
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Modal: Confirmation */}
                <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                    <DialogContent className="max-w-[400px] p-8 text-center rounded-3xl border-none shadow-2xl">
                        {!isSuccess ? (
                            <>
                                <div className="flex justify-center mb-4">
                                    <div className="bg-primary rounded-full p-4">
                                        <AlertCircleIcon className="w-12 h-12 text-primary-foreground" />
                                    </div>
                                </div>
                                <h2 className="text-[18px] font-bold text-foreground mb-2">Are you sure you want to save changes?</h2>
                                <p className="text-[14px] text-muted-foreground mb-8">This action cannot be undone.</p>
                                <div className="flex gap-4">
                                    <Button 
                                        type="button"
                                        onClick={() => setIsConfirmOpen(false)} 
                                        className="flex-1 rounded-full border border-foreground/20 h-12 font-bold"
                                        variant="outline"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="negative" 
                                        type="button"
                                        onClick={handleConfirmSave} 
                                        className="flex-1 rounded-full h-12 font-bold"
                                    >
                                        Confirm
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="py-8">
                                <div className="flex justify-center mb-6">
                                    <div className="bg-alert-success rounded-full p-4">
                                        <Check className="w-12 h-12 text-primary-foreground" />
                                    </div>
                                </div>
                                <h2 className="text-[20px] font-bold text-foreground">Item saved successfully.</h2>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                <div className="w-full mt-[120px]">
                    <NavFooter />
                </div>
            </div>
        </AppLayout>
    );
}