import { Breadcrumb } from '@/components/ui/breadcrumb';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Fragment } from 'react';

export function Breadcrumbs({
    breadcrumbs,
}: {
    breadcrumbs: BreadcrumbItemType[];
}) {
    const items = breadcrumbs.map(item => item.title);
    
    return (
        <>
            {breadcrumbs.length > 0 && (
                <Breadcrumb items={items} />
            )}
        </>
    );
}