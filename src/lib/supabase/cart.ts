import { createClient } from '@/lib/supabase/browser';
import { Cart } from '@/types/cart';
import { useState } from 'react';

export const useCartSupabase = () => {
    const [supabase] = useState(() => createClient());

    return {
        getCart: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            const { data, error } = await supabase
                .from('carts')
                .select('*, items:cart_items(*, product:products(*))')
                .eq('user_id', user.id)
                .maybeSingle();

            if (error) throw error;

            if (data) {
                // Check for expiration (24 hours)
                const updatedAt = new Date(data.updated_at);
                const now = new Date();
                const diffHours = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60);

                if (diffHours > 24) {
                    // Delete expired cart
                    await supabase.from('carts').delete().eq('id', data.id);
                    return null;
                }
            }

            return data as Cart | null;
        },

        addToCart: async (productId: string, quantity: number = 1) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Please sign in to add items to cart');

            // Check inventory first
            const { data: product, error: productError } = await supabase
                .from('products')
                .select('inventory_count')
                .eq('id', productId)
                .single();

            if (productError || !product) throw new Error('Product not found');
            if (product.inventory_count < quantity) {
                throw new Error(`Only ${product.inventory_count} items left in stock`);
            }

            let { data: cart, error: cartError } = await supabase
                .from('carts')
                .select('id')
                .eq('user_id', user.id)
                .maybeSingle();

            if (cartError) throw cartError;

            // Create cart if not exists
            if (!cart) {
                const { data: newCart, error: createError } = await supabase
                    .from('carts')
                    .insert({ user_id: user.id })
                    .select('id')
                    .single();

                if (createError) throw createError;
                cart = newCart;
            }

            if (!cart) throw new Error('Failed to create cart');

            // Check if item exists in cart
            const { data: existingItem, error: itemError } = await supabase
                .from('cart_items')
                .select('*')
                .eq('cart_id', cart.id)
                .eq('product_id', productId)
                .maybeSingle();

            if (itemError) throw itemError;

            if (existingItem) {
                const { error: updateError } = await supabase
                    .from('cart_items')
                    .update({ quantity: existingItem.quantity + quantity })
                    .eq('id', existingItem.id);

                if (updateError) throw updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('cart_items')
                    .insert({
                        cart_id: cart.id,
                        product_id: productId,
                        quantity: quantity,
                    });

                if (insertError) throw insertError;
            }
        },

        updateQuantity: async (itemId: string, quantity: number) => {
            if (quantity <= 0) {
                const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
                if (error) throw error;
                return;
            }

            const { error } = await supabase
                .from('cart_items')
                .update({ quantity })
                .eq('id', itemId);

            if (error) throw error;
        },

        removeItem: async (itemId: string) => {
            const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
            if (error) throw error;
        },

        clearCart: async (cartId: string) => {
            // Deleting the cart itself might be better to reset headers/updated_at?
            // Or just delete items.
            const { error } = await supabase.from('cart_items').delete().eq('cart_id', cartId);
            if (error) throw error;
        },
    };
};
