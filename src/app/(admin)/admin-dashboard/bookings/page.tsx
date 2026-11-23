
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  Search,
  Eye,
  CalendarDays,
  MapPin,
  UserRound,
  Package,
  CreditCard,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiRequest, ApiError } from "@/lib/api";

type BookingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "cancelled";

type PaymentStatus = "paid" | "pending" | "refunded";

type BookingFilter = "All" | BookingStatus;

interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
  phone?: string | null;
}

interface PopulatedEquipment {
  _id: string;
  name: string;
  image?: string;
  category?: string;
  location?: string;
}

interface AdminBookingApi {
  _id: string;
  bookingNumber: string;
  customer: PopulatedUser | null;
  owner: PopulatedUser | null;
  equipment: PopulatedEquipment | null;
  startDate: string;
  endDate: string;
  duration: number;
  durationUnit: "daily" | "weekly" | "monthly";
  quantity: number;
  rentalPrice: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  customerNote?: string;
  ownerResponse?: string;
  requestedAt?: string;
  createdAt?: string;
}

interface AdminBookingsResponse {
  bookings: AdminBookingApi[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface AdminBooking {
  id: string;
  bookingNumber: string;
  customer: string;
  email: string;
  phone: string;
  equipment: string;
  owner: string;
  startDate: string;
  endDate: string;
  location: string;
  amount: number;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  bookingDate: string;
  quantity: number;
  duration: number;
  durationUnit: string;
  customerNote: string;
  ownerResponse: string;
}

const bookingFilters: { label: string; value: BookingFilter }[] = [
  { label: "All", value: "All" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const emptyPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

const formatDate = (value?: string) => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatCurrency = (amount: number) =>
  `৳${amount.toLocaleString("en-US")}`;

const mapBooking = (booking: AdminBookingApi): AdminBooking => ({
  id: booking._id,
  bookingNumber: booking.bookingNumber,
  customer: booking.customer?.name ?? "Unknown Customer",
  email: booking.customer?.email ?? "Not provided",
  phone: booking.customer?.phone ?? "Not provided",
  equipment: booking.equipment?.name ?? "Equipment unavailable",
  owner: booking.owner?.name ?? "Unknown Owner",
  startDate: formatDate(booking.startDate),
  endDate: formatDate(booking.endDate),
  location: booking.equipment?.location ?? "Not provided",
  amount: booking.totalAmount,
  paymentStatus: booking.paymentStatus,
  status: booking.status,
  bookingDate: formatDate(
    booking.requestedAt ?? booking.createdAt,
  ),
  quantity: booking.quantity,
  duration: booking.duration,
  durationUnit: booking.durationUnit,
  customerNote: booking.customerNote ?? "No customer note.",
  ownerResponse: booking.ownerResponse ?? "No owner response.",
});

const statusLabels: Record<BookingStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-blue-50 text-blue-700",
  rejected: "bg-red-50 text-red-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-gray-100 text-gray-700",
};

const paymentLabels: Record<PaymentStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  refunded: "Refunded",
};

const paymentStyles: Record<PaymentStatus, string> = {
  paid: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  refunded: "bg-red-50 text-red-700",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<BookingFilter>("All");

  const [selectedBooking, setSelectedBooking] =
    useState<AdminBooking | null>(null);

  const [pagination, setPagination] = useState(emptyPagination);
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
      });

      if (activeFilter !== "All") {
        params.set("status", activeFilter);
      }

      const response = await apiRequest<AdminBookingsResponse>(
        `/bookings/admin?${params.toString()}`,
      );

      if (!response.data) {
        throw new Error("Invalid bookings response from server.");
      }

      const result = response.data;
      const mappedBookings = result.bookings.map(mapBooking);

      setBookings(mappedBookings);
      setPagination(result.pagination);

      setSelectedBooking((previous) => {
        if (!previous) return null;

        return (
          mappedBookings.find(
            (booking) => booking.id === previous.id,
          ) ?? null
        );
      });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to load bookings. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, activeFilter]);

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

  const handleFilterChange = (filter: BookingFilter) => {
    setActiveFilter(filter);
    setPage(1);
    setSelectedBooking(null);
  };

  const query = searchQuery.trim().toLowerCase();

  const filteredBookings = bookings.filter((booking) => {
    if (!query) return true;

    return (
      booking.bookingNumber.toLowerCase().includes(query) ||
      booking.customer.toLowerCase().includes(query) ||
      booking.email.toLowerCase().includes(query) ||
      booking.equipment.toLowerCase().includes(query) ||
      booking.owner.toLowerCase().includes(query)
    );
  });

  const pendingCount = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;

  const approvedCount = bookings.filter(
    (booking) => booking.status === "approved",
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "completed",
  ).length;

  const statCards = [
    {
      title: "Total Bookings",
      value: pagination.total,
      icon: <ClipboardList className="size-5" />,
      iconClass: "bg-blue-50 text-blue-600",
    },
    {
      title: "Pending Requests",
      value: pendingCount,
      icon: <Clock3 className="size-5" />,
      iconClass: "bg-amber-50 text-amber-600",
    },
    {
      title: "Approved Bookings",
      value: approvedCount,
      icon: <CheckCircle2 className="size-5" />,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Completed Bookings",
      value: completedCount,
      icon: <CheckCircle2 className="size-5" />,
      iconClass: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-accent">
            Platform Management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            Booking Management
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Monitor rental bookings across the platform.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm">
          <ClipboardList className="size-4 text-muted-foreground" />
          <span className="font-medium text-primary">
            {pagination.total} Bookings
          </span>
        </div>
      </div>

      {/* API Error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-900"
        >
          <AlertCircle className="mt-0.5 size-5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold">
              Something went wrong
            </p>
            <p className="mt-1 text-sm">{error}</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => void fetchBookings()}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconClass={stat.iconClass}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Booking Table */}
      <section className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="border-b border-border p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-primary">
                All Bookings
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Search and review customer rental bookings.
              </p>
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search current page..."
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* Status Filters */}
          <div className="mt-5 flex flex-wrap gap-2">
            {bookingFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => handleFilterChange(filter.value)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  activeFilter === filter.value
                    ? "bg-primary text-white"
                    : "border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {filter.label}

                {filter.value === "pending" &&
                  activeFilter === "pending" &&
                  pendingCount > 0 && (
                    <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-amber-800">
                      {pendingCount}
                    </span>
                  )}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-4 font-semibold">
                  Booking
                </th>
                <th className="px-5 py-4 font-semibold">
                  Customer
                </th>
                <th className="px-5 py-4 font-semibold">
                  Equipment
                </th>
                <th className="px-5 py-4 font-semibold">
                  Rental Period
                </th>
                <th className="px-5 py-4 font-semibold">
                  Amount
                </th>
                <th className="px-5 py-4 font-semibold">
                  Payment
                </th>
                <th className="px-5 py-4 font-semibold">
                  Status
                </th>
                <th className="px-5 py-4 text-right font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <Loader2 className="mx-auto size-6 animate-spin text-primary" />
                    <p className="mt-3 text-sm text-muted-foreground">
                      Loading bookings...
                    </p>
                  </td>
                </tr>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-primary">
                        {booking.bookingNumber}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {booking.bookingDate}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-primary">
                        {booking.customer}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {booking.email}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-primary">
                        {booking.equipment}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Owner: {booking.owner}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-xs text-primary">
                        {booking.startDate}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        to {booking.endDate}
                      </p>
                    </td>

                    <td className="px-5 py-4 font-semibold text-primary">
                      {formatCurrency(booking.amount)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${paymentStyles[booking.paymentStatus]}`}
                      >
                        {paymentLabels[booking.paymentStatus]}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}
                      >
                        {statusLabels[booking.status]}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <Eye className="size-3.5" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <ClipboardList className="mx-auto size-8 text-muted-foreground/50" />

                    <p className="mt-3 font-medium text-primary">
                      No bookings found
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Try changing your search or status filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {filteredBookings.length} matching records on this page
            {" · "}
            {pagination.total} total bookings
          </p>

          <div className="flex items-center gap-2">
            <span className="mr-2 text-xs text-muted-foreground">
              Page {pagination.page} of{" "}
              {Math.max(1, pagination.totalPages)}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={isLoading || page <= 1}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={
                isLoading ||
                pagination.totalPages === 0 ||
                page >= pagination.totalPages
              }
              onClick={() =>
                setPage((current) =>
                  Math.min(pagination.totalPages, current + 1),
                )
              }
            >
              Next
            </Button>
          </div>
        </div>
      </section>

      {/* Booking Details */}
      {selectedBooking && (
        <section className="rounded-xl border border-border bg-background p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
                Booking Details
              </p>

              <h2 className="mt-1 text-xl font-bold text-primary">
                {selectedBooking.bookingNumber}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Booked on {selectedBooking.bookingDate}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Close booking details"
              onClick={() => setSelectedBooking(null)}
            >
              <X className="size-5" />
            </Button>
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary">
                Customer Information
              </h3>

              <DetailItem
                icon={<UserRound className="size-4" />}
                label="Customer Name"
                value={selectedBooking.customer}
              />

              <DetailItem
                icon={<UserRound className="size-4" />}
                label="Email Address"
                value={selectedBooking.email}
              />

              <DetailItem
                icon={<UserRound className="size-4" />}
                label="Phone Number"
                value={selectedBooking.phone}
              />
            </div>

            {/* Rental Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary">
                Rental Information
              </h3>

              <DetailItem
                icon={<Package className="size-4" />}
                label="Equipment"
                value={selectedBooking.equipment}
              />

              <DetailItem
                icon={<UserRound className="size-4" />}
                label="Equipment Owner"
                value={selectedBooking.owner}
              />

              <DetailItem
                icon={<MapPin className="size-4" />}
                label="Location"
                value={selectedBooking.location}
              />

              <DetailItem
                icon={<CalendarDays className="size-4" />}
                label="Rental Period"
                value={`${selectedBooking.startDate} to ${selectedBooking.endDate}`}
              />

              <DetailItem
                icon={<Package className="size-4" />}
                label="Quantity"
                value={String(selectedBooking.quantity)}
              />

              <DetailItem
                icon={<CalendarDays className="size-4" />}
                label="Duration"
                value={`${selectedBooking.duration} ${selectedBooking.durationUnit}`}
              />
            </div>
          </div>

          {/* Customer Note */}
          <div className="mt-6 rounded-xl bg-muted/50 p-4">
            <h3 className="text-sm font-semibold text-primary">
              Customer Note
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {selectedBooking.customerNote}
            </p>
          </div>

          {/* Owner Response */}
          <div className="mt-4 rounded-xl bg-muted/50 p-4">
            <h3 className="text-sm font-semibold text-primary">
              Owner Response
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {selectedBooking.ownerResponse}
            </p>
          </div>

          {/* Payment Summary */}
          <div className="mt-6 rounded-xl bg-muted/50 p-4">
            <h3 className="text-sm font-semibold text-primary">
              Payment Summary
            </h3>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-background text-primary">
                  <CreditCard className="size-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Payment Status
                  </p>

                  <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${paymentStyles[selectedBooking.paymentStatus]}`}
                  >
                    {paymentLabels[selectedBooking.paymentStatus]}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Total Booking Amount
                </p>

                <p className="mt-1 text-xl font-bold text-primary">
                  {formatCurrency(selectedBooking.amount)}
                </p>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
            <div>
              <p className="text-sm font-medium text-primary">
                Booking Status
              </p>

              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedBooking.status]}`}
              >
                {statusLabels[selectedBooking.status]}
              </span>
            </div>

            <p className="max-w-md text-xs leading-5 text-muted-foreground">
              Booking approval and completion are managed by the equipment
              owner. Admin can monitor booking information and payment status
              from this page.
            </p>
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
  isLoading,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
  isLoading: boolean;
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
        {isLoading ? (
          <span className="inline-block h-7 w-12 animate-pulse rounded bg-muted" />
        ) : (
          value.toLocaleString("en-US")
        )}
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

        <p className="mt-1 break-words text-sm font-semibold text-primary">
          {value}
        </p>
      </div>
    </div>
  );
}
