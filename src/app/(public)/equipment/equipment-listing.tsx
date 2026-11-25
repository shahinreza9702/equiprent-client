
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

const PAGE_LIMIT = 12;

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

// Suspense boundary for useSearchParams
export function EquipmentListing(props: EquipmentListingProps) {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-border px-6 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Loading equipment...
          </p>
        </div>
      }
    >
      <EquipmentListingContent {...props} />
    </Suspense>
  );
}

function EquipmentListingContent({
  initialSearch = "",
  initialLocation = "",
}: EquipmentListingProps) {
  const searchParams = useSearchParams();

  // Read category from URL without setting state inside an effect
  const [category, setCategory] = useState(() => {
    const requestedCategory = searchParams.get("category");

    return requestedCategory && categories.includes(requestedCategory)
      ? requestedCategory
      : "All Categories";
  });

  // Search and filter states
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const [rentalType, setRentalType] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");

  // Equipment and pagination states
  const [equipments, setEquipments] = useState<EquipmentCardData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Request states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  // Fetch equipment whenever filters or pagination change
  useEffect(() => {
    let isMounted = true;

    const fetchEquipments = async () => {
      const query = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_LIMIT),
        sort,
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

      if (rentalType !== "all") {
        query.set("rentalType", rentalType);
      }

      if (minPrice.trim()) {
        query.set("minPrice", minPrice);
      }

      if (maxPrice.trim()) {
        query.set("maxPrice", maxPrice);
      }

      try {
        const response = await apiRequest<EquipmentListResponse>(
          `/equipments?${query.toString()}`
        );

        if (!response.data) {
          throw new Error("Equipment data was not returned.");
        }

        if (isMounted) {
          setEquipments(response.data.equipments);
          setTotal(response.data.pagination.total);
          setTotalPages(response.data.pagination.totalPages);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setEquipments([]);
          setTotal(0);
          setTotalPages(1);

          setError(
            err instanceof Error
              ? err.message
              : "Unable to load equipment. Please try again."
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
  }, [
    search,
    location,
    category,
    rentalType,
    minPrice,
    maxPrice,
    sort,
    page,
    retry,
  ]);

  // Reset pagination when filters change
  const resetPage = () => {
    setPage(1);
    setIsLoading(true);
  };

  // Clear all filters
  const clearFilters = () => {
    resetPage();
    setSearch("");
    setLocation("");
    setCategory("All Categories");
    setRentalType("all");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
  };

  // Retry failed request
  const handleRetry = () => {
    setIsLoading(true);
    setRetry((value) => value + 1);
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    if (page > 1) {
      setIsLoading(true);
      setPage((currentPage) => currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setIsLoading(true);
      setPage((currentPage) => currentPage + 1);
    }
  };

  return (
    <div>
      {/* Search and filters */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Equipment search */}
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
                  resetPage();
                  setSearch(event.target.value);
                }}
                placeholder="Search equipment..."
                className="h-11 w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          {/* Location filter */}
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
                  resetPage();
                  setLocation(event.target.value);
                }}
                placeholder="Enter location..."
                className="h-11 w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          {/* Category filter */}
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
                  resetPage();
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

        {/* Additional filters */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Rental type */}
          <div>
            <label
              htmlFor="equipment-rental-type"
              className="mb-2 block text-sm font-semibold text-primary"
            >
              Rental Type
            </label>

            <select
              id="equipment-rental-type"
              value={rentalType}
              onChange={(event) => {
                resetPage();
                setRentalType(event.target.value);
              }}
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Rental Types</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Minimum price */}
          <div>
            <label
              htmlFor="equipment-min-price"
              className="mb-2 block text-sm font-semibold text-primary"
            >
              Minimum Price
            </label>

            <input
              id="equipment-min-price"
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) => {
                resetPage();
                setMinPrice(event.target.value);
              }}
              placeholder="Minimum price"
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Maximum price */}
          <div>
            <label
              htmlFor="equipment-max-price"
              className="mb-2 block text-sm font-semibold text-primary"
            >
              Maximum Price
            </label>

            <input
              id="equipment-max-price"
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => {
                resetPage();
                setMaxPrice(event.target.value);
              }}
              placeholder="Maximum price"
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Sorting */}
          <div>
            <label
              htmlFor="equipment-sort"
              className="mb-2 block text-sm font-semibold text-primary"
            >
              Sort By
            </label>

            <select
              id="equipment-sort"
              value={sort}
              onChange={(event) => {
                resetPage();
                setSort(event.target.value);
              }}
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Equipment listing */}
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
              onClick={handleRetry}
              className="mt-4 text-sm font-semibold text-primary hover:text-brand-accent"
            >
              Try again
            </button>
          </div>
        ) : equipments.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {equipments.map((equipment) => (
                <EquipmentCard
                  key={equipment._id}
                  equipment={equipment}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePreviousPage}
                    disabled={page <= 1 || isLoading}
                    className="rounded-xl border border-input px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <span className="text-sm font-medium text-primary">
                    {page} / {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={page >= totalPages || isLoading}
                    className="rounded-xl border border-input px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
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
