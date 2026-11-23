"use client";
import Link from "next/link";
import { CheckCircle2, Clock, ShoppingBag, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ErrorState from "@/components/common/ErrorState";
import PageLoader from "@/components/common/PageLoader";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import { BarStat } from "@/components/dashboard/Charts";
import { useFetch } from "@/hooks/use-fetch";

export default function CustomerOverview() {
  const { data, loading, error, reload } = useFetch("/customer/stats", { auth: true });
  if (loading) return <PageLoader label="Loading your dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const chart = [
    { name: "pending", value: data.pending },
    { name: "accepted", value: data.accepted },
    { name: "rejected", value: data.rejected },
    { name: "cancelled", value: data.cancelled },
  ];

  return (
    <div>
      <PageHeader title="Customer Overview" description="Your orders at a glance." action={<Button asChild><Link href="/menu">Order something tasty</Link></Button>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total orders" value={data.total} icon={ShoppingBag} />
        <StatCard label="Pending orders" value={data.pending} icon={Clock} />
        <StatCard label="Accepted orders" value={data.accepted} icon={CheckCircle2} />
        <StatCard label="Rejected orders" value={data.rejected} icon={XCircle} hint={data.cancelled ? `${data.cancelled} cancelled by you` : undefined} />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Orders by status</CardTitle></CardHeader>
        <CardContent><BarStat data={chart} /></CardContent>
      </Card>
    </div>
  );
}
