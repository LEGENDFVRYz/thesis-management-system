import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/admin/repository';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Repository',
        href: index().url,
    },
];

interface RepositoryLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function RepositoryLayout({ children, breadcrumbs }: RepositoryLayoutProps) {
    return (
        <AppLayout breadcrumbs={[...(breadcrumbs ?? [])]}>
            {children}
        </AppLayout>
    );
}