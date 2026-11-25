"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Boxes, Search, ShieldCheck, Sparkles } from "lucide-react";

import {
  equipmentCategories,
  getCategoryEquipmentHref,
} from "./category-page-data";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

export default function CategoriesPageClient() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative isolate overflow-hidden border-b border-border/70">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="pointer-events-none absolute -right-24 -top-32 -z-10 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Explore EquipRent
            </div>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Find equipment for{" "}
              <span className="bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent">
                every kind of work.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Browse equipment by category and discover the tools, machines,
              and resources you need for your next project—all in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/equipment"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Browse all equipment
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#category-list"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-accent"
              >
                Explore categories
                <Boxes className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="relative mx-auto w-full max-w-lg"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/15 via-sky-500/10 to-emerald-500/10 blur-2xl" />
            <div className="relative rounded-[1.75rem] border border-border/80 bg-card/90 p-5 shadow-2xl shadow-black/5 backdrop-blur sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Your next project starts here
                  </p>
                  <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                    One place. More possibilities.
                  </p>
                </div>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Search className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3">
                {equipmentCategories.slice(0, 4).map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <div
                      key={category.slug}
                      className={`rounded-2xl border border-border/70 bg-gradient-to-br ${category.accent} p-4`}
                    >
                      <div className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl ${category.iconBackground}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {category.name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {index === 0
                          ? "Build with confidence"
                          : index === 1
                            ? "Create something great"
                            : index === 2
                              ? "Move what matters"
                              : "Grow more efficiently"}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-muted/70 p-4">
                <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    A simpler way to rent
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Explore options that fit your project.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="category-list"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Browse by category
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Explore equipment categories
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
              Choose a category to see available equipment and find the right
              fit for your requirements.
            </p>
          </div>
          <Link
            href="/equipment"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
          >
            View all equipment
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {equipmentCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.article
                key={category.slug}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/5"
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${category.accent} opacity-80`}
                />
                <div className="relative flex h-full flex-col p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${category.iconBackground} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="h-7 w-7" strokeWidth={1.8} />
                    </div>
                    <span className="rounded-full border border-border/80 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                      Category {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-bold tracking-tight text-foreground">
                    {category.name}
                  </h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
                    {category.description}
                  </p>
                  <p className="mt-4 text-xs font-medium text-muted-foreground">
                    {category.detail}
                  </p>

                  <Link
                    href={getCategoryEquipmentHref(category.name)}
                    className="mt-7 inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-background/80 px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
                    aria-label={`Explore ${category.name}`}
                  >
                    Explore category
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </section>
    </main>
  );
}
