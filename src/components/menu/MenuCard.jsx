import Link from "next/link";
import { Crown, MapPin, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";

// All cards share the same height: fixed image ratio, clamped text, button pinned to the bottom
export default function MenuCard({ item }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden p-0 transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.images?.[0]}
          alt={item.itemName}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {item.vendor?.isPremium && (
          <Badge className="absolute left-3 top-3 gap-1 bg-amber-500 text-white hover:bg-amber-500">
            <Crown className="size-3" /> Premium
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-bold">{item.itemName}</h3>
          <span className="shrink-0 text-lg font-extrabold text-primary">{formatPrice(item.price)}</span>
        </div>
        <Badge variant="secondary" className="w-fit">{item.category}</Badge>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-2"><MapPin className="size-4 shrink-0 text-primary" /><span className="line-clamp-1">{item.location}</span></p>
          <p className="flex items-center gap-2"><Store className="size-4 shrink-0 text-primary" /><span className="line-clamp-1">{item.vendor?.businessName || "Local shop"}</span></p>
        </div>
        <Button asChild className="mt-auto w-full">
          <Link href={`/menu/${item.id}`}>View Details</Link>
        </Button>
      </div>
    </Card>
  );
}
