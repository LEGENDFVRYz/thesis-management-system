import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/faculty/joint/defense_management';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import FacultyManagementLayout from '@/pages/Faculty/management/index';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Defense Management',
        href: index().url,
    },
];

export default function Dashboard() {
    return (
        <FacultyManagementLayout 
            breadcrumbs={breadcrumbs}
            title="Defense Management" 
            description="Monitor all defense schedules and panel assignments"
        >
            <div className="flex flex-1 flex-row gap-4"> 
                <div className="relative aspect-video flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
                <div className="relative aspect-video flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </FacultyManagementLayout>
    );
}

