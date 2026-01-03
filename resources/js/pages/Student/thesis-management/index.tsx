import AppLayout from '@/layouts/app-layout';
import { thesisManagement } from '@/routes/student';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils'; 

interface RepositoryLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
    description?: string;
}

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Repository',
        href: thesisManagement().url,
    },
];

export default function RepositoryLayout({ children, breadcrumbs, title, description }: RepositoryLayoutProps) {
    return (
        // WRAPPER FOR ALL REPOSITORY PAGES
        <AppLayout breadcrumbs={[...breadcrumb, ...(breadcrumbs ?? [])]}>
            {title && description && (
                <header 
                    className={cn(
                        "flex flex-row items-center",
                        "h-[124px] w-full px-[24px] py-[32px] gap-[102px]",
                        "bg-white border-b border-[#9B000A]",
                        "flex-none order-0 grow-0 box-border"
                    )}
                >
                    <div className="flex flex-col justify-center">
                        <h1 className="text-[36px] font-regular leading-tight text-secondary-foreground-2">
                            {title}
                        </h1>
                        <p className="text-lg text-primary leading-normal">
                            {description}
                        </p>
                    </div>
                </header>
            )}
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {children}
            </div>
        </AppLayout>
    );
}