'use client';

import React from 'react';
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
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Dummy data for the dashboard
const dashboardData = {
  totalOrders: 1243,
  totalRevenue: 32450,
  activeCustomers: 876,
  inventoryItems: 32,
  monthlyGrowth: 18.5,
  popularMeals: [
    { name: 'The Shredder', orders: 342 },
    { name: 'Bulking Beast', orders: 245 },
    { name: 'Keto Konquest', orders: 178 },
  ],
  recentOrders: [
    { id: 'ORD-2023', customer: 'Jake B.', amount: 45.97, status: 'Delivered' },
    { id: 'ORD-2022', customer: 'Sarah R.', amount: 89.96, status: 'Processing' },
    { id: 'ORD-2021', customer: 'Mike T.', amount: 32.98, status: 'Shipped' },
    { id: 'ORD-2020', customer: 'Lisa M.', amount: 65.97, status: 'Processing' },
  ],
  monthlySales: [120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450],
};

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  isNegative?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, isNegative = false }) => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex justify-between">
        <span className="text-muted-foreground">{title}</span>
        <div className="bg-primary/10 p-2 rounded-full">{icon}</div>
      </div>
      <div className="mt-4 flex justify-between items-end">
        <span className="text-2xl font-bold">{value}</span>
        <span
          className={`flex items-center text-sm ${isNegative ? 'text-red-500' : 'text-green-500'}`}
        >
          {change}
        </span>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline">Generate Report</Button>
            <Button onClick={() => router.push('/admin/cms')}>Edit Product List</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Orders"
            value={dashboardData.totalOrders}
            change="+12.5%"
            icon={<ShoppingCart className="h-5 w-5" />}
          />
          <StatCard
            title="Revenue"
            value={`$${dashboardData.totalRevenue}`}
            change="+8.2%"
            icon={<DollarSign className="h-5 w-5" />}
          />
          <StatCard
            title="Active Customers"
            value={dashboardData.activeCustomers}
            change="+5.3%"
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="Inventory Items"
            value={dashboardData.inventoryItems}
            change="-2.1%"
            isNegative
            icon={<Package className="h-5 w-5" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Weekly Sales Chart */}
          <div className="col-span-1 lg:col-span-2 bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Weekly Sales</h2>
              <Button variant="outline" size="sm">
                View Full Report
              </Button>
            </div>
            {/* Chart Placeholder */}
            <div className="bg-secondary h-64 rounded-lg flex items-center justify-center">
              <div className="flex flex-col items-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-2" />
                <span className="text-muted-foreground">Sales chart would render here</span>
              </div>
            </div>
          </div>

          {/* Popular Products */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Popular Meals</h2>
              <Button variant="ghost" size="sm" className="text-primary">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {dashboardData.popularMeals.map((meal, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="rounded-md bg-secondary h-10 w-10 flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <span>{meal.name}</span>
                  </div>
                  <span className="font-medium">{meal.orders} orders</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="col-span-1 lg:col-span-2 bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <Link href="/admin/orders">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-border">
                    <th className="pb-4 font-medium text-muted-foreground">Order ID</th>
                    <th className="pb-4 font-medium text-muted-foreground">Customer</th>
                    <th className="pb-4 font-medium text-muted-foreground">Amount</th>
                    <th className="pb-4 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentOrders.map((order, index) => (
                    <tr key={index} className="border-b border-border last:border-0">
                      <td className="py-4">{order.id}</td>
                      <td className="py-4">{order.customer}</td>
                      <td className="py-4">${order.amount}</td>
                      <td className="py-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            order.status === 'Delivered'
                              ? 'bg-green-500/20 text-green-500'
                              : order.status === 'Processing'
                              ? 'bg-blue-500/20 text-blue-500'
                              : 'bg-yellow-500/20 text-yellow-500'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Growth */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Monthly Growth</h2>
              <span className="flex items-center text-green-500">
                <TrendingUp className="h-4 w-4 mr-1" />
                {dashboardData.monthlyGrowth}%
              </span>
            </div>
            <div className="space-y-4">
              <div className="bg-secondary h-40 rounded-lg flex items-center justify-center mb-4">
                <div className="flex flex-col items-center">
                  <TrendingUp className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-muted-foreground">Growth chart would render here</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer Growth</span>
                  <span>+12.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenue Growth</span>
                  <span>+18.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product Growth</span>
                  <span>+7.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
