
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Package,
  Plus,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";

interface DashboardSummary {
  totalEquipment: number;
  approvedEquipment: number;
  pendingEquipment: number;
  rejectedEquipment: number;
  availableEquipment: number;
  unavailableEquipment: number;
}

const statCards = [
  {
    label: "Total Equipment",
    key: "totalEquipment",
    icon: Package,
    iconColor: "bg-blue-50 text-blue-600",
  },
  {
    label: "Approved Equipment",
    key: "approvedEquipment",
    icon: TrendingUp,
    iconColor: "bg-green-50 text-green-600",
  },
  {
    label: "Pending Approval",
    key: "pendingEquipment",
    icon: Clock3,
    iconColor: "bg-amber-50 text-amber-600",
  },
  {
    label: "Available Equipment",
    key: "availableEquipment",
    icon: Wallet,
    iconColor: "bg-purple-50 text-purple-600",
  },
] as const;


export default function OwnerDashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardSummary = useCallback(() => {
    return apiRequest<DashboardSummary>(
      "/equipments/owner/dashboard-summary",
    );
  }, []);

  useEffect(() => {
    let isActive = true;

    fetchDashboardSummary()
      .then((response) => {
        if (!isActive) return;

        setSummary(response.data ?? null);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!isActive) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard information.",
        );
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [fetchDashboardSummary]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);

    fetchDashboardSummary()
      .then((response) => {
        setSummary(response.data ?? null);
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard information.",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };


  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="flex flex-col justify-between gap-5 rounded-2xl bg-primary p-6 text-primary-foreground shadow-sm sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="text-sm font-medium text-white/70">
            Owner Workspace
          </p>

          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Welcome back, Owner!
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
            Manage your equipment, track booking requests, and monitor
            your rental business performance from one place.
          </p>
        </div>

        <Button
          className="shrink-0 gap-2 bg-brand-accent text-primary hover:bg-brand-accent/90"
          render={<Link href="/owner-dashboard/add-equipment" />}
          nativeButton={false}
        >
          <Plus className="size-4" />
          Add Equipment
        </Button>
      </section>

      {/* Statistics */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            const value = summary?.[stat.key];

            return (
              <article
                key={stat.key}
                className="rounded-2xl border border-border bg-background p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>

                  <div
                    className={`flex size-11 items-center justify-center rounded-xl ${stat.iconColor}`}
                  >
                    <Icon className="size-5" />
                  </div>
                </div>

                <h3 className="mt-4 text-2xl font-bold tracking-tight text-primary">
                  {isLoading ? "..." : error ? "—" : (value ?? 0)}
                </h3>

                <p className="mt-2 text-xs text-muted-foreground">
                  {isLoading
                    ? "Loading information..."
                    : error
                      ? "Unable to retrieve data"
                      : "Current equipment statistics"}
                </p>
              </article>
            );
          })}
        </div>

        {error && (
          <div className="flex flex-col justify-between gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 sm:flex-row sm:items-center">
            <p className="text-sm text-destructive">{error}</p>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              disabled={isLoading}
            >
              Try Again
            </Button>
          </div>
        )}
      </section>

      {/* Revenue and Quick Actions */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Revenue Overview */}
        <div className="flex min-h-[320px] flex-col rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div>
            <h3 className="text-lg font-bold text-primary">
              Revenue Overview
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Monthly rental revenue performance.
            </p>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <Wallet className="size-7" />
            </div>

            <h4 className="mt-4 font-semibold text-primary">
              Revenue analytics coming soon
            </h4>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Revenue information will appear here once the booking
              and payment features are integrated.
            </p>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Revenue statistics are not available yet.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
          <h3 className="text-lg font-bold text-primary">
            Quick Actions
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your rental business.
          </p>

          <div className="mt-6 space-y-3">
            <Link
              href="/owner-dashboard/add-equipment"
              className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary/30 hover:bg-muted/40"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Plus className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-primary">
                  Add New Equipment
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Create a new listing
                </p>
              </div>

              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>

            <Link
              href="/owner-dashboard/bookings"
              className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary/30 hover:bg-muted/40"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <CalendarDays className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-primary">
                  Manage Bookings
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Review booking requests
                </p>
              </div>

              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>

            <Link
              href="/owner-dashboard/equipment"
              className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary/30 hover:bg-muted/40"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <Package className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-primary">
                  My Equipment
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Manage existing listings
                </p>
              </div>

              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>

            <Link
              href="/owner-dashboard/earnings"
              className="flex items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary/30 hover:bg-muted/40"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <Wallet className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-primary">
                  View Earnings
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Track your revenue
                </p>
              </div>

              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Booking Requests */}
      <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h3 className="text-lg font-bold text-primary">
              Recent Booking Requests
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Review the latest customer booking activity.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            render={<Link href="/owner-dashboard/bookings" />}
            nativeButton={false}
          >
            View All
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="flex min-h-52 flex-col items-center justify-center px-5 py-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <CalendarDays className="size-6" />
          </div>

          <h4 className="mt-4 font-semibold text-primary">
            Booking information unavailable
          </h4>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Your recent booking requests will appear here once the
            booking management feature is available.
          </p>
        </div>
      </section>

      {/* Top Performing Equipment */}
      <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h3 className="text-lg font-bold text-primary">
              Top Performing Equipment
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Equipment generating the most rental activity.
            </p>
          </div>

          <Link
            href="/owner-dashboard/equipment"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-brand-accent"
          >
            Manage Equipment
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="flex min-h-48 flex-col items-center justify-center px-5 py-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <Package className="size-6" />
          </div>

          <h4 className="mt-4 font-semibold text-primary">
            Equipment performance coming soon
          </h4>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Booking and rental performance information will appear
            here when the required backend features are available.
          </p>
        </div>
      </section>

      {/* Dashboard Notice */}
      <p className="text-center text-xs text-muted-foreground">
        Equipment statistics are connected to live dashboard data.
        Booking and revenue analytics are coming soon.
      </p>
    </div>
  );
}
