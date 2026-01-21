'use client';

import { useNotifications } from '@/hooks/useNotifications';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const NotificationBell = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleNotificationClick = (notification: any) => {
        markAsRead(notification.id);
        if (notification.data?.order_id) {
            router.push('/admin/orders');
        }
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                            <h3 className="font-semibold text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markAllAsRead()}
                                    className="text-xs text-blue-400 hover:text-blue-300"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="overflow-y-auto flex-1">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    No notifications
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <button
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`w-full p-4 text-left border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors ${!notification.read ? 'bg-zinc-800/30' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-white text-sm">
                                                        {notification.title}
                                                    </h4>
                                                    {!notification.read && (
                                                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-400 mt-1">
                                                    {notification.message}
                                                </p>
                                                {notification.data?.customer_name && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Customer: {notification.data.customer_name}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {new Date(notification.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
