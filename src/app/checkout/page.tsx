'use client';

import { useState } from 'react';
import { useCart } from '@/providers/cart-provider';
import { useCheckout } from '@/hooks/useCheckout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CreditCard, ChevronLeft, MapPin, Clock, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { GTA_DELIVERY_WINDOWS, GTA_REGIONS, PAYMENT_CONFIG } from '@/constants/delivery';

export default function CheckoutPage() {
    const { cart, subtotal } = useCart();
    const { placeOrder, isSubmitting } = useCheckout();

    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('Toronto');
    const [streetAddress, setStreetAddress] = useState('');
    const [unit, setUnit] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [deliveryWindow, setDeliveryWindow] = useState(GTA_DELIVERY_WINDOWS[0].label);
    const [dropNotes, setDropNotes] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim() || !phone.trim() || !streetAddress.trim() || !postalCode.trim() || !deliveryWindow) {
            toast.error('Please complete all required shipping fields');
            return;
        }

        const formattedPostal = postalCode.trim().toUpperCase();
        // Canadian postal code format check (e.g. A1A 1A1 or A1A1A1)
        const postalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
        if (!postalRegex.test(formattedPostal)) {
            toast.error('Please enter a valid Canadian postal code (e.g. M5V 2T6)');
            return;
        }

        const fullAddress = [
            streetAddress.trim(),
            unit.trim() ? `Unit/Suite: ${unit.trim()}` : null,
            `${city.trim()}, ON ${formattedPostal}`,
            dropNotes.trim() ? `[Drop Note: ${dropNotes.trim()}]` : null
        ].filter(Boolean).join(', ');

        try {
            await placeOrder({
                fullName: fullName.trim(),
                address: fullAddress,
                phone: phone.trim(),
                deliveryWindow
            });
        } catch (error: any) {
            toast.error(error.message || 'Failed to place order');
        }
    };

    if (!cart || cart.items.length === 0) {
        return (
            <div className="container py-24 text-center">
                <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Your Cart is Empty</h1>
                <p className="text-muted-foreground mb-8">No research items currently in your session.</p>
                <Link href="/products">
                    <Button className="bg-primary hover:bg-primary/90 font-black uppercase italic tracking-tighter px-8 py-6 text-base">
                        Browse Collection
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-10 px-4 md:px-6 max-w-6xl mx-auto">
            <Link href="/cart" className="flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary mb-6 transition-colors">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Cart
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                        GTA Local Drop <span className="text-primary">& Checkout</span>
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Discreet direct courier delivery across the Greater Toronto Area & Ontario.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary w-fit">
                    <Truck className="h-4 w-4" />
                    <span>Ontario Delivery Hub Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Recipient & Contact */}
                        <Card className="border-border">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-xl font-black uppercase italic tracking-tighter">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    1. Recipient & Drop Intelligence
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider">
                                            Full Name *
                                        </Label>
                                        <Input
                                            id="fullName"
                                            placeholder="Dr. Alex Rivera"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider">
                                            Mobile Phone * (For Drop SMS/Call)
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="(416) 555-0199"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                        />
                                        <p className="text-[11px] text-muted-foreground">
                                            Driver will text/call when approaching your address.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="city" className="text-xs font-bold uppercase tracking-wider">
                                            City / Region *
                                        </Label>
                                        <Select value={city} onValueChange={setCity}>
                                            <SelectTrigger id="city">
                                                <SelectValue placeholder="Select GTA City" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {GTA_REGIONS.flatMap(region => region.cities).map((c) => (
                                                    <SelectItem key={c} value={c}>
                                                        {c}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="Other Ontario City">Other Ontario City</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="streetAddress" className="text-xs font-bold uppercase tracking-wider">
                                            Street Address *
                                        </Label>
                                        <Input
                                            id="streetAddress"
                                            placeholder="e.g. 250 Front St W"
                                            value={streetAddress}
                                            onChange={(e) => setStreetAddress(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="unit" className="text-xs font-bold uppercase tracking-wider">
                                            Unit / Suite / Buzzer (Optional)
                                        </Label>
                                        <Input
                                            id="unit"
                                            placeholder="Apt 1402 / Buzzer #420"
                                            value={unit}
                                            onChange={(e) => setUnit(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="postalCode" className="text-xs font-bold uppercase tracking-wider">
                                            Postal Code *
                                        </Label>
                                        <Input
                                            id="postalCode"
                                            placeholder="e.g. M5V 3G5"
                                            value={postalCode}
                                            onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                                            maxLength={7}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <Label htmlFor="dropNotes" className="text-xs font-bold uppercase tracking-wider">
                                        Drop-Off Instructions (Optional)
                                    </Label>
                                    <Input
                                        id="dropNotes"
                                        placeholder="e.g. Leave with concierge under name, or leave in secure parcel locker"
                                        value={dropNotes}
                                        onChange={(e) => setDropNotes(e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delivery Window Selection */}
                        <Card className="border-border">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-xl font-black uppercase italic tracking-tighter">
                                    <Clock className="h-5 w-5 text-primary" />
                                    2. Select GTA Delivery Window
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {GTA_DELIVERY_WINDOWS.map((slot) => {
                                        const isSelected = deliveryWindow === slot.label;
                                        return (
                                            <div
                                                key={slot.id}
                                                onClick={() => setDeliveryWindow(slot.label)}
                                                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                                    isSelected
                                                        ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary'
                                                        : 'border-border bg-card hover:border-primary/40'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="radio"
                                                            checked={isSelected}
                                                            onChange={() => setDeliveryWindow(slot.label)}
                                                            className="text-primary focus:ring-primary h-4 w-4"
                                                        />
                                                        <div>
                                                            <div className="font-bold text-sm">{slot.label}</div>
                                                            <div className="text-xs text-muted-foreground mt-0.5">
                                                                {slot.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs font-mono font-bold text-primary px-2.5 py-1 rounded-md bg-background border border-border shrink-0">
                                                        {slot.timeSlot}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Method Notice */}
                        <Card className="border-primary/30 bg-primary/5">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base font-bold">
                                    <CreditCard className="h-5 w-5 text-primary" />
                                    Interac E-Transfer (Ontario / Canada)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xs space-y-2 text-muted-foreground">
                                <p>
                                    To eliminate credit card processing markups and protect privacy, orders are confirmed via direct <strong>Interac E-Transfer</strong>.
                                </p>
                                <div className="p-3 bg-background/80 rounded-lg border border-border text-foreground space-y-1 font-mono text-[11px]">
                                    <div>⚡ Recipient: <strong>{PAYMENT_CONFIG.etransferEmail}</strong></div>
                                    <div>⚡ Interac Autodeposit: <strong>Active (No password needed)</strong></div>
                                </div>
                                <p className="text-[11px]">
                                    After clicking <strong>Place Order</strong>, you will receive your unique reference code to include in your bank transfer memo.
                                </p>
                            </CardContent>
                        </Card>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full sm:w-auto px-12 py-7 text-lg font-black uppercase italic tracking-tighter bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Securing Drop...
                                    </>
                                ) : (
                                    'Confirm Drop & Place Order'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Sidebar Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24 border-border shadow-md">
                        <CardHeader className="pb-4">
                            <CardTitle className="uppercase italic tracking-tighter font-black text-xl">
                                Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="divide-y divide-border">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="py-3 flex justify-between text-sm">
                                        <div>
                                            <div className="font-bold">{item.product?.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                Qty: {item.quantity} × ${item.product?.price.toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="font-mono font-bold">
                                            ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-mono">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">GTA Local Courier</span>
                                    <span className="text-primary font-bold uppercase text-xs italic">Complimentary Drop</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Cold-Chain Packaging</span>
                                    <span className="font-bold text-xs uppercase">Included</span>
                                </div>
                                <div className="flex justify-between font-black text-xl pt-3 border-t">
                                    <span className="uppercase italic tracking-tight">Total</span>
                                    <span className="text-primary font-mono">${subtotal.toFixed(2)} CAD</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/40 p-4 border-t flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground w-full">
                                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                                <span>100% discrete plain packaging. Lyophilized stability protected.</span>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
