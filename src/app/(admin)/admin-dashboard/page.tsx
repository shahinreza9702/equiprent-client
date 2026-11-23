
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Package,
  ClipboardList,
  Wallet,
  ArrowUpRight,
  ArrowRight,
  Clock3,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

// API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

// API response types
interface AdminOverview {
  stats: {
    totalUsers: number;
    totalEquipment: number;
    totalBookings: number;
    pendingEquipment: number;
    pendingBookings: number;
    confirmedBookingValue: number;
  };

  monthlyBookingValue: {
    month: string;
    value: number;
  }[];

  recentUsers: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
  }[];

  pendingEquipments: {
    id: string;
    name: string;
    category: string;
    location: string;
    image: string;
    createdAt: string;
    owner: {
      id: string;
      name: string;
      email: string;
    } | null;
  }[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Quick Actions
const quickActions = [
  {
    title: "Manage Users",
    description: "View and manage platform users",
    href: "/admin-dashboard/users",
    icon: Users,
  },
  {
    title: "Review Equipment",
    description: "Approve or reject equipment",
    href: "/admin-dashboard/equipment",
    icon: Package,
  },
  {
    title: "Manage Bookings",
    description: "Monitor all rental bookings",
    href: "/admin-dashboard/bookings",
    icon: ClipboardList,
  },
];

// Formatting helpers
const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-BD").format(value);

const formatCurrency = (value: number) =>
  `৳${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value)}`;

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

const formatMonth = (month: string) => {
  const [year, monthNumber] = month.split("-").map(Number);

  return new Intl.DateTimeFormat("en", {
    month: "short",
  }).format(new Date(year, monthNumber - 1, 1));
};

const formatLabel = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch dashboard overview
  useEffect(() => {
    let isActive = true;

    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/admin/overview`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const result: ApiResponse<AdminOverview> =
          await response.json();

        if (!response.ok || !result.success || !result.data) {
          throw new Error(
            result.message || "Failed to load dashboard overview.",
          );
        }

        if (isActive) {
          setOverview(result.data);
        }
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading dashboard data.",
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void fetchOverview();

    return () => {
      isActive = false;
    };
  }, [retryCount]);

  const currentDate = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  const stats = overview
    ? [
        {
          title: "Total Users",
          value: formatNumber(overview.stats.totalUsers),
          description: "Registered platform members",
          icon: Users,
        },
        {
          title: "Total Equipment",
          value: formatNumber(overview.stats.totalEquipment),
          description: "Across all categories",
          icon: Package,
        },
        {
          title: "Total Bookings",
          value: formatNumber(overview.stats.totalBookings),
          description: `${formatNumber(overview.stats.pendingBookings)} pending bookings`,
          icon: ClipboardList,
        },
        {
          title: "Confirmed Booking Value",
          value: formatCurrency(
            overview.stats.confirmedBookingValue,
          ),
          description: "Approved and completed bookings",
          icon: Wallet,
        },
      ]
    : [];

  const monthlyBookingValue =
    overview?.monthlyBookingValue ?? [];

  const maxBookingValue = Math.max(
    ...monthlyBookingValue.map((item) => item.value),
    0,
  );

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" />
            Platform Administration
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Admin Overview
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Monitor platform activity and manage your rental marketplace.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground">
          <Clock3 className="size-4" />
          {currentDate}
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-border bg-background">
          <RefreshCw className="size-7 animate-spin text-primary" />

          <p className="text-sm text-muted-foreground">
            Loading dashboard overview...
          </p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-border bg-background p-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <RefreshCw className="size-5" />
          </div>

          <div>
            <h3 className="font-semibold text-foreground">
              Unable to load dashboard
            </h3>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {error}
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            <RefreshCw className="mr-2 size-4" />
            Try Again
          </Button>
        </div>
      )}

      {/* Dashboard Content */}
      {!loading && !error && overview && (
        <>
          {/* Statistics */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-xl border border-border bg-background p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>

                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <p className="mt-5 text-2xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </p>

                  <p className="mt-3 text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </section>

          {/* Revenue and Quick Actions */}
          <section className="grid gap-6 xl:grid-cols-3">
            {/* Monthly Booking Value Chart */}
            <div className="rounded-xl border border-border bg-background p-5 shadow-sm xl:col-span-2 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Booking Value Overview
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Monthly value of approved and completed bookings
                  </p>
                </div>

                <span className="rounded-lg bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
                  Last 6 months
                </span>
              </div>

              <div className="mt-8 flex h-64 items-end justify-between gap-3 border-b border-border pb-2 sm:gap-5">
                {monthlyBookingValue.map((item) => {
                  const barHeight =
                    maxBookingValue > 0
                      ? (item.value / maxBookingValue) * 100
                      : 0;

                  return (
                    <div
                      key={item.month}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                    >
                      <div className="flex h-full w-full items-end justify-center">
                        <div
                          className="w-full max-w-12 rounded-t-md bg-primary transition-all hover:bg-brand-accent"
                          style={{
                            height: `${barHeight}%`,
                          }}
                          title={`${formatMonth(item.month)}: ${formatCurrency(item.value)}`}
                        />
                      </div>

                      <span className="text-xs text-muted-foreground">
                        {formatMonth(item.month)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Confirmed Booking Value
                  </p>

                  <p className="mt-1 text-xl font-bold text-foreground">
                    {formatCurrency(
                      overview.stats.confirmedBookingValue,
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                  <TrendingUp className="size-4" />
                  <span>6 months</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-border bg-background p-5 shadow-sm sm:p-6">
              <h3 className="text-lg font-semibold text-foreground">
                Quick Actions
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Common administration tasks
              </p>

              <div className="mt-6 space-y-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="group flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:border-primary/40 hover:bg-muted/50"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          {action.title}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {action.description}
                        </p>
                      </div>

                      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Recent Registrations */}
          <section className="rounded-xl border border-border bg-background shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5 sm:p-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Recent Registrations
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Recently joined platform members
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                render={<Link href="/admin-dashboard/users" />}
                nativeButton={false}
              >
                View All
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">User</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Joined Date</th>
                    <th className="px-6 py-4 text-right font-medium">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {overview.recentUsers.length > 0 ? (
                    overview.recentUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4">
                          <p className="font-medium text-foreground">
                            {user.name}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {formatLabel(user.role)}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-medium ${
                              user.status === "active"
                                ? "text-emerald-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {user.status === "active" && (
                              <CheckCircle2 className="size-3.5" />
                            )}

                            {formatLabel(user.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-10 text-center text-sm text-muted-foreground"
                      >
                        No recent registrations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Pending Equipment */}
          <section className="rounded-xl border border-border bg-background shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5 sm:p-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Pending Equipment Approval
                  </h3>

                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                    {formatNumber(overview.stats.pendingEquipment)} Pending
                  </span>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  Equipment awaiting administrator review
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                render={<Link href="/admin-dashboard/equipment" />}
                nativeButton={false}
              >
                Review All
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>

            <div className="divide-y divide-border">
              {overview.pendingEquipments.length > 0 ? (
                overview.pendingEquipments.map((equipment) => (
                  <div
                    key={equipment.id}
                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Package className="size-5" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {equipment.name}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {equipment.owner?.name ?? "Unknown owner"} ·{" "}
                          {equipment.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(equipment.createdAt)}
                      </span>

                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        Pending
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                  No equipment is waiting for approval.
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
