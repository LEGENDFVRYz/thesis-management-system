import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { group_comp } from '@/routes/faculty/management/adviser/advisee_management';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import AdviseeManagementLayout from '.';

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Group Composition',
        href: group_comp().url,
    },
];

export default function Dashboard() {
    return (
        <AdviseeManagementLayout 
            breadcrumbs={breadcrumb}
            title="Group Composition" 
            description="Create and manage thesis group compositions and membership changes"
        >
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
        </AdviseeManagementLayout>
    );
}

