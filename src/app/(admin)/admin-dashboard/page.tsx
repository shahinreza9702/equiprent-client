
import Link from "next/link";
import {
  Users,
  Package,
  ClipboardList,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Clock3,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const stats = [
  {
    title: "Total Users",
    value: "1,284",
    change: "+12.5%",
    description: "Compared to last month",
    icon: Users,
  },
  {
    title: "Total Equipment",
    value: "486",
    change: "+8.2%",
    description: "Across all categories",
    icon: Package,
  },
  {
    title: "Total Bookings",
    value: "2,846",
    change: "+18.4%",
    description: "Compared to last month",
    icon: ClipboardList,
  },
  {
    title: "Total Revenue",
    value: "৳8,45,600",
    change: "+15.3%",
    description: "Compared to last month",
    icon: Wallet,
  },
];

const monthlyRevenue = [
  { month: "Jun", revenue: 42 },
  { month: "Jul", revenue: 58 },
  { month: "Aug", revenue: 48 },
  { month: "Sep", revenue: 72 },
  { month: "Oct", revenue: 63 },
  { month: "Nov", revenue: 88 },
];

const recentUsers = [
  {
    name: "Rahim Ahmed",
    email: "rahim@example.com",
    role: "Customer",
    date: "Nov 21, 2026",
  },
  {
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    role: "Owner",
    date: "Nov 20, 2026",
  },
  {
    name: "Tanvir Hasan",
    email: "tanvir@example.com",
    role: "Customer",
    date: "Nov 19, 2026",
  },
  {
    name: "Sadia Islam",
    email: "sadia@example.com",
    role: "Owner",
    date: "Nov 18, 2026",
  },
];

const pendingEquipment = [
  {
    name: "Professional Excavator",
    owner: "Karim Enterprise",
    category: "Construction",
    submitted: "2 hours ago",
  },
  {
    name: "Canon EOS R6 Camera",
    owner: "Creative Studio",
    category: "Photography",
    submitted: "5 hours ago",
  },
  {
    name: "Toyota Hiace 2022",
    owner: "Travel Solutions",
    category: "Vehicles",
    submitted: "1 day ago",
  },
];

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

export default function AdminDashboardPage() {
  const maxRevenue = Math.max(
    ...monthlyRevenue.map((item) => item.revenue)
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
          November 2026
        </div>
      </section>

      {/* Demo Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
        <AlertCircle className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Demo Dashboard</p>
          <p className="mt-1 text-xs leading-5 opacity-80">
            The statistics and records displayed here are sample data.
            Live platform analytics will be connected through the backend.
          </p>
        </div>
      </div>

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

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <TrendingUp className="size-3.5" />
                  {stat.change}
                </span>

                <span className="text-xs text-muted-foreground">
                  {stat.description}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Revenue and Quick Actions */}
      <section className="grid gap-6 xl:grid-cols-3">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-border bg-background p-5 shadow-sm xl:col-span-2 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Revenue Overview
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Monthly platform revenue performance
              </p>
            </div>

            <span className="rounded-lg bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
              Last 6 months
            </span>
          </div>

          <div className="mt-8 flex h-64 items-end justify-between gap-3 border-b border-border pb-2 sm:gap-5">
            {monthlyRevenue.map((item) => (
              <div
                key={item.month}
                className="flex h-full flex-1 flex-col items-center justify-end gap-3"
              >
                <div className="flex h-full w-full items-end justify-center">
                  <div
                    className="w-full max-w-12 rounded-t-md bg-primary transition-all hover:bg-brand-accent"
                    style={{
                      height: `${(item.revenue / maxRevenue) * 100}%`,
                    }}
                    title={`${item.month}: ${item.revenue}%`}
                  />
                </div>

                <span className="text-xs text-muted-foreground">
                  {item.month}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">
                Total Revenue
              </p>
              <p className="mt-1 text-xl font-bold text-foreground">
                ৳8,45,600
              </p>
            </div>

            <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
              <TrendingUp className="size-4" />
              15.3%
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

      {/* Recent Users */}
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
                <th className="px-6 py-4 text-right font-medium">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {recentUsers.map((user) => (
                <tr key={user.email}>
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
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-muted-foreground">
                    {user.date}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <CheckCircle2 className="size-3.5" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
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
                {pendingEquipment.length} Pending
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
          {pendingEquipment.map((equipment) => (
            <div
              key={equipment.name}
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
                    {equipment.owner} · {equipment.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <span className="text-xs text-muted-foreground">
                  {equipment.submitted}
                </span>

                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  Pending
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
