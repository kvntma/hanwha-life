import { createClient } from '@/lib/supabase/browser';
import { AdminNotification } from '@/types/notification';
import { useState } from 'react';

export const useAdminNotifications = () => {
    const [supabase] = useState(() => createClient());

    return {
        // Get all notifications
        getNotifications: async () => {
            const { data, error } = await supabase
                .from('admin_notifications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as AdminNotification[];
        },

        // Get unread count
        getUnreadCount: async () => {
            const { count, error } = await supabase
                .from('admin_notifications')
                .select('*', { count: 'exact', head: true })
                .eq('read', false);

            if (error) throw error;
            return count ?? 0;
        },

        // Mark notification as read
        markAsRead: async (id: string) => {
            const { error } = await supabase
                .from('admin_notifications')
                .update({ read: true })
                .eq('id', id);

            if (error) throw error;
        },

        // Mark all as read
        markAllAsRead: async () => {
            const { error } = await supabase
                .from('admin_notifications')
                .update({ read: true })
                .eq('read', false);

            if (error) throw error;
        },

        // Subscribe to new notifications (realtime)
        subscribeToNotifications: (callback: (notification: AdminNotification) => void) => {
            const channel = supabase
                .channel('admin_notifications')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'admin_notifications',
                    },
                    (payload) => {
                        callback(payload.new as AdminNotification);
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        },
    };
};
