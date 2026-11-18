
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { categoryData } from "./category-data";

type Category = (typeof categoryData)[number];

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <Link
      href={category.href}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-accent/50 hover:shadow-xl"
    >
      {/* Decorative Background */}
      <div className="absolute -right-10 -top-10 size-32 rounded-full bg-brand-accent/5 transition-transform duration-500 group-hover:scale-150" />

      {/* Category Icon */}
      <div className="relative mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/5 text-primary transition-colors duration-300 group-hover:bg-brand-accent group-hover:text-primary">
        <Icon className="size-7" strokeWidth={1.8} />
      </div>

      {/* Category Information */}
      <div className="relative flex flex-1 flex-col">
        <h3 className="text-lg font-bold text-primary transition-colors group-hover:text-brand-accent">
          {category.name}
        </h3>

        <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
          {category.description}
        </p>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm font-semibold text-primary">
            {category.equipmentCount} Items
          </span>

          <span className="flex size-9 items-center justify-center rounded-full bg-muted text-primary transition-all duration-300 group-hover:bg-brand-accent group-hover:translate-x-1">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
