
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  CalendarDays,
  Clock3,
  Heart,
  Package,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const stats = [
  {
    title: "Total Bookings",
    value: "12",
    change: "+2 this month",
    icon: CalendarDays,
    trend: "up",
    iconStyle: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Active Rentals",
    value: "03",
    change: "Currently rented",
    icon: Package,
    trend: "neutral",
    iconStyle: "bg-amber-500/10 text-amber-600",
  },
  {
    title: "Completed Rentals",
    value: "09",
    change: "Successfully completed",
    icon: CalendarCheck,
    trend: "up",
    iconStyle: "bg-green-500/10 text-green-600",
  },
  {
    title: "Favorite Equipment",
    value: "08",
    change: "Saved equipment",
    icon: Heart,
    trend: "neutral",
    iconStyle: "bg-rose-500/10 text-rose-600",
  },
];

const recentBookings = [
  {
    id: "BK-2026-001",
    equipment: "Professional Excavator",
    category: "Construction Equipment",
    date: "Nov 18, 2026",
    duration: "5 Days",
    amount: "৳22,500",
    status: "Active",
    statusStyle: "bg-green-500/10 text-green-700",
  },
  {
    id: "BK-2026-002",
    equipment: "Canon EOS R5 Camera",
    category: "Photography Equipment",
    date: "Nov 15, 2026",
    duration: "3 Days",
    amount: "৳7,500",
    status: "Pending",
    statusStyle: "bg-amber-500/10 text-amber-700",
  },
  {
    id: "BK-2026-003",
    equipment: "Toyota Hiace",
    category: "Vehicles & Transportation",
    date: "Nov 10, 2026",
    duration: "2 Days",
    amount: "৳12,000",
    status: "Completed",
    statusStyle: "bg-blue-500/10 text-blue-700",
  },
];

const upcomingRentals = [
  {
    equipment: "Canon EOS R5 Camera",
    date: "November 25, 2026",
    duration: "3 Days",
    status: "Confirmed",
  },
  {
    equipment: "Professional Drone",
    date: "December 02, 2026",
    duration: "2 Days",
    status: "Upcoming",
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome Section */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-brand-accent">
            CUSTOMER OVERVIEW
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            Welcome back, Customer!
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Here&apos;s what&apos;s happening with your equipment rentals.
          </p>
        </div>

        <Button
          render={<Link href="/equipment" />}
          nativeButton={false}
          className="h-11 gap-2 self-start rounded-xl bg-brand-accent px-5 font-semibold text-primary hover:bg-brand-accent/90 sm:self-auto"
        >
          <Plus className="size-4" />
          Browse Equipment
        </Button>
      </section>

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
                <div className={`flex size-11 items-center justify-center rounded-xl ${stat.iconStyle}`}>
                  <Icon className="size-5" />
                </div>

                {stat.trend === "up" && (
                  <ArrowUpRight className="size-4 text-green-600" />
                )}
                {stat.trend === "down" && (
                  <ArrowDownRight className="size-4 text-red-600" />
                )}
              </div>

              <p className="mt-5 text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>

              <div className="mt-1 flex flex-wrap items-end justify-between gap-2">
                <h3 className="text-3xl font-bold tracking-tight text-primary">
                  {stat.value}
                </h3>

                <span className="text-xs text-muted-foreground">
                  {stat.change}
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
                  key={booking.id}
                  className="transition-colors hover:bg-muted/20"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-primary">
                      {booking.equipment}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {booking.category}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {booking.id}
                  </td>

                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {booking.date}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-primary">
                    {booking.amount}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${booking.statusStyle}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
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
              Equipment scheduled for your upcoming projects.
            </p>
          </div>

          <Clock3 className="size-5 text-muted-foreground" />
        </div>

        <div className="mt-5 divide-y divide-border">
          {upcomingRentals.map((rental) => (
            <div
              key={rental.equipment}
              className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
            >
              <div>
                <p className="text-sm font-semibold text-primary">
                  {rental.equipment}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {rental.date} · {rental.duration}
                </p>
              </div>

              <span className="w-fit rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-700">
                {rental.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
