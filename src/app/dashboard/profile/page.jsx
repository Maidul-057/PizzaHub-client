"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUploader from "@/components/common/ImageUploader";
import PageHeader from "@/components/dashboard/PageHeader";
import PageLoader from "@/components/common/PageLoader";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const user = session?.user;
  const [form, setForm] = useState({ name: "", businessName: "" });
  const [image, setImage] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", businessName: user.businessName || "" });
      setImage(user.image ? [user.image] : []);
    }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isPending || !user) return <PageLoader label="Loading profile..." />;

  const save = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast.error("Name must be at least 2 characters");
    setSaving(true);
    try {
      // role / subscription fields are not sent and are ignored by the server anyway
      await api("/profile", {
        method: "PATCH",
        body: { name: form.name.trim(), image: image[0] || "", ...(user.role === "vendor" ? { businessName: form.businessName.trim() } : {}) },
      });
      await refetch();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Profile Settings" description="Update your name and photo." />
      <Card>
        <CardHeader><CardTitle>Your details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-5">
            <div className="space-y-2">
              <Label>Profile image</Label>
              <ImageUploader value={image} onChange={setImage} max={1} disabled={saving} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            {user.role === "vendor" && (
              <div className="space-y-2">
                <Label htmlFor="businessName">Restaurant name</Label>
                <Input id="businessName" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required />
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={user.role} disabled className="capitalize" />
              </div>
            </div>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
