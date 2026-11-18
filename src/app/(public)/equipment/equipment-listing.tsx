
"use client";

import { useState } from "react";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";

import { EquipmentCard } from "@/components/home/featured-equipment/equipment-card";
import { equipmentData } from "@/components/home/featured-equipment/equipment-data";

const categories = [
  "All Categories",
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

interface EquipmentListingProps {
  initialSearch?: string;
  initialLocation?: string;
}

export function EquipmentListing({
  initialSearch = "",
  initialLocation = "",
}: EquipmentListingProps) {
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState("All Categories");

  const filteredEquipment = equipmentData.filter((equipment) => {
    const matchesSearch =
      equipment.name.toLowerCase().includes(search.toLowerCase()) ||
      equipment.category.toLowerCase().includes(search.toLowerCase());

    const matchesLocation = equipment.location
      .toLowerCase()
      .includes(location.toLowerCase());

    const matchesCategory =
      category === "All Categories" || equipment.category === category;

    return matchesSearch && matchesLocation && matchesCategory;
  });

  return (
    <div>
      {/* Search and Filter */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="equipment-search"
              className="mb-2 block text-sm font-semibold text-primary"
            >
              Equipment Name
            </label>

            <div className="flex items-center gap-2 rounded-xl border border-input px-3">
              <Search className="size-4 shrink-0 text-muted-foreground" />

              <input
                id="equipment-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search equipment..."
                className="h-11 w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="equipment-location"
              className="mb-2 block text-sm font-semibold text-primary"
            >
              Location
            </label>

            <div className="flex items-center gap-2 rounded-xl border border-input px-3">
              <MapPin className="size-4 shrink-0 text-muted-foreground" />

              <input
                id="equipment-location"
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Enter location..."
                className="h-11 w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="equipment-category"
              className="mb-2 block text-sm font-semibold text-primary"
            >
              Category
            </label>

            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <select
                id="equipment-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-input bg-background pl-10 pr-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-primary">
              Available Equipment
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Showing {filteredEquipment.length} of {equipmentData.length} equipment items
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setLocation("");
              setCategory("All Categories");
            }}
            className="text-sm font-semibold text-primary transition-colors hover:text-brand-accent"
          >
            Clear Filters
          </button>
        </div>

        {filteredEquipment.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEquipment.map((equipment) => (
              <EquipmentCard key={equipment.id} equipment={equipment} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <Search className="mx-auto size-10 text-muted-foreground/50" />

            <h3 className="mt-4 text-lg font-semibold text-primary">
              No equipment found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Try changing your search terms or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
