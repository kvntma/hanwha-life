'use client';

import { Order, OrderStatus } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Loader2, MoreVertical, CheckCircle, Truck, Package, XCircle, Clock, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useMemo } from 'react';

const STATUS_CONFIG: Record<OrderStatus, { label: string, color: string, icon: any }> = {
    pending_payment: { label: 'Pending Payment', color: 'bg-yellow-500/20 text-yellow-600 border-yellow-500/20', icon: Clock },
    payment_verified: { label: 'Verified', color: 'bg-blue-500/20 text-blue-600 border-blue-500/20', icon: CheckCircle },
    preparing: { label: 'Preparing', color: 'bg-blue-500/20 text-blue-600 border-blue-500/20', icon: Package },
    out_for_delivery: { label: 'Out for Delivery', color: 'bg-purple-500/20 text-purple-600 border-purple-500/20', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-gray-500/20 text-gray-600 border-gray-500/20', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-500/20 text-red-600 border-red-500/20', icon: XCircle },
};

import { useOrders } from '@/hooks/useOrders';

export default function AdminOrdersPage() {
    const { adminOrders: orders, isLoadingAdminOrders: isLoading, updateStatus, refetchAdminOrders } = useOrders();

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 30;

    console.log('📦 [AdminOrdersPage] Render state:', {
        ordersCount: orders?.length || 0,
        isLoading,
        orders: orders
    });

    // Filter orders based on all criteria
    const filteredOrders = useMemo(() => {
        if (!orders) return [];

        return orders.filter(order => {
            // Search filter (customer name, phone, or order ID)
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery ||
                order.full_name.toLowerCase().includes(searchLower) ||
                order.phone.includes(searchQuery) ||
                order.transaction_id.toLowerCase().includes(searchLower);

            // Status filter
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

            // Price filter
            const matchesMinPrice = !minPrice || order.total_amount >= parseFloat(minPrice);
            const matchesMaxPrice = !maxPrice || order.total_amount <= parseFloat(maxPrice);

            // Date filter
            const orderDate = new Date(order.created_at);
            const matchesStartDate = !startDate || orderDate >= new Date(startDate);
            const matchesEndDate = !endDate || orderDate <= new Date(endDate + 'T23:59:59');

            return matchesSearch && matchesStatus && matchesMinPrice && matchesMaxPrice && matchesStartDate && matchesEndDate;
        });
    }, [orders, searchQuery, statusFilter, minPrice, maxPrice, startDate, endDate]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, minPrice, maxPrice, startDate, endDate]);


    const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
        try {
            await updateStatus({ orderId, status: newStatus });
            toast.success(`Order status updated to ${newStatus.replace('_', ' ')}`);
        } catch (error) {
            console.error('Error updating order:', error);
            toast.error('Failed to update order status');
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setMinPrice('');
        setMaxPrice('');
        setStartDate('');
        setEndDate('');
    };

    const hasActiveFilters = searchQuery || statusFilter !== 'all' || minPrice || maxPrice || startDate || endDate;

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">Manage Orders</h1>
                <Button variant="outline" onClick={() => refetchAdminOrders()} className="font-black uppercase italic tracking-tighter">Refresh</Button>
            </div>

            {/* Filters Section */}
            <div className="bg-card border rounded-lg p-6 mb-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-black uppercase italic tracking-tighter">Filters</h2>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-xs font-bold uppercase tracking-wider"
                        >
                            <X className="h-3 w-3 mr-1" />
                            Clear All
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest">Search</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Name, phone, or order ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest">Status</Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending_payment">Pending Payment</SelectItem>
                                <SelectItem value="payment_verified">Verified</SelectItem>
                                <SelectItem value="preparing">Preparing</SelectItem>
                                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest">Price Range</Label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-1/2"
                            />
                            <Input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-1/2"
                            />
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest">Start Date</Label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest">End Date</Label>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* Results Count */}
                <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="font-bold text-foreground">{startIndex + 1}-{Math.min(endIndex, filteredOrders.length)}</span> of <span className="font-bold text-foreground">{filteredOrders.length}</span> filtered orders
                        {filteredOrders.length !== orders.length && <span> (from {orders.length} total)</span>}
                    </p>
                </div>
            </div>

            <div className="border rounded-lg bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Delivery Slot</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                                    {hasActiveFilters ? 'No orders match your filters.' : 'No orders found.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedOrders.map((order) => {
                                const status = STATUS_CONFIG[order.status];
                                const StatusIcon = status.icon;

                                return (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-mono text-xs uppercase">
                                            {order.transaction_id}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{order.full_name}</span>
                                                <span className="text-xs text-muted-foreground">{order.phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs max-w-[200px] truncate" title={order.address}>
                                            {order.address}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            ${order.total_amount.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`${status.color} flex items-center gap-1 w-fit`}>
                                                <StatusIcon className="h-3 w-3" />
                                                {status.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {order.delivery_window}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => handleUpdateStatus(order.id, 'payment_verified')}
                                                        disabled={order.status !== 'pending_payment'}
                                                    >
                                                        Mark as Verified
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleUpdateStatus(order.id, 'preparing')}
                                                        disabled={order.status === 'pending_payment'}
                                                    >
                                                        Mark as Preparing
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleUpdateStatus(order.id, 'out_for_delivery')}
                                                    >
                                                        Out for Delivery
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleUpdateStatus(order.id, 'delivered')}
                                                    >
                                                        Mark as Delivered
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                                    >
                                                        Cancel Order
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                        Page <span className="font-bold text-foreground">{currentPage}</span> of <span className="font-bold text-foreground">{totalPages}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="font-bold uppercase tracking-wider text-xs"
                        >
                            Previous
                        </Button>

                        {/* Page Numbers */}
                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <Button
                                        key={pageNum}
                                        variant={currentPage === pageNum ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentPage(pageNum)}
                                        className="w-8 h-8 p-0 font-bold"
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="font-bold uppercase tracking-wider text-xs"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
