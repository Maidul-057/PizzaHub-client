"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/common/Logo";
import Container from "@/components/common/Container";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import { authClient } from "@/lib/auth-client";
import { NAV_ROLE_LINKS, dashboardPath } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Navbar() {
  // useSession is reactive: the navbar updates immediately after sign in / sign out
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Browse Menu" },
    ...(user ? [{ href: dashboardPath(user.role), label: "Dashboard" }, ...(NAV_ROLE_LINKS[user.role] || [])] : []),
  ];

  const linkClass = (href) =>
    cn(
      "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
      pathname === href ? "text-primary" : "text-foreground/80"
    );

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isPending ? (
            <div className="size-9 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="outline">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </Container>

      {open && (
        <div className="border-t bg-background md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={linkClass(l.href)}>
                {l.label}
              </Link>
            ))}
            {!user && !isPending && (
              <div className="mt-2 flex gap-2">
                <Button asChild variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button asChild className="flex-1" onClick={() => setOpen(false)}>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}
