import AppLayout from '@/layouts/app-layout';
import { thesisManagement } from '@/routes/student';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface RepositoryLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Repository',
        href: thesisManagement().url,
    },
];

export default function RepositoryLayout({ children, breadcrumbs }: RepositoryLayoutProps) {
    return (
        // WRAPPER FOR ALL REPOSITORY PAGES
        <AppLayout breadcrumbs={[...breadcrumb, ...(breadcrumbs ?? [])]}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {children}
            </div>
        </AppLayout>
    );
}