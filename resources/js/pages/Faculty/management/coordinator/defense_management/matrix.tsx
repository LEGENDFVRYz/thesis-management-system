import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { matrix } from '@/routes/faculty/management/coordinator/defense_management';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import DefenseManagementLayout from '.';


const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Matrix Management',
        href: matrix().url,
    },
];

export default function Dashboard() {
    return (
        <DefenseManagementLayout
            breadcrumbs={breadcrumb}
            title="Matrix Management" 
            description="Monitor all defense schedule, facilities, and equipment"
        >
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
        </DefenseManagementLayout>
    );
}