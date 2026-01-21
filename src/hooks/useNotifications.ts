'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/browser';
import { useState } from 'react';

export interface Notification {
    id: string;
    user_id: string;
    type: string;
    title: string;
    message: string;
    data?: {
        order_id?: string;
        total_amount?: number;
        customer_name?: string;
        status?: string;
    };
    read: boolean;
    created_at: string;
}

export const useNotifications = () => {
    const [supabase] = useState(() => createClient());
    const queryClient = useQueryClient();

    // Fetch notifications
    const { data: notifications = [], isLoading, error, refetch } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as Notification[];
        },
        refetchInterval: 30000, // Auto-refresh every 30 seconds
    });

    // Mark notification as read
    const markAsRead = useMutation({
        mutationFn: async (notificationId: string) => {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', notificationId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    // Mark all as read
    const markAllAsRead = useMutation({
        mutationFn: async () => {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('read', false);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    return {
        notifications,
        unreadCount,
        isLoading,
        error,
        markAsRead: markAsRead.mutate,
        markAllAsRead: markAllAsRead.mutate,
        refetch,
    };
};
