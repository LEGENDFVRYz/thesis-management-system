import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/repository';
import { type BreadcrumbItem } from '@/types';
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
}

export default function RepositoryLayout({ children, breadcrumbs }: RepositoryLayoutProps) {
    return (
        <AppLayout breadcrumbs={[...(breadcrumbs ?? [])]}>
            {children}
        </AppLayout>
    );
}