'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminNotifications } from '@/lib/supabase/notifications';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';

export function NotificationBell() {
    const { getNotifications, getUnreadCount, markAsRead, markAllAsRead, subscribeToNotifications } = useAdminNotifications();
    const queryClient = useQueryClient();
    const router = useRouter();

    const { data: notifications = [] } = useQuery({
        queryKey: ['admin-notifications'],
        queryFn: getNotifications,
    });

    const { data: unreadCount = 0 } = useQuery({
        queryKey: ['admin-notifications-unread'],
        queryFn: getUnreadCount,
    });

    const markAsReadMutation = useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
            queryClient.invalidateQueries({ queryKey: ['admin-notifications-unread'] });
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
            queryClient.invalidateQueries({ queryKey: ['admin-notifications-unread'] });
            toast.success('All notifications marked as read');
        },
    });

    // Subscribe to realtime notifications
    useEffect(() => {
        const unsubscribe = subscribeToNotifications((notification) => {
            queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
            queryClient.invalidateQueries({ queryKey: ['admin-notifications-unread'] });

            // Show toast for new notification
            toast.info(notification.title, {
                description: notification.message,
            });
        });

        return unsubscribe;
    }, [subscribeToNotifications, queryClient]);

    const handleNotificationClick = (notificationId: string, orderId: string | null) => {
        markAsReadMutation.mutate(notificationId);
        if (orderId) {
            router.push(`/admin/orders?highlight=${orderId}`);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-4 py-2">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAllAsReadMutation.mutate()}
                            className="text-xs"
                        >
                            Mark all read
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />
                <ScrollArea className="max-h-96">
                    {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No notifications
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={`px-4 py-3 cursor-pointer ${!notification.read ? 'bg-primary/5' : ''}`}
                                onClick={() => handleNotificationClick(notification.id, notification.order_id)}
                            >
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="font-medium text-sm">{notification.title}</span>
                                        {!notification.read && (
                                            <span className="h-2 w-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
