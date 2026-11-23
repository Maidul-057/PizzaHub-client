import { requireRole } from "@/lib/session";

// Users can never open another role's dashboard by editing the URL
export default async function VendorLayout({ children }) {
  await requireRole("vendor");
  return children;
}
