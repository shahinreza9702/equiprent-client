
"use client";

import { useState } from "react";
import {
    ArrowDownLeft,
    ArrowUpRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
    DollarSign,
    Download,
    Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type TransactionStatus = "Completed" | "Pending" | "Failed";

type Transaction = {
    id: string;
    equipment: string;
    customer: string;
    date: string;
    amount: number;
    fee: number;
    status: TransactionStatus;
};

const transactions: Transaction[] = [
    {
        id: "TRX-2026-001",
        equipment: "Professional Excavator",
        customer: "Rahim Ahmed",
        date: "2026-11-18",
        amount: 13500,
        fee: 675,
        status: "Completed",
    },
    {
        id: "TRX-2026-002",
        equipment: "Canon EOS R5 Camera",
        customer: "Nusrat Jahan",
        date: "2026-11-16",
        amount: 7500,
        fee: 375,
        status: "Pending",
    },
    {
        id: "TRX-2026-003",
        equipment: "Toyota Hiace",
        customer: "Karim Hossain",
        date: "2026-11-14",
        amount: 18000,
        fee: 900,
        status: "Completed",
    },
    {
        id: "TRX-2026-004",
        equipment: "Heavy Duty Generator",
        customer: "Sabbir Hasan",
        date: "2026-11-11",
        amount: 5400,
        fee: 270,
        status: "Completed",
    },
    {
        id: "TRX-2026-005",
        equipment: "Professional Drone",
        customer: "Tanvir Islam",
        date: "2026-10-28",
        amount: 4500,
        fee: 225,
        status: "Pending",
    },
    {
        id: "TRX-2026-006",
        equipment: "Event Sound System",
        customer: "Mehedi Hasan",
        date: "2026-10-21",
        amount: 3600,
        fee: 180,
        status: "Failed",
    },
];

const monthlyRevenue = [
    { month: "Jun", revenue: 42000 },
    { month: "Jul", revenue: 58000 },
    { month: "Aug", revenue: 49000 },
    { month: "Sep", revenue: 72000 },
    { month: "Oct", revenue: 65000 },
    { month: "Nov", revenue: 85500 },
];

const formatCurrency = (amount: number) =>
    `৳${amount.toLocaleString("en-BD")}`;

const formatDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

export default function OwnerEarningsPage() {
    const [dateFilter, setDateFilter] = useState("all");

    const filteredTransactions = transactions.filter((transaction) => {
        if (dateFilter === "all") return true;

        if (dateFilter === "this-month") {
            return transaction.date.startsWith("2026-11");
        }

        if (dateFilter === "last-month") {
            return transaction.date.startsWith("2026-10");
        }

        return true;
    });

    const maxRevenue = Math.max(
        ...monthlyRevenue.map((item) => item.revenue),
    );

    const stats = [
        {
            title: "Total Earnings",
            value: "৳3,85,500",
            description: "Lifetime earnings",
            icon: Wallet,
            iconStyle: "bg-blue-50 text-blue-600",
            trend: "+12.5%",
        },
        {
            title: "This Month",
            value: "৳85,500",
            description: "November 2026",
            icon: DollarSign,
            iconStyle: "bg-emerald-50 text-emerald-600",
            trend: "+8.2%",
        },
        {
            title: "Pending Payouts",
            value: "৳18,500",
            description: "Awaiting processing",
            icon: Clock3,
            iconStyle: "bg-amber-50 text-amber-600",
            trend: null,
        },
        {
            title: "Completed Payouts",
            value: "৳2,95,000",
            description: "Successfully paid",
            icon: CheckCircle2,
            iconStyle: "bg-purple-50 text-purple-600",
            trend: null,
        },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        Owner Workspace / Earnings
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                        Earnings Overview
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Track your revenue, payouts, and transaction history.
                    </p>
                </div>

                <Button
                    variant="outline"
                    className="w-fit gap-2"
                    disabled
                >
                    <Download className="size-4" />
                    Export Report
                </Button>
            </div>

            {/* Demo Notice */}
            <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <CreditCard className="mt-0.5 size-5 shrink-0 text-blue-600" />

                <div>
                    <p className="text-sm font-semibold text-blue-900">
                        Demo Earnings Data
                    </p>

                    <p className="mt-1 text-sm leading-relaxed text-blue-800">
                        The earnings, payouts, and transactions shown here
                        are sample data for preview purposes. Real payment
                        processing and payout management will be connected
                        later.
                    </p>
                </div>
            </div>

            {/* Earnings Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="rounded-xl border border-border bg-card p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div
                                    className={`flex size-11 items-center justify-center rounded-xl ${stat.iconStyle}`}
                                >
                                    <Icon className="size-5" />
                                </div>

                                {stat.trend && (
                                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                        <ArrowUpRight className="size-4" />
                                        {stat.trend}
                                    </span>
                                )}
                            </div>

                            <p className="mt-5 text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </p>

                            <h2 className="mt-1 text-2xl font-bold tracking-tight text-primary">
                                {stat.value}
                            </h2>

                            <p className="mt-2 text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Revenue Chart and Payout Summary */}
            <div className="grid gap-6 xl:grid-cols-3">
                {/* Revenue Chart */}
                <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6 xl:col-span-2">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-bold text-primary">
                                Revenue Overview
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Monthly revenue performance
                            </p>
                        </div>

                        <span className="rounded-lg bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">
                            Last 6 Months
                        </span>
                    </div>

                    <div className="mt-8">
                        <div className="flex h-64 items-end justify-between gap-3 border-b border-border px-1 sm:gap-5">
                            {monthlyRevenue.map((item) => {
                                const height = (item.revenue / maxRevenue) * 100;

                                return (
                                    <div
                                        key={item.month}
                                        className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                                    >
                                        <div className="flex h-full w-full items-end justify-center">
                                            <div
                                                className="group relative w-full max-w-12 rounded-t-lg bg-primary/80 transition-all duration-300 hover:bg-primary"
                                                style={{ height: `${height}%` }}
                                                title={`${item.month}: ${formatCurrency(item.revenue)}`}
                                            >
                                                <div className="absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-primary px-2 py-1 text-[10px] font-medium text-white group-hover:block">
                                                    {formatCurrency(item.revenue)}
                                                </div>
                                            </div>
                                        </div>

                                        <span className="text-xs font-medium text-muted-foreground">
                                            {item.month}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-5 flex items-center gap-2">
                            <span className="size-2.5 rounded-sm bg-primary" />
                            <span className="text-xs text-muted-foreground">
                                Monthly Revenue (BDT)
                            </span>
                        </div>
                    </div>
                </section>

                {/* Payout Summary */}
                <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
                    <h2 className="text-lg font-bold text-primary">
                        Payout Summary
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Your payment breakdown
                    </p>

                    <div className="mt-7 rounded-xl bg-primary p-5 text-white">
                        <div className="flex items-center gap-2 text-sm text-white/75">
                            <Wallet className="size-4" />
                            Available Balance
                        </div>

                        <h3 className="mt-3 text-3xl font-bold">
                            ৳67,000
                        </h3>

                        <p className="mt-2 text-xs text-white/65">
                            Demo available balance
                        </p>
                    </div>

                    <div className="mt-6 space-y-5">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                    <ArrowDownLeft className="size-5" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-primary">
                                        Total Received
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Completed payouts
                                    </p>
                                </div>
                            </div>

                            <span className="text-sm font-bold text-primary">
                                ৳2,95,000
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                    <Clock3 className="size-5" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-primary">
                                        In Progress
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Pending payouts
                                    </p>
                                </div>
                            </div>

                            <span className="text-sm font-bold text-primary">
                                ৳18,500
                            </span>
                        </div>

                        <div className="border-t border-border pt-5">
                            <p className="text-xs leading-relaxed text-muted-foreground">
                                Payout details and bank account management will
                                be available after payment gateway integration.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Transactions */}
            <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="flex flex-col justify-between gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:p-6">
                    <div>
                        <h2 className="text-lg font-bold text-primary">
                            Recent Transactions
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Review your rental payment activity.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <CalendarDays className="size-4 text-muted-foreground" />

                        <select
                            value={dateFilter}
                            onChange={(event) => setDateFilter(event.target.value)}
                            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-primary outline-none transition-colors focus:border-primary"
                            aria-label="Filter transactions by date"
                        >
                            <option value="all">All Transactions</option>
                            <option value="this-month">This Month</option>
                            <option value="last-month">Last Month</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left text-sm">
                        <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 font-semibold">
                                    Transaction ID
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    Equipment / Customer
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    Date
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    Amount
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    Platform Fee
                                </th>
                                <th className="px-6 py-4 font-semibold">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {filteredTransactions.map((transaction) => (
                                <tr
                                    key={transaction.id}
                                    className="transition-colors hover:bg-muted/30"
                                >
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-primary">
                                        {transaction.id}
                                    </td>

                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-primary">
                                            {transaction.equipment}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {transaction.customer}
                                        </p>
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                                        {formatDate(transaction.date)}
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-primary">
                                        {formatCurrency(transaction.amount)}
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                                        {formatCurrency(transaction.fee)}
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${transaction.status === "Completed"
                                                ? "bg-emerald-50 text-emerald-700"
                                                : transaction.status === "Pending"
                                                    ? "bg-amber-50 text-amber-700"
                                                    : "bg-red-50 text-red-700"
                                                }`}
                                        >
                                            {transaction.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center text-sm text-muted-foreground"
                                    >
                                        No transactions found for this period.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col justify-between gap-2 border-t border-border px-6 py-4 sm:flex-row sm:items-center">
                    <p className="text-xs text-muted-foreground">
                        Showing {filteredTransactions.length} of {transactions.length} transactions
                    </p>

                    <p className="text-xs font-medium text-muted-foreground">
                        Demo transaction history
                    </p>
                </div>
            </section>
        </div>
    );
}
