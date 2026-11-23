import { requireUser } from "@/lib/session";
import ItemDetails from "@/components/menu/ItemDetails";

export const metadata = { title: "Item Details" };

export default async function ItemPage({ params }) {
  const { id } = await params;
  // Logged-out visitors are redirected to Sign In and sent back here afterwards
  const user = await requireUser(`/menu/${id}`);
  return <ItemDetails id={id} user={{ id: user.id, role: user.role }} />;
}
