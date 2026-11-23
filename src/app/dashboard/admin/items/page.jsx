"use client";
import { useEffect, useState } from "react";
import { Check, Eye, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import PageLoader from "@/components/common/PageLoader";
import StatusBadge from "@/components/common/StatusBadge";
import PageHeader from "@/components/dashboard/PageHeader";
import { useFetch } from "@/hooks/use-fetch";
import { useDebounce } from "@/hooks/use-debounce";
import { api } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";

const STATUSES = ["pending", "approved", "rejected", "inactive"];

export default function ManageItemsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search);
  useEffect(() => setPage(1), [debounced, status]);

  const { data, loading, error, reload } = useFetch("/admin/menu", { auth: true, params: { search: debounced, status, page, limit: 10 } });
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const setItemStatus = async (item, next) => {
    try {
      await api(`/admin/menu/${item.id}/status`, { method: "PATCH", body: { status: next } });
      toast.success(`Item ${next}`);
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await api(`/admin/menu/${deleting.id}`, { method: "DELETE" });
      toast.success("Menu item deleted");
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
      setDeleting(null);
    }
  };

  return (
    <div>
      <PageHeader title="Manage Menu Items" description="Review pending items, change the status of published ones or delete inappropriate items." />

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by name, area or description" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (<SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <PageLoader label="Loading menu items..." />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data.items.length === 0 ? (
        <EmptyState emoji="🍽️" title="No menu items found" description="Nothing matches the current filters." />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow><TableHead>Item</TableHead><TableHead>Vendor</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.images?.[0]} alt="" className="size-12 rounded-lg object-cover" />
                        <div>
                          <p className="max-w-[180px] truncate font-medium">{item.itemName}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-[160px] truncate">{item.vendor?.businessName}</p>
                      <p className="max-w-[160px] truncate text-xs text-muted-foreground">{item.vendor?.email}</p>
                    </TableCell>
                    <TableCell className="font-semibold">{formatPrice(item.price)}</TableCell>
                    <TableCell>
                      <Select value={item.status} onValueChange={(v) => setItemStatus(item, v)}>
                        <SelectTrigger className="h-8 w-32"><SelectValue><StatusBadge status={item.status} /></SelectValue></SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (<SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        {item.status === "pending" && (
                          <>
                            <Button size="sm" onClick={() => setItemStatus(item, "approved")}><Check className="mr-1 size-4" /> Approve</Button>
                            <Button size="sm" variant="outline" className="text-destructive" onClick={() => setItemStatus(item, "rejected")}><X className="mr-1 size-4" /> Reject</Button>
                          </>
                        )}
                        <Button size="icon" variant="ghost" aria-label="View item" onClick={() => setViewing(item)}><Eye className="size-4" /></Button>
                        <Button size="icon" variant="ghost" aria-label="Delete item" className="text-destructive" onClick={() => setDeleting(item)}><Trash2 className="size-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {data.pages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span className="text-sm text-muted-foreground">Page {data.page} of {data.pages}</span>
              <Button variant="outline" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          )}
        </>
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
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">{formatPrice(viewing.price)}</span>
                <StatusBadge status={viewing.status} />
              </div>
              <p className="text-xs text-muted-foreground">By {viewing.vendor?.businessName} - created {formatDate(viewing.createdAt, true)}</p>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete this menu item?"
        description="This removes the item from the platform for good. Pending orders for it are cancelled."
        confirmLabel="Delete item"
        destructive
        loading={busy}
        onConfirm={remove}
      />
    </div>
  );
}
