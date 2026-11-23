import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

// Order status timeline: Placed -> Accepted / Rejected / Cancelled
export default function OrderTimeline({ order }) {
  const steps = [{ label: "Order placed", date: order.createdAt, state: "done" }];

  if (order.status === "pending") {
    steps.push({ label: "Waiting for the restaurant", state: "current" });
  } else if (order.status === "accepted") {
    steps.push({ label: "Accepted by the restaurant", date: order.statusUpdatedAt, state: "done" });
  } else if (order.status === "rejected") {
    steps.push({ label: "Rejected by the restaurant", date: order.statusUpdatedAt, state: "failed" });
  } else if (order.status === "cancelled") {
    steps.push({ label: "Cancelled", date: order.statusUpdatedAt, state: "failed" });
  }

  return (
    <ol className="space-y-4">
      {steps.map((s) => (
        <li key={s.label} className="flex items-start gap-3">
          {s.state === "done" && <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" />}
          {s.state === "current" && <Circle className="mt-0.5 size-5 animate-pulse text-amber-500" />}
          {s.state === "failed" && <XCircle className="mt-0.5 size-5 text-destructive" />}
          <div>
            <p className={cn("text-sm font-medium", s.state === "current" && "text-amber-600")}>{s.label}</p>
            {s.date && <p className="text-xs text-muted-foreground">{formatDate(s.date, true)}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
