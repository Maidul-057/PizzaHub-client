import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({ label, value, icon: Icon, hint }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 truncate text-3xl font-extrabold">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        {Icon && (
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Icon className="size-6" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
