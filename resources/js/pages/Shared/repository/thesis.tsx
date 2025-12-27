import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { theses } from '@/routes/repository';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import RepositoryLayout from '@/pages/Shared/repository';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Thesis',
        href: theses().url,
    },
];

export default function Dashboard() {
    return (
        <RepositoryLayout breadcrumbs={breadcrumbs}>
            <Head title="Theses Repository" />

            <h1>THESEs REPOSITORY</h1>

            <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
            </div>
        </RepositoryLayout>
    );
}