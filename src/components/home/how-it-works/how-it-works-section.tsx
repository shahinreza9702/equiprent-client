
"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { stepData } from "./step-data";
import { StepCard } from "./step-card";

export function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden bg-muted/40 py-20 sm:py-24">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-40 top-10 size-80 rounded-full bg-brand-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-accent/20 bg-brand-accent/10 px-4 py-2 text-sm font-semibold text-primary">
            <span className="size-2 rounded-full bg-brand-accent" />
            Simple & Convenient
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            How <span className="text-brand-accent">EquipRent</span> Works
          </h2>

          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
            Renting equipment has never been easier. Follow three simple
            steps to find and rent what you need.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative grid gap-6 md:grid-cols-3">
          {/* Connecting Line - Desktop */}
          <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-14 hidden border-t-2 border-dashed border-brand-accent/30 md:block" />

          {stepData.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: "easeOut",
              }}
              className="relative z-10"
            >
              <StepCard
                number={step.number}
                title={step.title}
                description={step.description}
                icon={step.icon}
              />

              {index < stepData.length - 1 && (
                <div className="absolute -bottom-5 left-1/2 z-20 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-white text-brand-accent shadow-sm md:-right-5 md:left-auto md:top-10 md:translate-x-0">
                  <ArrowRight className="size-4 rotate-90 md:rotate-0" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
