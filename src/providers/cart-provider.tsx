'use client';

import { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Cart } from '@/types/cart';
import { useCartSupabase } from '@/lib/supabase/cart';
import { useAuth } from '@/providers/auth-provider';
import { toast } from 'sonner';

interface CartContextType {
    cart: Cart | null;
    isLoading: boolean;
    itemCount: number;
    subtotal: number;
    refreshCart: () => Promise<void>;
    addToCart: (productId: string, quantity?: number) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const cartApi = useCartSupabase();
    const queryClient = useQueryClient();

    // Query for fetching cart
    const cartQuery = useQuery({
        queryKey: ['cart', user?.id],
        queryFn: async () => {
            if (!user) return null;
            return await cartApi.getCart();
        },
        enabled: !!user,
    });

    const cart = cartQuery.data || null;
    const isLoading = cartQuery.isLoading;

    // Mutations with optimistic updates
    const invalidateCart = () => queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });

    const addItemMutation = useMutation({
        mutationFn: ({ productId, quantity }: { productId: string, quantity: number }) =>
            cartApi.addToCart(productId, quantity),
        onMutate: async ({ productId, quantity }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['cart', user?.id] });

            // Snapshot previous value
            const previousCart = queryClient.getQueryData<Cart | null>(['cart', user?.id]);

            // Optimistically update the cart
            if (previousCart) {
                const existingItem = previousCart.items.find(item => item.product_id === productId);

                if (existingItem) {
                    // Update existing item quantity
                    queryClient.setQueryData<Cart>(['cart', user?.id], {
                        ...previousCart,
                        items: previousCart.items.map(item =>
                            item.product_id === productId
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        )
                    });
                } else {
                    // We don't have full product data yet, so we'll wait for the server response
                    // This prevents showing incomplete data
                }
            }

            return { previousCart };
        },
        onSuccess: () => {
            toast.success('Added to cart');
            invalidateCart();
        },
        onError: (err: any, variables, context) => {
            // Rollback on error
            if (context?.previousCart) {
                queryClient.setQueryData(['cart', user?.id], context.previousCart);
            }
            console.error(err);
            toast.error(err.message || 'Failed to add to cart');
        }
    });

    const updateQtyMutation = useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: string, quantity: number }) =>
            cartApi.updateQuantity(itemId, quantity),
        onMutate: async ({ itemId, quantity }) => {
            await queryClient.cancelQueries({ queryKey: ['cart', user?.id] });

            const previousCart = queryClient.getQueryData<Cart | null>(['cart', user?.id]);

            // Optimistically update quantity
            if (previousCart) {
                queryClient.setQueryData<Cart>(['cart', user?.id], {
                    ...previousCart,
                    items: previousCart.items.map(item =>
                        item.id === itemId ? { ...item, quantity } : item
                    )
                });
            }

            return { previousCart };
        },
        onSuccess: () => invalidateCart(),
        onError: (err, variables, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(['cart', user?.id], context.previousCart);
            }
            console.error(err);
            toast.error('Failed to update quantity');
        }
    });

    const removeItemMutation = useMutation({
        mutationFn: (itemId: string) => cartApi.removeItem(itemId),
        onMutate: async (itemId) => {
            await queryClient.cancelQueries({ queryKey: ['cart', user?.id] });

            const previousCart = queryClient.getQueryData<Cart | null>(['cart', user?.id]);

            // Optimistically remove item
            if (previousCart) {
                queryClient.setQueryData<Cart>(['cart', user?.id], {
                    ...previousCart,
                    items: previousCart.items.filter(item => item.id !== itemId)
                });
            }

            return { previousCart };
        },
        onSuccess: () => {
            toast.success('Removed from cart');
            invalidateCart();
        },
        onError: (err, variables, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(['cart', user?.id], context.previousCart);
            }
            console.error(err);
            toast.error('Failed to remove item');
        }
    });

    const clearCartMutation = useMutation({
        mutationFn: () => {
            if (!cart) return Promise.resolve();
            return cartApi.clearCart(cart.id);
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['cart', user?.id] });

            const previousCart = queryClient.getQueryData<Cart | null>(['cart', user?.id]);

            // Optimistically clear cart
            if (previousCart) {
                queryClient.setQueryData<Cart>(['cart', user?.id], {
                    ...previousCart,
                    items: []
                });
            }

            return { previousCart };
        },
        onSuccess: () => invalidateCart(),
        onError: (err, variables, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(['cart', user?.id], context.previousCart);
            }
            console.error(err);
            toast.error('Failed to clear cart');
        }
    });

    const refreshCart = async () => {
        await cartQuery.refetch();
    };

    const addToCart = async (productId: string, quantity = 1) => {
        if (!user) {
            toast.error('Please sign in to add items');
            return;
        }
        await addItemMutation.mutateAsync({ productId, quantity });
    };

    const updateQuantity = async (itemId: string, quantity: number) => {
        await updateQtyMutation.mutateAsync({ itemId, quantity });
    };

    const removeItem = async (itemId: string) => {
        await removeItemMutation.mutateAsync(itemId);
    };

    const clearCart = async () => {
        await clearCartMutation.mutateAsync();
    };

    const itemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
    const subtotal = cart?.items.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0) || 0;

    return (
        <CartContext.Provider
            value={{
                cart,
                isLoading,
                itemCount,
                subtotal,
                refreshCart,
                addToCart,
                updateQuantity,
                removeItem,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
