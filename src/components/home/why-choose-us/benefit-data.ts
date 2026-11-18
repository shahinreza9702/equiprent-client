
import {
  Wallet,
  ShieldCheck,
  CalendarCheck,
  LockKeyhole,
} from "lucide-react";

export const benefitData = [
  {
    id: "affordable-pricing",
    title: "Affordable Pricing",
    description:
      "Access quality equipment at competitive rental prices without stretching your budget.",
    icon: Wallet,
  },
  {
    id: "verified-owners",
    title: "Verified Equipment Owners",
    description:
      "Connect with trusted equipment owners and make confident rental decisions.",
    icon: ShieldCheck,
  },
  {
    id: "flexible-rentals",
    title: "Flexible Rental Periods",
    description:
      "Choose rental durations that fit your project timeline and requirements.",
    icon: CalendarCheck,
  },
  {
    id: "secure-payments",
    title: "Secure Payments",
    description:
      "Enjoy a reliable payment experience throughout your equipment rental journey.",
    icon: LockKeyhole,
  },
] as const;
