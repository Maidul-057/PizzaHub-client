import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Payment cancelled" };

export default async function PaymentCancelPage() {
  await requireUser("/payment/cancel");
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <XCircle className="size-16 text-destructive" />
      <h1 className="text-3xl font-extrabold">Payment cancelled</h1>
      <p className="max-w-md text-muted-foreground">No money was taken and your plan has not changed. You can upgrade whenever you are ready.</p>
      <Button asChild><Link href="/dashboard/vendor/subscription">Back to subscription</Link></Button>
    </div>
  );
}
