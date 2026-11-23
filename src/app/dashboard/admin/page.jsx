"use client";
import { Briefcase, DollarSign, Hourglass, ReceiptText, ShoppingBasket, UserRound, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ErrorState from "@/components/common/ErrorState";
import PageLoader from "@/components/common/PageLoader";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { BarStat, PieStat } from "@/components/dashboard/Charts";
import { useFetch } from "@/hooks/use-fetch";
import { formatPrice } from "@/lib/format";

export default function AdminOverview() {
  const { data, loading, error, reload } = useFetch("/admin/stats", { auth: true });
  if (loading) return <PageLoader label="Loading platform stats..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const usersChart = [
    { name: "vendors", value: data.totalVendors },
    { name: "customers", value: data.totalCustomers },
    { name: "admins", value: Math.max(0, data.totalUsers - data.totalVendors - data.totalCustomers) },
  ];
  const itemsChart = ["pending", "approved", "rejected", "inactive"].map((s) => ({ name: s, value: data.itemsByStatus[s] || 0 }));

  return (
    <div>
      <PageHeader title="Admin Overview" description="Platform health at a glance." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Registered users" value={data.totalUsers} icon={Users} />
        <StatCard label="Vendors" value={data.totalVendors} icon={Briefcase} />
        <StatCard label="Customers" value={data.totalCustomers} icon={UserRound} />
        <StatCard label="Total menu items" value={data.totalItems} icon={ShoppingBasket} />
        <StatCard label="Pending menu items" value={data.pendingItems} icon={Hourglass} />
        <StatCard label="Transactions" value={data.totalTransactions} icon={ReceiptText} />
        <StatCard label="Paid revenue" value={formatPrice(data.revenue)} icon={DollarSign} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Users by role</CardTitle></CardHeader><CardContent><PieStat data={usersChart} /></CardContent></Card>
        <Card><CardHeader><CardTitle>Menu items by status</CardTitle></CardHeader><CardContent><BarStat data={itemsChart} /></CardContent></Card>
      </div>
    </div>
  );
}
