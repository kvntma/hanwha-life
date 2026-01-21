'use client';

import { createClient } from '@/lib/supabase/browser';
import { useCart } from '@/providers/cart-provider';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface CheckoutData {
    fullName: string;
    address: string;
    phone: string;
    deliveryWindow: string;
}

export const useCheckout = () => {
    const [supabase] = useState(() => createClient());
    const { cart, subtotal, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const placeOrder = async (data: CheckoutData) => {
        if (!cart || cart.items.length === 0) {
            throw new Error('Your cart is empty');
        }

        setIsSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('You must be signed in to place an order');

            // 1. Create the order with transaction_id
            // Generate a temporary UUID to create the transaction_id
            const tempOrderId = crypto.randomUUID();
            const transactionId = `BEAST-${tempOrderId.substring(0, 8).toUpperCase()}`;

            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    transaction_id: transactionId,
                    full_name: data.fullName,
                    address: data.address,
                    phone: data.phone,
                    delivery_window: data.deliveryWindow,
                    total_amount: subtotal,
                    status: 'pending_payment'
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create order items
            const orderItems = cart.items.map(item => ({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.product?.price || 0
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            // 3. Decrement inventory
            for (const item of cart.items) {
                const { error: invError } = await supabase
                    .rpc('decrement_inventory', {
                        product_id: item.product_id,
                        qty: item.quantity
                    });

                // If RPC doesn't exist, fallback to direct update (less safe but works for now)
                if (invError) {
                    const { data: p } = await supabase
                        .from('products')
                        .select('inventory_count')
                        .eq('id', item.product_id)
                        .single();

                    if (p) {
                        await supabase
                            .from('products')
                            .update({ inventory_count: Math.max(0, p.inventory_count - item.quantity) })
                            .eq('id', item.product_id);
                    }
                }
            }

            // 4. Clear cart
            await clearCart();

            // 4. Redirect to confirmation page
            router.push(`/checkout/confirmation?orderId=${order.id}&total=${subtotal}`);

            return order;
        } catch (error) {
            console.error('Error placing order:', error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        placeOrder,
        isSubmitting
    };
};
