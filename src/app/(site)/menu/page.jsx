import BrowseMenu from "@/components/menu/BrowseMenu";

export const metadata = { title: "Browse Menu" };

export default async function MenuPage({ searchParams }) {
  const sp = await searchParams;
  return <BrowseMenu initialCategory={sp?.category || "all"} initialSearch={sp?.search || ""} />;
}
