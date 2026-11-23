import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { dashboardPath } from "./constants";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireUser(next = "/dashboard") {
  const session = await getSession();
  if (!session) redirect(`/signin?next=${encodeURIComponent(next)}`);
  if (session.user.isBlocked) redirect("/blocked");
  return session.user;
}

// Server-side role guard for dashboard areas
export async function requireRole(role) {
  const user = await requireUser();
  if (user.role !== role) redirect(dashboardPath(user.role));
  return user;
}
