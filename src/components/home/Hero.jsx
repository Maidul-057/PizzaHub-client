"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Flame, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/common/Container";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-red-950/40 dark:via-background dark:to-orange-950/30">
      <Container className="grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Hot &amp; Fresh Pizza Delivered to Your Door
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Discover local pizza shops, browse their menus and place an order in a few clicks. Restaurants keep every order organised, you keep every slice warm.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/menu">Explore Pizza Menu</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/signup">Become a vendor</Link>
            </Button>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Flame className="size-4 text-primary" /> Baked to order</li>
            <li className="flex items-center gap-2"><Clock className="size-4 text-primary" /> Pick your delivery date</li>
            <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> Reviewed menus only</li>
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative">
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-red-200/60 to-orange-200/60 blur-2xl dark:from-red-900/30 dark:to-orange-900/30" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80"
            alt="A freshly baked pizza with melted cheese"
            className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl"
          />
        </motion.div>
      </Container>
    </section>
  );
}
