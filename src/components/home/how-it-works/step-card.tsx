
import type { LucideIcon } from "lucide-react";

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export function StepCard({
  number,
  title,
  description,
  icon: Icon,
}: StepCardProps) {
  return (
    <article className="group relative h-full rounded-2xl border border-border bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-brand-accent/50 hover:shadow-xl hover:shadow-primary/5 sm:p-8">
      {/* Step Number */}
      <div className="absolute right-7 top-7 text-4xl font-bold tracking-tight text-primary/5 transition-colors duration-300 group-hover:text-brand-accent/20">
        {number}
      </div>

      {/* Icon */}
      <div className="relative mb-7 flex size-16 items-center justify-center rounded-2xl bg-primary/5 text-primary transition-all duration-300 group-hover:bg-brand-accent group-hover:text-primary">
        <Icon className="size-7" strokeWidth={1.8} />
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-primary">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        {description}
      </p>

      {/* Bottom Accent */}
      <div className="mt-7 h-1 w-12 rounded-full bg-brand-accent transition-all duration-300 group-hover:w-20" />
    </article>
  );
}
