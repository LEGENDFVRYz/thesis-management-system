import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { thesis_review } from '@/routes/faculty/management/adviser/advisee_management';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import AdviseeManagementLayout from '.';

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Thesis Document Review',
        href: thesis_review().url,
    },
];

export default function Dashboard() {
    return (
        <AdviseeManagementLayout 
            breadcrumbs={breadcrumb}
            title="Thesis Document Review" 
            description="Review, comment on, and approve/request revisions for submitted thesis documents"
        >
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
        </AdviseeManagementLayout>
    );
}

