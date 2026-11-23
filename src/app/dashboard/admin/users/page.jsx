"use client";
import { useEffect, useState } from "react";
import { Eye, Search, ShieldBan, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { formatDate, initials } from "@/lib/format";

export default function ManageUsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search);
  useEffect(() => setPage(1), [debounced, role]);

  const { data, loading, error, reload } = useFetch("/admin/users", { auth: true, params: { search: debounced, role, page, limit: 10 } });
  const [viewing, setViewing] = useState(null);
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const toggleBlock = async () => {
    setBusy(true);
    try {
      const res = await api(`/admin/users/${target.id}/block`, { method: "PATCH", body: { blocked: !target.isBlocked } });
      toast.success(res.message);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
      setTarget(null);
    }
  };

  return (
    <div>
      <PageHeader title="Manage Users" description="Search, filter and block or unblock accounts." />

      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="vendor">Vendors</SelectItem>
            <SelectItem value="customer">Customers</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <PageLoader label="Loading users..." />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data.users.length === 0 ? (
        <EmptyState emoji="🔍" title="No users found" description="Try a different search or role filter." />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow><TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Plan</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {data.users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 border">
                          <AvatarImage src={u.image || undefined} alt="" />
                          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{initials(u.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="max-w-[180px] truncate font-medium">{u.name}</p>
                          <p className="max-w-[200px] truncate text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{u.role}</TableCell>
                    <TableCell>{u.role === "vendor" ? <Badge variant="secondary" className="capitalize">{u.subscriptionPlan}</Badge> : "-"}</TableCell>
                    <TableCell><StatusBadge status={u.isBlocked ? "blocked" : "active"} /></TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" aria-label="View user" onClick={() => setViewing(u)}><Eye className="size-4" /></Button>
                        {u.role !== "admin" && (
                          <Button size="sm" variant="outline" className={u.isBlocked ? "" : "text-destructive"} onClick={() => setTarget(u)}>
                            {u.isBlocked ? <ShieldCheck className="mr-1 size-4" /> : <ShieldBan className="mr-1 size-4" />}
                            {u.isBlocked ? "Unblock" : "Block"}
                          </Button>
                        )}
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
        <DialogContent>
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.name}</DialogTitle>
                <DialogDescription>{viewing.email}</DialogDescription>
              </DialogHeader>
              <dl className="grid grid-cols-3 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Role</dt><dd className="col-span-2 capitalize">{viewing.role}</dd>
                {viewing.businessName && (<><dt className="text-muted-foreground">Restaurant</dt><dd className="col-span-2">{viewing.businessName}</dd></>)}
                {viewing.role === "vendor" && (<><dt className="text-muted-foreground">Plan</dt><dd className="col-span-2 capitalize">{viewing.subscriptionPlan}</dd></>)}
                <dt className="text-muted-foreground">Status</dt><dd className="col-span-2">{viewing.isBlocked ? "Blocked" : "Active"}</dd>
                <dt className="text-muted-foreground">Joined</dt><dd className="col-span-2">{formatDate(viewing.createdAt, true)}</dd>
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(target)}
        onOpenChange={(o) => !o && setTarget(null)}
        title={target?.isBlocked ? "Unblock this user?" : "Block this user?"}
        description={target?.isBlocked ? "They will be able to use protected features again." : "They will be logged out and cannot use protected features until unblocked."}
        confirmLabel={target?.isBlocked ? "Unblock" : "Block user"}
        destructive={!target?.isBlocked}
        loading={busy}
        onConfirm={toggleBlock}
      />
    </div>
  );
}
