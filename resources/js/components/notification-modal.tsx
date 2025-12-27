import React from 'react';
import { X, Bell, Calendar, Users, Info, ExternalLink } from 'lucide-react';

// --- Types ---
export type NotificationType = 'schedule' | 'assignment' | 'reminder' | 'system';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: NotificationType;
  isUnread: boolean;
}

interface NotificationModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  notifications?: NotificationItem[];
}

// --- Helper to get Icon and Colors based on type ---
const getNotificationStyles = (type: NotificationType) => {
  switch (type) {
    case 'schedule':
      return {
        icon: <Calendar className="w-5 h-5 text-red-700" />,
        bg: 'bg-red-50',
      };
    case 'assignment':
      return {
        icon: <Users className="w-5 h-5 text-red-900" />,
        bg: 'bg-red-100', 
      };
    case 'reminder':
      return {
        icon: <Bell className="w-5 h-5 text-yellow-600" />,
        bg: 'bg-yellow-50',
      };
    case 'system':
      return {
        icon: <Info className="w-5 h-5 text-green-600" />,
        bg: 'bg-green-50',
      };
    default:
      return {
        icon: <Bell className="w-5 h-5 text-gray-600" />,
        bg: 'bg-gray-100',
      };
  }
};

export default function NotificationModal({
  isOpen = true, // Default to true for visualization
  onClose,
  notifications = defaultNotifications, // Uses mock data if none provided
}: NotificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Notification List - Scrollable Area */}
      <div className="max-h-[500px] overflow-y-auto">
        {notifications.map((item) => {
          const style = getNotificationStyles(item.type);

          return (
            <div
              key={item.id}
              className={`relative flex gap-4 px-6 py-5 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                item.isUnread ? 'bg-blue-50/30' : 'bg-white'
              }`}
            >
              {/* Unread Indicator Dot */}
              {item.isUnread && (
                <span className="absolute left-2 top-8 w-2 h-2 rounded-full bg-red-700" />
              )}

              {/* Icon Container */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${style.bg}`}
              >
                {style.icon}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <span className="text-xs text-gray-400 mt-1">
                  {item.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 bg-white border-t border-gray-100">
        <button className="w-full flex items-center justify-center gap-2 text-red-900 hover:text-red-700 font-medium text-sm py-2 transition-colors">
          View Notification
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// --- Mock Data (nagbase sa figma hihi)---
const defaultNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'schedule',
    title: 'Defense Schedule Updated',
    description: "Defense for 'Machine Learning Applications in Healthcare Diagnostics' has been updated.",
    timestamp: '2d ago',
    isUnread: true,
  },
  {
    id: '2',
    type: 'assignment',
    title: 'New Panel Assignment',
    description: "You have been assigned as a panel member for the defense of 'Blockchain-Based Voting System'.",
    timestamp: '2d ago',
    isUnread: true,
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Upcoming Defense Reminder',
    description: "Reminder: Defense for 'IoT-Enabled Smart Home Energy Management System' is tomorrow.",
    timestamp: '3d ago',
    isUnread: false,
  },
  {
    id: '4',
    type: 'system',
    title: 'System Maintenance Scheduled',
    description: 'The Defense Management System will undergo scheduled maintenance on December 5, 2025.',
    timestamp: '3d ago',
    isUnread: false,
  },
];