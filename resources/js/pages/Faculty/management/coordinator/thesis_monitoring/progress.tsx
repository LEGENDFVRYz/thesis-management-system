import React, { useState, useMemo } from 'react';
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
import { NavFooter } from '@/components/nav-footer';
import { HeaderCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
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

const DEFAULT_DATA = [
    { year: 2017, count: 100 }, { year: 2018, count: 125 }, { year: 2019, count: 180 },
    { year: 2020, count: 150 }, { year: 2021, count: 200 }, { year: 2022, count: 250 },
    { year: 2023, count: 300 }, { year: 2024, count: 320 }, { year: 2025, count: 360 },
];

const breadcrumb: BreadcrumbItem[] = [{ title: 'Progress Reports', href: progress().url }];

export default function ProgressReports() {
    const [selectedYear, setSelectedYear] = useState("2024 - 2025");
    const [isExportSuccessOpen, setIsExportSuccessOpen] = useState(false);

    const ACADEMIC_YEARS = useMemo(() => {
        const years = [];
        for (let i = 2026; i >= 1900; i--) {
            years.push(`${i} - ${i + 1}`);
        }
        return years;
    }, []);

    const handleExport = () => {
        setIsExportSuccessOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title="Progress Reports" />
            
            <style dangerouslySetInnerHTML={{ __html: `
                .custom-year-scrollbar::-webkit-scrollbar { width: 12px; }
                .custom-year-scrollbar::-webkit-scrollbar-track { background: #D9D9D9; }
                .custom-year-scrollbar::-webkit-scrollbar-thumb { 
                    background: #8E8E8E; border-radius: 10px; border: 2px solid #D9D9D9; 
                }

                .year-item-hover:hover, .year-item-hover[data-highlighted] {
                    background-color: #E2D9B7 !important;
                    color: #730000 !important;
                }

                .year-item-selected[data-state="checked"] {
                    background-color: #730000 !important;
                    color: #FFB800 !important; 
                }

                .calendar-icon-fixed {
                    transform: none !important;
                    transition: none !important;
                    rotate: 0deg !important;
                }

                [data-state="open"] .calendar-icon-fixed {
                    transform: rotate(0deg) !important;
                    transition: none !important;
                }

                .custom-trigger svg:not(.calendar-icon-fixed) {
                    display: none !important;
                }
            `}} />

            <div className="flex flex-col min-h-screen -mt-4 -mx-4 -mb-4 md:-mt-4 md:-mx-6 md:-mb-6 lg:-mt-6 lg:-mx-8 lg:-mb-8 bg-primary-foreground">
                <HeaderCard 
                    title="Progress Reports"
                    description="Generate and export reports on thesis submissions, completions and guidelines"
                    icon={<FolderOpen className="w-8 h-8 text-primary" />}
                    className="w-full lg:w-full rounded-none border-t-0 border-x-0 border-b-sidebar-gradient-mid" 
                />

                <div className="flex flex-1 flex-col gap-8 p-4 md:p-6 lg:p-8 w-full">
                    <div className="flex justify-end w-full">
                        <StageSwitchToggle />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                        <TrendCard title="Submission Trend" data={DEFAULT_DATA} dataKey="Submission" rate="50%" rateLabel="Submission Rate" />
                        <TrendCard title="Completion Trend" data={DEFAULT_DATA} dataKey="Completion" rate="50%" rateLabel="Completion Rate" />
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
                                
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                        <input type="checkbox" className="accent-primary w-4 h-4" /> Submissions
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                        <input type="checkbox" className="accent-primary w-4 h-4" /> Completions
                                    </label>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button onClick={handleExport} variant="tertiary" className="flex-1 text-[13px] font-dm">
                                        Export PDF <Download className="ml-2 w-3 h-3" />
                                    </Button>
                                    <Button onClick={handleExport} variant="tertiary" className="flex-1 text-[13px] font-dm">
                                        Export Excel <Download className="ml-2 w-3 h-3" />
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
                                <TemplateCard title="AY 2024 - 2025 Summary" desc="Complete overview of submissions and completions" onUse={handleExport} />
                                <TemplateCard title="Monthly Progress Report" desc="Month-by-month breakdown of thesis activities" onUse={handleExport} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full mt-[120px]">
                    <NavFooter />
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
        </AppLayout>
    );
}

function TrendCard({ title, data, dataKey, rate, rateLabel }: any) {
    return (
        <div className="bg-accent rounded-xl overflow-hidden border border-primary/20 shadow-[0px_4px_12px_rgba(0,0,0,0.1)] flex flex-col">
            <div className="p-6">
                <h3 className="text-primary font-bold text-lg mb-4 font-dm uppercase tracking-tight">{title}</h3>
                <div className="flex items-center justify-end gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[12px] text-foreground/60 font-medium font-dm">{dataKey}</span>
                </div>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="0" stroke="#0000001F" vertical={false} />
                            <XAxis dataKey="year" tick={{ fill: "#00000099", fontSize: 11 }} axisLine={{ stroke: "#0000001F" }} tickLine={false} />
                            <YAxis tick={{ fill: "#00000099", fontSize: 11 }} axisLine={{ stroke: "#0000001F" }} tickLine={false} domain={[0, 400]} ticks={[0, 100, 200, 300, 400]} />
                            <Tooltip cursor={{ stroke: '#730000', strokeWidth: 0 }} />
                            <Line type="linear" dataKey="count" stroke="#730000" strokeWidth={2} dot={false} />
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
        <div className="bg-primary-foreground border border-breadcrumb rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <FolderOpen className="w-5 h-5 text-primary-foreground-2"/>
                <h4 className="text-primary-foreground-2 text-[22px] font-dm">{title}</h4>
            </div>
            <p className="text-[15px] text-foreground mb-6 leading-relaxed font-dm">{desc}</p>
            <div className="flex items-center justify-between">
                <span className="text-[15px] text-foreground tracking-tight font-dm">Includes: All Metrics</span>
                <Button 
                    variant="primary" onClick={onUse} className="text-[13px] font-dm"
                >
                    Use Template
                </Button>
            </div>
        </div>
    );
}