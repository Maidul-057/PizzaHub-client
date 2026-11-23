"use client";
import { motion } from "framer-motion";
import { CalendarCheck, Crown, Store, Wallet } from "lucide-react";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";

const reasons = [
  { icon: Store, title: "Local shops, one place", text: "Browse menus from pizza shops near you instead of juggling many apps." },
  { icon: CalendarCheck, title: "Order for the day you want", text: "Choose a delivery date and leave instructions the kitchen can follow." },
  { icon: Crown, title: "Premium vendors stand out", text: "Shops on the Premium plan get a badge and a featured spot on this page." },
  { icon: Wallet, title: "Simple for restaurants", text: "Publish items, accept or reject orders and track everything in one dashboard." },
];

export default function WhyChoose() {
  return (
    <section className="py-16">
      <Container>
        <SectionHeading title="Why Choose PizzaHub?" subtitle="Built for hungry customers and busy kitchens." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <motion.div key={r.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-xl border bg-card p-6">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <r.icon className="size-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold">{r.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{r.text}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
