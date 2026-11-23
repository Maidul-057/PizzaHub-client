"use client";
import Link from "next/link";
import { ClipboardCheck, Clock, Crown, UtensilsCrossed, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ErrorState from "@/components/common/ErrorState";
import PageLoader from "@/components/common/PageLoader";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { BarStat, PieStat } from "@/components/dashboard/Charts";
import { useFetch } from "@/hooks/use-fetch";
import { formatDate } from "@/lib/format";

export default function VendorOverview() {
  const { data, loading, error, reload } = useFetch("/vendor/stats", { auth: true });
  if (loading) return <PageLoader label="Loading your dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const itemsChart = ["pending", "approved", "rejected", "inactive"].map((s) => ({ name: s, value: data.itemsByStatus[s] || 0 }));
  const ordersChart = ["pending", "accepted", "rejected", "cancelled"].map((s) => ({ name: s, value: data.ordersByStatus[s] || 0 }));

  return (
    <div>
      <PageHeader
        title="Vendor Overview"
        description="A quick look at your restaurant."
        action={<Button asChild><Link href="/dashboard/vendor/items/new">Add menu item</Link></Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total menu items" value={data.totalItems} icon={UtensilsCrossed} />
        <StatCard label="Active menu items" value={data.activeItems} icon={CheckCircle2} hint="Approved and visible" />
        <StatCard label="Pending orders" value={data.pendingOrders} icon={Clock} />
        <StatCard label="Accepted orders" value={data.acceptedOrders} icon={ClipboardCheck} />
        <StatCard
          label="Current plan"
          value={<span className="capitalize">{data.plan}</span>}
          icon={Crown}
          hint={data.planExpiresAt ? `Renews/ends ${formatDate(data.planExpiresAt)}` : "Upgrade for unlimited items"}
        />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Menu items by status</CardTitle></CardHeader>
          <CardContent><PieStat data={itemsChart} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Orders by status</CardTitle></CardHeader>
          <CardContent><BarStat data={ordersChart} /></CardContent>
        </Card>
      </div>
    </div>
  );
}
