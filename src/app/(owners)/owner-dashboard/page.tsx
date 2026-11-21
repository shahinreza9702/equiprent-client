
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Package,
  Plus,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const stats = [
  {
    label: "Total Equipment",
    value: "24",
    change: "+3 this month",
    trend: "up",
    icon: Package,
    iconColor: "bg-blue-50 text-blue-600",
  },
  {
    label: "Active Bookings",
    value: "12",
    change: "+2 this week",
    trend: "up",
    icon: CalendarDays,
    iconColor: "bg-green-50 text-green-600",
  },
  {
    label: "Pending Requests",
    value: "05",
    change: "Needs attention",
    trend: "neutral",
    icon: Clock3,
    iconColor: "bg-amber-50 text-amber-600",
  },
  {
    label: "Total Earnings",
    value: "৳85,500",
    change: "+12.5% this month",
    trend: "up",
    icon: Wallet,
    iconColor: "bg-purple-50 text-purple-600",
  },
];

const monthlyRevenue = [
  { month: "Jan", amount: 35 },
  { month: "Feb", amount: 48 },
  { month: "Mar", amount: 40 },
  { month: "Apr", amount: 65 },
  { month: "May", amount: 52 },
  { month: "Jun", amount: 80 },
  { month: "Jul", amount: 60 },
  { month: "Aug", amount: 92 },
  { month: "Sep", amount: 72 },
  { month: "Oct", amount: 85 },
  { month: "Nov", amount: 100 },
  { month: "Dec", amount: 75 },
];

const recentBookings = [
  {
    id: "BK-2026-104",
    customer: "Rahim Ahmed",
    equipment: "Professional Excavator",
    date: "Nov 21, 2026",
    amount: 22500,
    status: "Pending",
  },
  {
    id: "BK-2026-103",
    customer: "Karim Hasan",
    equipment: "Canon EOS R5 Camera",
    date: "Nov 20, 2026",
    amount: 7500,
    status: "Confirmed",
  },
  {
    id: "BK-2026-102",
    customer: "Nusrat Jahan",
    equipment: "Toyota Hiace",
    date: "Nov 19, 2026",
    amount: 12000,
    status: "Active",
  },
];

const topEquipment = [
  {
    name: "Professional Excavator",
    category: "Construction",
    bookings: 18,
    earnings: 45000,
    availability: "Rented",
  },
  {
    name: "Canon EOS R5 Camera",
    category: "Photography",
    bookings: 14,
    earnings: 32000,
    availability: "Available",
  },
  {
    name: "Toyota Hiace",
    category: "Transportation",
    bookings: 11,
    earnings: 28500,
    availability: "Available",
  },
];

function getBookingStatusStyle(status: string) {
  switch (status) {
    case "Confirmed":
      return "bg-blue-50 text-blue-700";
    case "Active":
      return "bg-green-50 text-green-700";
    case "Pending":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default function OwnerDashboardPage() {
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
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
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
                {stat.value}
              </h3>

              <div className="mt-2 flex items-center gap-1.5">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="size-4 text-green-600" />
                ) : (
                  <Clock3 className="size-4 text-amber-600" />
                )}

                <span
                  className={`text-xs font-medium ${
                    stat.trend === "up"
                      ? "text-green-600"
                      : "text-amber-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </article>
          );
        })}
      </section>

      {/* Revenue and Quick Actions */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Revenue Chart */}
        <div className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-bold text-primary">
                Revenue Overview
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Monthly rental revenue performance.
              </p>
            </div>

            <div className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground">
              Year: 2026
            </div>
          </div>

          <div className="mt-8 flex h-64 items-end gap-2 border-b border-border pb-2 sm:gap-4">
            {monthlyRevenue.map((item) => (
              <div
                key={item.month}
                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
              >
                <div
                  className="w-full max-w-10 rounded-t-md bg-primary transition-all duration-300 hover:bg-brand-accent"
                  style={{ height: `${item.amount}%` }}
                  title={`${item.month}: ${item.amount}% of peak monthly revenue`}
                />

                <span className="text-[10px] font-medium text-muted-foreground sm:text-xs">
                  {item.month}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">
                Total Revenue
              </p>

              <p className="mt-1 text-2xl font-bold text-primary">
                ৳85,500
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-green-600">
              <TrendingUp className="size-4" />
              12.5% growth
            </div>
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

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-muted/40">
              <tr className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-4">Customer / Booking</th>
                <th className="px-6 py-4">Equipment</th>
                <th className="px-6 py-4">Request Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {recentBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="transition-colors hover:bg-muted/20"
                >
                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold text-primary">
                      {booking.customer}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {booking.id}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-primary">
                      {booking.equipment}
                    </p>
                  </td>

                  <td className="px-6 py-5 text-sm text-muted-foreground">
                    {booking.date}
                  </td>

                  <td className="px-6 py-5 text-sm font-semibold text-primary">
                    ৳{booking.amount.toLocaleString("en-BD")}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBookingStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border px-6 py-4">
          <p className="text-xs text-muted-foreground">
            Showing sample booking requests. Live booking data will be
            connected later.
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

        <div className="divide-y divide-border">
          {topEquipment.map((equipment) => (
            <div
              key={equipment.name}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Package className="size-5" />
                </div>

                <div>
                  <p className="font-semibold text-primary">
                    {equipment.name}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {equipment.category} · {equipment.bookings} bookings
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-5 sm:justify-end">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Rental Earnings
                  </p>

                  <p className="mt-1 font-bold text-primary">
                    ৳{equipment.earnings.toLocaleString("en-BD")}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    equipment.availability === "Rented"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  {equipment.availability}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Notice */}
      <p className="text-center text-xs text-muted-foreground">
        Dashboard statistics and business activities are sample data for
        demonstration. Live information will be connected through the API.
      </p>
    </div>
  );
}
