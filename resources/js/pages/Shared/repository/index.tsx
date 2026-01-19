import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/guest/repository';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Repository',
        href: index().url,
    },
];

interface RepositoryLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    pageHeader: PageHeaderProps;
}

export default function RepositoryLayout({ children, breadcrumbs, pageHeader }: RepositoryLayoutProps) {
    return (
        <AppLayout 
            breadcrumbs={[...breadcrumb, ...(breadcrumbs ?? [])]}
            pageHeader={pageHeader}
        >
            {children}
        </AppLayout>
    );
}