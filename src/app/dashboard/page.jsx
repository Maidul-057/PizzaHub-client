import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { dashboardPath } from "@/lib/constants";

// Sends every user to the dashboard that matches their role
export default async function DashboardIndex() {
  const user = await requireUser("/dashboard");
  redirect(dashboardPath(user.role));
}
