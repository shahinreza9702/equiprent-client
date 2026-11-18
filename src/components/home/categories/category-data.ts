
import {
  HardHat,
  Camera,
  Truck,
  Tractor,
  Cpu,
  PartyPopper,
} from "lucide-react";

export const categoryData = [
  {
    id: "construction",
    name: "Construction Equipment",
    description: "Power your projects with reliable construction machinery.",
    equipmentCount: "120+",
    icon: HardHat,
    href: "/equipment?category=construction",
  },
  {
    id: "photography",
    name: "Photography Equipment",
    description: "Capture every moment with professional photography gear.",
    equipmentCount: "85+",
    icon: Camera,
    href: "/equipment?category=photography",
  },
  {
    id: "vehicles",
    name: "Vehicles & Transportation",
    description: "Find the right vehicle for every transportation need.",
    equipmentCount: "95+",
    icon: Truck,
    href: "/equipment?category=vehicles",
  },
  {
    id: "agriculture",
    name: "Agriculture Equipment",
    description: "Make farming easier with dependable agricultural tools.",
    equipmentCount: "65+",
    icon: Tractor,
    href: "/equipment?category=agriculture",
  },
  {
    id: "electronics",
    name: "Electronics",
    description: "Rent modern electronics for work and everyday needs.",
    equipmentCount: "110+",
    icon: Cpu,
    href: "/equipment?category=electronics",
  },
  {
    id: "events",
    name: "Event Equipment",
    description: "Make your events memorable with professional equipment.",
    equipmentCount: "75+",
    icon: PartyPopper,
    href: "/equipment?category=events",
  },
] as const;
