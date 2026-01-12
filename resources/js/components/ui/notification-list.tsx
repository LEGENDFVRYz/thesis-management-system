import * as React from 'react';
import { Calendar, Users, Bell, Info, Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

// --- Types ---
export type NotificationType = 'schedule' | 'assignment' | 'reminder' | 'system';

export interface NotificationItemProps extends React.HTMLAttributes<HTMLDivElement> {
    type: string | null;    // Accept any string, since you have internal validation already
    title: string;
    description: string;
    timestamp: string;
    isUnread?: boolean;

    onRead?: () => void; 
    onDelete?: () => void;
    isLoading?: boolean;
}

const getNotificationStyles = (type: NotificationType) => {
    switch (type) {
        case 'schedule': return { icon: Calendar, iconColor: 'text-red-700', bg: 'bg-red-50' };
        case 'assignment': return { icon: Users, iconColor: 'text-red-900', bg: 'bg-red-100' };
        case 'reminder': return { icon: Bell, iconColor: 'text-yellow-600', bg: 'bg-yellow-50' };
        case 'system': return { icon: Info, iconColor: 'text-green-600', bg: 'bg-green-50' };
        default: return { icon: Bell, iconColor: 'text-gray-600', bg: 'bg-gray-100' };
    }
};

const NotificationListItem = React.forwardRef<HTMLDivElement, NotificationItemProps>(
    ({ className, type = 'system', title, description, timestamp, isUnread, onRead, onDelete, isLoading, ...props }, ref) => {


        // 1. GUMAMIT NG STATE PARA SA REAL-TIME UPDATE
        // const [unread, setUnread] = React.useState(initialIsUnread);

        const style = getNotificationStyles(type);
        const IconComponent = style.icon;

        // 2. TOGGLE FUNCTION
        // const handleToggleRead = (e: React.MouseEvent) => {
        //     e.stopPropagation();
        //     // setUnread(!unread);
        // };

        return (
            <div
                ref={ref}
                className={cn(
                    'relative flex gap-4 px-6 py-5 border-border border rounded-xl mb-2 transition-all duration-200',
                    'hover:bg-gray-50 cursor-pointer',
                    // Ang background ng container ay nagbabago base sa state
                    isUnread ? 'bg-blue-50/40 border-blue-100' : 'bg-white',
                    className
                )}
                {...props}
            >
                {/* Red Dot - Lalabas lang kung unread */}
                {isUnread && (
                    <span className="absolute left-2 top-8 w-2 h-2 rounded-full bg-red-700" />
                )}

                <div className={cn('flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center', style.bg)}>
                    <IconComponent className={cn('w-5 h-5', style.iconColor)} />
                </div>

                <div className="flex flex-col gap-1 flex-1">
                    <h3 className={cn("text-sm font-semibold leading-tight", isUnread ? "text-gray-900" : "text-gray-700")}>
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                         <span className="text-xs text-gray-400">{timestamp}</span>
                        
                        <div className="flex items-center gap-1">
                            <Button 
                                variant={'ghost'} 
                                className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 transition-all"
                                disabled={isLoading}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRead?.(); // Call the parent function
                                }}
                            >
                                {isUnread ? (
                                    <>
                                        <Check className="w-3.5 h-3.5" />
                                        Mark Read
                                    </>
                                ) : (
                                    <>
                                        <div className="relative flex items-center justify-center w-3.5 h-3.5">
                                            <Check className="w-3.5 h-3.5 absolute" style={{ left: '-2px' }} />
                                            <Check className="w-3.5 h-3.5 absolute" style={{ left: '2px' }} />
                                        </div>
                                        Mark Unread
                                    </>
                                )}
                            </Button>
                            
                            <Button variant={'negative'} className="p-1.5 h-8 w-8"
                                disabled={isLoading}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete?.();
                                }}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>
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
