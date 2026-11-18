
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const benefits = [
  { icon: ShieldCheck, label: "Verified Equipment" },
  { icon: Truck, label: "Flexible Delivery" },
  { icon: ShieldCheck, label: "Secure Booking" },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-primary">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -right-40 -top-40 size-[500px] rounded-full bg-brand-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -left-40 size-[450px] rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:px-8 lg:py-24">
        {/* Left: Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 max-w-2xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
            <span className="size-2 rounded-full bg-brand-accent" />
            Your Trusted Equipment Rental Marketplace
          </div>

          <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Rent Smart.
            <span className="mt-2 block text-brand-accent">
              Work Better.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
            Find reliable equipment for construction, photography, events,
            and more. Rent the right equipment for your project, exactly
            when you need it.
          </p>

          {/* Hero Actions */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 gap-2 rounded-xl bg-brand-accent px-7 font-semibold text-primary hover:bg-brand-accent/90"
              render={<Link href="/equipment" />}
              nativeButton={false}
            >
              Explore Equipment
              <ArrowRight className="size-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-white/30 bg-white/5 px-7 font-semibold text-white hover:bg-white/10 hover:text-white"
              render={<Link href="/register" />}
              nativeButton={false}
            >
              List Your Equipment
            </Button>
          </div>

          {/* Benefits */}
          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.label}
                  className="flex items-center gap-2 text-sm text-white/75"
                >
                  <Icon className="size-4 text-brand-accent" />
                  <span>{benefit.label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right: Equipment Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-2xl"
        >
          {/* Main Image */}
          <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-2xl shadow-black/25">
            <Image
              src="/images/hero/equiprent-equipment-photo.png"
              alt="Yellow excavator available for equipment rental"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/65 via-transparent to-transparent" />

            {/* Image Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
              <p className="text-sm font-medium text-white/75">
                Built for your next big project
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                Powerful Equipment.
                <span className="block text-brand-accent">
                  Reliable Rentals.
                </span>
              </h2>
            </div>
          </div>

          {/* Floating Trust Badge */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -left-2 top-6 rounded-2xl border border-border bg-white p-3 shadow-xl sm:-left-6 sm:p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <ShieldCheck className="size-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-primary">
                  Trusted Rentals
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Safe & Reliable
                </p>
              </div>
            </div>
          </motion.div>

          {/* Bottom Floating Badge */}
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-5 right-3 flex items-center gap-3 rounded-2xl border border-border bg-white p-3 shadow-xl sm:right-6 sm:p-4"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Truck className="size-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-primary">
                Ready to Rent
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Find what you need
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
