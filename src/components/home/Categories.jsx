"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { CATEGORIES } from "@/lib/constants";

export default function Categories() {
  return (
    <section className="bg-secondary/50 py-16">
      <Container>
        <SectionHeading title="Pizza Categories" subtitle="Start with what you are craving." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
              <Link
                href={`/menu?category=${encodeURIComponent(c.name)}`}
                className="flex h-full items-center gap-4 rounded-xl border bg-card p-5 transition hover:border-primary hover:shadow-md"
              >
                <span className="text-4xl" aria-hidden="true">{c.emoji}</span>
                <span>
                  <span className="block text-lg font-bold">{c.name}</span>
                  <span className="block text-sm text-muted-foreground">{c.blurb}</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
