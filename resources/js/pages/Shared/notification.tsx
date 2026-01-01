import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { AppContent } from '@/components/app-content';
import { Bell } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';

export default function Notification() {
    return (
        <><AppLayout breadcrumbs={[{ title: 'Notifications', href: '/notifications' } as BreadcrumbItem]}>
            <Head title="Notifications" />

            <AppContent
                title="Notifications"
                subtitle="Stay updated with all system notifications and alerts"
                icon={<Bell className="w-8 h-8 text-primary" />}
                variant="header"
            > </AppContent>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
                            <PlaceholderPattern />
                        </div>
                    </div>
                </div>
            </div>


        </AppLayout><NavFooter /></>
    );
}
