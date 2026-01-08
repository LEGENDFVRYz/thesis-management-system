import {
    group_comp,
    index,
    my_advisees,
    progress,
    thesis_review,
} from '@/routes/faculty/management/adviser/advisee_management';

import FacultyManagementLayout from '@/pages/Faculty/management/index';
import { type BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

import { TabButton } from '@/components/ui/tabs';

interface AdviseeManagementLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title: string;
    description: string;
}

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Advisee Management',
        href: index().url,
    },
];

const tabs = [
    { title: 'My Advisees', href: my_advisees() },
    { title: 'Group Composition', href: group_comp() },
    { title: 'Progress Monitoring', href: progress() },
    { title: 'Thesis Review', href: thesis_review() },
];

export default function AdviseeManagementLayout({
    children,
    breadcrumbs,
    title,
    description,
}: AdviseeManagementLayoutProps) {
    const { url } = usePage();

    return (
        <FacultyManagementLayout
            breadcrumbs={[...breadcrumb, ...(breadcrumbs ?? [])]}
            title={title}
            description={description}
        >
            {/* PAGE TABS */}
            <div className="mb-6">
                <div className="inline-flex">
                    {tabs.map((tab) => {
                        const isActive = url.startsWith(tab.href.url);

                        return (
                            <Link key={tab.title} href={tab.href}>
                                <TabButton isActive={isActive}>
                                    {tab.title}
                                </TabButton>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* CONTENT */}
            {children}
        </FacultyManagementLayout>
    );
}
