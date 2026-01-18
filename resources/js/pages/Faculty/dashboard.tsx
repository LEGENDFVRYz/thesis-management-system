{/* React & Core Imports */}
import React from 'react';
import { Head } from '@inertiajs/react';

{/* Layout & Routing Imports */}
import AppLayout from '@/layouts/app-layout';
import { NavFooter } from '@/components/nav-footer';
import { getTimeAgo } from '@/lib/utils';
import { dashboard } from '@/routes';
import { NotificationItem, SharedData, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';

{/* UI Components Imports */}
import { MetricCard } from '@/components/ui/card';
import { PendingEndorsementForms } from '@/components/pending-endorsement';
import { PendingProposalForms } from '@/components/pending-proposal';
import { DeadlineTimelineView } from '@/pages/Faculty/components/deadline-timeline-view-faculty';

{/* Icons Imports */}
import {
    CalendarDays,
    GraduationCap,
    NotebookPen,
    Users,
    Calendar,
    AlertCircle,
    FileText,
    LucideIcon
} from 'lucide-react';

{/* Visualization Imports */}
import { ResearchAreaChart } from '@/components/research-area-distribution-pie';
import { SubmissionStatusChart } from '@/components/submission-status-bar';
import { PerformanceOverviewChart } from '@/components/performance-overview-ver-bar';
import { ArchivedJournalsChart } from '@/components/archived-journals-line';

{/* TYPE DEFINITIONS */}

{/* Active Term Interface */}
interface ActiveTerm {
    semester_id: number;
    semester: number;
    year: number;
    display_sy: string;
}

{/* Props for the main dashboard component */}
interface DashboardProps {
    activeTerm?: ActiveTerm;
    currentDate?: string;
}

{/* Props for individual metric items */}
type MetricItemProps = {
  label: string;
  value: number;
  color: string;
};


{/* Props for metric content */}
type MetricContentProps = {
  total: number;
  items: Array<{
    label: string;
    value: number;
    color: string;
  }>;
};


{/* Individual metric row */}
function MetricItem({ label, value, color }: MetricItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm" style={{ color }}>
          {label}
        </span>
      </div>
      <span className="text-sm" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

{/* Metric card content */}
function MetricContent({ total, items }: MetricContentProps) {
  const getFontSize = (num: number) => {
    if (num >= 1000) return 'text-3xl';
    if (num >= 100) return 'text-4xl';
    return 'text-5xl';
  };

  return (
    <div className="flex items-center gap-3 px-1 py-4 min-h-[95px]">
      {/* Total Number */}
      <div className={`text-[#730000] ${getFontSize(total)} font-bold shrink-0 w-18 text-center`}>
        {total}
      </div>
      {/* Divider */}
      <div className="h-12 w-px bg-gray-200 shrink-0" />
      {/* Metrics List */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {items.map((item, index) => (
          <MetricItem
            key={index}
            label={item.label}
            value={item.value}
            color={item.color}
          />
        ))}
      </div>
    </div>
  );
}

{/* Breadcrumb navigation */}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];


export default function Dashboard({ activeTerm, currentDate }: DashboardProps) {
    const { user_info } = usePage<SharedData>().props;

    // Default values if not provided from backend
    const defaultActiveTerm = activeTerm || {
        semester_id: 1,
        semester: 0,
        year: 2025,
        display_sy: "2025-2026"
    };
    const defaultCurrentDate = currentDate || new Date().toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    });
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-3">
                <div className="min-h-screen bg-white p-8">

                    {/* HEADER SECTION */}
                    <div className="flex items-center justify-between">
                        {/* Left side - Welcome message */}
                        <div>
                            <h1 className={`text-[42px] font-bold leading-tight text-primary`}>
                                Welcome back, Engr. Dela Cruz
                            </h1>
                            <p className="mt-1 text-lg text-gray-700">
                                Department of Computer Engineering | Faculty
                            </p>
                        </div>

                        {/* Right side - Current info cards */}
                        <div className="flex gap-x-10">
                            {/* Today's date */}
                            <div className="flex items-start gap-3">
                                <CalendarDays className="h-8 w-8 text-primary" strokeWidth={1.5} />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-primary">
                                        TODAY
                                    </p>
                                    <p className="font-bold text-gray-800">
                                        {defaultCurrentDate}
                                    </p>
                                </div>
                            </div>

                            {/* School year */}
                            <div className="flex items-start gap-3">
                                <GraduationCap className="h-8 w-8 text-primary" strokeWidth={1.5} />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-primary">
                                        SCHOOL YEAR
                                    </p>
                                    <p className="font-bold text-gray-800">
                                        {defaultActiveTerm.display_sy}
                                    </p>
                                </div>
                            </div>

                            {/* Current semester */}            
                            <div className="flex items-start gap-3">
                                <NotebookPen className="h-8 w-8 text-primary" strokeWidth={1.5} />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-primary">
                                        CURRENT SEM
                                    </p>
                                    <p className="font-bold text-gray-800">
                                        {defaultActiveTerm.semester === 0 ? 'First Semester' : 'Second Semester'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="my-8 border-gray-200" />

                    {/* BODY CONTENT */}
                    <div className="space-y-8">
                        {/* Metrics Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
                            {/* Total Active Users Card */}
                            <MetricCard
                                icon={<Users className="text-primary-foreground-2" />}
                                title="TOTAL ACTIVE USERS"
                            >
                                <MetricContent
                                    total={286}
                                    items={[
                                        {
                                            label: 'Total Students',
                                            value: 256,
                                            color: '#1C398E',
                                        },
                                        {
                                            label: 'Total Faculty',
                                            value: 30,
                                            color: '#0D542B',
                                        },
                                    ]}
                                />
                            </MetricCard>

                            {/* Total Active Groups Card */}
                            <MetricCard
                                icon={<Users className="text-primary-foreground-2" />}
                                title="TOTAL ACTIVE GROUPS"
                            >
                                <MetricContent
                                    total={40}
                                    items={[
                                        {
                                            label: 'Active Groups',
                                            value: 30,
                                            color: '#0D542B',
                                        },
                                        {
                                            label: 'Completed Groups',
                                            value: 10,
                                            color: '#1C398E',
                                        },
                                    ]}
                                />
                            </MetricCard>

                            {/* Upcoming Defenses Card */}
                            <MetricCard
                                icon={<Calendar className="text-primary-foreground-2" />}
                                title="UPCOMING DEFENSES"
                            >
                                <MetricContent
                                    total={40}
                                    items={[
                                        {
                                            label: 'Scheduled',
                                            value: 20,
                                            color: '#0D542B',
                                        },
                                        {
                                            label: 'Pending',
                                            value: 0,
                                            color: '#730000',
                                        },
                                    ]}
                                />
                            </MetricCard>

                            {/* Thesis Status Card */}
                            <MetricCard
                                icon={<FileText className="text-primary-foreground-2" />}
                                title="THESIS STATUS"
                            >
                                <MetricContent
                                    total={45}
                                    items={[
                                        {
                                            label: 'Active Thesis',
                                            value: 30,
                                            color: '#1C398E',
                                        },
                                        {
                                            label: 'Completed Thesis',
                                            value: 15,
                                            color: '#0D542B',
                                        },
                                    ]}
                                />
                            </MetricCard>
                        </div>

                        {/* Visualizations Section */}
                        
                        {/* Performance Overview & Submission Status */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <PerformanceOverviewChart />
                            <SubmissionStatusChart />
                        </div>

                        {/* Archived Journals & Research Area Distribution */}
                        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                            <ArchivedJournalsChart />
                            <ResearchAreaChart />
                        </div>
                        
                        {/* Pending Endorsement Forms */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <PendingEndorsementForms />
                            <PendingProposalForms />
                        </div>

                        {/* Deadline Timeline View */}
                        <div className="grid grid-cols-1 lg:grid-cols-1">
                        <DeadlineTimelineView />
                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
