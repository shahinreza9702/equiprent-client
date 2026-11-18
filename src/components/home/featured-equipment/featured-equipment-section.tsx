
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EquipmentCard } from "./equipment-card";
import { equipmentData } from "./equipment-data";

export function FeaturedEquipmentSection() {
  const featuredEquipment = equipmentData
    .filter((equipment) => equipment.featured)
    .slice(0, 6);

  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        >
          <div className="max-w-2xl">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-[0.18em] text-brand-accent">
              Featured Collection
            </span>

            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Explore Our Featured Equipment
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Discover quality equipment for your next project.
              Find the right tools and machinery at flexible rental prices.
            </p>
          </div>

          <Button
            nativeButton={false}
            render={<Link href="/equipment" />}
            variant="outline"
            className="w-fit gap-2"
          >
            Explore All Equipment
            <ArrowRight className="size-4" />
          </Button>
        </motion.div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredEquipment.map((equipment, index) => (
            <motion.div
              key={equipment.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
            >
              <EquipmentCard equipment={equipment} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
