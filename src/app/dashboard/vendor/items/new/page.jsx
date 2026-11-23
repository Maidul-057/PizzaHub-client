import PageHeader from "@/components/dashboard/PageHeader";
import ItemForm from "@/components/dashboard/ItemForm";

export const metadata = { title: "Add Menu Item" };

export default function NewItemPage() {
  return (
    <div>
      <PageHeader title="Add Menu Item" description="New items stay pending until an admin approves them." />
      <ItemForm />
    </div>
  );
}
