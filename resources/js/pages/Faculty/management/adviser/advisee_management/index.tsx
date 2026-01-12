import { index as my_advisees } from '@/routes/faculty/adviser/my_advisees';
import { index as group_comp } from '@/routes/faculty/adviser/group_comp';
import { index as progress } from '@/routes/faculty/adviser/thesis_review';
import { index as thesis_review } from '@/routes/faculty/adviser/progress';

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
        href: '#',      // temporary, since this file is just a wrapper
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
