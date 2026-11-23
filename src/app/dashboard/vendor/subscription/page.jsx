"use client";
import { useState } from "react";
import { Check, Crown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ErrorState from "@/components/common/ErrorState";
import PageLoader from "@/components/common/PageLoader";
import StatusBadge from "@/components/common/StatusBadge";
import PageHeader from "@/components/dashboard/PageHeader";
import { useFetch } from "@/hooks/use-fetch";
import { api } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";

const FREE = ["Max 3 active menu items", "Basic vendor dashboard", "Order management"];
const PREMIUM = ["Unlimited active menu items", "Premium vendor badge", "Featured menu placement", "All Free features"];

export default function SubscriptionPage() {
  const { data, loading, error, reload } = useFetch("/payments/subscription", { auth: true });
  const [paying, setPaying] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  if (loading) return <PageLoader label="Loading subscription..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const isPremium = data.plan === "premium";

  const upgrade = async () => {
    setPaying(true);
    try {
      const { url } = await api("/payments/checkout", { method: "POST" });
      window.location.href = url; // Stripe Checkout
    } catch (err) {
      toast.error(err.message);
      setPaying(false);
    }
  };

  const cancel = async () => {
    setCancelling(true);
    try {
      const res = await api("/payments/cancel-subscription", { method: "POST" });
      toast.success(res.message);
      setCancelOpen(false);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div>
      <PageHeader title="Subscription" description="Upgrade to publish unlimited items and get featured on the homepage." />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className={!isPremium ? "border-primary" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Free</CardTitle>
              {!isPremium && <Badge>Current plan</Badge>}
            </div>
            <CardDescription>$0 forever</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {FREE.map((f) => (<li key={f} className="flex items-center gap-2"><Check className="size-4 text-emerald-600" /> {f}</li>))}
            </ul>
          </CardContent>
        </Card>

        <Card className={isPremium ? "border-primary" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Crown className="size-5 text-amber-500" /> Premium</CardTitle>
              {isPremium && <Badge>Current plan</Badge>}
            </div>
            <CardDescription>Monthly subscription via Stripe</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <ul className="space-y-2 text-sm">
              {PREMIUM.map((f) => (<li key={f} className="flex items-center gap-2"><Check className="size-4 text-emerald-600" /> {f}</li>))}
            </ul>
            {isPremium ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {data.cancelAtPeriodEnd ? "Cancelled. Premium ends on " : "Active until "}
                  <strong>{formatDate(data.expiresAt)}</strong>
                  {data.cancelAtPeriodEnd ? "." : " (renews automatically)."}
                </p>
                {!data.cancelAtPeriodEnd && (
                  <Button variant="outline" onClick={() => setCancelOpen(true)}>Cancel subscription</Button>
                )}
              </div>
            ) : (
              <Button onClick={upgrade} disabled={paying} className="w-full">
                {paying && <Loader2 className="mr-2 size-4 animate-spin" />}
                Upgrade to Premium
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-3 mt-10 text-xl font-bold">Payment history</h2>
      {data.transactions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No payments yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Date</TableHead><TableHead>Plan</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {data.transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{formatDate(t.createdAt, true)}</TableCell>
                  <TableCell className="capitalize">{t.plan}</TableCell>
                  <TableCell>{formatPrice(t.amount)} {String(t.currency).toUpperCase()}</TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel Premium?"
        description="You keep Premium until the end of the current billing period, then your plan returns to Free."
        confirmLabel="Cancel subscription"
        destructive
        loading={cancelling}
        onConfirm={cancel}
      />
    </div>
  );
}
