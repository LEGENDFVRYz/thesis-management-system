import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { thesis_monitoring } from '@/routes/faculty/management/coordinator';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ManagementLayout from '@/pages/Faculty/management/index';
import FacultyManagementLayout from '@/pages/Faculty/management/index';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Thesis Monitoring',
        href: thesis_monitoring().url,
    },
];

export default function Dashboard() {
    return (
        <FacultyManagementLayout
            breadcrumbs={breadcrumbs}
            title="Thesis Registry" 
            description="View all ongoing and completed theses across all stages and batches"
        >
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
        </FacultyManagementLayout>
    );
}

