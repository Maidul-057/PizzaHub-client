"use client";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";

const steps = [
  { title: "Find your pizza", text: "Search by name, category or area and open any item for photos and details." },
  { title: "Place the order", text: "Pick a delivery date, add your address and any special instructions." },
  { title: "Track the status", text: "The restaurant accepts or rejects your order. Follow it from your dashboard." },
];

export default function HowItWorks() {
  return (
    <section className="bg-secondary/50 py-16">
      <Container>
        <SectionHeading title="How PizzaHub Works" subtitle="From craving to doorstep in three steps." />
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.li key={s.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-xl border bg-card p-6">
              <span className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">{i + 1}</span>
              <h3 className="mb-2 text-lg font-bold">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </motion.li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
