import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { thesis_registry } from '@/routes/faculty/management/coordinator/thesis_monitoring';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ThesisMonitoringLayout from '.';


const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Thesis Registry',
        href: thesis_registry().url,
    },
];

export default function Dashboard() {
    return (
        <ThesisMonitoringLayout
            breadcrumbs={breadcrumb}
            title="Thesis Registry" 
            description="View all ongoing and completed theses across all stages and batches"
        >
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
        </ThesisMonitoringLayout>
    );
}

