import { requireRole } from "@/lib/session";

// Users can never open another role's dashboard by editing the URL
export default async function AdminLayout({ children }) {
  await requireRole("admin");
  return children;
}
