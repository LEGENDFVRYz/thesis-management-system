import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/faculty/coordinator/defense_management/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import ManagementLayout from '@/pages/Faculty/management/index';
import FacultyManagementLayout from '@/pages/Faculty/management/index';
import { index as matrix } from '@/routes/faculty/coordinator/defense_management/matrix';
import { index as panel_assign } from '@/routes/faculty/coordinator/defense_management/panel_assign';


import { type ReactNode } from 'react';


interface DefenseManagementLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title: string;
    description: string;
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

export default function DefenseManagementLayout({ children, breadcrumbs, title, description }: DefenseManagementLayoutProps) {
    const { url } = usePage();

    return (
        <FacultyManagementLayout 
            breadcrumbs={[...breadcrumb, ...(breadcrumbs ?? [])]}
            title={title} 
            description={description}
        >
            {/* PAGE TABS */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                    {tabs.map((tab) => {
                        const isActive = url.startsWith(tab.href.url);
                        
                        return (
                            <li key={tab.title} className="me-2">
                                <Link
                                    href={tab.href}
                                    className={`inline-block p-4 border-b-2 rounded-t-lg ${
                                        isActive
                                            ? 'text-primary border-primary active'
                                            : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                                    }`}
                                >
                                    {tab.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
            
            {/* CONTENT */}
            {children}

        </FacultyManagementLayout>
    );
}

