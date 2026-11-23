"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import PageLoader from "@/components/common/PageLoader";
import StatusBadge from "@/components/common/StatusBadge";
import PageHeader from "@/components/dashboard/PageHeader";
import { useFetch } from "@/hooks/use-fetch";
import { formatDate, formatPrice } from "@/lib/format";

// Read-only: there is no API route that edits or deletes a payment record
export default function TransactionsPage() {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [status]);

  const { data, loading, error, reload } = useFetch("/admin/transactions", { auth: true, params: { status, page, limit: 10 } });

  return (
    <div>
      <PageHeader
        title="Transactions"
        description="Subscription payments. Records are read-only."
        action={
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {["paid", "pending", "failed", "expired"].map((s) => (<SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>))}
            </SelectContent>
          </Select>
        }
      />

      {loading ? (
        <PageLoader label="Loading transactions..." />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data.transactions.length === 0 ? (
        <EmptyState emoji="🧾" title="No transactions yet" description="Premium subscription payments will appear here." />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow><TableHead>Vendor</TableHead><TableHead>Plan</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {data.transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <p className="font-medium">{t.vendor?.businessName || "Unknown vendor"}</p>
                      <p className="text-xs text-muted-foreground">{t.vendor?.email}</p>
                    </TableCell>
                    <TableCell className="capitalize">{t.plan}</TableCell>
                    <TableCell className="font-semibold">{formatPrice(t.amount)} {String(t.currency).toUpperCase()}</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(t.createdAt, true)}</TableCell>
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
    </div>
  );
}
