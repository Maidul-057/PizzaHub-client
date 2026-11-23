"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/common/ImageUploader";
import { api } from "@/lib/api";
import { CATEGORY_NAMES } from "@/lib/constants";

// Shared by "Add Menu Item" (create) and "Edit" (update)
export default function ItemForm({ item }) {
  const router = useRouter();
  const editing = Boolean(item);
  const [form, setForm] = useState({
    itemName: item?.itemName || "",
    category: item?.category || "",
    description: item?.description || "",
    price: item?.price ?? "",
    location: item?.location || "",
  });
  const [images, setImages] = useState(item?.images || []);
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.category) return toast.error("Please choose a category");
    if (images.length === 0) return toast.error("Please upload at least one image");
    if (!(Number(form.price) > 0)) return toast.error("Price must be greater than 0");

    setSaving(true);
    try {
      await api(editing ? `/vendor/items/${item.id}` : "/vendor/items", {
        method: editing ? "PUT" : "POST",
        body: { ...form, price: Number(form.price), images },
      });
      toast.success(editing ? "Item updated and sent for review" : "Item submitted. It will appear after admin approval.");
      router.push("/dashboard/vendor/items");
      router.refresh();
    } catch (err) {
      toast.error(err.message, err.status === 403 ? { action: { label: "Upgrade", onClick: () => router.push("/dashboard/vendor/subscription") } } : undefined);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="max-w-3xl">
      <CardContent className="p-6">
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item name</Label>
              <Input id="itemName" value={form.itemName} onChange={set("itemName")} required minLength={3} maxLength={80} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Choose a category" /></SelectTrigger>
                <SelectContent>
                  {CATEGORY_NAMES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" type="number" min="0.01" step="0.01" value={form.price} onChange={set("price")} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location (area / city)</Label>
              <Input id="location" value={form.location} onChange={set("location")} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={4} value={form.description} onChange={set("description")} required minLength={10} maxLength={1000} />
          </div>

          <div className="space-y-2">
            <Label>Item images (first image is the cover, up to 4)</Label>
            <ImageUploader value={images} onChange={setImages} max={4} disabled={saving} />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              {editing ? "Save changes" : "Submit for review"}
            </Button>
            <Button asChild type="button" variant="outline"><Link href="/dashboard/vendor/items">Cancel</Link></Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
