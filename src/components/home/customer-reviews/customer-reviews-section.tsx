
"use client";

import { motion } from "framer-motion";
import { MessageSquareQuote } from "lucide-react";

import { ReviewCard } from "./review-card";
import { reviewData } from "./review-data";

export function CustomerReviewsSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-24">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 size-80 rounded-full bg-brand-accent/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-accent/20 bg-brand-accent/10 px-4 py-2 text-sm font-semibold text-primary">
            <MessageSquareQuote className="size-4 text-brand-accent" />
            Customer Testimonials
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
            What Our Customers
            <span className="text-brand-accent"> Say About Us</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
            Discover how EquipRent helps people find the right equipment
            and make their projects easier.
          </p>
        </motion.div>

        {/* Review Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reviewData.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.5,
                delay: index * 0.12,
                ease: "easeOut",
              }}
            >
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
