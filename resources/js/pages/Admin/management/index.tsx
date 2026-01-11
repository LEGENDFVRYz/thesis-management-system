import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/admin/management/index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Icon } from '@/components/icon-index';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils'; 

interface ManagementLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    pageHeader: PageHeaderProps;
}

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Management',
        href: index().url,
    },
];

export default function ManagementLayout({ children, breadcrumbs, pageHeader }: ManagementLayoutProps) {
    return (
        <AppLayout 
            breadcrumbs={[...breadcrumb, ...(breadcrumbs ?? [])]}
            pageHeader={pageHeader}
        >
            <div className="flex flex-col flex-1">
                {/* Header Card implementation based on figma CSS:
                   height: 124px, padding: 32px 24px, border-bottom: #9B000A 
                */}


                {/* Main Content Area */}
                <div className="flex-1 h-full p-6 overflow-x-auto">
                    {children}
                </div>
            </div>
        </AppLayout>
    );
}