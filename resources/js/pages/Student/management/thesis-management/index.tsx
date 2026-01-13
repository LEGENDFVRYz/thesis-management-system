import AppLayout from '@/layouts/app-layout';
import { thesis } from '@/routes/student/management/index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils'; 
import StudentManagementLayout from '..';

interface ThesisManagementLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    pageHeader: PageHeaderProps;
}

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Thesis Management',
        href: thesis().url,
    },
];

export default function ThesisManagementLayout({ children, breadcrumbs, pageHeader }: ThesisManagementLayoutProps) {
    return (
        // WRAPPER FOR ALL THESIS MANAGEMENT PAGES
        <StudentManagementLayout
            breadcrumbs={[...breadcrumb, ...(breadcrumbs ?? [])]}
            pageHeader={pageHeader}
        >
            
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {children}
            </div>
        </StudentManagementLayout>
    );
}