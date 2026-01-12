import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { NotificationItem, PageHeaderProps, type BreadcrumbItem } from '@/types';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { AppContent } from '@/components/app-content';
import { index } from '@/routes/notifications/index';
import { Bell } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import FilterSearchSection from '@/components/filter-search-section';
import { NotificationList, NotificationListItem } from '@/components/ui/notification-list';
import { getTimeAgo } from '@/lib/utils';

// Setup
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Notifications',
        href: index().url,
    },
];

const pageHeader: PageHeaderProps = {
    title: "Notifications",
    subtitle: "Stay updated with all system notifications and alerts",
    icon: (
        // pa correct nalang
        <Bell className="w-8 h-8 text-primary" />
    ),
};

// PAge Props
interface NotificationProps {
    notifications: NotificationItem[];
}


export default function Notification({ notifications }: NotificationProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs} pageHeader={pageHeader}>
            <Head title="Notifications" />

            <div className="space-y-6 font-dm pb-10 flex flex-col items-center w-full">
    
                <div className="w-full flex justify-center">
                    <FilterSearchSection variant="Notifications" />
                </div>
                
                <div className="w-full max-w-[1360px] flex flex-col gap-[35px] rounded-lg">
                    <NotificationList maxHeight="auto">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-6 text-gray-500">
                                <Bell className='w-16 h-16 mb-4 text-gray-400' />
                                <p className="text-center text-sm">
                                    You don't have any notifications yet. <br /> They'll appear here when something happens!
                                </p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <NotificationListItem
                                    key={notification.id}
                                    type={notification.data.type ?? null}   // null for internal fallback (defaulkt: bell icon)
                                    title={notification.data.title}
                                    description={notification.data.message}
                                    timestamp={getTimeAgo(notification.created_at)}
                                    isUnread={notification.read_at === null}
                                />
                            ))
                        )}
                    </NotificationList>

                </div>
            </div>

        </AppLayout>
    );
}
