import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ProgressTrackingLayout from './index';

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Progress Tracking',
        href: '/student/management/progress_tracking/overall_progress'
    },
    {   title: 'Overall Progress',
        href: '#'
    }
];

export default function Dashboard() {
    return (
        <ProgressTrackingLayout 
            breadcrumbs={breadcrumb}
            title="Progress Tracking" 
            description="Access a comprehensive archive of student theses"
        >
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                Overall progress
            </div>
        </ProgressTrackingLayout>
    );
}

