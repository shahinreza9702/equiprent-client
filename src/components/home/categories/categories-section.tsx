
"use client";

import { motion } from "framer-motion";

import { CategoryCard } from "./category-card";
import { categoryData } from "./category-data";

export function CategoriesSection() {
  return (
    <section className="bg-muted/40 py-20 sm:py-24">
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
            Browse Categories
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Find Equipment for Every Need
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            From construction machinery to event essentials, explore
            equipment across a wide range of categories.
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoryData.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
