import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { PageHeaderProps, SharedData, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useEffect, type ReactNode } from 'react';
import { toast, Toaster } from 'sonner';

type AppHeaderLayoutProps = PropsWithChildren<{
    breadcrumbs?: BreadcrumbItem[];
    pageHeader?: PageHeaderProps;
}>;

export default function AppHeaderLayout({children, breadcrumbs, pageHeader}: AppHeaderLayoutProps) {
    const { flash } = usePage<SharedData>().props;

    useEffect(() => {
        if (flash.success) toast.success(flash.success)
        if (flash.error) toast.error(flash.error)
        if (flash.info) toast.info(flash.info)
        if (flash.warning) toast.warning(flash.warning)
    }, [flash])

    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent pageHeader={pageHeader} >
                {children}
            </AppContent>
            <Toaster />
        </AppShell>
    );
}
