
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PackagePlus, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="relative isolate overflow-hidden bg-primary py-20 sm:py-24">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-40 -top-40 size-[450px] rounded-full bg-brand-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-40 size-[500px] rounded-full bg-white/5 blur-3xl" />

      {/* Decorative Shapes */}
      <div className="pointer-events-none absolute right-[12%] top-10 hidden size-32 rounded-full border border-white/10 lg:block" />
      <div className="pointer-events-none absolute bottom-10 left-[10%] hidden size-20 rounded-full border border-brand-accent/20 lg:block" />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-accent/30 bg-brand-accent/10 px-4 py-2 text-sm font-semibold text-brand-accent">
            <Sparkles className="size-4" />
            Make Your Next Project Easier
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to Find Your
            <span className="block text-brand-accent">
              Perfect Equipment?
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            Discover quality equipment, connect with trusted owners, and
            get everything you need to bring your next project to life.
          </p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="h-13 w-full gap-2 rounded-xl bg-brand-accent px-7 font-semibold text-primary shadow-lg shadow-black/10 transition-all hover:-translate-y-1 hover:bg-brand-accent/90 sm:w-auto"
              render={<Link href="/equipment" />}
              nativeButton={false}
            >
              <Search className="size-4" />
              Explore Equipment
              <ArrowRight className="size-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-13 w-full gap-2 rounded-xl border-white/25 bg-white/5 px-7 font-semibold text-white transition-all hover:-translate-y-1 hover:border-white/40 hover:bg-white/10 hover:text-white sm:w-auto"
              render={<Link href="/register" />}
              nativeButton={false}
            >
              <PackagePlus className="size-4" />
              List Your Equipment
            </Button>
          </motion.div>

          {/* Supporting Text */}
          <p className="mt-7 text-sm text-white/50">
            Find what you need. Rent with confidence. Get things done.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
