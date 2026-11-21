
"use client";

import { useState } from "react";
import Link from "next/link";
import {
    CalendarDays,
    Check,
    CheckCircle2,
    Clock3,
    Eye,
    Filter,
    MapPin,
    Search,
    X,
    XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type BookingStatus = "Pending" | "Approved" | "Rejected" | "Completed";

interface Booking {
    id: string;
    customer: string;
    email: string;
    phone: string;
    equipment: string;
    category: string;
    startDate: string;
    endDate: string;
    duration: number;
    amount: number;
    location: string;
    status: BookingStatus;
    requestedAt: string;
}

const initialBookings: Booking[] = [
    {
        id: "BK-2026-001",
        customer: "Rahim Ahmed",
        email: "rahim@example.com",
        phone: "+880 1712-345678",
        equipment: "Professional Excavator",
        category: "Construction",
        startDate: "Nov 24, 2026",
        endDate: "Nov 27, 2026",
        duration: 3,
        amount: 13500,
        location: "Dhaka",
        status: "Pending",
        requestedAt: "Nov 20, 2026",
    },
    {
        id: "BK-2026-002",
        customer: "Nusrat Jahan",
        email: "nusrat@example.com",
        phone: "+880 1812-456789",
        equipment: "Canon EOS R5 Camera",
        category: "Photography",
        startDate: "Nov 25, 2026",
        endDate: "Nov 27, 2026",
        duration: 2,
        amount: 5000,
        location: "Chattogram",
        status: "Pending",
        requestedAt: "Nov 20, 2026",
    },
    {
        id: "BK-2026-003",
        customer: "Tanvir Hasan",
        email: "tanvir@example.com",
        phone: "+880 1912-567890",
        equipment: "Toyota Hiace",
        category: "Vehicles",
        startDate: "Nov 21, 2026",
        endDate: "Nov 23, 2026",
        duration: 2,
        amount: 12000,
        location: "Dhaka",
        status: "Approved",
        requestedAt: "Nov 18, 2026",
    },
    {
        id: "BK-2026-004",
        customer: "Sadia Islam",
        email: "sadia@example.com",
        phone: "+880 1612-678901",
        equipment: "Heavy Duty Generator",
        category: "Electronics",
        startDate: "Nov 15, 2026",
        endDate: "Nov 17, 2026",
        duration: 2,
        amount: 3600,
        location: "Sylhet",
        status: "Completed",
        requestedAt: "Nov 12, 2026",
    },
    {
        id: "BK-2026-005",
        customer: "Imran Hossain",
        email: "imran@example.com",
        phone: "+880 1512-789012",
        equipment: "Professional Drone",
        category: "Photography",
        startDate: "Nov 28, 2026",
        endDate: "Nov 30, 2026",
        duration: 2,
        amount: 3000,
        location: "Chattogram",
        status: "Rejected",
        requestedAt: "Nov 19, 2026",
    },
    {
        id: "BK-2026-006",
        customer: "Farzana Akter",
        email: "farzana@example.com",
        phone: "+880 1312-890123",
        equipment: "Event Sound System",
        category: "Event Equipment",
        startDate: "Dec 02, 2026",
        endDate: "Dec 04, 2026",
        duration: 2,
        amount: 2400,
        location: "Dhaka",
        status: "Pending",
        requestedAt: "Nov 21, 2026",
    },
];

const statusStyles: Record<BookingStatus, string> = {
    Pending: "border-amber-200 bg-amber-50 text-amber-700",
    Approved: "border-blue-200 bg-blue-50 text-blue-700",
    Rejected: "border-red-200 bg-red-50 text-red-700",
    Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const filters = ["All", "Pending", "Approved", "Rejected", "Completed"] as const;

type BookingFilter = (typeof filters)[number];

export default function OwnerBookingsPage() {
    const [bookings, setBookings] = useState(initialBookings);
    const [activeFilter, setActiveFilter] = useState<BookingFilter>("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const stats = [
        {
            label: "Total Requests",
            value: bookings.length,
            icon: CalendarDays,
            color: "bg-primary/10 text-primary",
        },
        {
            label: "Pending Requests",
            value: bookings.filter((item) => item.status === "Pending").length,
            icon: Clock3,
            color: "bg-amber-100 text-amber-700",
        },
        {
            label: "Approved",
            value: bookings.filter((item) => item.status === "Approved").length,
            icon: CheckCircle2,
            color: "bg-blue-100 text-blue-700",
        },
        {
            label: "Completed",
            value: bookings.filter((item) => item.status === "Completed").length,
            icon: CheckCircle2,
            color: "bg-emerald-100 text-emerald-700",
        },
    ];

    const query = searchQuery.trim().toLowerCase();

    const filteredBookings = bookings.filter((booking) => {
        const matchesFilter =
            activeFilter === "All" || booking.status === activeFilter;

        const matchesSearch =
            !query ||
            booking.id.toLowerCase().includes(query) ||
            booking.customer.toLowerCase().includes(query) ||
            booking.equipment.toLowerCase().includes(query);

        return matchesFilter && matchesSearch;
    });

    const updateBookingStatus = (
        bookingId: string,
        status: "Approved" | "Rejected",
    ) => {
        setBookings((previous) =>
            previous.map((booking) =>
                booking.id === bookingId ? { ...booking, status } : booking,
            ),
        );

        setSelectedBooking((previous) =>
            previous?.id === bookingId ? { ...previous, status } : previous,
        );
    };

    const formatAmount = (amount: number) =>
        `৳${amount.toLocaleString("en-BD")}`;

    return (
        <div className="mx-auto w-full max-w-7xl space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Booking Requests
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Review and manage rental requests from your customers.
                    </p>
                </div>

                <Button
                    variant="outline"
                    className="gap-2 self-start"
                    render={<Link href="/owner-dashboard/equipment" />}
                    nativeButton={false}
                >
                    View My Equipment
                </Button>
            </div>

            {/* Demo Notice */}
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                <Clock3 className="mt-0.5 size-5 shrink-0" />
                <div>
                    <p className="text-sm font-semibold">Demo booking data</p>
                    <p className="mt-1 text-xs leading-5 text-amber-800">
                        These requests are sample records. Status changes only affect this
                        page during the current session and are not saved to a database.
                    </p>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.label}
                            className="rounded-xl border border-border bg-card p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">
                                        {stat.value.toString().padStart(2, "0")}
                                    </p>
                                </div>
                                <div className={`flex size-11 items-center justify-center rounded-xl ${stat.color}`}>
                                    <Icon className="size-5" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Booking Table */}
            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="space-y-5 border-b border-border p-5 sm:p-6">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">
                            All Booking Requests
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {filteredBookings.length} request
                            {filteredBookings.length !== 1 ? "s" : ""} found
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative w-full lg:max-w-sm">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Search booking, customer or equipment..."
                                className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Filter className="size-4 text-muted-foreground" />

                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => setActiveFilter(filter)}
                                    className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${activeFilter === filter
                                            ? "bg-primary text-primary-foreground"
                                            : "border border-border bg-background text-muted-foreground hover:bg-muted"
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Responsive Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left text-sm">
                        <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 font-medium">Booking / Customer</th>
                                <th className="px-6 py-4 font-medium">Equipment</th>
                                <th className="px-6 py-4 font-medium">Rental Period</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 text-right font-medium">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id} className="transition-colors hover:bg-muted/30">
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-foreground">
                                            {booking.customer}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {booking.id}
                                        </p>
                                    </td>

                                    <td className="px-6 py-4">
                                        <p className="font-medium text-foreground">
                                            {booking.equipment}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {booking.category}
                                        </p>
                                    </td>

                                    <td className="px-6 py-4">
                                        <p className="font-medium text-foreground">
                                            {booking.startDate}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            to {booking.endDate}
                                        </p>
                                    </td>

                                    <td className="px-6 py-4 font-semibold tabular-nums text-foreground">
                                        {formatAmount(booking.amount)}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[booking.status]}`}>
                                            {booking.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                aria-label={`View ${booking.id}`}
                                                onClick={() => setSelectedBooking(booking)}
                                            >
                                                <Eye className="size-4" />
                                            </Button>

                                            {booking.status === "Pending" && (
                                                <>
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        aria-label={`Approve ${booking.id}`}
                                                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                                                        onClick={() =>
                                                            updateBookingStatus(booking.id, "Approved")
                                                        }
                                                    >
                                                        <Check className="size-4" />
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        aria-label={`Reject ${booking.id}`}
                                                        onClick={() =>
                                                            updateBookingStatus(booking.id, "Rejected")
                                                        }
                                                    >
                                                        <X className="size-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredBookings.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-14 text-center">
                                        <CalendarDays className="mx-auto size-9 text-muted-foreground/50" />
                                        <p className="mt-3 font-medium text-foreground">
                                            No booking requests found
                                        </p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Try changing your search or status filter.
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-4"
                                            onClick={() => {
                                                setSearchQuery("");
                                                setActiveFilter("All");
                                            }}
                                        >
                                            Clear Filters
                                        </Button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Booking Details Panel */}
            {selectedBooking && (
                <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
                    <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Booking Details
                            </p>
                            <h2 className="mt-1 text-lg font-bold text-foreground">
                                {selectedBooking.id}
                            </h2>
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Close booking details"
                            onClick={() => setSelectedBooking(null)}
                        >
                            <X className="size-5" />
                        </Button>
                    </div>

                    <div className="grid gap-6 py-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">
                                Customer Information
                            </h3>

                            <div>
                                <p className="text-xs text-muted-foreground">Customer Name</p>
                                <p className="mt-1 text-sm font-medium text-foreground">
                                    {selectedBooking.customer}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">Email Address</p>
                                <p className="mt-1 break-all text-sm font-medium text-foreground">
                                    {selectedBooking.email}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">Phone Number</p>
                                <p className="mt-1 text-sm font-medium text-foreground">
                                    {selectedBooking.phone}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">
                                Rental Information
                            </h3>

                            <div>
                                <p className="text-xs text-muted-foreground">Equipment</p>
                                <p className="mt-1 text-sm font-medium text-foreground">
                                    {selectedBooking.equipment}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">Rental Period</p>
                                <p className="mt-1 text-sm font-medium text-foreground">
                                    {selectedBooking.startDate} – {selectedBooking.endDate}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">Duration</p>
                                <p className="mt-1 text-sm font-medium text-foreground">
                                    {selectedBooking.duration} days
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">Location</p>
                                <p className="mt-1 flex items-center gap-1 text-sm font-medium text-foreground">
                                    <MapPin className="size-4 text-muted-foreground" />
                                    {selectedBooking.location}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 rounded-xl bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground">Total Rental Amount</p>
                            <p className="mt-1 text-xl font-bold tabular-nums text-foreground">
                                {formatAmount(selectedBooking.amount)}
                            </p>
                        </div>

                        <span className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-medium ${statusStyles[selectedBooking.status]}`}>
                            {selectedBooking.status}
                        </span>
                    </div>

                    {selectedBooking.status === "Pending" && (
                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="destructive"
                                className="gap-2"
                                onClick={() =>
                                    updateBookingStatus(selectedBooking.id, "Rejected")
                                }
                            >
                                <XCircle className="size-4" />
                                Reject Request
                            </Button>

                            <Button
                                type="button"
                                className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                                onClick={() =>
                                    updateBookingStatus(selectedBooking.id, "Approved")
                                }
                            >
                                <CheckCircle2 className="size-4" />
                                Approve Request
                            </Button>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
