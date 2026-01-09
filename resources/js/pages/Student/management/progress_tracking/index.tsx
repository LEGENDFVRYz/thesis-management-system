import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/faculty/management/adviser/advisee_management';
import { my_advisees, group_comp, thesis_review, progress } from '@/routes/faculty/management/adviser/advisee_management';

import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import StudentManagementLayout from '@/pages/Student/management/index';


interface ProgressTrackingLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title: string;
    description: string;
}

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Progress Tracking',
        href: index().url,
    },
];

const tabs = [
    { 
        title: 'Overall Progress', 
        href: '/student/management/progress_tracking/overall_progress'
    },
    {
        title: 'Status Report',
        href: '/student/management/progress_tracking/status_reports' 
    },
];

export default function ProgressTrackingLayout({ children, breadcrumbs, title, description }: ProgressTrackingLayoutProps) {
    const { url } = usePage();

    return (
        <StudentManagementLayout 
            breadcrumbs={[...breadcrumb, ...(breadcrumbs ?? [])]}
            title={title} 
            description={description}
        >
            {/* PAGE TABS */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    {tabs.map((tab) => {
                        const isActive = url.startsWith(tab.href);
                        
                        return (
                            <li key={tab.title} className="me-2">
                                <Link
                                    href={tab.href}
                                    className={`inline-block p-4 border-b-2 rounded-t-lg ${
                                        isActive
                                            ? 'text-primary border-primary active'
                                            : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                                    }`}
                                >
                                    {tab.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
            
            {/* CONTENT */}
            {children}

        </StudentManagementLayout>
    );
}

