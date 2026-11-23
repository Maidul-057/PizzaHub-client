import Link from "next/link";
import { Pizza } from "lucide-react";

export default function Logo({ href = "/" }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-primary">
      <Pizza className="size-7" />
      PizzaHub
    </Link>
  );
}
