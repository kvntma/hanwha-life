'use client';

import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { useCart } from '@/providers/cart-provider';
import { useState } from 'react';

interface AddToCartButtonProps {
    productId: string;
    inventoryCount: number;
}

export function AddToCartButton({ productId, inventoryCount }: AddToCartButtonProps) {
    const { addToCart, refreshCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const outOfStock = inventoryCount <= 0;

    const handleAddToCart = async () => {
        if (outOfStock) return;
        setIsAdding(true);
        await addToCart(productId);
        await refreshCart();
        setIsAdding(false);
    };

    return (
        <Button
            size="lg"
            className="w-full bg-primary hover:bg-tertiary text-white font-black uppercase italic tracking-tighter transition-all duration-300 hover:scale-[1.02] active:scale-95 py-8 text-xl animate-shine"
            onClick={handleAddToCart}
            disabled={isAdding || outOfStock}
        >
            {outOfStock ? (
                'Vault Sealed'
            ) : (
                <>
                    <Zap className="mr-3 h-6 w-6 fill-current animate-pulse" />
                    {isAdding ? 'Securing...' : 'Secure Drop'}
                </>
            )}
        </Button>
    );
}
