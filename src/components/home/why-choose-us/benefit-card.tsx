
import type { benefitData } from "./benefit-data";

type Benefit = (typeof benefitData)[number];

interface BenefitCardProps {
  benefit: Benefit;
}

export function BenefitCard({ benefit }: BenefitCardProps) {
  const Icon = benefit.icon;

  return (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-accent/50 hover:shadow-xl sm:p-8">
      {/* Decorative Background */}
      <div className="absolute -right-12 -top-12 size-36 rounded-full bg-brand-accent/5 transition-transform duration-500 group-hover:scale-150" />

      {/* Icon */}
      <div className="relative mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/5 text-primary transition-all duration-300 group-hover:bg-brand-accent group-hover:text-primary">
        <Icon className="size-7" strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div className="relative">
        <h3 className="text-lg font-bold text-primary transition-colors group-hover:text-brand-accent sm:text-xl">
          {benefit.title}
        </h3>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {benefit.description}
        </p>
      </div>
    </article>
  );
}
