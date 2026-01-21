'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/browser';
import { Order, OrderStatus } from '@/types/order';
import { useState } from 'react';

export const useOrders = (userId?: string) => {
    const [supabase] = useState(() => createClient());
    const queryClient = useQueryClient();

    // Fetch orders for a specific user
    const userOrdersQuery = useQuery({
        queryKey: ['orders', 'user', userId],
        queryFn: async () => {
            if (!userId) return [];
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    items:order_items(
                        *,
                        product:products(*)
                    )
                `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as Order[];
        },
        enabled: !!userId,
    });

    // Fetch all orders (Admin only)
    const adminOrdersQuery = useQuery({
        queryKey: ['orders', 'admin'],
        queryFn: async () => {
            console.log('🔍 [useOrders] Fetching admin orders...');
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    items:order_items(
                        *,
                        product:products(*)
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('❌ [useOrders] Error fetching orders:', error);
                throw error;
            }
            console.log('✅ [useOrders] Successfully fetched orders:', data);
            console.log('📊 [useOrders] Number of orders:', data?.length || 0);
            return data as Order[];
        },
    });

    // Mutation to update order status
    const updateStatusMutation = useMutation({
        mutationFn: async ({ orderId, status }: { orderId: string, status: OrderStatus }) => {
            const { error } = await supabase
                .from('orders')
                .update({ status })
                .eq('id', orderId);

            if (error) throw error;
        },
        onSuccess: () => {
            // Invalidate both user and admin queries to ensure data consistency
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });

    return {
        userOrders: userOrdersQuery.data || [],
        isLoadingUserOrders: userOrdersQuery.isLoading,
        adminOrders: adminOrdersQuery.data || [],
        isLoadingAdminOrders: adminOrdersQuery.isLoading,
        refetchAdminOrders: adminOrdersQuery.refetch,
        updateStatus: updateStatusMutation.mutateAsync,
        isUpdating: updateStatusMutation.isPending,
    };
};
