
"use client";

import { motion } from "framer-motion";
import { BenefitCard } from "./benefit-card";
import { benefitData } from "./benefit-data";

export function WhyChooseUsSection() {
  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="mb-3 inline-block text-sm font-bold uppercase tracking-[0.18em] text-brand-accent">
            The EquipRent Advantage
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Why Choose EquipRent?
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            We make equipment rental simpler, more convenient, and
            more reliable for everyone.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefitData.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
            >
              <BenefitCard benefit={benefit} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
