import AppLayout from '@/layouts/app-layout';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface ManagementLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    pageHeader?: PageHeaderProps;
}

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Management',
        href: '#',      // temporary route, since this component is just a wrapper for whole faculty management
    },
];

export default function FacultyManagementLayout({ children, breadcrumbs, pageHeader }: ManagementLayoutProps) {
    return (
        // WRAPPER FOR MANAGEMENT
        <AppLayout 
            breadcrumbs={[...breadcrumb, ...(breadcrumbs ?? [])]}
            pageHeader={pageHeader}
        >
            <div className="flex flex-col flex-1">

                {/* Main Content Area */}
                <div className="flex-1 h-full p-6 overflow-x-auto">
                    {children}
                </div>
            </div>
        </AppLayout>
    );
}
