import React from 'react';
import { X, Bell, ExternalLink } from 'lucide-react';
import { NotificationList, NotificationListItem, type NotificationType } from '@/components/ui/notification-list';

// --- Types ---
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
      <NotificationList maxHeight="500px">
        {notifications.map((item) => (
          <NotificationListItem
            key={item.id}
            type={item.type}
            title={item.title}
            description={item.description}
            timestamp={item.timestamp}
            isUnread={item.isUnread}
          />
        ))}
      </NotificationList>

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