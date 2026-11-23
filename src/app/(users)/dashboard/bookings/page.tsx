
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  PackageCheck,
  Search,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiRequest, ApiError } from "@/lib/api";

interface BookingEquipment {
  _id: string;
  name: string;
  image?: string;
  category?: string;
  location?: string;
  rentalType?: "daily" | "weekly" | "monthly";
}

interface Booking {
  _id: string;
  bookingNumber: string;
  equipment: BookingEquipment;
  startDate: string;
  endDate: string;
  duration: number;
  durationUnit: string;
  quantity: number;
  rentalPrice: number;
  totalAmount: number;
  status:
    | "pending"
    | "approved"
    | "rejected"
    | "completed"
    | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
  customerNote?: string;
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
  | "all"
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "cancelled";

const PAGE_LIMIT = 10;

const initialPagination: Pagination = {
  page: 1,
  limit: PAGE_LIMIT,
  total: 0,
  totalPages: 0,
};

function formatDate(date: string) {
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

function formatAmount(amount: number) {
  return `৳${(amount || 0).toLocaleString("en-BD")}`;
}

function getStatusLabel(status: Booking["status"]) {
  switch (status) {
    case "pending":
      return "Pending";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

function getStatusStyle(status: Booking["status"]) {
  switch (status) {
    case "approved":
      return "bg-green-50 text-green-700";
    case "completed":
      return "bg-blue-50 text-blue-700";
    case "pending":
      return "bg-amber-50 text-amber-700";
    case "rejected":
    case "cancelled":
      return "bg-red-50 text-red-700";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getPaymentStyle(payment: Booking["paymentStatus"]) {
  switch (payment) {
    case "paid":
      return "text-green-700";
    case "refunded":
      return "text-blue-700";
    case "pending":
    default:
      return "text-amber-700";
  }
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] =
    useState<Pagination>(initialPagination);

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] =
    useState<BookingFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState<string | null>(
    null,
  );

  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch customer bookings
  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_LIMIT),
      });

      if (statusFilter !== "all") {
        queryParams.set("status", statusFilter);
      }

      const response = await apiRequest<BookingsResponse>(
        `/bookings/my-bookings?${queryParams.toString()}`,
      );

      if (!response.data) {
        throw new Error("Booking data was not returned.");
      }

      setBookings(response.data.bookings || []);
      setPagination(
        response.data.pagination || initialPagination,
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Unable to load your bookings.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  // Load bookings after the effect has completed.
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

  // Cancel a pending booking
  const handleCancelBooking = async (bookingId: string) => {
    const shouldCancel = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!shouldCancel) return;

    try {
      setIsCancelling(bookingId);
      setActionError("");
      setSuccessMessage("");

      await apiRequest<Booking>(
        `/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          body: JSON.stringify({}),
        },
      );

      setSuccessMessage("Booking cancelled successfully.");

      await fetchBookings();
    } catch (err) {
      setActionError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Unable to cancel this booking.",
      );
    } finally {
      setIsCancelling(null);
    }
  };

  // Summary calculations
  const summaryCards = useMemo(() => {
    const total = pagination.total;

    return [
      {
        label: "Total Bookings",
        value: total,
        icon: CalendarDays,
        color: "bg-blue-50 text-blue-600",
      },
      {
        label: "Active Bookings",
        value: bookings.filter(
          (booking) => booking.status === "approved",
        ).length,
        icon: PackageCheck,
        color: "bg-green-50 text-green-600",
      },
      {
        label: "Pending Bookings",
        value: bookings.filter(
          (booking) => booking.status === "pending",
        ).length,
        icon: Clock3,
        color: "bg-amber-50 text-amber-600",
      },
      {
        label: "Cancelled Bookings",
        value: bookings.filter(
          (booking) => booking.status === "cancelled",
        ).length,
        icon: XCircle,
        color: "bg-red-50 text-red-600",
      },
    ];
  }, [bookings, pagination.total]);

  // Search within the currently loaded page
  const filteredBookings = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    if (!search) return bookings;

    return bookings.filter((booking) => {
      return (
        booking.bookingNumber.toLowerCase().includes(search) ||
        booking.equipment?.name?.toLowerCase().includes(search) ||
        booking.equipment?.category?.toLowerCase().includes(search)
      );
    });
  }, [bookings, searchQuery]);

  const handleFilterChange = (value: BookingFilter) => {
    setStatusFilter(value);
    setPage(1);
    setSearchQuery("");
  };

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-brand-accent">
            Customer Portal
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            My Bookings
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Track and manage all your equipment rental bookings.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="w-full gap-2 sm:w-auto"
            onClick={() => void fetchBookings()}
            disabled={isLoading}
          >
            <RefreshCw
              className={`size-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            className="w-full gap-2 bg-brand-accent text-primary hover:bg-brand-accent/90 sm:w-auto"
            render={<Link href="/equipment" />}
            nativeButton={false}
          >
            Browse Equipment
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-border bg-background p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </p>

                <div
                  className={`flex size-11 items-center justify-center rounded-xl ${card.color}`}
                >
                  <Icon className="size-5" />
                </div>
              </div>

              <p className="mt-4 text-3xl font-bold text-primary">
                {isLoading ? "—" : card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Action Messages */}
      {successMessage && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          <CheckCircle2 className="size-5 shrink-0" />
          {successMessage}
        </div>
      )}

      {actionError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle className="size-5 shrink-0" />
          {actionError}
        </div>
      )}

      {/* Bookings List */}
      <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:p-6">
          <div>
            <h3 className="text-lg font-bold text-primary">
              Booking History
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Your recent equipment rental activities.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                placeholder="Search this page..."
                aria-label="Search bookings"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm outline-none transition focus:border-primary"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(event) =>
                handleFilterChange(
                  event.target.value as BookingFilter,
                )
              }
              aria-label="Filter bookings by status"
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-primary outline-none focus:border-primary sm:w-48"
            >
              <option value="all">All Bookings</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8">
            <Loader2 className="size-8 animate-spin text-brand-accent" />
            <p className="text-sm text-muted-foreground">
              Loading your bookings...
            </p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
            <AlertCircle className="size-10 text-destructive" />

            <h3 className="mt-4 font-semibold text-primary">
              Unable to load bookings
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
          <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
              <PackageCheck className="size-8 text-muted-foreground" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-primary">
              {bookings.length === 0
                ? "No bookings yet"
                : "No matching bookings"}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {bookings.length === 0
                ? "You have not made any equipment bookings yet. Explore available equipment to get started."
                : "Try another search term to find your booking."}
            </p>

            {bookings.length === 0 && (
              <Button
                className="mt-5 gap-2 bg-brand-accent text-primary hover:bg-brand-accent/90"
                render={<Link href="/equipment" />}
                nativeButton={false}
              >
                Explore Equipment
                <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-muted/40">
                  <tr className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="px-6 py-4">Equipment</th>
                    <th className="px-6 py-4">Rental Period</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="transition-colors hover:bg-muted/20"
                    >
                      {/* Equipment */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                            {booking.equipment?.image ? (
                              <Image
                                src={booking.equipment.image}
                                alt={booking.equipment.name}
                                fill
                                unoptimized
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <PackageCheck className="size-5 text-muted-foreground" />
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-primary">
                              {booking.equipment?.name || "Equipment unavailable"}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {booking.bookingNumber}
                            </p>

                            {booking.equipment?.category && (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {booking.equipment.category}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Rental Period */}
                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-primary">
                          {formatDate(booking.startDate)}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          to {formatDate(booking.endDate)}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Quantity: {booking.quantity}
                        </p>
                      </td>

                      {/* Amount */}
                      <td className="px-6 py-5">
                        <p className="font-semibold text-primary">
                          {formatAmount(booking.totalAmount)}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {booking.duration} {booking.durationUnit}
                          {booking.duration > 1 ? "s" : ""}
                        </p>
                      </td>

                      {/* Payment */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center text-sm font-semibold capitalize ${getPaymentStyle(booking.paymentStatus)}`}
                        >
                          {booking.paymentStatus === "paid" && (
                            <CheckCircle2 className="mr-1 size-4" />
                          )}

                          {booking.paymentStatus}
                        </span>
                      </td>

                      {/* Booking Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(booking.status)}`}
                        >
                          {getStatusLabel(booking.status)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        {booking.status === "pending" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            disabled={
                              isCancelling === booking._id
                            }
                            onClick={() =>
                              void handleCancelBooking(booking._id)
                            }
                          >
                            {isCancelling === booking._id ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <XCircle className="size-3" />
                            )}

                            Cancel
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No actions
                          </span>
                        )}
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
                {pagination.total} bookings
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

                <span className="px-2 text-sm font-medium text-primary">
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
    </div>
  );
}
