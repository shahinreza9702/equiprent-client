import type { Metadata } from "next";

import CategoriesPageClient from "@/components/categories/categories-page-client";

export const metadata: Metadata = {
  title: "Equipment Categories",
  description:
    "Explore construction, photography, transportation, agriculture, electronics, and event equipment available on EquipRent.",
};

export default function CategoriesPage() {
  return <CategoriesPageClient />;
}
