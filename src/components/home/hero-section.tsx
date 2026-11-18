
"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Search, ShieldCheck, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: ShieldCheck,
    label: "Verified Equipment",
  },
  {
    icon: Truck,
    label: "Flexible Delivery",
  },
  {
    icon: ShieldCheck,
    label: "Secure Booking",
  },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-primary">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-40 -top-40 size-[500px] rounded-full bg-brand-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -left-40 size-[450px] rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90">
            <span className="size-2 rounded-full bg-brand-accent" />
            Your trusted equipment rental marketplace
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            The right equipment.
            <span className="mt-2 block text-brand-accent">
              Right when you need it.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
            Find reliable equipment for construction, photography, events and
            more. Rent what you need, when you need it.
          </p>

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-10 rounded-2xl bg-white p-3 shadow-2xl shadow-black/15 sm:p-4"
          >
            <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
              <div className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted">
                <Search className="size-5 shrink-0 text-muted-foreground" />

                <div className="min-w-0 flex-1">
                  <label
                    htmlFor="equipment-search"
                    className="block text-xs font-semibold text-primary"
                  >
                    What do you need?
                  </label>

                  <input
                    id="equipment-search"
                    type="search"
                    placeholder="Search equipment..."
                    className="mt-1 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted sm:border-l sm:border-border">
                <MapPin className="size-5 shrink-0 text-muted-foreground" />

                <div className="min-w-0 flex-1">
                  <label
                    htmlFor="equipment-location"
                    className="block text-xs font-semibold text-primary"
                  >
                    Location
                  </label>

                  <input
                    id="equipment-location"
                    type="text"
                    placeholder="Enter your location"
                    className="mt-1 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <Button
                size="lg"
                className="h-12 gap-2 rounded-xl bg-brand-accent px-6 font-semibold text-primary hover:bg-brand-accent/90"
              >
                Find Equipment
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </motion.div>

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

        {/* Visual Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/20 sm:p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/15 via-transparent to-white/5" />

            <div className="relative flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white/60">
                    EquipRent Marketplace
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                    Everything you need.
                  </h2>
                  <p className="mt-1 text-sm text-white/65">
                    All in one place.
                  </p>
                </div>

                <div className="rounded-xl bg-brand-accent p-3 text-primary">
                  <Truck className="size-6" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-brand-accent/20 text-xl">
                    🏗️
                  </div>
                  <p className="font-semibold text-white">Construction</p>
                  <p className="mt-1 text-xs text-white/60">
                    Tools & machinery
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-brand-accent/20 text-xl">
                    📷
                  </div>
                  <p className="font-semibold text-white">Photography</p>
                  <p className="mt-1 text-xs text-white/60">
                    Cameras & lenses
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-brand-accent/20 text-xl">
                    🎪
                  </div>
                  <p className="font-semibold text-white">Events</p>
                  <p className="mt-1 text-xs text-white/60">
                    Event equipment
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-brand-accent/20 text-xl">
                    🔌
                  </div>
                  <p className="font-semibold text-white">Electronics</p>
                  <p className="mt-1 text-xs text-white/60">
                    Devices & accessories
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Your next project starts here.
                  </p>
                  <p className="mt-1 text-xs text-white/60">
                    Discover equipment with ease.
                  </p>
                </div>

                <ArrowRight className="size-5 shrink-0 text-brand-accent" />
              </div>
            </div>
          </div>

          {/* Floating Badge */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-5 -left-3 rounded-2xl border border-border bg-white p-4 shadow-xl sm:-left-7"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <ShieldCheck className="size-6" />
              </div>

              <div>
                <p className="text-sm font-bold text-primary">
                  Trusted Rentals
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Built around reliability
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
