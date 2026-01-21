
'use client';

import { Order } from '@/types/order';
import { useOrders } from '@/hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Package, Clock, CheckCircle, Truck, XCircle, ChevronRight, Filter, Calendar } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const STATUS_CONFIG: Record<string, { label: string, color: string, icon: any }> = {
    pending_payment: { label: 'Pending Payment', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', icon: Clock },
    payment_verified: { label: 'Verified', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: CheckCircle },
    preparing: { label: 'Preparing', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Package },
    out_for_delivery: { label: 'Out for Delivery', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-gray-500/10 text-gray-600 border-gray-500/20', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-600 border-red-500/20', icon: XCircle },
};

type StatusFilter = 'all' | 'pending' | 'in_delivery' | 'fulfilled';

export default function OrdersPage() {
    const { user } = useAuth();
    const { userOrders: orders, isLoadingUserOrders: isLoading } = useOrders(user?.id);

    // Filter states
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    // Filtered orders
    const filteredOrders = useMemo(() => {
        if (!orders) return [];

        return orders.filter((order) => {
            // Status filter
            if (statusFilter !== 'all') {
                if (statusFilter === 'pending' && !['pending_payment', 'payment_verified'].includes(order.status)) {
                    return false;
                }
                if (statusFilter === 'in_delivery' && !['preparing', 'out_for_delivery'].includes(order.status)) {
                    return false;
                }
                if (statusFilter === 'fulfilled' && order.status !== 'delivered') {
                    return false;
                }
            }

            // Price filter
            const min = minPrice ? parseFloat(minPrice) : 0;
            const max = maxPrice ? parseFloat(maxPrice) : Infinity;
            if (order.total_amount < min || order.total_amount > max) {
                return false;
            }

            // Date filter
            const orderDate = new Date(order.created_at);
            if (startDate && orderDate < new Date(startDate)) {
                return false;
            }
            if (endDate) {
                const endDateTime = new Date(endDate);
                endDateTime.setHours(23, 59, 59, 999); // Include the entire end date
                if (orderDate > endDateTime) {
                    return false;
                }
            }

            return true;
        });
    }, [orders, statusFilter, minPrice, maxPrice, startDate, endDate]);

    const clearFilters = () => {
        setStatusFilter('all');
        setMinPrice('');
        setMaxPrice('');
        setStartDate('');
        setEndDate('');
    };

    if (isLoading) {
        return (
            <div className="container py-24 flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading your orders...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container py-24 text-center">
                <h1 className="text-2xl font-bold mb-4">Please sign in to view your orders</h1>
                <Link href="/">
                    <Button>Return Home</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-12 px-4 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">My Orders</h1>
                    <p className="text-muted-foreground mt-1 font-medium uppercase text-[10px] tracking-widest">Track your recent purchases and delivery status.</p>
                </div>
                <Link href="/products">
                    <Button variant="outline" className="font-black uppercase italic tracking-tighter">Order More Tins</Button>
                </Link>
            </div>

            {/* Filter Section */}
            <Card className="mb-6 border-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-black uppercase italic tracking-tighter">
                        <Filter className="h-5 w-5" />
                        Filter Orders
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Status Tabs */}
                    <div>
                        <Label className="text-xs font-bold uppercase tracking-wider mb-3 block">Status</Label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { value: 'all', label: 'All Orders' },
                                { value: 'pending', label: 'Pending' },
                                { value: 'in_delivery', label: 'In Delivery' },
                                { value: 'fulfilled', label: 'Fulfilled' },
                            ].map((tab) => (
                                <Button
                                    key={tab.value}
                                    variant={statusFilter === tab.value ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setStatusFilter(tab.value as StatusFilter)}
                                    className="font-bold uppercase text-xs tracking-tight"
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date Range Filter */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Date Range
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="start-date" className="text-xs text-muted-foreground">From</Label>
                                    <Input
                                        id="start-date"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="end-date" className="text-xs text-muted-foreground">To</Label>
                                    <Input
                                        id="end-date"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-wider">Price Range</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="min-price" className="text-xs text-muted-foreground">Min ($)</Label>
                                    <Input
                                        id="min-price"
                                        type="number"
                                        placeholder="0.00"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        min="0"
                                        step="0.01"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="max-price" className="text-xs text-muted-foreground">Max ($)</Label>
                                    <Input
                                        id="max-price"
                                        type="number"
                                        placeholder="999.99"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        min="0"
                                        step="0.01"
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Clear Filters Button */}
                    {(statusFilter !== 'all' || minPrice || maxPrice || startDate || endDate) && (
                        <div className="flex justify-end">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="font-bold uppercase text-xs"
                            >
                                Clear All Filters
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Results Count */}
            <div className="mb-4 text-sm text-muted-foreground font-medium">
                Showing {filteredOrders.length} of {orders?.length || 0} orders
            </div>

            {filteredOrders.length === 0 ? (
                <Card className="text-center py-16 border-dashed">
                    <CardContent className="space-y-4">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto" />
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold">
                                {orders?.length === 0 ? 'No orders yet' : 'No orders match your filters'}
                            </h3>
                            <p className="text-muted-foreground">
                                {orders?.length === 0
                                    ? 'When you place an order, it will appear here.'
                                    : 'Try adjusting your filters to see more results.'}
                            </p>
                        </div>
                        {orders?.length === 0 ? (
                            <Link href="/products">
                                <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 font-black uppercase italic tracking-tighter">Browse Collection</Button>
                            </Link>
                        ) : (
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={clearFilters}
                                className="rounded-full px-8 font-black uppercase italic tracking-tighter"
                            >
                                Clear Filters
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {filteredOrders.map((order) => {
                        const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending_payment;
                        const StatusIcon = status.icon;

                        return (
                            <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow transition-all group">
                                <CardHeader className="bg-muted/30 pb-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-background p-2 rounded-lg border shadow-sm">
                                                <Package className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Order ID</p>
                                                <p className="font-mono text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Placed On</p>
                                                <p className="font-medium">{new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                            </div>
                                            <Badge variant="outline" className={`${status.color} flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold uppercase tracking-tight`}>
                                                <StatusIcon className="h-3 w-3" />
                                                {status.label}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h4 className="font-semibold flex items-center gap-2">
                                                Items ({order.items?.reduce((acc, item) => acc + item.quantity, 0)})
                                            </h4>
                                            <div className="space-y-3">
                                                {order.items?.map((item) => (
                                                    <div key={item.id} className="flex justify-between items-start text-sm">
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs font-bold">
                                                                {item.quantity}x
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{item.product?.name}</p>
                                                                <p className="text-xs text-muted-foreground">${item.unit_price.toFixed(2)} each</p>
                                                            </div>
                                                        </div>
                                                        <span className="font-medium">${(item.quantity * item.unit_price).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                                <Separator className="my-2" />
                                                <div className="flex justify-between items-center pt-2">
                                                    <span className="font-bold text-lg text-primary">Total Amount</span>
                                                    <span className="font-bold text-lg">${order.total_amount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <h4 className="font-semibold">Delivery & Payment</h4>
                                                <div className="space-y-3 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Window:</span>
                                                        <span className="font-medium">{order.delivery_window}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Address:</span>
                                                        <span className="font-medium text-right max-w-[200px]">{order.address}</span>
                                                    </div>
                                                    {order.etransfer_reference && (
                                                        <div className="flex justify-between bg-primary/5 p-2 rounded border border-primary/10">
                                                            <span className="text-muted-foreground text-[10px] uppercase font-bold">Ref ID:</span>
                                                            <span className="font-mono text-xs font-bold text-primary">{order.etransfer_reference}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {order.status === 'pending_payment' && (
                                                <div className="flex justify-end pt-2">
                                                    <Link href={`/checkout/confirmation?orderId=${order.id}&total=${order.total_amount}`}>
                                                        <Button variant="outline" size="sm" className="gap-2 rounded-full border-primary/30 text-primary hover:bg-primary/5">
                                                            Payment Instructions <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
