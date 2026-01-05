import * as React from 'react';
import { Calendar, Users, Bell, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types ---
export type NotificationType = 'schedule' | 'assignment' | 'reminder' | 'system';

export interface NotificationItemProps extends React.HTMLAttributes<HTMLDivElement> {
    type: string | null;    // Accept any string, since you have internal validation already
    title: string;
    description: string;
    timestamp: string;
    isUnread?: boolean;
}

// --- Helper to get Icon and Colors based on type ---
const getNotificationStyles = (type: NotificationType) => {
    switch (type) {
        case 'schedule':
            return {
                icon: Calendar,
                iconColor: 'text-red-700',
                bg: 'bg-red-50',
            };
        case 'assignment':
            return {
                icon: Users,
                iconColor: 'text-red-900',
                bg: 'bg-red-100',
            };
        case 'reminder':
            return {
                icon: Bell,
                iconColor: 'text-yellow-600',
                bg: 'bg-yellow-50',
            };
        case 'system':
            return {
                icon: Info,
                iconColor: 'text-green-600',
                bg: 'bg-green-50',
            };
        default:
            return {
                icon: Bell,
                iconColor: 'text-gray-600',
                bg: 'bg-gray-100',
            };
    }
};

// --- Individual Notification List Item ---
const NotificationListItem = React.forwardRef<HTMLDivElement, NotificationItemProps>(
    ({ className, type = 'system', title, description, timestamp, isUnread = false, ...props }, ref) => {
        const style = getNotificationStyles(type);
        const IconComponent = style.icon;

        return (
            <div
                ref={ref}
                className={cn(
                    'relative flex gap-4 px-6 py-5 border-b border-gray-50',
                    'hover:bg-gray-50 transition-colors cursor-pointer',
                    isUnread && 'bg-blue-50/30',
                    className
                )}
                {...props}
            >
                {/* Unread Indicator Dot */}
                {isUnread && (
                    <span className="absolute left-2 top-8 w-2 h-2 rounded-full bg-red-700" />
                )}

                {/* Icon Container */}
                <div
                    className={cn(
                        'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
                        style.bg
                    )}
                >
                    <IconComponent className={cn('w-5 h-5', style.iconColor)} />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                    <span className="text-xs text-gray-400 mt-1">
                        {timestamp}
                    </span>
                </div>
            </div>
        );
    }
);
NotificationListItem.displayName = 'NotificationListItem';

// --- Notification List Container ---
interface NotificationListProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    maxHeight?: string;
}

const NotificationList = React.forwardRef<HTMLDivElement, NotificationListProps>(
    ({ className, children, maxHeight = '500px', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn('overflow-y-auto', className)}
                style={{ maxHeight }}
                {...props}
            >
                {children}
            </div>
        );
    }
);
NotificationList.displayName = 'NotificationList';

export { NotificationList, NotificationListItem };
