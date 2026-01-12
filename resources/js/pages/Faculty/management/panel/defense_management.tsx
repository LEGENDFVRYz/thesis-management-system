import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/faculty/joint/defense_management/index';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ManagementLayout from '@/pages/Faculty/management/index';
import FacultyManagementLayout from '@/pages/Faculty/management/index';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Defense Management',
        href: index().url,
    },
];

export default function Dashboard() {
    return (
        <FacultyManagementLayout
            breadcrumbs={breadcrumbs}
            title="Defense Management" 
            description="loremmms"
        >
            {/* NOTE: This page is joint now with the adviser */}
            {/* YOU SHOULD EDIT IT WITH adviser/defense_management.tsx */}
            <div>temporary: for notice only... read the comment above of this tsx file</div>
        </FacultyManagementLayout>
    );
}

