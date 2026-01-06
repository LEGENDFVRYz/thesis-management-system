import AppLayout from '@/layouts/app-layout';
import { index } from '@/routes/admin/management';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils'; 

interface ManagementLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title: string;
    description: string;
}

const breadcrumb: BreadcrumbItem[] = [
    {
        title: 'Management',
        href: index().url,
    },
];

export default function ManagementLayout({ children, breadcrumbs, title, description }: ManagementLayoutProps) {
    return (
        <AppLayout breadcrumbs={[...breadcrumb, ...(breadcrumbs ?? [])]}>
            <div className="flex flex-col flex-1">
                {/* Header Card implementation based on figma CSS:
                   height: 124px, padding: 32px 24px, border-bottom: #9B000A 
                */}
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
                    
                    {/* The 102px gap will naturally separate the title from any optional header actions here */}
                </header>

                {/* Main Content Area */}
                <div className="flex-1 h-full p-6 overflow-x-auto">
                    {children}
                </div>
            </div>
        </AppLayout>
    );
}