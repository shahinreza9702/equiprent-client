
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  PackageCheck,
  Search,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const bookings = [
  {
    id: "BK-2026-001",
    equipment: "Professional Excavator",
    category: "Construction Equipment",
    image: "/images/equipment/excavator.jpg",
    startDate: "Nov 18, 2026",
    endDate: "Nov 23, 2026",
    total: 22500,
    payment: "Paid",
    status: "Active",
  },
  {
    id: "BK-2026-002",
    equipment: "Canon EOS R5 Camera",
    category: "Photography Equipment",
    image: "/images/equipment/camera.jpg",
    startDate: "Nov 25, 2026",
    endDate: "Nov 28, 2026",
    total: 7500,
    payment: "Pending",
    status: "Pending",
  },
  {
    id: "BK-2026-003",
    equipment: "Toyota Hiace",
    category: "Vehicles & Transportation",
    image: "/images/equipment/hiace.jpg",
    startDate: "Nov 05, 2026",
    endDate: "Nov 07, 2026",
    total: 12000,
    payment: "Paid",
    status: "Completed",
  },
];

const summaryCards = [
  {
    label: "Total Bookings",
    value: "12",
    icon: CalendarDays,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Active Bookings",
    value: "03",
    icon: PackageCheck,
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Pending Bookings",
    value: "02",
    icon: Clock3,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Cancelled Bookings",
    value: "01",
    icon: XCircle,
    color: "bg-red-50 text-red-600",
  },
];

function getStatusStyle(status: string) {
  switch (status) {
    case "Active":
      return "bg-green-50 text-green-700";
    case "Completed":
      return "bg-blue-50 text-blue-700";
    case "Pending":
      return "bg-amber-50 text-amber-700";
    case "Cancelled":
      return "bg-red-50 text-red-700";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getPaymentStyle(payment: string) {
  return payment === "Paid"
    ? "text-green-700"
    : "text-amber-700";
}

export default function MyBookingsPage() {
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

        <Button
          className="w-full gap-2 bg-brand-accent text-primary hover:bg-brand-accent/90 sm:w-auto"
          render={<Link href="/equipment" />}
          nativeButton={false}
        >
          Browse Equipment
          <ArrowRight className="size-4" />
        </Button>
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
                <div className={`flex size-11 items-center justify-center rounded-xl ${card.color}`}>
                  <Icon className="size-5" />
                </div>
              </div>

              <p className="mt-4 text-3xl font-bold text-primary">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bookings List */}
      <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h3 className="text-lg font-bold text-primary">
              Booking History
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your recent equipment rental activities.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search bookings..."
              aria-label="Search bookings"
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm outline-none transition focus:border-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
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
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="transition-colors hover:bg-muted/20"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                        <PackageCheck className="size-5 text-muted-foreground" />
                      </div>

                      <div>
                        <p className="font-semibold text-primary">
                          {booking.equipment}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {booking.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-primary">
                      {booking.startDate}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      to {booking.endDate}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="font-semibold text-primary">
                      ৳{booking.total.toLocaleString("en-BD")}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <span className={`text-sm font-semibold ${getPaymentStyle(booking.payment)}`}>
                      {booking.payment === "Paid" && (
                        <CheckCircle2 className="mr-1 inline size-4" />
                      )}
                      {booking.payment}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled
                      title="Booking details will be available later"
                    >
                      Details
                      <ArrowRight className="size-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border px-6 py-4">
          <p className="text-xs text-muted-foreground">
            Showing {bookings.length} sample bookings. Real booking data will be connected later.
          </p>
        </div>
      </section>
    </div>
  );
}
