import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';

type AppHeaderLayoutProps = PropsWithChildren<{
    breadcrumbs?: BreadcrumbItem[];
    pageHeader?: PageHeaderProps;
}>;

export default function AppHeaderLayout({children, breadcrumbs, pageHeader}: AppHeaderLayoutProps) {
    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent pageHeader={pageHeader} >
                {children}
            </AppContent>
        </AppShell>
    );
}
