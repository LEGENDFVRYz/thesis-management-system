import { overall, reports } from '@/routes/student/management/progress/index';
import { TabButton } from '@/components/ui/tabs';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import StudentManagementLayout from '@/pages/Student/management/index';


interface ProgressTrackingLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    pageHeader: PageHeaderProps;
}

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Progress Tracking',
        href: overall().url,
    },
];

const tabs = [
    { 
        title: 'Overall Progress', 
        href: overall().url
    },
    {
        title: 'Status Report',
        href: reports().url
    },
];

export default function ProgressTrackingLayout({ children, breadcrumbs, pageHeader }: ProgressTrackingLayoutProps) {
    const { url } = usePage();

    return (
        <StudentManagementLayout 
            breadcrumbs={[...breadcrumb, ...(breadcrumbs ?? [])]}
            pageHeader={pageHeader}
        >
            {/* PAGE TABS */}
            <div className="mb-6 inline-flex">
                {tabs.map((tab) => {
                    const isActive = url.startsWith(tab.href);

                    return (
                        <Link key={tab.title} href={tab.href}>
                            <TabButton isActive={isActive}>
                                {tab.title}
                            </TabButton>
                        </Link>
                    );
                })}
            </div>
            
            {/* CONTENT */}
            {children}

        </StudentManagementLayout>
    );
}

