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
import GoogleButton from "@/components/layout/GoogleButton";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";

export default function SignInForm({ next }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await authClient.signIn.email({ email: form.email.trim(), password: form.password });
    if (error) {
      toast.error(error.message || "Invalid email or password");
      setLoading(false);
      return;
    }
    if (data?.user?.isBlocked) {
      await authClient.signOut();
      toast.error("Your account has been blocked. Please contact support.");
      setLoading(false);
      return;
    }
    clearToken();
    toast.success("Welcome back!");
    router.push(next);
    router.refresh();
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-extrabold">Sign in to PizzaHub</CardTitle>
          <CardDescription>Welcome back. Your next slice is waiting.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          <div className="relative text-center text-xs text-muted-foreground">
            <span className="relative z-10 bg-card px-2">or</span>
            <span className="absolute inset-x-0 top-1/2 border-t" />
          </div>

          <GoogleButton next={next} />

          <p className="text-center text-sm text-muted-foreground">
            New to PizzaHub?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline">Create an account</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
