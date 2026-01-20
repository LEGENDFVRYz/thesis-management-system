import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/student/management/index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface ManagementLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    pageHeader: PageHeaderProps;
}

// Setup
const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Management',
        href: index().url,
    },
];


export default function StudentManagementLayout({ children, breadcrumbs, pageHeader }: ManagementLayoutProps) {
    return (
        // WRAPPER FOR MANAGEMENT
        <AppLayout 
            breadcrumbs={[...breadcrumb, ...(breadcrumbs ?? [])]}
            pageHeader={pageHeader}
        >
            <div className="flex h-full flex-1">

                {/* Main Content Area */}
                <div className="flex-1 h-full overflow-x-auto">
                    {children}
                </div>
            </div>
        </AppLayout>
    );
}