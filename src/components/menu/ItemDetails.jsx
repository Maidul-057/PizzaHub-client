"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Crown, MapPin, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Container from "@/components/common/Container";
import ErrorState from "@/components/common/ErrorState";
import PageLoader from "@/components/common/PageLoader";
import OrderDialog from "./OrderDialog";
import { useFetch } from "@/hooks/use-fetch";
import { formatPrice } from "@/lib/format";

export default function ItemDetails({ id, user }) {
  const { data: item, loading, error } = useFetch(`/menu/${id}`);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  if (loading) return <PageLoader label="Loading item..." />;

  if (error) {
    return (
      <Container className="py-16">
        <ErrorState message={error} />
        <div className="mt-6 text-center">
          <Button asChild variant="outline"><Link href="/menu">Back to menu</Link></Button>
        </div>
      </Container>
    );
  }

  const isOwner = user.role === "vendor" && item.vendorId === user.id;
  let orderBlock;
  if (user.role === "customer") {
    orderBlock = <Button size="lg" className="w-full sm:w-auto" onClick={() => setOpen(true)}>Order this item</Button>;
  } else {
    orderBlock = (
      <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
        {isOwner ? "This is your own item, so you cannot order it." : user.role === "admin" ? "Admins cannot place customer orders." : "Only customer accounts can place orders."}
      </p>
    );
  }

  return (
    <Container className="py-10">
      <Button asChild variant="ghost" className="mb-6 -ml-3">
        <Link href="/menu"><ArrowLeft className="mr-2 size-4" /> Back to menu</Link>
      </Button>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.images[active]} alt={item.itemName} className="size-full object-cover" />
          </div>
          {item.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {item.images.map((img, i) => (
                <button key={img} onClick={() => setActive(i)} aria-label={`Show image ${i + 1}`}
                  className={`size-20 shrink-0 overflow-hidden rounded-lg border-2 ${i === active ? "border-primary" : "border-transparent"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Badge variant="secondary">{item.category}</Badge>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{item.itemName}</h1>
            <p className="text-3xl font-extrabold text-primary">{formatPrice(item.price)}</p>
          </div>

          <p className="leading-relaxed text-muted-foreground">{item.description}</p>

          <div className="space-y-3 rounded-xl border bg-card p-4 text-sm">
            <p className="flex items-center gap-2"><MapPin className="size-4 text-primary" /> {item.location}</p>
            <p className="flex items-center gap-2">
              <Store className="size-4 text-primary" /> {item.vendor?.businessName}
              {item.vendor?.isPremium && (
                <Badge className="ml-1 gap-1 bg-amber-500 text-white hover:bg-amber-500"><Crown className="size-3" /> Premium</Badge>
              )}
            </p>
          </div>

          {orderBlock}
        </div>
      </div>

      {user.role === "customer" && <OrderDialog item={item} open={open} onOpenChange={setOpen} />}
    </Container>
  );
}
