import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ProgressTrackingLayout from './index';
import { Icon } from '@/components/icon-index';

// Setup
const breadcrumb: BreadcrumbItem[] = [
    {   title: 'Overall Progress',
        href: '#'
    }
];

const pageHeader: PageHeaderProps = {
    title: "Progress Tracking" ,
    subtitle: "Access a comprehensive archive of student theses",
    icon: (
        // pa correct nalang
        <Icon name="calendarDefault" className="w-8 h-8 text-primary" />
    ),
};

export default function Dashboard() {
    return (
        <ProgressTrackingLayout 
            breadcrumbs={breadcrumb}
            pageHeader={pageHeader}
        >
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                Overall progress
            </div>
        </ProgressTrackingLayout>
    );
}

