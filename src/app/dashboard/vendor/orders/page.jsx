"use client";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import PageLoader from "@/components/common/PageLoader";
import StatusBadge from "@/components/common/StatusBadge";
import PageHeader from "@/components/dashboard/PageHeader";
import { useFetch } from "@/hooks/use-fetch";
import { api } from "@/lib/api";
import { formatDate, formatDay, formatPrice } from "@/lib/format";

export default function VendorOrdersPage() {
  const { data, loading, error, reload } = useFetch("/vendor/orders", { auth: true });
  const [filter, setFilter] = useState("all");
  const [pending, setPending] = useState(null); // { order, status }
  const [busy, setBusy] = useState(false);

  const update = async () => {
    setBusy(true);
    try {
      await api(`/orders/${pending.order.id}/status`, { method: "PATCH", body: { status: pending.status } });
      toast.success(`Order ${pending.status}`);
      setPending(null);
      reload();
    } catch (err) {
      toast.error(err.message);
      setPending(null);
      reload();
    } finally {
      setBusy(false);
    }
  };

  const orders = (data?.orders || []).filter((o) => filter === "all" || o.status === filter);

  return (
    <div>
      <PageHeader
        title="Customer Orders"
        description="Accept or reject pending orders. A decision can only be made once."
        action={
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {["pending", "accepted", "rejected", "cancelled"].map((s) => (<SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>))}
            </SelectContent>
          </Select>
        }
      />

      {loading ? (
        <PageLoader label="Loading orders..." />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : orders.length === 0 ? (
        <EmptyState emoji="📭" title="No orders here" description="Orders from customers will show up in this list." />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead><TableHead>Item</TableHead><TableHead>Delivery</TableHead><TableHead>Message</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>
                    <p className="font-medium">{o.customer?.name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{o.customer?.email}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {o.itemImage && <img src={o.itemImage} alt="" className="size-10 rounded-md object-cover" />}
                      <div>
                        <p className="max-w-[160px] truncate font-medium">{o.itemName}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(o.price)}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="whitespace-nowrap font-medium">{formatDay(o.deliveryDate)}</p>
                    <p className="max-w-[200px] text-xs text-muted-foreground">{o.deliveryAddress}</p>
                  </TableCell>
                  <TableCell className="max-w-[200px] text-sm text-muted-foreground">{o.message || "-"}</TableCell>
                  <TableCell>
                    <StatusBadge status={o.status} />
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(o.createdAt)}</p>
                  </TableCell>
                  <TableCell>
                    {o.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" onClick={() => setPending({ order: o, status: "accepted" })}><Check className="mr-1 size-4" /> Accept</Button>
                        <Button size="sm" variant="outline" className="text-destructive" onClick={() => setPending({ order: o, status: "rejected" })}><X className="mr-1 size-4" /> Reject</Button>
                      </div>
                    ) : (
                      <p className="text-right text-xs text-muted-foreground">Final</p>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pending)}
        onOpenChange={(o) => !o && setPending(null)}
        title={pending?.status === "accepted" ? "Accept this order?" : "Reject this order?"}
        description="This decision is final and the customer will see the new status."
        confirmLabel={pending?.status === "accepted" ? "Accept order" : "Reject order"}
        destructive={pending?.status === "rejected"}
        loading={busy}
        onConfirm={update}
      />
    </div>
  );
}
