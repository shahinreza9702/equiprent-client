
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Package,
  CheckCircle2,
  Clock3,
  XCircle,
  Search,
  Eye,
  MapPin,
  CalendarDays,
  UserRound,
  X,
  AlertCircle,
  Check,
  Ban,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";

type EquipmentApprovalStatus = "approved" | "pending" | "rejected";

type AdminEquipment = {
  id: string;
  name: string;
  category: string;
  owner: {
    name: string;
    email: string;
    phone: string | null;
  } | null;
  location: string;
  rentalPrice: number;
  rentalType: "daily" | "weekly" | "monthly";
  approvalStatus: EquipmentApprovalStatus;
  status: "available" | "unavailable";
  createdAt: string;
  description: string;
  brand?: string;
  model?: string;
  condition?: string;
  availableQuantity?: number;
  image?: string;
  rentalTerms?: string;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
};

type EquipmentListResponse = {
  equipments: AdminEquipment[];
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    available: number;
    unavailable: number;
  };
  pagination: {
    page: number;
    limit: number;
    totalEquipments: number;
    totalPages: number;
  };
};

const statusFilters = [
  "All",
  "Approved",
  "Pending",
  "Rejected",
] as const;

type StatusFilter = (typeof statusFilters)[number];

const statusMap: Record<StatusFilter, EquipmentApprovalStatus | null> = {
  All: null,
  Approved: "approved",
  Pending: "pending",
  Rejected: "rejected",
};

const statusLabels: Record<EquipmentApprovalStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
};

const statusStyles: Record<EquipmentApprovalStatus, string> = {
  approved: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  rejected: "bg-red-50 text-red-700",
};

const rentalTypeLabels: Record<AdminEquipment["rentalType"], string> = {
  daily: "Day",
  weekly: "Week",
  monthly: "Month",
};

export default function AdminEquipmentPage() {
  const [equipment, setEquipment] = useState<AdminEquipment[]>([]);
  const [stats, setStats] = useState<EquipmentListResponse["stats"]>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    available: 0,
    unavailable: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All");

  const [selectedEquipment, setSelectedEquipment] =
    useState<AdminEquipment | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [pageError, setPageError] = useState("");

  // Fetch equipment from the backend
  const fetchEquipments = useCallback(async () => {
    try {
      setPageError("");

      const response = await apiRequest<EquipmentListResponse>(
        "/admin/equipments?limit=100",
      );

      if (!response.data) {
        throw new Error("Unable to retrieve equipment data.");
      }

      const result = response.data;

      setEquipment(result.equipments);
      setStats(result.stats);

      setSelectedEquipment((previous) => {
        if (!previous) return null;

        return (
          result.equipments.find((item) => item.id === previous.id) ?? null
        );
      });
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Failed to load equipment.",
      );
    }
  }, []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);

      await fetchEquipments();

      if (active) {
        setIsLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [fetchEquipments]);

  // Approve or reject equipment through the backend
  const handleReview = async (
    id: string,
    status: Extract<EquipmentApprovalStatus, "approved" | "rejected">,
  ) => {
    const targetEquipment = equipment.find((item) => item.id === id);

    if (!targetEquipment || targetEquipment.approvalStatus !== "pending") {
      return;
    }

    try {
      setIsReviewing(true);
      setReviewError("");

      await apiRequest(`/admin/equipments/${id}/review`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      await fetchEquipments();
    } catch (error) {
      setReviewError(
        error instanceof Error
          ? error.message
          : "Unable to update equipment status.",
      );
    } finally {
      setIsReviewing(false);
    }
  };

  // Dynamic category options
  const categories = [
    "All Categories",
    ...Array.from(
      new Set(equipment.map((item) => item.category).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b)),
  ];

  const query = searchQuery.trim().toLowerCase();

  const filteredEquipment = equipment.filter((item) => {
    const ownerName = item.owner?.name ?? "";
    const ownerEmail = item.owner?.email ?? "";

    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query) ||
      ownerName.toLowerCase().includes(query) ||
      ownerEmail.toLowerCase().includes(query);

    const matchesCategory =
      categoryFilter === "All Categories" ||
      item.category === categoryFilter;

    const selectedStatus = statusMap[activeFilter];

    const matchesStatus =
      selectedStatus === null ||
      item.approvalStatus === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) =>
    `৳${price.toLocaleString("en-US")}`;

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-accent">
            Platform Management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            Equipment Management
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Review, monitor, and manage equipment listed on EquipRent.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm">
          <Package className="size-4 text-muted-foreground" />

          <span className="font-medium text-primary">
            {stats.total} Equipment
          </span>
        </div>
      </div>

      {/* Page Error */}
      {pageError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" />

          <div className="flex-1">
            <p className="text-sm font-semibold text-red-900">
              Unable to load equipment
            </p>

            <p className="mt-1 text-sm text-red-800">
              {pageError}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsLoading(true);
              void fetchEquipments().finally(() => setIsLoading(false));
            }}
          >
            <RefreshCw className="size-3.5" />
            Retry
          </Button>
        </div>
      )}

      {/* Review Error */}
      {reviewError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" />

          <div className="flex-1">
            <p className="text-sm font-semibold text-red-900">
              Review failed
            </p>

            <p className="mt-1 text-sm text-red-800">
              {reviewError}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Dismiss error"
            onClick={() => setReviewError("")}
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Equipment"
          value={stats.total}
          icon={<Package className="size-5" />}
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Approved"
          value={stats.approved}
          icon={<CheckCircle2 className="size-5" />}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Pending Review"
          value={stats.pending}
          icon={<Clock3 className="size-5" />}
          iconClass="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle className="size-5" />}
          iconClass="bg-red-50 text-red-600"
        />
      </div>

      {/* Equipment Management */}
      <section className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="border-b border-border p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-primary">
                All Equipment
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Review equipment listings and manage approval status.
              </p>
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search name, ID or owner..."
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    activeFilter === filter
                      ? "bg-primary text-white"
                      : "border border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {filter}

                  {filter === "Pending" && stats.pending > 0 && (
                    <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-amber-800">
                      {stats.pending}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-primary outline-none focus:border-primary"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-4 font-semibold">Equipment</th>
                <th className="px-5 py-4 font-semibold">Owner</th>
                <th className="px-5 py-4 font-semibold">Category</th>
                <th className="px-5 py-4 font-semibold">Rental Price</th>
                <th className="px-5 py-4 font-semibold">Submitted</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <Loader2 className="mx-auto size-7 animate-spin text-primary" />

                    <p className="mt-3 text-sm text-muted-foreground">
                      Loading equipment...
                    </p>
                  </td>
                </tr>
              ) : (
                <>
                  {filteredEquipment.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                            <Package className="size-5" />
                          </div>

                          <div>
                            <p className="font-semibold text-primary">
                              {item.name}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {item.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-primary">
                          {item.owner?.name ?? "Unknown Owner"}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="size-3" />
                          {item.location}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {item.category}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-primary">
                          {formatPrice(item.rentalPrice)}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          / {rentalTypeLabels[item.rentalType]}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[item.approvalStatus]}`}
                        >
                          {statusLabels[item.approvalStatus]}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedEquipment(item);
                              setReviewError("");
                            }}
                          >
                            <Eye className="size-3.5" />
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredEquipment.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center">
                        <Package className="mx-auto size-8 text-muted-foreground/50" />

                        <p className="mt-3 font-medium text-primary">
                          No equipment found
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Try changing your search or filters.
                        </p>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border px-5 py-4">
          <p className="text-xs text-muted-foreground">
            Showing {isLoading ? 0 : filteredEquipment.length} of{" "}
            {stats.total} equipment records
            {stats.total > equipment.length &&
              " (first 100 records loaded)"}
          </p>
        </div>
      </section>

      {/* Equipment Details Panel */}
      {selectedEquipment && (
        <section className="rounded-xl border border-border bg-background p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
                Equipment Details
              </p>

              <h2 className="mt-1 text-xl font-bold text-primary">
                {selectedEquipment.name}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {selectedEquipment.id}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Close equipment details"
              onClick={() => {
                setSelectedEquipment(null);
                setReviewError("");
              }}
            >
              <X className="size-5" />
            </Button>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <DetailItem
              icon={<UserRound className="size-4" />}
              label="Equipment Owner"
              value={selectedEquipment.owner?.name ?? "Unknown Owner"}
            />

            <DetailItem
              icon={<Package className="size-4" />}
              label="Category"
              value={selectedEquipment.category}
            />

            <DetailItem
              icon={<MapPin className="size-4" />}
              label="Location"
              value={selectedEquipment.location}
            />

            <DetailItem
              icon={<CalendarDays className="size-4" />}
              label="Submission Date"
              value={formatDate(selectedEquipment.createdAt)}
            />

            <DetailItem
              icon={<Package className="size-4" />}
              label="Rental Price"
              value={`${formatPrice(selectedEquipment.rentalPrice)} / ${rentalTypeLabels[selectedEquipment.rentalType]}`}
            />

            <DetailItem
              icon={<Package className="size-4" />}
              label="Availability"
              value={
                selectedEquipment.status === "available"
                  ? "Available"
                  : "Unavailable"
              }
            />

            {selectedEquipment.brand && (
              <DetailItem
                icon={<Package className="size-4" />}
                label="Brand"
                value={selectedEquipment.brand}
              />
            )}

            {selectedEquipment.model && (
              <DetailItem
                icon={<Package className="size-4" />}
                label="Model"
                value={selectedEquipment.model}
              />
            )}

            {selectedEquipment.condition && (
              <DetailItem
                icon={<Package className="size-4" />}
                label="Condition"
                value={selectedEquipment.condition}
              />
            )}

            {selectedEquipment.availableQuantity !== undefined && (
              <DetailItem
                icon={<Package className="size-4" />}
                label="Available Quantity"
                value={String(selectedEquipment.availableQuantity)}
              />
            )}
          </div>

          {selectedEquipment.owner && (
            <div className="mt-5 rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-semibold text-primary">
                Owner Contact
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                {selectedEquipment.owner.email}
              </p>

              {selectedEquipment.owner.phone && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedEquipment.owner.phone}
                </p>
              )}
            </div>
          )}

          <div className="mt-5 rounded-lg bg-muted/50 p-4">
            <p className="text-sm font-semibold text-primary">
              Description
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {selectedEquipment.description}
            </p>
          </div>

          {selectedEquipment.rentalTerms && (
            <div className="mt-4 rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-semibold text-primary">
                Rental Terms
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {selectedEquipment.rentalTerms}
              </p>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
            <div>
              <p className="text-sm font-medium text-primary">
                Current Approval Status
              </p>

              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedEquipment.approvalStatus]}`}
              >
                {statusLabels[selectedEquipment.approvalStatus]}
              </span>
            </div>

            {selectedEquipment.approvalStatus === "pending" ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  disabled={isReviewing}
                  onClick={() =>
                    void handleReview(selectedEquipment.id, "approved")
                  }
                >
                  {isReviewing ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Check className="size-4" />
                  )}
                  Approve
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isReviewing}
                  onClick={() =>
                    void handleReview(selectedEquipment.id, "rejected")
                  }
                >
                  {isReviewing ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Ban className="size-4" />
                  )}
                  Reject
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                This equipment has already been reviewed.
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  iconClass,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          {title}
        </p>

        <div
          className={`flex size-10 items-center justify-center rounded-lg ${iconClass}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold tracking-tight text-primary">
        {value.toLocaleString("en-US")}
      </p>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </div>

      <div>
        <p className="text-xs text-muted-foreground">{label}</p>

        <p className="mt-1 text-sm font-semibold text-primary">
          {value}
        </p>
      </div>
    </div>
  );
}
