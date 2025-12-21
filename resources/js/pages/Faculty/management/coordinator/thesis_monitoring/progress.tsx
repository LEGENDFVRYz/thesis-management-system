import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { progress } from '@/routes/faculty/management/coordinator/thesis_monitoring';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ThesisMonitoringLayout from '.';


const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Progress Reports',
        href: progress().url,
    },
];

export default function Dashboard() {
    return (
        <ThesisMonitoringLayout
            breadcrumbs={breadcrumb}
            title="Progress Reports" 
            description="Generate and export reports on thesis submissions, completions and guidelines"
        >
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
        </ThesisMonitoringLayout>
    );
}