'use client';

import { Order, OrderStatus } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Loader2, MoreVertical, CheckCircle, Truck, Package, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

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

    console.log('📦 [AdminOrdersPage] Render state:', {
        ordersCount: orders?.length || 0,
        isLoading,
        orders: orders
    });

    const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
        try {
            await updateStatus({ orderId, status: newStatus });
            toast.success(`Order status updated to ${newStatus.replace('_', ' ')}`);
        } catch (error) {
            console.error('Error updating order:', error);
            toast.error('Failed to update order status');
        }
    };

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
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => {
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
        </div>
    );
}
