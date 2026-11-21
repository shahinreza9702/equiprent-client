
"use client";

import { useState } from "react";
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
  Check,
  Ban,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type BookingStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Completed";

type PaymentStatus = "Paid" | "Pending" | "Refunded";

type AdminBooking = {
  id: string;
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
};

const initialBookings: AdminBooking[] = [
  {
    id: "BK-2001",
    customer: "Sabbir Hossain",
    email: "sabbir@example.com",
    phone: "+880 1712-345678",
    equipment: "Professional Excavator",
    owner: "Rahim Ahmed",
    startDate: "2026-11-22",
    endDate: "2026-11-25",
    location: "Dhaka",
    amount: 13500,
    paymentStatus: "Paid",
    status: "Approved",
    bookingDate: "2026-11-15",
  },
  {
    id: "BK-2002",
    customer: "Nusrat Jahan",
    email: "nusrat@example.com",
    phone: "+880 1812-456789",
    equipment: "Canon EOS R5 Camera",
    owner: "Karim Uddin",
    startDate: "2026-11-24",
    endDate: "2026-11-26",
    location: "Chattogram",
    amount: 5000,
    paymentStatus: "Pending",
    status: "Pending",
    bookingDate: "2026-11-17",
  },
  {
    id: "BK-2003",
    customer: "Tanvir Hasan",
    email: "tanvir@example.com",
    phone: "+880 1912-567890",
    equipment: "Toyota Hiace",
    owner: "Mahmud Hasan",
    startDate: "2026-11-20",
    endDate: "2026-11-22",
    location: "Dhaka",
    amount: 12000,
    paymentStatus: "Paid",
    status: "Approved",
    bookingDate: "2026-11-14",
  },
  {
    id: "BK-2004",
    customer: "Farhana Akter",
    email: "farhana@example.com",
    phone: "+880 1612-678901",
    equipment: "Event Sound System",
    owner: "Sabbir Hossain",
    startDate: "2026-11-28",
    endDate: "2026-11-29",
    location: "Sylhet",
    amount: 1200,
    paymentStatus: "Pending",
    status: "Pending",
    bookingDate: "2026-11-18",
  },
  {
    id: "BK-2005",
    customer: "Mahmud Hasan",
    email: "mahmud@example.com",
    phone: "+880 1512-789012",
    equipment: "Professional Drone",
    owner: "Tanvir Hasan",
    startDate: "2026-10-15",
    endDate: "2026-10-17",
    location: "Chattogram",
    amount: 4500,
    paymentStatus: "Paid",
    status: "Completed",
    bookingDate: "2026-10-10",
  },
  {
    id: "BK-2006",
    customer: "Abdul Karim",
    email: "abdul@example.com",
    phone: "+880 1712-890123",
    equipment: "Heavy Duty Generator",
    owner: "Rahim Ahmed",
    startDate: "2026-11-26",
    endDate: "2026-11-28",
    location: "Rajshahi",
    amount: 3600,
    paymentStatus: "Refunded",
    status: "Rejected",
    bookingDate: "2026-11-16",
  },
  {
    id: "BK-2007",
    customer: "Karim Uddin",
    email: "karim@example.com",
    phone: "+880 1812-901234",
    equipment: "Agricultural Power Tiller",
    owner: "Abdul Karim",
    startDate: "2026-11-19",
    endDate: "2026-11-21",
    location: "Rangpur",
    amount: 4000,
    paymentStatus: "Paid",
    status: "Completed",
    bookingDate: "2026-11-12",
  },
];

const bookingFilters = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
  "Completed",
] as const;

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState(initialBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<(typeof bookingFilters)[number]>("All");
  const [selectedBooking, setSelectedBooking] =
    useState<AdminBooking | null>(null);

  const totalBookings = bookings.length;

  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending"
  ).length;

  const approvedCount = bookings.filter(
    (booking) => booking.status === "Approved"
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  const query = searchQuery.trim().toLowerCase();

  const filteredBookings = bookings.filter((booking) => {
    const matchesFilter =
      activeFilter === "All" ||
      booking.status === activeFilter;

    const matchesSearch =
      !query ||
      booking.id.toLowerCase().includes(query) ||
      booking.customer.toLowerCase().includes(query) ||
      booking.equipment.toLowerCase().includes(query) ||
      booking.owner.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const updateStatus = (
    id: string,
    status: BookingStatus
  ) => {
    setBookings((previous) =>
      previous.map((booking) =>
        booking.id === id ? { ...booking, status } : booking
      )
    );

    setSelectedBooking((previous) =>
      previous?.id === id
        ? { ...previous, status }
        : previous
    );
  };

  const statusStyles: Record<BookingStatus, string> = {
    Pending: "bg-amber-50 text-amber-700",
    Approved: "bg-blue-50 text-blue-700",
    Rejected: "bg-red-50 text-red-700",
    Completed: "bg-emerald-50 text-emerald-700",
  };

  const paymentStyles: Record<PaymentStatus, string> = {
    Paid: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Refunded: "bg-red-50 text-red-700",
  };

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
            Monitor rental bookings and manage their status across the platform.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm">
          <ClipboardList className="size-4 text-muted-foreground" />
          <span className="font-medium text-primary">
            {totalBookings} Bookings
          </span>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-blue-600" />
        <div>
          <p className="text-sm font-semibold text-blue-900">
            Demo Preview
          </p>
          <p className="mt-1 text-sm leading-6 text-blue-800">
            Booking records are sample data. Status changes are temporary
            and will reset when the page reloads. Payment information is
            for demonstration only.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          icon={<ClipboardList className="size-5" />}
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Pending Requests"
          value={pendingCount}
          icon={<Clock3 className="size-5" />}
          iconClass="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Approved Bookings"
          value={approvedCount}
          icon={<CheckCircle2 className="size-5" />}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Completed Bookings"
          value={completedCount}
          icon={<CheckCircle2 className="size-5" />}
          iconClass="bg-purple-50 text-purple-600"
        />
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
                placeholder="Search ID, customer or equipment..."
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* Status Filters */}
          <div className="mt-5 flex flex-wrap gap-2">
            {bookingFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  activeFilter === filter
                    ? "bg-primary text-white"
                    : "border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {filter}
                {filter === "Pending" && pendingCount > 0 && (
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
                <th className="px-5 py-4 font-semibold">Booking</th>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Equipment</th>
                <th className="px-5 py-4 font-semibold">Rental Period</th>
                <th className="px-5 py-4 font-semibold">Amount</th>
                <th className="px-5 py-4 font-semibold">Payment</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-primary">
                      {booking.id}
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
                    ৳{booking.amount.toLocaleString("en-US")}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${paymentStyles[booking.paymentStatus]}`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}
                    >
                      {booking.status}
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
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center"
                  >
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

        <div className="border-t border-border px-5 py-4">
          <p className="text-xs text-muted-foreground">
            Showing {filteredBookings.length} of {totalBookings} booking records
          </p>
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
                {selectedBooking.id}
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
            </div>
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
                    {selectedBooking.paymentStatus}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Total Booking Amount
                </p>
                <p className="mt-1 text-xl font-bold text-primary">
                  ৳{selectedBooking.amount.toLocaleString("en-US")}
                </p>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="mt-6 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">
                Booking Status
              </p>
              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedBooking.status]}`}
              >
                {selectedBooking.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedBooking.status === "Pending" && (
                <>
                  <Button
                    size="sm"
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() =>
                      updateStatus(selectedBooking.id, "Approved")
                    }
                  >
                    <Check className="size-4" />
                    Approve
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      updateStatus(selectedBooking.id, "Rejected")
                    }
                  >
                    <Ban className="size-4" />
                    Reject
                  </Button>
                </>
              )}

              {selectedBooking.status === "Approved" && (
                <Button
                  size="sm"
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() =>
                    updateStatus(selectedBooking.id, "Completed")
                  }
                >
                  <CheckCircle2 className="size-4" />
                  Mark Completed
                </Button>
              )}
            </div>
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
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
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
        {value.toLocaleString("en-US")}
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
