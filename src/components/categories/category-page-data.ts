import {
  Camera,
  Construction,
  Laptop,
  PartyPopper,
  Sprout,
  Truck,
  type LucideIcon,
} from "lucide-react";

export type EquipmentCategory = {
  name: string;
  slug: string;
  description: string;
  detail: string;
  icon: LucideIcon;
  accent: string;
  iconBackground: string;
};

export const equipmentCategories: EquipmentCategory[] = [
  {
    name: "Construction Equipment",
    slug: "construction-equipment",
    description: "Power your next build with dependable machinery.",
    detail: "Excavators, loaders, power tools and more",
    icon: Construction,
    accent: "from-amber-500/15 via-orange-500/5 to-transparent",
    iconBackground: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    name: "Photography Equipment",
    slug: "photography-equipment",
    description: "Capture every moment with professional gear.",
    detail: "Cameras, lenses, lighting and accessories",
    icon: Camera,
    accent: "from-violet-500/15 via-fuchsia-500/5 to-transparent",
    iconBackground: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    name: "Vehicles & Transportation",
    slug: "vehicles-transportation",
    description: "Find the right transport for work or travel.",
    detail: "Trucks, vans, trailers and utility vehicles",
    icon: Truck,
    accent: "from-sky-500/15 via-cyan-500/5 to-transparent",
    iconBackground: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    name: "Agriculture Equipment",
    slug: "agriculture-equipment",
    description: "Make everyday farming tasks more efficient.",
    detail: "Tractors, harvesters and farming tools",
    icon: Sprout,
    accent: "from-emerald-500/15 via-green-500/5 to-transparent",
    iconBackground: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "Electronics",
    slug: "electronics",
    description: "Get the technology you need, when you need it.",
    detail: "Computers, displays, generators and devices",
    icon: Laptop,
    accent: "from-blue-500/15 via-indigo-500/5 to-transparent",
    iconBackground: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    name: "Event Equipment",
    slug: "event-equipment",
    description: "Bring your events to life with the right setup.",
    detail: "Sound systems, stages, lights and furniture",
    icon: PartyPopper,
    accent: "from-rose-500/15 via-pink-500/5 to-transparent",
    iconBackground: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
];

export function getCategoryEquipmentHref(categoryName: string) {
  return `/equipment?category=${encodeURIComponent(categoryName)}`;
}
