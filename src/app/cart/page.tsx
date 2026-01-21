'use client';

import { useCart } from '@/providers/cart-provider';
import { Button } from '@/components/ui/button';
import { Loader2, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PageContainer } from '@/components/layouts';

export default function CartPage() {
    const { cart, isLoading, updateQuantity, removeItem, subtotal, itemCount } = useCart();

    if (isLoading && !cart) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <PageContainer centerContent maxWidth="lg">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                    <h1 className="text-2xl font-bold">Your cart is empty</h1>
                    <p className="text-muted-foreground">Looks like you haven't secured any drops yet.</p>
                    <Link href="/products">
                        <Button size="lg" className="mt-4">
                            Browse Collection
                        </Button>
                    </Link>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer maxWidth="7xl">
            <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 rounded-lg border p-4 shadow-sm bg-card"
                        >
                            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                                {/* Product Image */}
                                {item.product?.image ? (
                                    <Image
                                        src={item.product.image}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-secondary">
                                        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-1 flex-col justify-between h-24">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg">{item.product?.name}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                            {item.product?.description}
                                        </p>
                                    </div>
                                    <p className="font-bold">
                                        ${item.product?.price?.toFixed(2)}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="rounded-lg border bg-card p-6 shadow-sm sticky top-24">
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Delivery</span>
                                <span className="text-green-600 font-medium">Free (Local)</span>
                            </div>
                        </div>
                        <div className="border-t pt-4 mb-6">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <Link href="/checkout" className="w-full">
                            <Button className="w-full" size="lg">
                                Proceed to Checkout
                            </Button>
                        </Link>
                        <div className="mt-4 text-xs text-center text-muted-foreground bg-muted p-2 rounded">
                            Secure manual E-Transfer checkout.
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
