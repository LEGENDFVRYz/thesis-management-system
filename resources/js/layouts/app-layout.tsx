import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { PageHeaderProps, type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    pageHeader?: PageHeaderProps;
}

export default ({ children, breadcrumbs, pageHeader, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} pageHeader={pageHeader} {...props}>
        {children}
    </AppLayoutTemplate>
);
