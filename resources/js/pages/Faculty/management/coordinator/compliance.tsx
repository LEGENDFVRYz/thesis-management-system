import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes/faculty';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ManagementLayout from '@/pages/Faculty/management/index';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Compliance and Eligibility',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <ManagementLayout breadcrumbs={breadcrumbs}>
            <Head title="Compliance and Eligibility" />

            <h1>Compliance and Eligibility</h1>

            <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
                <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
        </ManagementLayout>
    );
}

