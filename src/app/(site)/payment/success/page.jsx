import { requireUser } from "@/lib/session";
import PaymentStatus from "./PaymentStatus";

export const metadata = { title: "Payment successful" };

export default async function PaymentSuccessPage({ searchParams }) {
  const sp = await searchParams;
  await requireUser("/payment/success");
  return <PaymentStatus sessionId={typeof sp?.session_id === "string" ? sp.session_id : ""} />;
}
