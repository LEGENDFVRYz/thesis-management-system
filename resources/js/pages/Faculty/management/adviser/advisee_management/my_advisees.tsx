import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { my_advisees } from '@/routes/faculty/management/adviser/advisee_management';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import AdviseeManagementLayout from '.';

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'My Advisees',
        href: my_advisees().url,
    },
];

export default function Dashboard() {
    return (
        <AdviseeManagementLayout 
            breadcrumbs={breadcrumb}
            title="My Advisees" 
            description="View and manage all students under supervision with their current thesis stages"
        >
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
        </AdviseeManagementLayout>
    );
}

