"use client";
import { useParams } from "next/navigation";
import ErrorState from "@/components/common/ErrorState";
import PageLoader from "@/components/common/PageLoader";
import ItemForm from "@/components/dashboard/ItemForm";
import PageHeader from "@/components/dashboard/PageHeader";
import { useFetch } from "@/hooks/use-fetch";

export default function EditItemPage() {
  const { id } = useParams();
  const { data, loading, error, reload } = useFetch(`/vendor/items/${id}`, { auth: true });

  if (loading) return <PageLoader label="Loading item..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div>
      <PageHeader title="Edit Menu Item" description="Saving sends the item back to admin review." />
      <ItemForm item={data} />
    </div>
  );
}
