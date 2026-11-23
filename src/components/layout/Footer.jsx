import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import Container from "@/components/common/Container";
import Logo from "@/components/common/Logo";

const social = [
  {
    label: "X",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t bg-card">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm leading-relaxed text-muted-foreground">
            PizzaHub connects hungry customers with local pizza shops. Browse menus, order in a few clicks and get it hot and fresh.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Quick links</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li><Link href="/menu" className="hover:text-primary">Browse Menu</Link></li>
            <li><Link href="/signin" className="hover:text-primary">Sign In</Link></li>
            <li><Link href="/signup" className="hover:text-primary">Sign Up</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Contact</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Mail className="size-4 text-primary" /> support@pizzahub.com</li>
            <li className="flex items-center gap-2"><Phone className="size-4 text-primary" /> +880 1700-000000</li>
            <li className="flex items-center gap-2"><MapPin className="size-4 text-primary" /> Sylhet, Bangladesh</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Follow us</h3>
          <div className="flex gap-3">
            {social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="flex size-9 items-center justify-center rounded-full border text-muted-foreground transition hover:border-primary hover:text-primary"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </Container>
      <div className="border-t py-5 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} PizzaHub. All rights reserved.
      </div>
    </footer>
  );
}
