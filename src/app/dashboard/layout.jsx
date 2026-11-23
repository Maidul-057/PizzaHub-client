import DashboardShell from "@/components/dashboard/DashboardShell";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Dashboard" };

// Server-side guard: logged-out users go to Sign In, blocked users to /blocked.
// A reload keeps the session because the cookie is read on the server.
export default async function DashboardLayout({ children }) {
  const user = await requireUser("/dashboard");
  return (
    <DashboardShell user={{ id: user.id, name: user.name, email: user.email, image: user.image || null, role: user.role }}>
      {children}
    </DashboardShell>
  );
}
