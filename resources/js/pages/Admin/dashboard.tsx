import React from 'react';
import { NotificationListItem, NotificationType } from '@/components/ui/notification-list';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { getTimeAgo } from '@/lib/utils';
import { dashboard } from '@/routes';
import { NotificationItem, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    CalendarDays,
    GraduationCap,
    NotebookPen,
    Users,
    Calendar,
    AlertCircle
} from 'lucide-react';
import { Icon } from '@/components/icon-index';
import { IconName } from '@/components/icons-registry';
import { NavFooter } from '@/components/nav-footer';

import { MetricCard } from '@/components/ui/card';
import { ResearchAreaChart } from '@/components/research-area-distribution-pie';
import { SubmissionStatusChart } from '@/components/submission-status-bar';
import { PerformanceOverviewChart } from '@/components/performance-overview-ver-bar';
import { ArchivedJournalsChart } from '@/components/archived-journals-line';
import { SystemRepositoryStorage } from '@/components/system-repository-storage';
import { DeadlineTimelineView } from '@/pages/Admin/management/deadline-timeline-view';

// Content Components for MetricCard
type MetricItemProps = {
  label: string;
  value: number;
  color: string;
};

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

type MetricContentProps = {
  total: number;
  items: Array<{
    label: string;
    value: number;
    color: string;
  }>;
};

function MetricContent({ total, items }: MetricContentProps) {
  return (
    <div className="flex items-center gap-3 px-2 py-5">
      {/* Total Number */}
      <div className="text-[#730000] text-4xl font-bold shrink-0">
        {total}
      </div>
      {/* Divider */}
      <div className="h-12 w-px bg-gray-200 shrink-0" />
      {/* Metrics List */}
      <div className="flex flex-col gap-2 flex-1 min-w-[148px]">
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


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const quickMenuItems = [
  {
    label: 'People',
    icon: 'quicklinkPeople',
    iconHover: 'quicklinkPeopleHover',
    href: '/admin/management/faculty',
  },
  {
    label: 'Management',
    icon: 'quicklinkManagement',
    iconHover: 'quicklinkManagementHover',
    href: '/admin/management/academic-settings',
  },
  {
    label: 'Repository',
    icon: 'quicklinkRepository',
    iconHover: 'quicklinkRepositoryHover',
    href: '/admin/repository',
  },
  {
    label: 'Calendar',
    icon: 'quicklinkCalendar',
    iconHover: 'quicklinkCalendarHover',
    href: '/admin/management/deadline',
  },
];


interface ActiveTerm {
    semester_id: number;
    semester: number; // 0 or 1
    year: number;     // e.g., 2025
    display_sy: string; // e.g., "2025-2026"
}

interface DashboardProps {
    activeTerm: ActiveTerm;
    currentDate: string;
    notifications: NotificationItem[];
}


export default function Dashboard({ activeTerm, currentDate, notifications }: DashboardProps) {
    console.log('Notifications:', notifications);

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                
                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-3">
                        <div className="min-h-screen bg-white p-8">

                            {/* HEADER SECTION */}
                            <div className="flex items-center justify-between ">
                                <div>
                                    <h1 className={`text-[42px] font-bold leading-tight text-primary`}>
                                        Welcome back, Engr. Dela Cruz
                                    </h1>
                                    <p className="mt-1 text-lg text-gray-700">
                                        Department of Computer Engineering | Department Head
                                    </p>
                                </div>

                                {/* Right Side - Insiights */}
                                <div className="flex gap-x-10">

                                    <div className="flex items-start gap-3">
                                        <CalendarDays className="h-8 w-8 text-primary" strokeWidth={1.5} />
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wide text-primary">
                                                TODAY
                                            </p>
                                            <p className="font-bold text-gray-800">
                                                {currentDate}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <GraduationCap className="h-8 w-8 text-primary" strokeWidth={1.5} />
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wide text-primary">
                                                SCHOOL YEAR
                                            </p>
                                            <p className="font-bold text-gray-800">
                                                {activeTerm.display_sy}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <NotebookPen className="h-8 w-8 text-primary" strokeWidth={1.5} />
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-wide text-primary">
                                                CURRENT SEM
                                            </p>
                                            <p className="font-bold text-gray-800">
                                                {activeTerm.semester === 0 ? 'First Semester' : 'Second Semester'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-8 border-gray-200" />

                            {/* BODY */}
                            <div className="space-y-8">
                            {/* QUICK MENU */}
                                <div className="w-full rounded-xl border border-gray-200 shadow-sm bg-accent py-6 px-4">
                                    <div className="flex justify-evenly items-center">

                                        {quickMenuItems.map((item, index) => {
                                        const [isHovered, setIsHovered] = React.useState(false);

                                        return (
                                            <a
                                            key={index}
                                            href={item.href}
                                            className="flex flex-col items-center gap-4 cursor-pointer"
                                            onMouseEnter={() => setIsHovered(true)}
                                            onMouseLeave={() => setIsHovered(false)}
                                            >
                                            {/* ICON — SWITCH ON HOVER */}
                                            <Icon
                                                name={(isHovered ? item.iconHover : item.icon) as IconName}
                                                size={127}
                                            />

                                            {/* LABEL */}
                                            <span className="font-bold text-accent-foreground">
                                                {item.label}
                                            </span>
                                            </a>
                                        );
                                        })}

                                    </div>
                                </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
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

                                {/* Pending Approvals Card */}
                                <MetricCard
                                    icon={<AlertCircle className="text-primary-foreground-2" />}
                                    title="FACULTY REQUESTS"
                                >
                                    <MetricContent
                                        total={20}
                                        items={[
                                            {
                                                label: 'Approved Requests',
                                                value: 15,
                                                color: '#0D542B',
                                            },
                                            {
                                                label: 'Pending Requests',
                                                value: 5,
                                                color: '#730000',
                                            },
                                        ]}
                                    />
                                </MetricCard>

                                {/* Pending Approvals Card */}
                                <MetricCard
                                    icon={<AlertCircle className="text-primary-foreground-2" />}
                                    title="STUDENT REQUESTS"
                                >
                                    <MetricContent
                                        total={20}
                                        items={[
                                            {
                                                label: 'Approved Requests',
                                                value: 15,
                                                color: '#0D542B',
                                            },
                                            {
                                                label: 'Pending Requests',
                                                value: 5,
                                                color: '#730000',
                                            },
                                        ]}
                                    />
                                </MetricCard>
                            </div>

                            {/* Visualizations */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <PerformanceOverviewChart />
                                <SubmissionStatusChart />
                            </div>   

                            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                                <ArchivedJournalsChart />
                                <ResearchAreaChart />
                            </div>     

                            <div className="space-y-6">
                                <SystemRepositoryStorage />
                            </div>   

                            </div>
                        </div>
                    </div>
            </AppLayout>
        <NavFooter />
        </>
    );
}
