"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Plus, Power, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import PageLoader from "@/components/common/PageLoader";
import StatusBadge from "@/components/common/StatusBadge";
import PageHeader from "@/components/dashboard/PageHeader";
import { useFetch } from "@/hooks/use-fetch";
import { api } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";

export default function MyItemsPage() {
  const { data, loading, error, reload } = useFetch("/vendor/items", { auth: true });
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const toggle = async (item) => {
    try {
      await api(`/vendor/items/${item.id}/availability`, { method: "PATCH", body: { available: item.status === "inactive" } });
      toast.success(item.status === "inactive" ? "Item is available again" : "Item marked unavailable");
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await api(`/vendor/items/${deleting.id}`, { method: "DELETE" });
      toast.success("Menu item deleted");
      setDeleting(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="My Menu Items"
        description={data ? `Plan: ${data.plan}${data.plan === "free" ? ` (max ${data.freeLimit} active items)` : " (unlimited items)"}` : undefined}
        action={<Button asChild><Link href="/dashboard/vendor/items/new"><Plus className="mr-2 size-4" /> Add item</Link></Button>}
      />

      {loading ? (
        <PageLoader label="Loading your items..." />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data.items.length === 0 ? (
        <EmptyState title="No menu items yet" description="Add your first item to start getting orders." action={<Button asChild><Link href="/dashboard/vendor/items/new">Add menu item</Link></Button>} />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.images?.[0]} alt="" className="size-12 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="max-w-[200px] truncate font-medium">{item.itemName}</p>
                        <p className="text-xs text-muted-foreground">{item.location}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{item.category}</TableCell>
                  <TableCell className="font-semibold">{formatPrice(item.price)}</TableCell>
                  <TableCell><StatusBadge status={item.status} /></TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" aria-label="View details" onClick={() => setViewing(item)}><Eye className="size-4" /></Button>
                      <Button asChild size="icon" variant="ghost" aria-label="Edit"><Link href={`/dashboard/vendor/items/${item.id}/edit`}><Pencil className="size-4" /></Link></Button>
                      {item.status !== "rejected" && (
                        <Button size="icon" variant="ghost" aria-label={item.status === "inactive" ? "Make available" : "Make unavailable"} onClick={() => toggle(item)}>
                          <Power className="size-4" />
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" aria-label="Delete" className="text-destructive" onClick={() => setDeleting(item)}><Trash2 className="size-4" /></Button>
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
                <DialogDescription>{viewing.category} - {viewing.location}</DialogDescription>
              </DialogHeader>
              <div className="flex gap-2 overflow-x-auto">
                {viewing.images.map((img) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={img} src={img} alt="" className="size-28 shrink-0 rounded-lg object-cover" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{viewing.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-lg font-bold text-primary">{formatPrice(viewing.price)}</span>
                <StatusBadge status={viewing.status} />
              </div>
              <p className="text-xs text-muted-foreground">Created {formatDate(viewing.createdAt, true)}</p>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete this menu item?"
        description="This cannot be undone. Pending orders for this item will be cancelled."
        confirmLabel="Delete item"
        destructive
        loading={busy}
        onConfirm={remove}
      />
    </div>
  );
}
