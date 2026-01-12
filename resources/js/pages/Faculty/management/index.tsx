import AppLayout from '@/layouts/app-layout';
// import { index } from '@/routes/faculty/management';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface ManagementLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title: string;
    description: string;
}

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Management',
        href: '#',              // Non-existing page, since this is just a wrapper
                                // We forcely passed this for sake of frontend breadcrumb organization
    },
];

export default function FacultyManagementLayout({ children, breadcrumbs, title, description }: ManagementLayoutProps) {
    return (
        // WRAPPER FOR MANAGEMENT
        <AppLayout breadcrumbs={[...breadcrumb, ...(breadcrumbs ?? [])]}>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className={`text-[36px] leading-tight text-secondary-foreground-2`}>
                        {title}
                    </h1>
                    <p className="mt-1 text-lg text-primary">
                        {description}
                    </p>
                </div>

                {children}
            </div>
        </AppLayout>
    );
}
