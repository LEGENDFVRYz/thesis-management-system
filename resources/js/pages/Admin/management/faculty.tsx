import ManagementLayout from '@/pages/Admin/management/index';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { faculty } from '@/routes/admin/management/index';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Faculty',
        href: faculty().url,
    },
];

export default function DeadlinePage() {
    return (
        <ManagementLayout 
            breadcrumbs={breadcrumbs}
            title="Faculty" 
            description="Manage Faculty Accounts and Assign Roles"
        >

            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
        </ManagementLayout>
    );
}
