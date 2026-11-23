import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STYLES = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
  approved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  accepted: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300",
  blocked: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300",
  cancelled: "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/25 dark:text-zinc-300",
  inactive: "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/25 dark:text-zinc-300",
  expired: "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/25 dark:text-zinc-300",
  active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
};

export default function StatusBadge({ status, className }) {
  return (
    <Badge variant="secondary" className={cn("capitalize", STYLES[status], className)}>
      {status}
    </Badge>
  );
}
