'use client';

import { useState } from 'react';
import { useCart } from '@/providers/cart-provider';
import { useCheckout, CheckoutData } from '@/hooks/useCheckout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CreditCard, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const DELIVERY_WINDOWS = [
    "Monday Evening (5pm - 8pm)",
    "Tuesday Morning (9am - 12pm)",
    "Wednesday Evening (5pm - 8pm)",
    "Thursday Morning (9am - 12pm)"
];

export default function CheckoutPage() {
    const { cart, subtotal, itemCount } = useCart();
    const { placeOrder, isSubmitting } = useCheckout();

    const [formData, setFormData] = useState<CheckoutData>({
        fullName: '',
        address: '',
        phone: '',
        deliveryWindow: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, deliveryWindow: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fullName || !formData.address || !formData.phone || !formData.deliveryWindow) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            await placeOrder(formData);
        } catch (error: any) {
            toast.error(error.message || 'Failed to place order');
        }
    };

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container py-24 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Link href="/products">
                    <Button className="bg-primary hover:bg-primary/90 font-black uppercase italic tracking-tighter">Browse Collection</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-10 px-4 md:px-6">
            <Link href="/cart" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Cart
            </Link>

            <h1 className="text-4xl font-black mb-8 text-center md:text-left uppercase italic tracking-tighter">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="uppercase italic tracking-tighter font-black">Shipping Intelligence</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            placeholder="(555) 000-0000"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="deliveryWindow">Delivery Window</Label>
                                        <Select onValueChange={handleSelectChange} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a slot" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DELIVERY_WINDOWS.map((window) => (
                                                    <SelectItem key={window} value={window}>
                                                        {window}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Delivery Address</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        placeholder="123 Street Ave, City, Province"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-6 border-primary/20 bg-primary/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-primary" />
                                    Payment Method
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm font-medium">Interac E-Transfer</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Instructions will be provided on the next page after you place your order.
                                </p>
                            </CardContent>
                        </Card>

                        <div className="mt-8 flex justify-center md:justify-start">
                            <Button type="submit" size="lg" className="px-12" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Placing Order...
                                    </>
                                ) : (
                                    'Place Order'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {item.quantity}x {item.product?.name}
                                        </span>
                                        <span>${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}

                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Delivery</span>
                                        <span className="text-primary font-bold italic">Free Drop</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                        <span>Total</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/50 p-4">
                            <p className="text-[10px] text-center w-full text-muted-foreground">
                                By placing this order, you agree to send the total amount via E-Transfer within 24 hours.
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
