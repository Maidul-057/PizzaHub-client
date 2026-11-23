"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import OrderTimeline from "@/components/common/OrderTimeline";
import PageLoader from "@/components/common/PageLoader";
import StatusBadge from "@/components/common/StatusBadge";
import PageHeader from "@/components/dashboard/PageHeader";
import { useFetch } from "@/hooks/use-fetch";
import { api } from "@/lib/api";
import { formatDate, formatDay, formatPrice } from "@/lib/format";

export default function MyOrdersPage() {
  const { data, loading, error, reload } = useFetch("/orders/my", { auth: true });
  const [viewing, setViewing] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [busy, setBusy] = useState(false);

  const cancel = async () => {
    setBusy(true);
    try {
      await api(`/orders/${cancelling.id}/cancel`, { method: "PATCH" });
      toast.success("Order cancelled");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
      setCancelling(null);
      reload();
    }
  };

  return (
    <div>
      <PageHeader title="My Orders" description="Track your orders. You can cancel an order while it is still pending." />

      {loading ? (
        <PageLoader label="Loading your orders..." />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data.orders.length === 0 ? (
        <EmptyState title="No orders yet" description="Find something delicious and place your first order." action={<Button asChild><Link href="/menu">Browse menu</Link></Button>} />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead><TableHead>Vendor</TableHead><TableHead>Delivery</TableHead><TableHead>Status</TableHead><TableHead>Requested</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {o.itemImage && <img src={o.itemImage} alt="" className="size-12 rounded-lg object-cover" />}
                      <div>
                        <p className="max-w-[180px] truncate font-medium">{o.itemName}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(o.price)}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{o.vendor?.businessName || "-"}</TableCell>
                  <TableCell>
                    <p className="whitespace-nowrap font-medium">{formatDay(o.deliveryDate)}</p>
                    <p className="max-w-[200px] text-xs text-muted-foreground">{o.deliveryAddress}</p>
                  </TableCell>
                  <TableCell><StatusBadge status={o.status} /></TableCell>
                  <TableCell className="whitespace-nowrap text-sm">{formatDate(o.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" aria-label="View order" onClick={() => setViewing(o)}><Eye className="size-4" /></Button>
                      {o.status === "pending" && (
                        <Button size="icon" variant="ghost" aria-label="Cancel order" className="text-destructive" onClick={() => setCancelling(o)}><XCircle className="size-4" /></Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={Boolean(viewing)} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="sm:max-w-lg">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.itemName}</DialogTitle>
                <DialogDescription>From {viewing.vendor?.businessName || "the restaurant"}</DialogDescription>
              </DialogHeader>
              <dl className="grid grid-cols-3 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Price</dt><dd className="col-span-2 font-semibold">{formatPrice(viewing.price)}</dd>
                <dt className="text-muted-foreground">Delivery date</dt><dd className="col-span-2">{formatDay(viewing.deliveryDate)}</dd>
                <dt className="text-muted-foreground">Address</dt><dd className="col-span-2">{viewing.deliveryAddress}</dd>
                <dt className="text-muted-foreground">Your message</dt><dd className="col-span-2">{viewing.message || "-"}</dd>
                <dt className="text-muted-foreground">Status</dt><dd className="col-span-2"><StatusBadge status={viewing.status} /></dd>
              </dl>
              <div className="border-t pt-4">
                <h3 className="mb-3 text-sm font-semibold">Order status timeline</h3>
                <OrderTimeline order={viewing} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(cancelling)}
        onOpenChange={(o) => !o && setCancelling(null)}
        title="Cancel this order?"
        description="Only pending orders can be cancelled. This cannot be undone."
        confirmLabel="Cancel order"
        destructive
        loading={busy}
        onConfirm={cancel}
      />
    </div>
  );
}
