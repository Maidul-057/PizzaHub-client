"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GoogleButton from "@/components/layout/GoogleButton";
import ImageUploader from "@/components/common/ImageUploader";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";

function validatePassword(pw) {
  if (pw.length < 6) return "Password must be at least 6 characters";
  if (!/[A-Z]/.test(pw)) return "Password needs at least one uppercase letter";
  if (!/[a-z]/.test(pw)) return "Password needs at least one lowercase letter";
  return null;
}

export default function SignUpForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer", businessName: "" });
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast.error("Please enter your full name");
    const pwError = validatePassword(form.password);
    if (pwError) return toast.error(pwError);
    if (form.role === "vendor" && form.businessName.trim().length < 2) return toast.error("Please enter your restaurant name");

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      image: image[0] || undefined,
      role: form.role,
      businessName: form.role === "vendor" ? form.businessName.trim() : undefined,
    });
    if (error) {
      toast.error(error.message || "Could not create your account");
      setLoading(false);
      return;
    }
    clearToken();
    toast.success("Account created! Welcome to PizzaHub.");
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-extrabold">Create your PizzaHub account</CardTitle>
          <CardDescription>Order pizza or sell it. Pick the role that fits you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required value={form.name} onChange={set("name")} autoComplete="name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={form.email} onChange={set("email")} autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={form.password} onChange={set("password")} autoComplete="new-password" />
              <p className="text-xs text-muted-foreground">At least 6 characters with one uppercase and one lowercase letter.</p>
            </div>
            <div className="space-y-2">
              <Label>Account role</Label>
              <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="vendor">Vendor (Restaurant Owner)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.role === "vendor" && (
              <div className="space-y-2">
                <Label htmlFor="businessName">Restaurant name</Label>
                <Input id="businessName" required value={form.businessName} onChange={set("businessName")} />
              </div>
            )}
            <div className="space-y-2">
              <Label>Profile image (optional)</Label>
              <ImageUploader value={image} onChange={setImage} max={1} disabled={loading} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Create account
            </Button>
          </form>

          <div className="relative text-center text-xs text-muted-foreground">
            <span className="relative z-10 bg-card px-2">or</span>
            <span className="absolute inset-x-0 top-1/2 border-t" />
          </div>

          <GoogleButton label="Sign up with Google (customer account)" />

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="font-semibold text-primary hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
