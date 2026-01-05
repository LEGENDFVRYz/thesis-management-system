import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import StageSwitchToggle from '@/components/stage-toggle';
import { NavFooter } from '@/components/nav-footer';
import { HeaderCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FolderOpen, Filter, Download } from 'lucide-react';
import { progress } from '@/routes/faculty/management/coordinator/thesis_monitoring';

// --- Data Constants ---
const DEFAULT_DATA = [
    { year: 2017, count: 100 },
    { year: 2018, count: 125 },
    { year: 2019, count: 180 },
    { year: 2020, count: 150 },
    { year: 2021, count: 200 },
    { year: 2022, count: 250 },
    { year: 2023, count: 300 },
    { year: 2024, count: 320 },
    { year: 2025, count: 360 },
];

const breadcrumb: BreadcrumbItem[] = [
    { title: 'Progress Reports', href: progress().url },
];

// --- Chart Helper Components ---
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-primary">
                <p className="text-[13px] font-semibold text-primary mb-1">Year {label}</p>
                <p className="text-[12px] text-slate-600">
                    <span className="text-primary">■</span> Count: {payload[0].value}
                </p>
            </div>
        );
    }
    return null;
};

const CustomLegend = ({ label }: { label: string }) => (
    <div className="flex items-center justify-end gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-[12px] text-black/60">{label}</span>
    </div>
);

export default function ProgressReports() {
    return (
        <AppLayout breadcrumbs={breadcrumb}>
            <Head title="Progress Reports" />
            
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

                    {/* Trend Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                        <TrendCard 
                            title="Submission Trend" 
                            data={DEFAULT_DATA} 
                            dataKey="Submission" 
                            rate="50%" 
                            rateLabel="Submission Rate" 
                        />
                        <TrendCard 
                            title="Completion Trend" 
                            data={DEFAULT_DATA} 
                            dataKey="Completion" 
                            rate="50%" 
                            rateLabel="Completion Rate" 
                        />
                    </div>

                    {/* Bottom Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
                        <div className="lg:col-span-4 rounded-2xl border border-primary/20 p-6 bg-[#fffcf5]/30">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-1.5 rounded-lg border border-primary">
                                    <Filter className="w-4 h-4 text-primary" />
                                </div>
                                <h3 className="text-primary font-bold text-lg">Custom Report Builder</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[12px] font-semibold text-primary mb-1 block">Academic Year</label>
                                    <select className="w-full bg-[#f4ebd0]/40 border border-[#f4ebd0] rounded-md px-3 py-2 text-sm text-muted-foreground outline-none">
                                        <option>Filter by Year</option>
                                    </select>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <input type="checkbox" className="accent-primary" /> Submissions
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <input type="checkbox" className="accent-primary" /> Completions
                                    </label>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button variant="tertiary" className="flex-1 text-[11px]">
                                        Export PDF <Download className="ml-2 w-3 h-3" />
                                    </Button>
                                    <Button variant="tertiary" className="flex-1 text-[11px]">
                                        Export Excel <Download className="ml-2 w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-8 rounded-2xl border border-primary/20 p-6 bg-[#fffcf5]/30">
                             <div className="flex items-center gap-2 mb-6">
                                <FolderOpen className="w-5 h-5 text-primary" />
                                <h3 className="text-primary font-bold text-lg">Report Templates</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TemplateCard title="AY 2024 - 2025 Summary" desc="Complete overview of submissions and completions" />
                                <TemplateCard title="Monthly Progress Report" desc="Month-by-month breakdown of thesis activities" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full mt-[120px]">
                    <NavFooter />
                </div>
            </div>
        </AppLayout>
    );
}

function TrendCard({ title, data, dataKey, rate, rateLabel }: any) {
    return (
        <div className="bg-[#FDFCF6] rounded-xl overflow-hidden border border-primary/20 shadow-[0px_4px_12px_rgba(0,0,0,0.1)] flex flex-col">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-primary font-bold text-lg">{title}</h3>
                </div>
                
                <CustomLegend label={dataKey} />

                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="0" stroke="#0000001F" vertical={false} />
                            <XAxis 
                                dataKey="year" 
                                tick={{ fill: "#00000099", fontSize: 11 }} 
                                axisLine={{ stroke: "#0000001F" }}
                                tickLine={false}
                            />
                            <YAxis 
                                tick={{ fill: "#00000099", fontSize: 11 }} 
                                axisLine={{ stroke: "#0000001F" }}
                                tickLine={false}
                                domain={[0, 400]}
                                ticks={[0, 100, 200, 300, 400]}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line 
                                type="linear" 
                                dataKey="count" 
                                stroke="#730000" 
                                strokeWidth={2} 
                                dot={false} 
                                activeDot={{ r: 4, fill: "#730000" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-primary py-4 text-center text-primary-foreground">
                <div className="text-2xl font-bold">{rate}</div>
                <div className="text-[12px] opacity-80 uppercase tracking-wider">{rateLabel}</div>
            </div>
        </div>
    );
}

function TemplateCard({ title, desc }: any) {
    return (
        <div className="bg-primary-foreground border border-[#f4ebd0] rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <FolderOpen className="w-5 h-5 text-primary-foreground-2"/>
                <h4 className="text-primary-foreground-2 font-bold">{title}</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{desc}</p>
            <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground">Includes: All Metrics</span>
                <Button variant="primary" className="text-primary-foreground text-[11px] px-4">
                    Use Template
                </Button>
            </div>
        </div>
    );
}