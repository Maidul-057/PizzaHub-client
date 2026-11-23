"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { SIDEBAR_LINKS } from "@/lib/constants";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

function NavLinks({ role, onNavigate }) {
  const pathname = usePathname();
  const links = SIDEBAR_LINKS[role] || SIDEBAR_LINKS.customer;
  // the most specific matching link is the active one
  const active = [...links].sort((a, b) => b.href.length - a.href.length).find((l) => pathname === l.href || pathname.startsWith(l.href + "/"));

  return (
    <nav className="space-y-1">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            active?.href === l.href ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <l.icon className="size-4" />
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

export default function DashboardShell({ user, children }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await authClient.signOut();
    clearToken();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  const profile = (
    <div className="flex items-center gap-3 border-t p-4">
      <Avatar className="size-10 border">
        <AvatarImage src={user.image || undefined} alt={user.name} />
        <AvatarFallback className="bg-primary/10 font-semibold text-primary">{initials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{user.name}</p>
        <Badge variant="secondary" className="mt-0.5 capitalize">{user.role}</Badge>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-card lg:flex">
        <div className="flex h-16 items-center border-b px-5"><Logo /></div>
        <div className="flex-1 overflow-y-auto p-4"><NavLinks role={user.role} /></div>
        {profile}
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b bg-background/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu"><Menu className="size-5" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex w-72 flex-col p-0">
                <SheetHeader className="border-b p-4"><SheetTitle><Logo /></SheetTitle></SheetHeader>
                <div className="flex-1 overflow-y-auto p-4"><NavLinks role={user.role} onNavigate={() => setOpen(false)} /></div>
                {profile}
              </SheetContent>
            </Sheet>
            <h2 className="hidden text-lg font-bold capitalize sm:block">{user.role} dashboard</h2>
          </div>
          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm"><Link href="/"><Home className="mr-2 size-4" /> Home</Link></Button>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={logout}><LogOut className="mr-2 size-4" /> Logout</Button>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
