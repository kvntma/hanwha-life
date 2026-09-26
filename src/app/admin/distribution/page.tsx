'use client';

import { useOrders } from '@/hooks/useOrders';
import { OrderStatus } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  TableRow,
} from '@/components/ui/table';
import {
  Loader2,
  Truck,
  CheckCircle,
  MapPin,
  Phone,
  Copy,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { GTA_DELIVERY_WINDOWS } from '@/constants/delivery';

export default function AdminDistributionPage() {
  const { adminOrders: orders, isLoadingAdminOrders: isLoading, updateStatus, refetchAdminOrders } = useOrders();

  const [selectedWindow, setSelectedWindow] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredDeliveries = useMemo(() => {
    if (!orders) return [];

    return orders.filter((order) => {
      if (selectedStatus === 'active') {
        if (!['payment_verified', 'preparing', 'out_for_delivery'].includes(order.status)) {
          return false;
        }
      } else if (selectedStatus !== 'all') {
        if (order.status !== selectedStatus) return false;
      }

      if (selectedWindow !== 'all') {
        if (!order.delivery_window?.includes(selectedWindow)) {
          return false;
        }
      }

      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchName = order.full_name?.toLowerCase().includes(query);
        const matchAddr = order.address?.toLowerCase().includes(query);
        const matchPhone = order.phone?.toLowerCase().includes(query);
        const matchId = order.transaction_id?.toLowerCase().includes(query);
        if (!matchName && !matchAddr && !matchPhone && !matchId) return false;
      }

      return true;
    });
  }, [orders, selectedStatus, selectedWindow, searchFilter]);

  const stats = useMemo(() => {
    if (!orders) return { totalActive: 0, outForDelivery: 0, preparing: 0, delivered: 0, pendingPayment: 0 };
    return {
      totalActive: orders.filter((o) => ['payment_verified', 'preparing', 'out_for_delivery'].includes(o.status)).length,
      outForDelivery: orders.filter((o) => o.status === 'out_for_delivery').length,
      preparing: orders.filter((o) => ['payment_verified', 'preparing'].includes(o.status)).length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      pendingPayment: orders.filter((o) => o.status === 'pending_payment').length,
    };
  }, [orders]);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateStatus({ orderId, status });
      toast.success(`Order advanced to: ${status.replace('_', ' ').toUpperCase()}`);
    } catch (err: any) {
      toast.error('Failed to update status: ' + err.message);
    }
  };

  const copyDriverManifest = () => {
    if (filteredDeliveries.length === 0) {
      toast.error('No deliveries in current view to export.');
      return;
    }

    const manifestText = filteredDeliveries
      .map((order, idx) => {
        return `[STOP ${idx + 1}]
Tracking ID: ${order.transaction_id}
Status: ${order.status.toUpperCase()}
Customer: ${order.full_name} | Phone: ${order.phone}
Address: ${order.address}
Window: ${order.delivery_window}
----------------------------------------`;
      })
      .join('\n\n');

    navigator.clipboard.writeText(manifestText);
    toast.success(`Copied driver manifest (${filteredDeliveries.length} stops) to clipboard!`);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">
            GTA Distribution <span className="text-primary">& Courier Hub</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Dispatch, route coordination, and live delivery management across Ontario.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={copyDriverManifest}
            className="font-bold uppercase tracking-wider text-xs gap-1.5"
          >
            <Copy className="h-4 w-4" />
            Copy Driver Manifest
          </Button>
          <Button
            onClick={() => refetchAdminOrders()}
            className="font-black uppercase italic tracking-tighter bg-primary text-white"
          >
            Refresh Hub
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="border-border">
          <CardContent className="pt-5">
            <div className="text-xs uppercase font-bold text-muted-foreground tracking-wider">Active Deliveries</div>
            <div className="text-3xl font-black text-foreground mt-1">{stats.totalActive}</div>
            <div className="text-[11px] text-muted-foreground mt-1">Queued for GTA delivery</div>
          </CardContent>
        </Card>

        <Card className="border-border border-purple-500/30 bg-purple-500/5">
          <CardContent className="pt-5">
            <div className="text-xs uppercase font-bold text-purple-600 tracking-wider">On The Road</div>
            <div className="text-3xl font-black text-purple-600 mt-1">{stats.outForDelivery}</div>
            <div className="text-[11px] text-muted-foreground mt-1">Out for delivery now</div>
          </CardContent>
        </Card>

        <Card className="border-border border-blue-500/30 bg-blue-500/5">
          <CardContent className="pt-5">
            <div className="text-xs uppercase font-bold text-blue-600 tracking-wider">Packaging Queue</div>
            <div className="text-3xl font-black text-blue-600 mt-1">{stats.preparing}</div>
            <div className="text-[11px] text-muted-foreground mt-1">Payment verified / Packing</div>
          </CardContent>
        </Card>

        <Card className="border-border border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="pt-5">
            <div className="text-xs uppercase font-bold text-emerald-600 tracking-wider">Delivered</div>
            <div className="text-3xl font-black text-emerald-600 mt-1">{stats.delivered}</div>
            <div className="text-[11px] text-muted-foreground mt-1">Completed drops</div>
          </CardContent>
        </Card>

        <Card className="border-border border-amber-500/30 bg-amber-500/5">
          <CardContent className="pt-5">
            <div className="text-xs uppercase font-bold text-amber-600 tracking-wider">Pending Interac</div>
            <div className="text-3xl font-black text-amber-600 mt-1">{stats.pendingPayment}</div>
            <div className="text-[11px] text-muted-foreground mt-1">Awaiting verification</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Filter by Status
              </label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Delivery Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active Drops (Verified & Dispatched)</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery Only</SelectItem>
                  <SelectItem value="preparing">Preparing in Warehouse</SelectItem>
                  <SelectItem value="delivered">Completed / Delivered</SelectItem>
                  <SelectItem value="pending_payment">Pending Payment Confirmation</SelectItem>
                  <SelectItem value="all">All Statuses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Filter by Delivery Window
              </label>
              <Select value={selectedWindow} onValueChange={setSelectedWindow}>
                <SelectTrigger>
                  <SelectValue placeholder="Delivery Window" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Windows</SelectItem>
                  {GTA_DELIVERY_WINDOWS.map((w) => (
                    <SelectItem key={w.id} value={w.timeSlot}>
                      {w.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Search Stops
              </label>
              <Input
                placeholder="Name, address, phone, or VIAL-ID..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[120px]">Order ID</TableHead>
              <TableHead>Customer & Contact</TableHead>
              <TableHead className="min-w-[240px]">Drop Location</TableHead>
              <TableHead>Window</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Courier Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDeliveries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No deliveries match the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredDeliveries.map((order) => {
                return (
                  <TableRow key={order.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-mono text-xs font-bold uppercase text-foreground">
                      {order.transaction_id}
                    </TableCell>

                    <TableCell>
                      <div className="font-bold text-sm text-foreground">{order.full_name}</div>
                      <a
                        href={`tel:${order.phone}`}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-mono mt-0.5"
                      >
                        <Phone className="h-3 w-3" />
                        {order.phone}
                      </a>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-start gap-1.5 text-xs text-foreground font-medium">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{order.address}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs font-medium">
                      <span className="px-2 py-1 rounded bg-muted font-mono text-[11px] border border-border">
                        {order.delivery_window}
                      </span>
                    </TableCell>

                    <TableCell>
                      {order.status === 'out_for_delivery' ? (
                        <Badge className="bg-purple-500/20 text-purple-600 border border-purple-500/30 uppercase text-[10px] font-bold">
                          Out for Delivery
                        </Badge>
                      ) : order.status === 'preparing' || order.status === 'payment_verified' ? (
                        <Badge className="bg-blue-500/20 text-blue-600 border border-blue-500/30 uppercase text-[10px] font-bold">
                          Packing / Ready
                        </Badge>
                      ) : order.status === 'delivered' ? (
                        <Badge className="bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 uppercase text-[10px] font-bold">
                          Delivered
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] font-bold uppercase">
                          {order.status.replace('_', ' ')}
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right space-x-2">
                      {order.status !== 'out_for_delivery' && order.status !== 'delivered' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(order.id, 'out_for_delivery')}
                          className="font-bold uppercase text-[11px] border-purple-500/30 hover:bg-purple-500/10 text-purple-600"
                        >
                          <Truck className="h-3.5 w-3.5 mr-1" />
                          Dispatch
                        </Button>
                      )}
                      {order.status === 'out_for_delivery' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(order.id, 'delivered')}
                          className="font-bold uppercase text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Mark Delivered
                        </Button>
                      )}
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
