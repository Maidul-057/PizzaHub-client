"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";

// The redirect itself never activates Premium. We only wait for the verified Stripe webhook
// to mark the transaction as paid, and then show the confirmation.
export default function PaymentStatus({ sessionId }) {
  const [state, setState] = useState({ phase: sessionId ? "checking" : "missing", tx: null });

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    let tries = 0;

    const poll = async () => {
      try {
        const tx = await api(`/payments/session/${sessionId}`);
        if (cancelled) return;
        if (tx.status === "paid") return setState({ phase: "paid", tx });
        if (tx.status === "failed" || tx.status === "expired") return setState({ phase: "failed", tx });
      } catch {
        if (cancelled) return;
      }
      tries += 1;
      if (tries >= 15) return setState({ phase: "slow", tx: null });
      setTimeout(poll, 2000);
    };
    poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const { phase, tx } = state;

  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center gap-4 px-4 text-center">
      {phase === "checking" && (
        <>
          <Loader2 className="size-14 animate-spin text-primary" />
          <h1 className="text-3xl font-extrabold">Confirming your payment...</h1>
          <p className="max-w-md text-muted-foreground">We are waiting for Stripe to confirm the payment. This usually takes a few seconds.</p>
        </>
      )}
      {phase === "paid" && (
        <>
          <CheckCircle2 className="size-16 text-emerald-600" />
          <h1 className="text-3xl font-extrabold">You are Premium now!</h1>
          <p className="max-w-md text-muted-foreground">
            Payment of {formatPrice(tx.amount)} {String(tx.currency).toUpperCase()} confirmed. Unlimited menu items, the Premium badge and featured placement are active.
          </p>
          <Button asChild><Link href="/dashboard/vendor/subscription">Go to subscription</Link></Button>
        </>
      )}
      {phase === "failed" && (
        <>
          <XCircle className="size-16 text-destructive" />
          <h1 className="text-3xl font-extrabold">Payment not completed</h1>
          <p className="max-w-md text-muted-foreground">Stripe reported that this payment did not go through. Your plan has not changed.</p>
          <Button asChild><Link href="/dashboard/vendor/subscription">Try again</Link></Button>
        </>
      )}
      {phase === "slow" && (
        <>
          <Loader2 className="size-14 text-amber-500" />
          <h1 className="text-3xl font-extrabold">Still processing</h1>
          <p className="max-w-md text-muted-foreground">The confirmation is taking longer than usual. Your plan will update automatically once Stripe confirms the payment.</p>
          <Button asChild><Link href="/dashboard/vendor/subscription">Check subscription</Link></Button>
        </>
      )}
      {phase === "missing" && (
        <>
          <XCircle className="size-16 text-destructive" />
          <h1 className="text-3xl font-extrabold">No payment found</h1>
          <Button asChild><Link href="/dashboard/vendor/subscription">Back to subscription</Link></Button>
        </>
      )}
    </div>
  );
}
