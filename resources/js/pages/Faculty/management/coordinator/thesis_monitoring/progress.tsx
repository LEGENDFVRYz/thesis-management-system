import React, { useState, useMemo, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip
} from "recharts";
import StageSwitchToggle from '@/components/stage-toggle';
import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';
import { FolderOpen, Filter, Download, Calendar, Check } from 'lucide-react';
import { progress } from '@/routes/faculty/coordinator/thesis/index';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import ThesisMonitoringLayout from '.';

// --- Interfaces ---
interface BreadcrumbItem {
    title: string;
    href: string;
}

interface PageHeaderProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
}

interface SubmissionData {
    year: number;
    submission_count: number;
}

interface CompletedData {
    year: number;
    completed_count: number;
}

interface DashboardProps {
    course: string;
    submission: SubmissionData[];
    completed: CompletedData[];
}

// --- Setup ---
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Progress Reports', href: progress().url }
];

const pageHeader: PageHeaderProps = {
    title: "Progress Reports",
    subtitle: "Generate and export reports on thesis submissions, completions and guidelines",
    icon: (
        <FolderOpen className="w-8 h-8 text-primary" />
    ),
};

export default function ProgressReports({ submission = [], completed = [], course = 'MOR' }: DashboardProps) {
    const [selectedYear, setSelectedYear] = useState("2024 - 2025");
    const [isExportSuccessOpen, setIsExportSuccessOpen] = useState(false);
    
    // State for Report Builder Checkboxes
    const [reportConfig, setReportConfig] = useState({
        includeSubmissions: true,
        includeCompletions: true,
        courses: {
            MOR: true,
            DP1: true,
            DP2: true
        }
    });

    // Convert backend data to chart format (year as string for X-axis)
    const chartSubmissions = useMemo(() => {
        return submission.map(item => ({
            year: item.year.toString(),
            submission_count: item.submission_count
        }));
    }, [submission]);

    const chartCompleted = useMemo(() => {
        return completed.map(item => ({
            year: item.year.toString(),
            completed_count: item.completed_count
        }));
    }, [completed]);

    // Handlers
    const handleStageChange = (newStage: string) => {
        router.get(progress().url, { course: newStage }, { preserveState: true, preserveScroll: true, only: ['submission', 'completed', 'course'] });
    };

    const handleGenerateReport = (type: 'summary' | 'monthly' | 'filtered', format: 'pdf', useFilters: boolean = false) => {
        let selectedCourses: string[];
        let year: string;
        let includeSubmissions: boolean;
        let includeCompletions: boolean;

        if (useFilters) {
            // Use custom report builder filters
            selectedCourses = Object.entries(reportConfig.courses)
                .filter(([_, v]) => v)
                .map(([c]) => c);
            year = selectedYear;
            includeSubmissions = reportConfig.includeSubmissions;
            includeCompletions = reportConfig.includeCompletions;
        } else {
            // Use all data for templates
            selectedCourses = ['MOR', 'DP1', 'DP2'];
            year = type === 'summary' ? selectedYear : 'all';
            includeSubmissions = true;
            includeCompletions = true;
        }

        // Use Inertia router.visit for proper Laravel route handling
        const queryParams = {
            type,
            format,
            year,
            courses: selectedCourses.join(','),
            include_submissions: includeSubmissions.toString(),
            include_completions: includeCompletions.toString(),
        };

        // Build URL with query parameters
        const queryString = new URLSearchParams(queryParams).toString();
        const url = `/faculty/coordinator/thesis/reports/generate?${queryString}`;

        // Open in new window/tab
        window.open(url, '_blank');
        
        // Show success dialog after a slight delay
        setTimeout(() => {
            setIsExportSuccessOpen(true);
        }, 500);
    };

    const toggleConfig = (key: 'includeSubmissions' | 'includeCompletions') => 
        setReportConfig(prev => ({ ...prev, [key]: !prev[key] }));
    
    const toggleCourse = (key: 'MOR' | 'DP1' | 'DP2') => 
        setReportConfig(prev => ({ ...prev, courses: { ...prev.courses, [key]: !prev.courses[key] } }));

    const ACADEMIC_YEARS = useMemo(() => {
        const years = [];
        for (let i = 2026; i >= 1900; i--) years.push(`${i} - ${i + 1}`);
        return years;
    }, []);

    const totalSubmissions = useMemo(() => 
        submission.reduce((acc, curr) => acc + (curr.submission_count || 0), 0), 
        [submission]
    );
    
    const totalCompleted = useMemo(() => 
        completed.reduce((acc, curr) => acc + (curr.completed_count || 0), 0), 
        [completed]
    );

    return (
        <ThesisMonitoringLayout breadcrumbs={breadcrumbs} pageHeader={pageHeader}>
            <Head title={`Progress Reports`} />
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-year-scrollbar::-webkit-scrollbar { width: 12px; }
                .custom-year-scrollbar::-webkit-scrollbar-track { background: #D9D9D9; }
                .custom-year-scrollbar::-webkit-scrollbar-thumb { background: #8E8E8E; border-radius: 10px; border: 2px solid #D9D9D9; }
                .year-item-hover:hover, .year-item-hover[data-highlighted] { background-color: #E2D9B7 !important; color: #730000 !important; }
                .year-item-selected[data-state="checked"] { background-color: #730000 !important; color: #FFB800 !important; }
                .calendar-icon-fixed { transform: none !important; transition: none !important; rotate: 0deg !important; }
                [data-state="open"] .calendar-icon-fixed { transform: rotate(0deg) !important; transition: none !important; }
                .custom-trigger svg:not(.calendar-icon-fixed) { display: none !important; }
            `}} />

            <div className="flex flex-col min-h-screen -mt-4 -mx-4 -mb-4 md:-mt-4 bg-primary-foreground">
                <div className="flex flex-1 flex-col gap-8 p-4 w-full">
                    
                    <div className="flex justify-end w-full">
                        <StageSwitchToggle 
                            // value={course} 
                            onChange={handleStageChange} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                        <TrendCard 
                            title={`Submission Trend`} 
                            data={chartSubmissions} 
                            valueKey="submission_count"
                            dataLabel="Submissions"
                            rate={totalSubmissions} 
                            rateLabel="Total Submissions" 
                        />
                        <TrendCard 
                            title={`Completion Trend`} 
                            data={chartCompleted} 
                            valueKey="completed_count"
                            dataLabel="Completions"
                            rate={totalCompleted} 
                            rateLabel="Total Completed" 
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
                        <div className="lg:col-span-4 rounded-2xl border border-primary/20 p-6 bg-[#fffcf5]/30">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-1.5 rounded-lg border border-primary/20">
                                    <Filter className="w-4 h-4 text-primary" />
                                </div>
                                <h3 className="text-primary text-[22px] font-dm">Custom Report Builder</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[15px] text-primary mb-1.5 block font-dm">Academic Year</label>
                                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                                        <SelectTrigger className="custom-trigger relative w-full bg-breadcrumb border-[1.5px] border-primary text-primary font-bold h-10 rounded-md focus:ring-0 focus:ring-offset-0 px-3 pr-10">
                                            <SelectValue placeholder="2024 - 2025" />
                                            <Calendar className="calendar-icon-fixed absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" strokeWidth={2.5} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-breadcrumb border-[1.5px] border-primary p-0 shadow-xl overflow-hidden min-w-[var(--radix-select-trigger-width)] rounded-md">
                                            <div className="bg-primary text-primary-foreground-2 text-center py-2 text-[14px] font-bold uppercase tracking-wide border-b border-primary">{selectedYear}</div>
                                            <div className="max-h-[220px] overflow-y-auto custom-year-scrollbar py-0">
                                                {ACADEMIC_YEARS.map((year) => (
                                                    <SelectItem key={year} value={year} className="year-item-hover year-item-selected text-primary font-medium py-2.5 flex justify-center items-center text-center cursor-pointer transition-colors rounded-none outline-none border-none ring-0 select-none data-[state=checked]:font-bold">
                                                        <span className="text-center w-full">{year}</span>
                                                    </SelectItem>
                                                ))}
                                            </div>
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm text-muted-foreground font-medium cursor-pointer">
                                            <input type="checkbox" className="accent-primary w-4 h-4" checked={reportConfig.includeSubmissions} onChange={() => toggleConfig('includeSubmissions')} /> 
                                            Submissions
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-muted-foreground font-medium cursor-pointer">
                                            <input type="checkbox" className="accent-primary w-4 h-4" checked={reportConfig.includeCompletions} onChange={() => toggleConfig('includeCompletions')} /> 
                                            Completions
                                        </label>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm text-muted-foreground font-medium cursor-pointer">
                                            <input type="checkbox" className="accent-primary w-4 h-4" checked={reportConfig.courses.MOR} onChange={() => toggleCourse('MOR')} /> 
                                            MOR
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-muted-foreground font-medium cursor-pointer">
                                            <input type="checkbox" className="accent-primary w-4 h-4" checked={reportConfig.courses.DP1} onChange={() => toggleCourse('DP1')} /> 
                                            DP1
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-muted-foreground font-medium cursor-pointer">
                                            <input type="checkbox" className="accent-primary w-4 h-4" checked={reportConfig.courses.DP2} onChange={() => toggleCourse('DP2')} /> 
                                            DP2
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button onClick={() => handleGenerateReport('filtered', 'pdf', true)} variant="tertiary" className="flex-1 text-[13px] font-dm">
                                        Export PDF <Download className="ml-2 w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8 rounded-2xl border border-primary/20 p-6 bg-[#fffcf5]/30">
                             <div className="flex items-center gap-2 mb-6">
                                <FolderOpen className="w-5 h-5 text-primary" />
                                <h3 className="text-primary text-[22px] font-dm">Report Templates</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TemplateCard 
                                    title={`AY ${selectedYear} Summary`} 
                                    desc="Complete overview of submissions and completions for all courses in the selected academic year" 
                                    onUse={() => handleGenerateReport('summary', 'pdf', false)} 
                                />
                                <TemplateCard 
                                    title="Monthly Progress Report" 
                                    desc="Month-by-month breakdown of all thesis activities across all courses and years" 
                                    onUse={() => handleGenerateReport('monthly', 'pdf', false)} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isExportSuccessOpen} onOpenChange={setIsExportSuccessOpen}>
                <DialogContent className="max-w-[320px] rounded-[24px] p-10 flex flex-col items-center justify-center border-none shadow-2xl bg-primary-foreground">
                    <div className="w-16 h-16 bg-alert-success rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <Check className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <p className="text-[16px] text-center text-foreground font-dm font-bold">File exported successfully.</p>
                </DialogContent>
            </Dialog>
        </ThesisMonitoringLayout>
    );
}

function TrendCard({ title, data, valueKey, dataLabel, rate, rateLabel }: any) {
    return (
        <div className="bg-accent rounded-xl overflow-hidden border border-primary/20 shadow-[0px_4px_12px_rgba(0,0,0,0.1)] flex flex-col">
            <div className="p-6">
                <h3 className="text-primary font-bold text-lg mb-4 font-dm uppercase tracking-tight">{title}</h3>
                <div className="flex items-center justify-end gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[12px] text-foreground/60 font-medium font-dm">{dataLabel}</span>
                </div>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="0" stroke="#0000001F" vertical={false} />
                            <XAxis 
                                dataKey="year" 
                                tick={{ fill: "#00000099", fontSize: 11 }} 
                                axisLine={{ stroke: "#0000001F" }} 
                                tickLine={false} 
                                type="category" 
                            />
                            <YAxis 
                                tick={{ fill: "#00000099", fontSize: 11 }} 
                                axisLine={{ stroke: "#0000001F" }} 
                                tickLine={false} 
                                domain={[0, 'auto']} 
                                allowDecimals={false}
                            />
                            <Tooltip cursor={{ stroke: '#730000', strokeWidth: 0 }} />
                            <Line 
                                type="linear" 
                                dataKey={valueKey} 
                                stroke="#730000" 
                                strokeWidth={2} 
                                dot={{ r: 4, fill: "#730000" }} 
                                activeDot={{ r: 6 }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-primary py-4 text-center text-primary-foreground">
                <div className="text-2xl font-bold font-dm">{rate}</div>
                <div className="text-[12px] opacity-80 uppercase tracking-wider font-dm font-bold">{rateLabel}</div>
            </div>
        </div>
    );
}

function TemplateCard({ title, desc, onUse }: any) {
    return (
        <div className="bg-primary-foreground border border-breadcrumb rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <FolderOpen className="w-5 h-5 text-primary-foreground-2"/>
                <h4 className="text-primary-foreground-2 text-[22px] font-dm">{title}</h4>
            </div>
            <p className="text-[15px] text-foreground mb-6 leading-relaxed font-dm">{desc}</p>
            <div className="flex items-center justify-between">
                <span className="text-[15px] text-foreground tracking-tight font-dm">Includes: All Metrics</span>
                <Button variant="primary" onClick={onUse} className="text-[13px] font-dm">Use Template</Button>
            </div>
        </div>
    );
}