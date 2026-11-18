
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, ArrowUpRight } from "lucide-react";

import type { Equipment } from "./equipment-data";
import { Button } from "@/components/ui/button";

interface EquipmentCardProps {
  equipment: Equipment;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Equipment Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={equipment.image}
          alt={equipment.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <span className="absolute left-4 top-4 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
          {equipment.category}
        </span>

        {equipment.featured && (
          <span className="absolute right-4 top-4 rounded-full bg-brand-accent px-3 py-1 text-xs font-semibold text-primary">
            Featured
          </span>
        )}
      </div>

      {/* Equipment Information */}
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">{equipment.location}</span>
          </div>

          <div className="flex shrink-0 items-center gap-1 text-sm font-semibold">
            <Star className="size-4 fill-brand-accent text-brand-accent" />
            {equipment.rating.toFixed(1)}
          </div>
        </div>

        <h3 className="line-clamp-1 text-lg font-bold text-primary transition-colors group-hover:text-brand-accent">
          {equipment.name}
        </h3>

        <div className="flex items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Rental price</p>
            <p className="text-xl font-bold text-primary">
              ৳{equipment.price.toLocaleString("en-BD")}
              <span className="ml-1 text-xs font-medium text-muted-foreground">
                / {equipment.rentalUnit}
              </span>
            </p>
          </div>

          <Button
            nativeButton={false}
            render={<Link href={`/equipment/${equipment.id}`} />}
            size="sm"
            className="gap-1.5"
          >
            View Details
            <ArrowUpRight className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
