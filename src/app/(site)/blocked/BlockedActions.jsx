"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";

export default function BlockedActions() {
  const router = useRouter();
  const logout = async () => {
    await authClient.signOut();
    clearToken();
    router.push("/");
    router.refresh();
  };
  return <Button onClick={logout}>Log out</Button>;
}
