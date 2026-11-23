
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  X,
  XCircle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiRequest, ApiError } from "@/lib/api";

type BookingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "cancelled";

interface BookingCustomer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface BookingEquipment {
  _id: string;
  name: string;
  category?: string;
  location?: string;
  image?: string;
}

interface Booking {
  _id: string;
  bookingNumber: string;
  customer: BookingCustomer;
  equipment: BookingEquipment;
  startDate: string;
  endDate: string;
  duration: number;
  durationUnit: string;
  quantity: number;
  rentalPrice: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: "pending" | "paid" | "refunded";
  customerNote?: string;
  ownerResponse?: string;
  requestedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface BookingsResponse {
  bookings: Booking[];
  pagination: Pagination;
}

type BookingFilter =
  | "All"
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Completed"
  | "Cancelled";

const PAGE_LIMIT = 10;

const filters: BookingFilter[] = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
  "Completed",
  "Cancelled",
];

const initialPagination: Pagination = {
  page: 1,
  limit: PAGE_LIMIT,
  total: 0,
  totalPages: 0,
};

const statusStyles: Record<BookingStatus, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  approved: "border-blue-200 bg-blue-50 text-blue-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-gray-200 bg-gray-50 text-gray-700",
};

function formatAmount(amount: number) {
  return `৳${(amount || 0).toLocaleString("en-BD")}`;
}

function formatDate(date?: string) {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusLabel(status: BookingStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getFilterStatus(filter: BookingFilter): BookingStatus | undefined {
  if (filter === "All") return undefined;

  return filter.toLowerCase() as BookingStatus;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError || error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export default function OwnerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] =
    useState<Pagination>(initialPagination);

  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] =
    useState<BookingFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch owner booking requests
  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_LIMIT),
      });

      const status = getFilterStatus(activeFilter);

      if (status) {
        queryParams.set("status", status);
      }

      const response = await apiRequest<BookingsResponse>(
        `/bookings/owner?${queryParams.toString()}`,
      );

      if (!response.data) {
        throw new Error("Booking requests were not returned.");
      }

      setBookings(response.data.bookings || []);
      setPagination(
        response.data.pagination || initialPagination,
      );
    } catch (err) {
      setError(
        getErrorMessage(err, "Unable to load booking requests."),
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, activeFilter]);

  // Load bookings after the effect has completed
  useEffect(() => {
    let isActive = true;

    void Promise.resolve().then(() => {
      if (isActive) {
        return fetchBookings();
      }
    });

    return () => {
      isActive = false;
    };
  }, [fetchBookings]);

  // Update booking status through the backend
  const updateBookingStatus = async (
    bookingId: string,
    status: "approved" | "rejected",
  ) => {
    const actionLabel = status === "approved" ? "approve" : "reject";

    const shouldUpdate = window.confirm(
      `Are you sure you want to ${actionLabel} this booking request?`,
    );

    if (!shouldUpdate) return;

    try {
      setIsUpdating(bookingId);
      setActionError("");
      setSuccessMessage("");

      await apiRequest<Booking>(
        `/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        },
      );

      setSuccessMessage(
        `Booking ${status === "approved" ? "approved" : "rejected"} successfully.`,
      );

      if (selectedBooking?._id === bookingId) {
        setSelectedBooking((previous) =>
          previous ? { ...previous, status } : previous,
        );
      }

      await fetchBookings();
    } catch (err) {
      setActionError(
        getErrorMessage(err, "Unable to update booking status."),
      );
    } finally {
      setIsUpdating(null);
    }
  };

  // Summary statistics
  const stats = useMemo(
    () => [
      {
        label: "Total Requests",
        value: pagination.total,
        icon: CalendarDays,
        color: "bg-primary/10 text-primary",
      },
      {
        label: "Pending Requests",
        value: bookings.filter(
          (booking) => booking.status === "pending",
        ).length,
        icon: Clock3,
        color: "bg-amber-100 text-amber-700",
      },
      {
        label: "Approved",
        value: bookings.filter(
          (booking) => booking.status === "approved",
        ).length,
        icon: CheckCircle2,
        color: "bg-blue-100 text-blue-700",
      },
      {
        label: "Completed",
        value: bookings.filter(
          (booking) => booking.status === "completed",
        ).length,
        icon: CheckCircle2,
        color: "bg-emerald-100 text-emerald-700",
      },
    ],
    [bookings, pagination.total],
  );

  // Search within the currently loaded page
  const query = searchQuery.trim().toLowerCase();

  const filteredBookings = useMemo(() => {
    if (!query) return bookings;

    return bookings.filter((booking) => {
      return (
        booking.bookingNumber?.toLowerCase().includes(query) ||
        booking.customer?.name?.toLowerCase().includes(query) ||
        booking.customer?.email?.toLowerCase().includes(query) ||
        booking.equipment?.name?.toLowerCase().includes(query)
      );
    });
  }, [bookings, query]);

  const handleFilterChange = (filter: BookingFilter) => {
    setActiveFilter(filter);
    setPage(1);
    setSearchQuery("");
    setSelectedBooking(null);
    setSuccessMessage("");
    setActionError("");
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Booking Requests
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Review and manage rental requests from your customers.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => void fetchBookings()}
            disabled={isLoading}
          >
            <RefreshCw
              className={`size-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            variant="outline"
            className="gap-2"
            render={<Link href="/owner-dashboard/equipment" />}
            nativeButton={false}
          >
            View My Equipment
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">
                    {isLoading
                      ? "—"
                      : stat.value.toString().padStart(2, "0")}
                  </p>
                </div>

                <div
                  className={`flex size-11 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon className="size-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          <CheckCircle2 className="size-5 shrink-0" />
          {successMessage}
        </div>
      )}

      {/* Action Error */}
      {actionError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle className="size-5 shrink-0" />
          {actionError}
        </div>
      )}

      {/* Booking Table */}
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="space-y-5 border-b border-border p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              All Booking Requests
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {isLoading
                ? "Loading booking requests..."
                : `${filteredBookings.length} request${filteredBookings.length !== 1 ? "s" : ""} found on this page`}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search booking, customer or equipment..."
                aria-label="Search booking requests"
                className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Filter className="size-4 text-muted-foreground" />

              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => handleFilterChange(filter)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    activeFilter === filter
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading booking requests...
            </p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
            <AlertCircle className="size-10 text-destructive" />

            <h3 className="mt-4 font-semibold text-foreground">
              Unable to load booking requests
            </h3>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {error}
            </p>

            <Button
              className="mt-5 gap-2"
              onClick={() => void fetchBookings()}
            >
              <RefreshCw className="size-4" />
              Try Again
            </Button>
          </div>
        ) : filteredBookings.length === 0 ? (
          /* Empty State */
          <div className="flex min-h-64 flex-col items-center justify-center px-6 py-14 text-center">
            <CalendarDays className="size-10 text-muted-foreground/50" />

            <p className="mt-3 font-medium text-foreground">
              {bookings.length === 0
                ? "No booking requests found"
                : "No matching booking requests"}
            </p>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {bookings.length === 0
                ? "You do not have any booking requests for this filter yet."
                : "Try changing your search or status filter."}
            </p>

            {(searchQuery || activeFilter !== "All") && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  handleFilterChange("All");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">
                      Booking / Customer
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Equipment
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Rental Period
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Amount
                    </th>
                    <th className="px-6 py-4 font-medium">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground">
                          {booking.customer?.name || "Customer"}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {booking.bookingNumber}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {booking.customer?.email || "No email"}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">
                          {booking.equipment?.name || "Equipment unavailable"}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {booking.equipment?.category || "Uncategorized"}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">
                          {formatDate(booking.startDate)}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          to {formatDate(booking.endDate)}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Quantity: {booking.quantity}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-semibold tabular-nums text-foreground">
                          {formatAmount(booking.totalAmount)}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {booking.duration} {booking.durationUnit}
                          {booking.duration > 1 ? "s" : ""}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[booking.status]}`}
                        >
                          {getStatusLabel(booking.status)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label={`View ${booking.bookingNumber}`}
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="size-4" />
                          </Button>

                          {booking.status === "pending" && (
                            <>
                              <Button
                                type="button"
                                size="icon"
                                aria-label={`Approve ${booking.bookingNumber}`}
                                className="bg-emerald-600 text-white hover:bg-emerald-700"
                                disabled={isUpdating === booking._id}
                                onClick={() =>
                                  void updateBookingStatus(
                                    booking._id,
                                    "approved",
                                  )
                                }
                              >
                                {isUpdating === booking._id ? (
                                  <Loader2 className="size-4 animate-spin" />
                                ) : (
                                  <Check className="size-4" />
                                )}
                              </Button>

                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                aria-label={`Reject ${booking.bookingNumber}`}
                                disabled={isUpdating === booking._id}
                                onClick={() =>
                                  void updateBookingStatus(
                                    booking._id,
                                    "rejected",
                                  )
                                }
                              >
                                <X className="size-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-4 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs text-muted-foreground">
                Showing {filteredBookings.length} of{" "}
                {pagination.total} booking requests
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  disabled={page <= 1 || isLoading}
                  onClick={() =>
                    setPage((previous) => Math.max(1, previous - 1))
                  }
                >
                  <ChevronLeft className="size-4" />
                  Previous
                </Button>

                <span className="px-2 text-sm font-medium text-foreground">
                  {pagination.page} / {Math.max(pagination.totalPages, 1)}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  disabled={
                    page >= pagination.totalPages || isLoading
                  }
                  onClick={() =>
                    setPage((previous) => previous + 1)
                  }
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Booking Details Panel */}
      {selectedBooking && (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Booking Details
              </p>

              <h2 className="mt-1 text-lg font-bold text-foreground">
                {selectedBooking.bookingNumber}
              </h2>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close booking details"
              onClick={() => setSelectedBooking(null)}
            >
              <X className="size-5" />
            </Button>
          </div>

          <div className="grid gap-6 py-6 md:grid-cols-2">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
                Customer Information
              </h3>

              <div>
                <p className="text-xs text-muted-foreground">
                  Customer Name
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {selectedBooking.customer?.name || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Email Address
                </p>
                <p className="mt-1 break-all text-sm font-medium text-foreground">
                  {selectedBooking.customer?.email || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Phone Number
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {selectedBooking.customer?.phone || "N/A"}
                </p>
              </div>

              {selectedBooking.customerNote && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Customer Note
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
                    {selectedBooking.customerNote}
                  </p>
                </div>
              )}
            </div>

            {/* Rental Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
                Rental Information
              </h3>

              <div>
                <p className="text-xs text-muted-foreground">
                  Equipment
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {selectedBooking.equipment?.name || "N/A"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedBooking.equipment?.category || "Uncategorized"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Rental Period
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {formatDate(selectedBooking.startDate)} –{" "}
                  {formatDate(selectedBooking.endDate)}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Duration
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {selectedBooking.duration}{" "}
                  {selectedBooking.durationUnit}
                  {selectedBooking.duration > 1 ? "s" : ""}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Quantity
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {selectedBooking.quantity}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Location
                </p>
                <p className="mt-1 flex items-center gap-1 text-sm font-medium text-foreground">
                  <MapPin className="size-4 text-muted-foreground" />
                  {selectedBooking.equipment?.location || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Requested At
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {formatDate(
                    selectedBooking.requestedAt ||
                      selectedBooking.createdAt,
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Amount and Status */}
          <div className="flex flex-col gap-4 rounded-xl bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-muted-foreground">
                Total Rental Amount
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums text-foreground">
                {formatAmount(selectedBooking.totalAmount)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Payment: {selectedBooking.paymentStatus}
              </p>
            </div>

            <span
              className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-medium ${statusStyles[selectedBooking.status]}`}
            >
              {getStatusLabel(selectedBooking.status)}
            </span>
          </div>

          {selectedBooking.ownerResponse && (
            <div className="mt-4 rounded-xl border border-border p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Owner Response
              </p>
              <p className="mt-1 text-sm text-foreground">
                {selectedBooking.ownerResponse}
              </p>
            </div>
          )}

          {/* Pending Booking Actions */}
          {selectedBooking.status === "pending" && (
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="destructive"
                className="gap-2"
                disabled={isUpdating === selectedBooking._id}
                onClick={() =>
                  void updateBookingStatus(
                    selectedBooking._id,
                    "rejected",
                  )
                }
              >
                {isUpdating === selectedBooking._id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <XCircle className="size-4" />
                )}
                Reject Request
              </Button>

              <Button
                type="button"
                className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                disabled={isUpdating === selectedBooking._id}
                onClick={() =>
                  void updateBookingStatus(
                    selectedBooking._id,
                    "approved",
                  )
                }
              >
                {isUpdating === selectedBooking._id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )}
                Approve Request
              </Button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
