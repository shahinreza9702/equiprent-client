
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  Clock3,
  Heart,
  Package,
  Plus,
  RefreshCw,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type BookingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "cancelled";

type PaymentStatus = "pending" | "paid" | "refunded";

interface EquipmentReference {
  _id?: string;
  name?: string;
  image?: string;
  category?: string | { name?: string };
  rentalType?: "daily" | "weekly" | "monthly";
}

interface CustomerBooking {
  _id: string;
  bookingNumber: string;
  equipment: EquipmentReference | string | null;
  startDate: string;
  endDate: string;
  duration: number;
  durationUnit: "daily" | "weekly" | "monthly";
  quantity: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt?: string;
}

interface BookingResponse {
  bookings: CustomerBooking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface FavoriteResponse {
  favorites: Array<{
    _id: string;
    equipment: EquipmentReference | string | null;
  }>;
  total: number;
  available: number;
}

interface DashboardData {
  bookings: CustomerBooking[];
  totalBookings: number;
  favoriteCount: number;
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

const loadDashboardData = async (): Promise<DashboardData> => {
  const [bookingResponse, favoriteResponse] = await Promise.all([
    apiRequest<BookingResponse>(
      "/bookings/my-bookings?page=1&limit=50",
    ),
    apiRequest<FavoriteResponse>("/favorites"),
  ]);

  if (!bookingResponse.data || !favoriteResponse.data) {
    throw new Error("Dashboard data was not returned by the server.");
  }

  return {
    bookings: bookingResponse.data.bookings,
    totalBookings: bookingResponse.data.pagination.total,
    favoriteCount: favoriteResponse.data.total,
  };
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getEquipmentName = (
  equipment: CustomerBooking["equipment"],
) => {
  if (!equipment) return "Equipment unavailable";

  if (typeof equipment === "string") {
    return "Equipment";
  }

  return equipment.name || "Equipment";
};

const getEquipmentCategory = (
  equipment: CustomerBooking["equipment"],
) => {
  if (!equipment || typeof equipment === "string") {
    return "Equipment";
  }

  if (typeof equipment.category === "string") {
    return equipment.category;
  }

  return equipment.category?.name || "Equipment";
};

const getDurationLabel = (duration: number) => {
  return `${duration} ${duration === 1 ? "Day" : "Days"}`;
};

const getStatusStyle = (status: BookingStatus) => {
  switch (status) {
    case "approved":
      return "bg-green-500/10 text-green-700";

    case "completed":
      return "bg-blue-500/10 text-blue-700";

    case "pending":
      return "bg-amber-500/10 text-amber-700";

    case "rejected":
      return "bg-red-500/10 text-red-700";

    case "cancelled":
      return "bg-gray-500/10 text-gray-600";

    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusLabel = (status: BookingStatus) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load customer dashboard data.
  useEffect(() => {
    if (isAuthLoading || !user) {
      return;
    }

    let cancelled = false;

    loadDashboardData()
      .then((data) => {
        if (!cancelled) {
          setDashboardData(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load dashboard data.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthLoading, user]);

  // Refresh dashboard data.
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await loadDashboardData();

      setDashboardData(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to refresh dashboard data.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isAuthLoading || (isLoading && !dashboardData)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto size-8 animate-spin text-brand-accent" />

          <p className="mt-4 text-sm text-muted-foreground">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Authentication fallback
  // ---------------------------------------------------------------------------

  if (!user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-primary">
            Please sign in to view your dashboard.
          </p>

          <Button
            render={<Link href="/login" />}
            nativeButton={false}
            className="mt-4"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (error && !dashboardData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-2xl border border-border bg-background p-8 text-center">
          <XCircle className="mx-auto size-10 text-red-500" />

          <h2 className="mt-4 text-lg font-semibold text-primary">
            Unable to Load Dashboard
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <Button
            type="button"
            onClick={() => void handleRefresh()}
            className="mt-6 gap-2"
          >
            <RefreshCw className="size-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Dashboard calculations
  // ---------------------------------------------------------------------------

  const bookings = dashboardData?.bookings ?? [];

  const now = new Date();

  const activeRentals = bookings.filter((booking) => {
    if (booking.status !== "approved") {
      return false;
    }

    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    return (
      !Number.isNaN(startDate.getTime()) &&
      !Number.isNaN(endDate.getTime()) &&
      startDate <= now &&
      endDate > now
    );
  });

  const completedRentals = bookings.filter(
    (booking) => booking.status === "completed",
  );

  const upcomingRentals = bookings
    .filter((booking) => {
      if (booking.status !== "approved") {
        return false;
      }

      const startDate = new Date(booking.startDate);

      return (
        !Number.isNaN(startDate.getTime()) &&
        startDate > now
      );
    })
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() -
        new Date(b.startDate).getTime(),
    )
    .slice(0, 5);

  const recentBookings = bookings.slice(0, 5);

  const stats = [
    {
      title: "Total Bookings",
      value: dashboardData?.totalBookings ?? 0,
      description: "All booking requests",
      icon: CalendarDays,
      iconStyle: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Active Rentals",
      value: activeRentals.length,
      description: "Currently rented",
      icon: Package,
      iconStyle: "bg-amber-500/10 text-amber-600",
    },
    {
      title: "Completed Rentals",
      value: completedRentals.length,
      description: "Successfully completed",
      icon: CalendarCheck,
      iconStyle: "bg-green-500/10 text-green-600",
    },
    {
      title: "Favorite Equipment",
      value: dashboardData?.favoriteCount ?? 0,
      description: "Saved equipment",
      icon: Heart,
      iconStyle: "bg-rose-500/10 text-rose-600",
    },
  ];

  // ---------------------------------------------------------------------------
  // Main UI
  // ---------------------------------------------------------------------------

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome Section */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-brand-accent">
            CUSTOMER OVERVIEW
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            Welcome back, {user.name}!
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Here&apos;s what&apos;s happening with your equipment
            rentals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => void handleRefresh()}
            disabled={isLoading}
            className="h-11 gap-2 rounded-xl"
          >
            <RefreshCw
              className={`size-4 ${
                isLoading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>

          <Button
            render={<Link href="/equipment" />}
            nativeButton={false}
            className="h-11 gap-2 self-start rounded-xl bg-brand-accent px-5 font-semibold text-primary hover:bg-brand-accent/90 sm:self-auto"
          >
            <Plus className="size-4" />
            Browse Equipment
          </Button>
        </div>
      </section>

      {/* Error Notice */}
      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm text-red-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void handleRefresh()}
            className="shrink-0 text-sm font-semibold text-red-500 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-border bg-background p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex size-11 items-center justify-center rounded-xl ${stat.iconStyle}`}
                >
                  <Icon className="size-5" />
                </div>
              </div>

              <p className="mt-5 text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>

              <div className="mt-1 flex flex-wrap items-end justify-between gap-2">
                <h3 className="text-3xl font-bold tracking-tight text-primary">
                  {stat.value.toLocaleString()}
                </h3>

                <span className="text-xs text-muted-foreground">
                  {stat.description}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Recent Bookings */}
      <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h3 className="text-lg font-bold text-primary">
              Recent Bookings
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              A quick overview of your latest rental activities.
            </p>
          </div>

          <Link
            href="/dashboard/bookings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-brand-accent"
          >
            View All
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-muted/40">
              <tr className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-4">Equipment</th>
                <th className="px-6 py-4">Booking ID</th>
                <th className="px-6 py-4">Start Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {recentBookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="transition-colors hover:bg-muted/20"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-primary">
                      {getEquipmentName(booking.equipment)}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {getEquipmentCategory(booking.equipment)}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {booking.bookingNumber}
                  </td>

                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {formatDate(booking.startDate)}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-primary">
                    {formatCurrency(booking.totalAmount)}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        booking.status,
                      )}`}
                    >
                      {getStatusLabel(booking.status)}
                    </span>
                  </td>
                </tr>
              ))}

              {recentBookings.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center"
                  >
                    <CalendarDays className="mx-auto size-9 text-muted-foreground" />

                    <p className="mt-3 font-semibold text-primary">
                      No bookings yet
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Your booking activities will appear here.
                    </p>

                    <Button
                      render={<Link href="/equipment" />}
                      nativeButton={false}
                      className="mt-4 gap-2"
                    >
                      Browse Equipment
                      <ArrowRight className="size-4" />
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Upcoming Rentals */}
      <section className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-bold text-primary">
              Upcoming Rentals
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Approved equipment bookings scheduled for the future.
            </p>
          </div>

          <Clock3 className="size-5 text-muted-foreground" />
        </div>

        <div className="mt-5 divide-y divide-border">
          {upcomingRentals.map((rental) => (
            <div
              key={rental._id}
              className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
            >
              <div>
                <p className="text-sm font-semibold text-primary">
                  {getEquipmentName(rental.equipment)}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(rental.startDate)}
                  {" · "}
                  {getDurationLabel(rental.duration)}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Booking ID: {rental.bookingNumber}
                </p>
              </div>

              <span className="w-fit rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-700">
                Confirmed
              </span>
            </div>
          ))}

          {upcomingRentals.length === 0 && (
            <div className="py-10 text-center">
              <CalendarCheck className="mx-auto size-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-semibold text-primary">
                No upcoming rentals
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Your approved future bookings will appear here.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
