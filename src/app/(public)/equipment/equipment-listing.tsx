
"use client";

import { useEffect, useState } from "react";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";

import {
  EquipmentCard,
  type EquipmentCardData,
} from "@/components/home/featured-equipment/equipment-card";
import { apiRequest } from "@/lib/api";

const categories = [
  "All Categories",
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

interface EquipmentListResponse {
  equipments: EquipmentCardData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

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

  const [equipments, setEquipments] = useState<EquipmentCardData[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchEquipments = async () => {
      const query = new URLSearchParams({
        page: "1",
        limit: "12",
      });

      if (search.trim()) {
        query.set("search", search.trim());
      }

      if (location.trim()) {
        query.set("location", location.trim());
      }

      if (category !== "All Categories") {
        query.set("category", category);
      }

      try {
        const response = await apiRequest<EquipmentListResponse>(
          `/equipment?${query.toString()}`,
        );

        if (!response.data) {
          throw new Error("Equipment data was not returned.");
        }

        if (isMounted) {
          setEquipments(response.data.equipments);
          setTotal(response.data.pagination.total);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setEquipments([]);
          setTotal(0);
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load equipment. Please try again.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchEquipments();

    return () => {
      isMounted = false;
    };
  }, [search, location, category]);

  const clearFilters = () => {
    setIsLoading(true);
    setSearch("");
    setLocation("");
    setCategory("All Categories");
  };

  return (
    <div>
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
                onChange={(event) => {
                  setIsLoading(true);
                  setSearch(event.target.value);
                }}
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
                onChange={(event) => {
                  setIsLoading(true);
                  setLocation(event.target.value);
                }}
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
                onChange={(event) => {
                  setIsLoading(true);
                  setCategory(event.target.value);
                }}
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

      <div className="mt-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-primary">
              Available Equipment
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Showing {equipments.length} of {total} equipment items
            </p>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-primary transition-colors hover:text-brand-accent"
          >
            Clear Filters
          </button>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-border px-6 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Loading equipment...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <h3 className="text-lg font-semibold text-primary">
              Unable to load equipment
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setIsLoading(true)}
              className="mt-4 text-sm font-semibold text-primary hover:text-brand-accent"
            >
              Try again
            </button>
          </div>
        ) : equipments.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {equipments.map((equipment) => (
              <EquipmentCard
                key={equipment._id}
                equipment={equipment}
              />
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
