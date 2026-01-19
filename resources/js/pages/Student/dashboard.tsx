{/* React & Core Imports */}
import React from 'react';
import { Head } from '@inertiajs/react';

{/* Layout & Routing Imports */}
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';

{/* UI Components Imports */}
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Icon } from '@/components/icon-index';
import { IconName } from '@/components/icons-registry';
import { ProposalVotingProgress } from '@/pages/Student/components/proposal-voting-progress';
import { LatestMilestoneResult } from '@/pages/Student/components/latest-milestone-result';
import { NextActionRequired } from '@/pages/Student/components/next-action-required';
import ApprovalTracker from "@/pages/Student/components/approval-tracker";
import CurrentStatus from '@/pages/Student/components/current-status';
import DefenseSchedule from '@/pages/Student/components/defense-schedule';

{/* Icons Imports */}
import {
    CalendarDays,
    GraduationCap,
    NotebookPen,
} from 'lucide-react';


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


{/* Quick menu items for navigation shortcuts */}
const quickMenuItems = [
  {
    label: 'My Group',
    icon: 'quicklinkPeople',
    iconHover: 'quicklinkPeopleHover',
    href: '#',
  },
  {
    label: 'Submit Document',
    icon: 'quicklinkManagement',
    iconHover: 'quicklinkManagementHover',
    href: '#',
  },
  {
    label: 'Defense',
    icon: 'quicklinkCalendar',
    iconHover: 'quicklinkCalendarHover',
    href: '#',
  },
  {
    label: 'Repository',
    icon: 'quicklinkRepository',
    iconHover: 'quicklinkRepositoryHover',
    href: '#',
  },
  {
    label: 'Guidelines',
    icon: 'quicklinkRepository',
    iconHover: 'quicklinkRepositoryHover',
    href: '#',
  },
];

{/* Component for quick menu items */}
function QuickLinkItem({ item }: { item: typeof quickMenuItems[0] }) {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <a
            href={item.href}
            className="flex flex-col items-center gap-4 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="transition-all duration-200 ease-in-out">
                <Icon
                    name={(isHovered ? item.iconHover : item.icon) as IconName}
                    size={127}
                />
            </div>
            <span className="font-bold text-accent-foreground pointer-events-none">
                {item.label}
            </span>
        </a>
    );
}

// Sample data for actions
const sampleActions = [
    {
        id: 1,
        title: "Complete remaining consultations for MOR",
        dueDate: "February 20, 2026",
        details: "2 more consultations needed"
    },
    {
        id: 2,
        title: "Submit revised Chapter 3",
        dueDate: "February 25, 2026",
        details: "Methodology updates required"
    },
    {
        id: 3,
        title: "Schedule final defense",
        dueDate: "March 1, 2026",
        details: "Contact panel coordinator"
    }
];

{/* Breadcrumb navigation */}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];


export default function Dashboard({ activeTerm, currentDate }: DashboardProps) {
    {/* Default values */}
    const defaultActiveTerm: ActiveTerm = {
        semester_id: 1,
        semester: 0,
        year: 2025,
        display_sy: '2025-2026'
    };

    const term = activeTerm || defaultActiveTerm;
    const date = currentDate || 'January 20, 2026';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-3">
                <div className="min-h-screen bg-white p-8">
                    
                    {/* HEADER SECTION */}
                    <div className="flex items-center justify-between">
                        {/* Left side - Welcome message */}
                        <div>
                            <h1 className="text-[42px] font-bold leading-tight text-primary">
                                Welcome back, John Dela Cruz
                            </h1>
                            <p className="mt-1 text-lg text-gray-700">
                                Department of Computer Engineering | Student
                            </p>
                        </div>

                        {/* Right side - Current info cards */}
                        <div className="flex gap-x-10">
                            {/* Today */}
                            <div className="flex items-start gap-3">
                                <CalendarDays className="h-8 w-8 text-primary" strokeWidth={1.5} />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-primary">
                                        TODAY
                                    </p>
                                    <p className="font-bold text-gray-800">
                                        {date}
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
                                        {term.display_sy}
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
                                        {term.semester === 0 ? 'First Semester' : 'Second Semester'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="my-8 border-gray-200" />

                    {/* BODY CONTENT */}
                    <div className="space-y-8">
                        {/* QUICK MENU */}
                        <div className="w-full rounded-xl border border-gray-200 shadow-sm bg-accent py-6 px-4">
                            <div className="flex justify-evenly items-center">
                                {quickMenuItems.map((item, index) => (
                                    <QuickLinkItem key={index} item={item} />
                                ))}
                            </div>
                        </div>

                        {/* Current Status */}
                        <CurrentStatus />

                        {/* Two Column Grid Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Column 1 */}
                                <div className="space-y-6">
                                    {/* Proposal Voting Progress */}
                                    <ProposalVotingProgress 
                                        approved={3}
                                        rejected={1}
                                        pending={1}
                                        totalCommittees={5}
                                        majorityReached={true}
                                    />

                                    {/* Defense Schedule */}
                                    <DefenseSchedule />
                                </div>

                                {/* Column 2 */}
                                <div className="space-y-6">
                                    {/* Approval Tracker */}
                                    <ApprovalTracker/>

                                    {/* Latest Milestone Result */}
                                    <LatestMilestoneResult 
                                        milestoneType="Proposal Defense"
                                        approvalDate="January 1, 2026"
                                        status="defended"
                                        message="You have successfully defended your Title Proposal!"
                                    />
                                </div>
                            </div>

                        {/* Next Action Required */}
                        <NextActionRequired actions={sampleActions} />

                        {/* Main Content Area */}
                        <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}