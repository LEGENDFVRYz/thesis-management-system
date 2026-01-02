import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { AppContent } from '@/components/app-content';
import { Bell } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import FilterSearchSection from '@/components/filter-search-section';
import { NotificationList, NotificationListItem } from '@/components/ui/notification-list';

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

            <div className="space-y-6 px-6 pb-6 max-w-[1440px] w-full">
    
                <FilterSearchSection variant='Notifications'/>
                
                <div className="w-full flex flex-col gap-[35px] rounded-lg">
                    <NotificationList maxHeight="auto">
                        <NotificationListItem
                            type="schedule"
                            title="Defense Schedule Updated"
                            description="Defense for 'Machine Learning Applications in Healthcare Diagnostics' has been updated."
                            timestamp="2d ago"
                            isUnread={true}
                        />
                        <NotificationListItem
                            type="assignment"
                            title="New Panel Assignment"
                            description="You have been assigned as a panel member for the defense of 'Blockchain-Based Voting System'."
                            timestamp="2d ago"
                            isUnread={true}
                        />
                        <NotificationListItem
                            type="reminder"
                            title="Upcoming Defense Reminder"
                            description="Reminder: Defense for 'IoT-Enabled Smart Home Energy Management System' is tomorrow."
                            timestamp="3d ago"
                            isUnread={false}
                        />
                        <NotificationListItem
                            type="system"
                            title="System Maintenance Scheduled"
                            description="The Defense Management System will undergo scheduled maintenance on December 5, 2025."
                            timestamp="3d ago"
                            isUnread={false}
                        />
                        <NotificationListItem
                            type="schedule"
                            title="Defense Schedule Updated"
                            description="Defense for 'Machine Learning Applications in Healthcare Diagnostics' has been updated."
                            timestamp="2d ago"
                            isUnread={true}
                        />
                        <NotificationListItem
                            type="assignment"
                            title="New Panel Assignment"
                            description="You have been assigned as a panel member for the defense of 'Blockchain-Based Voting System'."
                            timestamp="2d ago"
                            isUnread={true}
                        />
                        <NotificationListItem
                            type="reminder"
                            title="Upcoming Defense Reminder"
                            description="Reminder: Defense for 'IoT-Enabled Smart Home Energy Management System' is tomorrow."
                            timestamp="3d ago"
                            isUnread={false}
                        />
                        <NotificationListItem
                            type="system"
                            title="System Maintenance Scheduled"
                            description="The Defense Management System will undergo scheduled maintenance on December 5, 2025."
                            timestamp="3d ago"
                            isUnread={false}
                        />
                    </NotificationList>
                </div>
            </div>

        </AppLayout><NavFooter /></>
    );
}
