'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/browser';
import { useState } from 'react';

export const useAdminStats = () => {
    const [supabase] = useState(() => createClient());

    return useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: async () => {
            const [ordersRes, productsRes] = await Promise.all([
                supabase.from('orders').select('*'),
                supabase.from('products').select('*')
            ]);

            const orders = ordersRes.data || [];
            const products = productsRes.data || [];

            const revenue = orders
                .filter(o => o.status !== 'cancelled' && o.status !== 'pending_payment')
                .reduce((sum, o) => sum + Number(o.total_amount), 0);

            const uniqueUsers = new Set(orders.map(o => o.user_id)).size;
            const lowStockProducts = products.filter(p => (p.inventory_count || 0) > 0 && (p.inventory_count || 0) < 10);
            const outOfStockCount = products.filter(p => (p.inventory_count || 0) === 0).length;

            return {
                totalOrders: orders.length,
                revenue,
                customers: uniqueUsers,
                productsCount: products.length,
                recentOrders: orders.slice(0, 5),
                lowStockProducts,
                outOfStockCount
            };
        },
        refetchInterval: 30000, // Refresh every 30 seconds for live updates
    });
};
