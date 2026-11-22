
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface EquipmentCardData {
  _id: string;
  name: string;
  category: string;
  rentalPrice: number;
  rentalType: "daily" | "weekly" | "monthly";
  location: string;
  availableQuantity: number;
  image: string;
  status: "available" | "unavailable";
}

interface FeaturedEquipmentCardData {
  id: string;
  name: string;
  category: string;
  location: string;
  price: number;
  rentalUnit: "day" | "hour";
  image: string;
}

interface EquipmentCardProps {
  equipment: EquipmentCardData | FeaturedEquipmentCardData;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const isApiEquipment = "_id" in equipment;

  const equipmentId = isApiEquipment
    ? equipment._id
    : equipment.id;

  const price = isApiEquipment
    ? equipment.rentalPrice
    : equipment.price;

  const rentalUnit = isApiEquipment
    ? equipment.rentalType
    : equipment.rentalUnit;

  const isAvailable = isApiEquipment
    ? equipment.status === "available" &&
      equipment.availableQuantity > 0
    : null;

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {equipment.image ? (
          <Image
            src={equipment.image}
            alt={equipment.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image available
          </div>
        )}

        <span className="absolute left-4 top-4 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
          {equipment.category}
        </span>

        {isApiEquipment && (
          <span
            className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
              isAvailable
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isAvailable ? "Available" : "Unavailable"}
          </span>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          <span className="truncate">{equipment.location}</span>
        </div>

        <h3 className="line-clamp-1 text-lg font-bold text-primary transition-colors group-hover:text-brand-accent">
          {equipment.name}
        </h3>

        <div className="flex items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Rental price</p>
            <p className="text-xl font-bold text-primary">
              ৳{price.toLocaleString("en-BD")}
              <span className="ml-1 text-xs font-medium text-muted-foreground">
                / {rentalUnit}
              </span>
            </p>
          </div>

          <Button
            nativeButton={false}
            render={<Link href={`/equipment/${equipmentId}`} />}
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
