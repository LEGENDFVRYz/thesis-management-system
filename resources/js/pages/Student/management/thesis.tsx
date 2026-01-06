import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ManagementLayout from '@/pages/Faculty/management/index';
import StudentManagementLayout from '@/pages/Faculty/management/index';
import { thesis } from '@/routes/student/management';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Thesis Management',
        href: thesis().url,
    },
];

export default function Dashboard() {
    return (
        <StudentManagementLayout
            breadcrumbs={breadcrumbs}
            title="Thesis Management" 
            description="Access a comprehensive archive of student theses"
        >
            <div className="flex flex-1 flex-row gap-4"> 
                <div className="relative aspect-video flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
                <div className="relative aspect-video flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </StudentManagementLayout>
    );
}

