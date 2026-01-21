'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowUpRight,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAdminStats } from '@/hooks/useAdminStats';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  isNegative?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, isNegative = false }) => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">{title}</span>
        <div className="bg-primary/10 p-2 rounded-full">{icon}</div>
      </div>
      <div className="mt-4 flex justify-between items-end">
        <span className="text-2xl font-bold">{value}</span>
        <span
          className={`flex items-center text-sm ${isNegative ? 'text-red-500' : 'text-blue-500'}`}
        >
          {change}
        </span>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const router = useRouter();
  const { data: stats, isLoading, refetch } = useAdminStats();

  if (isLoading || !stats) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()} className="font-black uppercase italic tracking-tighter">Refresh</Button>
          <Button onClick={() => router.push('/admin/cms')} className="bg-primary hover:bg-primary/90 text-white font-black uppercase italic tracking-tighter shadow-lg shadow-primary/20">Manage Collection</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change="+1 new"
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.revenue.toFixed(0)}`}
          change="+0%"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          title="Active Customers"
          value={stats.customers}
          change="+0%"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Stock Alerts"
          value={stats.lowStockProducts.length}
          change={stats.outOfStockCount > 0 ? `${stats.outOfStockCount} OOS` : "Healthy"}
          isNegative={stats.outOfStockCount > 0}
          icon={<Package className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Overview */}
        <div className="col-span-1 lg:col-span-2 bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Link href="/admin/orders">
              <Button variant="outline" size="sm">
                View All Orders
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="pb-4 font-medium text-muted-foreground">Order</th>
                  <th className="pb-4 font-medium text-muted-foreground">Customer</th>
                  <th className="pb-4 font-medium text-muted-foreground">Amount</th>
                  <th className="pb-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground">No orders yet.</td>
                  </tr>
                ) : (
                  stats.recentOrders.map((order, index) => (
                    <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-4 font-mono text-xs uppercase">#{order.id.slice(0, 6)}</td>
                      <td className="py-4 font-medium">{order.full_name}</td>
                      <td className="py-4">${Number(order.total_amount).toFixed(2)}</td>
                      <td className="py-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'delivered' ? 'bg-muted text-muted-foreground' :
                            order.status === 'pending_payment' ? 'bg-yellow-500/20 text-yellow-600' :
                              'bg-blue-500/20 text-blue-600'
                            }`}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Alerts Card */}
        <div className="space-y-6">
          <Card className="p-6 border-orange-500/20 bg-orange-500/5">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-orange-600">
              <Package className="h-5 w-5" />
              Inventory Alerts
            </h3>
            <div className="space-y-4">
              {stats.lowStockProducts.length === 0 && stats.outOfStockCount === 0 ? (
                <p className="text-sm text-muted-foreground">All items are well stocked! ✨</p>
              ) : (
                <>
                  {stats.lowStockProducts.map(product => (
                    <div key={product.id} className="flex justify-between items-center p-2 bg-background rounded-lg border border-orange-200">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{product.name}</span>
                        <span className="text-[10px] text-orange-600 font-bold uppercase">Low Stock</span>
                      </div>
                      <span className="text-sm font-bold">{product.inventory_count} left</span>
                    </div>
                  ))}
                  {stats.outOfStockCount > 0 && (
                    <div className="p-2 bg-destructive/10 rounded-lg border border-destructive/20 mt-2">
                      <p className="text-[10px] font-bold text-destructive uppercase">Warning: {stats.outOfStockCount} items out of stock</p>
                    </div>
                  )}
                </>
              )}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4" asChild>
              <Link href="/admin/cms">Update Inventory</Link>
            </Button>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="justify-start gap-2" asChild>
                <Link href="/admin/cms">
                  <Package className="h-4 w-4" />
                  Manage Collection
                </Link>
              </Button>
              <Button variant="outline" className="justify-start gap-2" asChild>
                <Link href="/admin/orders">
                  <ShoppingCart className="h-4 w-4" />
                  Review Pending Payments
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

// Internal Card component since it's used in the page
function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`bg-card rounded-xl border border-border shadow-sm ${className}`}>{children}</div>
}
