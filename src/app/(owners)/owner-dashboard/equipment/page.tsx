
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  MapPin,
  Package,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";

type ApprovalStatus = "approved" | "pending" | "rejected";
type RentalType = "daily" | "weekly" | "monthly";
type AvailabilityStatus = "available" | "unavailable";

interface EquipmentApiItem {
  _id: string;
  name: string;
  category: string;
  location: string;
  rentalPrice: number;
  rentalType: RentalType;
  availableQuantity: number;
  condition: string;
  brand: string;
  model: string;
  image: string;
  rentalTerms: string;
  status: AvailabilityStatus;
  approvalStatus: ApprovalStatus;
  createdAt?: string;
}

interface EquipmentApiResponse {
  equipments: EquipmentApiItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface OwnerEquipment {
  id: string;
  name: string;
  category: string;
  location: string;
  price: number;
  rentalType: RentalType;
  approvalStatus: ApprovalStatus;
  availabilityStatus: AvailabilityStatus;
  availableQuantity: number;
  condition: string;
  brand: string;
  model: string;
  rentalTerms: string;
  addedDate: string;
  image: string;
}

const statusLabels: Record<ApprovalStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
};

const statusStyles: Record<ApprovalStatus, string> = {
  approved: "bg-green-50 text-green-700 ring-green-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  rejected: "bg-red-50 text-red-700 ring-red-600/20",
};

const rentalLabels: Record<RentalType, string> = {
  daily: "per day",
  weekly: "per week",
  monthly: "per month",
};

const formatDate = (date?: string) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const mapEquipment = (item: EquipmentApiItem): OwnerEquipment => ({
  id: item._id,
  name: item.name,
  category: item.category,
  location: item.location,
  price: item.rentalPrice,
  rentalType: item.rentalType,
  approvalStatus: item.approvalStatus,
  availabilityStatus: item.status,
  availableQuantity: item.availableQuantity,
  condition: item.condition,
  brand: item.brand,
  model: item.model,
  rentalTerms: item.rentalTerms,
  addedDate: formatDate(item.createdAt),
  image: item.image,
});

export default function OwnerEquipmentPage() {
  const [equipmentData, setEquipmentData] = useState<OwnerEquipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedEquipment, setSelectedEquipment] =
    useState<OwnerEquipment | null>(null);

  // Fetch owner equipment
  const fetchEquipments = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response =
        await apiRequest<EquipmentApiResponse>(
          "/equipments/owner/my-equipment",
        );

      const equipments = response.data?.equipments ?? [];

      setEquipmentData(equipments.map(mapEquipment));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load your equipment.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);


  // Initial API request
  // Initial API request
  useEffect(() => {
    void Promise.resolve().then(() => fetchEquipments());
  }, [fetchEquipments]);

  // Dynamic categories
  const categories = useMemo(
    () => [...new Set(equipmentData.map((item) => item.category))].sort(),
    [equipmentData],
  );

  // Search and filters
  const filteredEquipment = useMemo(() => {
    return equipmentData.filter((equipment) => {
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        equipment.name.toLowerCase().includes(query) ||
        equipment.id.toLowerCase().includes(query);

      const matchesStatus =
        selectedStatus === "All" ||
        equipment.approvalStatus === selectedStatus;

      const matchesCategory =
        selectedCategory === "All" ||
        equipment.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [equipmentData, searchQuery, selectedStatus, selectedCategory]);

  // Dashboard statistics
  const stats = [
    {
      label: "Total Equipment",
      value: equipmentData.length,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Approved",
      value: equipmentData.filter(
        (item) => item.approvalStatus === "approved",
      ).length,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Pending Review",
      value: equipmentData.filter(
        (item) => item.approvalStatus === "pending",
      ).length,
      icon: Clock3,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Rejected",
      value: equipmentData.filter(
        (item) => item.approvalStatus === "rejected",
      ).length,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("All");
    setSelectedCategory("All");
  };

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            Owner Workspace / Equipment
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            My Equipment
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your equipment listings and monitor their approval status.
          </p>
        </div>

        <Button
          className="w-full gap-2 bg-brand-accent text-primary hover:bg-brand-accent/90 sm:w-auto"
          render={<Link href="/owner-dashboard/add-equipment" />}
          nativeButton={false}
        >
          <Plus className="size-4" />
          Add New Equipment
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-background p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon className="size-5" />
                </div>
              </div>

              <p className="mt-4 text-3xl font-bold text-primary">
                {stat.value.toString().padStart(2, "0")}
              </p>
            </div>
          );
        })}
      </div>

      {/* Equipment List */}
      <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="border-b border-border p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h3 className="text-lg font-bold text-primary">
                All Equipment
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {isLoading
                  ? "Loading equipment..."
                  : `${filteredEquipment.length} equipment found`}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="search"
                  placeholder="Search equipment..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm outline-none transition focus:border-primary sm:w-56"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                aria-label="Filter by category"
              >
                <option value="All">All Categories</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Approval Status Filter */}
              <select
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value)}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                aria-label="Filter by approval status"
              >
                <option value="All">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <Package className="mb-4 size-9 animate-pulse text-muted-foreground" />

            <h4 className="font-semibold text-primary">
              Loading your equipment
            </h4>

            <p className="mt-2 text-sm text-muted-foreground">
              Please wait while we retrieve your equipment listings.
            </p>
          </div>
        ) : errorMessage ? (
          /* Error State */
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <XCircle className="mb-4 size-10 text-red-500" />

            <h4 className="text-lg font-bold text-primary">
              Unable to load equipment
            </h4>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {errorMessage}
            </p>

            <Button
              className="mt-5"
              onClick={() => void fetchEquipments()}
            >
              Try Again
            </Button>
          </div>
        ) : equipmentData.length === 0 ? (
          /* No Equipment State */
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <Package className="mb-4 size-10 text-muted-foreground" />

            <h4 className="text-lg font-bold text-primary">
              No equipment yet
            </h4>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              You haven&apos;t added any equipment. Start by creating your
              first equipment listing.
            </p>

            <Button
              className="mt-5 gap-2"
              render={<Link href="/owner-dashboard/add-equipment" />}
              nativeButton={false}
            >
              <Plus className="size-4" />
              Add Equipment
            </Button>
          </div>
        ) : filteredEquipment.length > 0 ? (
          /* Equipment Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-muted/40">
                <tr className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4">Equipment</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Rental Price</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Approval Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredEquipment.map((equipment) => (
                  <tr
                    key={equipment.id}
                    className="transition-colors hover:bg-muted/20"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted text-muted-foreground">
                          {equipment.image ? (
                            <Image
                              src={equipment.image}
                              alt={equipment.name}
                              width={48}
                              height={48}
                              unoptimized
                              className="size-full object-cover"
                            />
                          ) : (
                            <Package className="size-5" />
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-primary">
                            {equipment.name}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {equipment.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {equipment.category}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-primary">
                        ৳{equipment.price.toLocaleString("en-BD")}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {rentalLabels[equipment.rentalType]}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {equipment.availableQuantity}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[equipment.approvalStatus]}`}
                      >
                        {statusLabels[equipment.approvalStatus]}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedEquipment(equipment)}
                          aria-label={`View ${equipment.name}`}
                          title="View details"
                          className="rounded-lg p-2 text-muted-foreground transition hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="size-4" />
                        </button>

                        <button
                          type="button"
                          disabled
                          aria-label={`Edit ${equipment.name}`}
                          title="Editing is not available yet"
                          className="cursor-not-allowed rounded-lg p-2 text-muted-foreground/40"
                        >
                          <Pencil className="size-4" />
                        </button>

                        <button
                          type="button"
                          disabled
                          aria-label={`Delete ${equipment.name}`}
                          title="Deletion is not available yet"
                          className="cursor-not-allowed rounded-lg p-2 text-muted-foreground/40"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Filter Empty State */
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <SlidersHorizontal className="mb-4 size-9 text-muted-foreground" />

            <h4 className="text-lg font-bold text-primary">
              No equipment found
            </h4>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              We couldn&apos;t find any equipment matching your search or
              filters. Try adjusting your filters.
            </p>

            <Button
              variant="outline"
              className="mt-5"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>

      {/* Selected Equipment Details */}
      {selectedEquipment && (
        <section className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Equipment Details
              </p>

              <h3 className="mt-2 text-xl font-bold text-primary">
                {selectedEquipment.name}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setSelectedEquipment(null)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              Close
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Equipment ID</p>
              <p className="mt-1 break-all font-semibold text-primary">
                {selectedEquipment.id}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="mt-1 flex items-center gap-1 font-semibold text-primary">
                <MapPin className="size-4 shrink-0" />
                {selectedEquipment.location}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Date Added</p>
              <p className="mt-1 flex items-center gap-1 font-semibold text-primary">
                <CalendarDays className="size-4" />
                {selectedEquipment.addedDate}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Approval Status</p>
              <span
                className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[selectedEquipment.approvalStatus]}`}
              >
                {statusLabels[selectedEquipment.approvalStatus]}
              </span>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Rental Price</p>
              <p className="mt-1 font-semibold text-primary">
                ৳{selectedEquipment.price.toLocaleString("en-BD")}{" "}
                {rentalLabels[selectedEquipment.rentalType]}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Available Quantity
              </p>
              <p className="mt-1 font-semibold text-primary">
                {selectedEquipment.availableQuantity}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Condition</p>
              <p className="mt-1 font-semibold capitalize text-primary">
                {selectedEquipment.condition}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Availability</p>
              <p className="mt-1 font-semibold capitalize text-primary">
                {selectedEquipment.availabilityStatus}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Brand</p>
              <p className="mt-1 font-semibold text-primary">
                {selectedEquipment.brand}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Model</p>
              <p className="mt-1 font-semibold text-primary">
                {selectedEquipment.model}
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-border pt-5">
            <p className="text-xs text-muted-foreground">Rental Terms</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-primary">
              {selectedEquipment.rentalTerms}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
