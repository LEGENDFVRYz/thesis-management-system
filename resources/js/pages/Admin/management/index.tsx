import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/admin/management';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface ManagementLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Management',
        href: index().url,
    },
];

export default function ManagementLayout({ children, breadcrumbs }: ManagementLayoutProps) {
    return (
        // WRAPPER FOR MANAGEMENT
        <AppLayout breadcrumbs={[...breadcrumb, ...(breadcrumbs ?? [])]}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {children}
            </div>
        </AppLayout>
    );
}
