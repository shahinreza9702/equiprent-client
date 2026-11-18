
import { Quote, Star } from "lucide-react";

import type { CustomerReview } from "./review-data";

interface ReviewCardProps {
  review: CustomerReview;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-accent/50 hover:shadow-xl hover:shadow-primary/5 sm:p-7">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              className={`size-4 ${
                index < review.rating
                  ? "fill-brand-accent text-brand-accent"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <Quote className="size-8 text-brand-accent/30 transition-colors group-hover:text-brand-accent/60" />
      </div>

      <p className="flex-1 text-sm leading-7 text-muted-foreground">
        “{review.comment}”
      </p>

      <div className="mt-7 flex items-center gap-3 border-t border-border pt-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
          {review.initials}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-primary">
            {review.name}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {review.role}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/80">
            {review.location}
          </p>
        </div>
      </div>
    </article>
  );
}
