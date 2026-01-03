import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/admin/repository';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface RepositoryLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title: string;
    subtitle: string;
}

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Repository',
        href: index().url,
    },
];

export default function RepositoryLayout({ children, breadcrumbs, title, subtitle }: RepositoryLayoutProps) {
    return (
        <AppLayout breadcrumbs={[...breadcrumb, ...(breadcrumbs ?? [])]}>
            <div className="flex flex-col flex-1">
                {/* Header Card */}
                <header 
                    className={cn(
                        "flex flex-row items-center",
                        "h-[124px] w-full px-[24px] py-[32px] gap-[102px]",
                        "bg-background border-b border-sidebar-gradient-mid",
                        "flex-none order-0 grow-0 box-border"
                    )}
                >
                    <div className="flex flex-col justify-center">
                        <h1 className="text-[36px] font-regular leading-tight text-secondary-foreground-2">
                            {title}
                        </h1>
                        <p className="text-lg text-primary leading-normal">
                            {subtitle}
                        </p>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="flex-1 p-6 overflow-x-auto">
                    {children}
                </div>
            </div>
        </AppLayout>
    );
}