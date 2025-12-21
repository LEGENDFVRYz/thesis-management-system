import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { thesis_review } from '@/routes/faculty/management/panel';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ManagementLayout from '@/pages/Faculty/management/index';
import FacultyManagementLayout from '@/pages/Faculty/management/index';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Thesis Review',
        href: thesis_review().url,
    },
];

export default function Dashboard() {
    return (
        <FacultyManagementLayout
            breadcrumbs={breadcrumbs}
            title="Evaluation and Grading" 
            description="Input and submit grades for advisees per stage (MOR/DP1/DP2) based on panel evaluations"
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

