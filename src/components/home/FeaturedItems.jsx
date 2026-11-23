"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import MenuGrid, { MenuGridSkeleton } from "@/components/menu/MenuGrid";
import { useFetch } from "@/hooks/use-fetch";

export default function FeaturedItems() {
  const { data, loading, error, reload } = useFetch("/menu/featured");

  return (
    <section className="py-16">
      <Container>
        <SectionHeading title="Featured Menu Items" subtitle="Fresh picks from approved restaurants, with Premium shops in the spotlight." />
        {loading ? (
          <MenuGridSkeleton count={8} />
        ) : error ? (
          <ErrorState message="We could not load the featured items right now." onRetry={reload} />
        ) : data.items.length === 0 ? (
          <EmptyState title="No featured items yet" description="Restaurants are adding their menus. Check back soon." />
        ) : (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5 }}>
            <MenuGrid items={data.items} />
          </motion.div>
        )}
        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg"><Link href="/menu">See the full menu</Link></Button>
        </div>
      </Container>
    </section>
  );
}
