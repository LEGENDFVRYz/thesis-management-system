import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/faculty/coordinator/defense_management/index';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import ManagementLayout from '@/pages/Faculty/management/index';
import FacultyManagementLayout from '@/pages/Faculty/management/index';
import { index as matrix } from '@/routes/faculty/coordinator/defense_management/matrix';
import { index as panel_assign } from '@/routes/faculty/coordinator/defense_management/panel_assign';


import { type ReactNode } from 'react';


interface DefenseManagementLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    pageHeader: PageHeaderProps;
}

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Defense Management',
        href: index().url,
    },
];

const tabs = [
    { title: 'Matrix Management',   href: matrix() },
    { title: 'Panel Assignment',    href: panel_assign() },
];

export default function DefenseManagementLayout({ children, breadcrumbs, pageHeader }: DefenseManagementLayoutProps) {
    const { url } = usePage();

    return (
        <FacultyManagementLayout 
            breadcrumbs={[...breadcrumb, ...(breadcrumbs ?? [])]}
            pageHeader={pageHeader}
        >
            
            {/* CONTENT */}
            {children}
        </FacultyManagementLayout>
    );
}

