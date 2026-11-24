
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  Download,
  RefreshCw,
  Wallet,
  XCircle,
} from "lucide-react";

import { apiRequest } from "@/lib/api";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface CurrencyAmount {
  currency: string;
  amount: number;
  transactions: number;
}

interface MonthlyCurrencyAmount {
  currency: string;
  amount: number;
}

interface MonthlyRevenue {
  month: string;
  revenue: MonthlyCurrencyAmount[];
}

type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

type FulfillmentStatus =
  | "pending"
  | "fulfilled"
  | "requires_refund";

interface PaymentStatusTotal {
  _id: {
    status: PaymentStatus;
    fulfillmentStatus: FulfillmentStatus;
    currency: string;
  };
  totalAmount: number;
  count: number;
}

interface PopulatedReference {
  _id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  image?: string;
}

type PaymentReference =
  | string
  | PopulatedReference
  | null
  | undefined;

interface PaymentTransaction {
  _id: string;
  customer: PaymentReference;
  equipment: PaymentReference;
  amount: number;
  currency: string;
  status: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  checkoutSessionId?: string;
  paymentIntentId?: string;
  booking?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface OwnerEarningsData {
  summary: {
    grossEarnings: CurrencyAmount[];
    thisMonthEarnings: CurrencyAmount[];
    paymentStatusTotals: PaymentStatusTotal[];
  };
  monthlyRevenue: MonthlyRevenue[];
  transactions: PaymentTransaction[];
}

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

const loadOwnerEarnings = async (): Promise<OwnerEarningsData> => {
  const response = await apiRequest<OwnerEarningsData>(
    "/payments/owner/earnings",
  );

  if (!response.data) {
    throw new Error("Earnings data was not returned by the server.");
  }

  return response.data;
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency.toUpperCase()} ${amount.toLocaleString()}`;
  }
};

const formatMonth = (month: string) => {
  const date = new Date(`${month}-01T00:00:00`);

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
};

const formatDate = (date?: string) => {
  if (!date) return "—";

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

const getReferenceName = (
  reference: PaymentReference,
  fallback: string,
) => {
  if (!reference) return fallback;

  if (typeof reference === "string") {
    return reference;
  }

  return reference.name || reference.email || fallback;
};

const getStatusLabel = (
  status: PaymentStatus,
  fulfillmentStatus: FulfillmentStatus,
) => {
  if (status === "refunded") return "Refunded";
  if (status === "failed") return "Failed";
  if (status === "pending") return "Pending";

  if (
    status === "paid" &&
    fulfillmentStatus === "fulfilled"
  ) {
    return "Paid";
  }

  return "Processing";
};

const getStatusClass = (
  status: PaymentStatus,
  fulfillmentStatus: FulfillmentStatus,
) => {
  if (status === "refunded") {
    return "bg-purple-500/10 text-purple-400";
  }

  if (status === "failed") {
    return "bg-red-500/10 text-red-400";
  }

  if (status === "pending") {
    return "bg-yellow-500/10 text-yellow-400";
  }

  if (
    status === "paid" &&
    fulfillmentStatus === "fulfilled"
  ) {
    return "bg-green-500/10 text-green-400";
  }

  return "bg-blue-500/10 text-blue-400";
};

const getTransactionReference = (
  transaction: PaymentTransaction,
) => {
  return (
    transaction.checkoutSessionId ||
    transaction.paymentIntentId ||
    transaction._id
  );
};

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function OwnerEarningsPage() {
  const [earningsData, setEarningsData] =
    useState<OwnerEarningsData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [dateFilter, setDateFilter] = useState<
    "all" | "this-month" | "last-month"
  >("all");

  // Fetch earnings from backend
  useEffect(() => {
    let cancelled = false;

    loadOwnerEarnings()
      .then((data) => {
        if (!cancelled) {
          setEarningsData(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load earnings data.",
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
  }, []);

  // Retry API request
  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await loadOwnerEarnings();
      setEarningsData(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load earnings data.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const transactions = useMemo(
    () => earningsData?.transactions ?? [],
    [earningsData],
  );

  const grossEarnings =
    earningsData?.summary.grossEarnings ?? [];

  const thisMonthEarnings =
    earningsData?.summary.thisMonthEarnings ?? [];

  const paymentStatusTotals =
    earningsData?.summary.paymentStatusTotals ?? [];

  // Avoid combining different currencies.
  const primaryCurrency =
    grossEarnings[0]?.currency ||
    thisMonthEarnings[0]?.currency ||
    paymentStatusTotals[0]?._id.currency ||
    "BDT";

  const grossAmount =
    grossEarnings.find(
      (item) => item.currency === primaryCurrency,
    )?.amount ?? 0;

  const currentMonthAmount =
    thisMonthEarnings.find(
      (item) => item.currency === primaryCurrency,
    )?.amount ?? 0;

  const pendingPayments = paymentStatusTotals
    .filter(
      (item) =>
        item._id.status === "pending" &&
        item._id.currency === primaryCurrency,
    )
    .reduce((total, item) => total + item.totalAmount, 0);

  const completedPayments = paymentStatusTotals
    .filter(
      (item) =>
        item._id.status === "paid" &&
        item._id.fulfillmentStatus === "fulfilled",
    )
    .reduce((total, item) => total + item.count, 0);

  const chartData = useMemo(() => {
    return (earningsData?.monthlyRevenue ?? []).map((item) => ({
      month: formatMonth(item.month),
      revenue:
        item.revenue.find(
          (currencyItem) =>
            currencyItem.currency === primaryCurrency,
        )?.amount ?? 0,
    }));
  }, [earningsData, primaryCurrency]);

  const maxRevenue = Math.max(
    ...chartData.map((item) => item.revenue),
    0,
  );

  // Filter transactions by date
  const filteredTransactions = useMemo(() => {
    if (dateFilter === "all") {
      return transactions;
    }

    const now = new Date();

    const startOfThisMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    );

    const startOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );

    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    );

    return transactions.filter((transaction) => {
      if (!transaction.createdAt) return false;

      const transactionDate = new Date(
        transaction.createdAt,
      );

      if (Number.isNaN(transactionDate.getTime())) {
        return false;
      }

      if (dateFilter === "this-month") {
        return transactionDate >= startOfThisMonth;
      }

      return (
        transactionDate >= startOfLastMonth &&
        transactionDate < endOfLastMonth
      );
    });
  }, [transactions, dateFilter]);

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (isLoading && !earningsData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary" />

          <p className="mt-4 text-sm text-muted-foreground">
            Loading earnings data...
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (error && !earningsData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-xl border border-border bg-card p-8 text-center">
          <XCircle className="mx-auto h-10 w-10 text-red-500" />

          <h2 className="mt-4 text-lg font-semibold">
            Unable to Load Earnings
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void handleRefresh()}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Main UI
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Earnings
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Track your rental revenue and payment transactions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void handleRefresh()}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isLoading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </div>

      {/* Error notice */}
      {error && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm text-red-400">{error}</p>

          <button
            type="button"
            onClick={() => void handleRefresh()}
            className="shrink-0 text-sm font-medium text-red-400 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Gross Earnings */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-green-500/10 p-2">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>

            <span className="text-xs text-muted-foreground">
              Paid & fulfilled
            </span>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Gross Earnings
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            {formatCurrency(grossAmount, primaryCurrency)}
          </h2>
        </div>

        {/* This Month */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <CalendarDays className="h-5 w-5 text-blue-500" />
            </div>

            <span className="text-xs text-muted-foreground">
              Current month
            </span>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            This Month
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            {formatCurrency(
              currentMonthAmount,
              primaryCurrency,
            )}
          </h2>
        </div>

        {/* Pending Payments */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-yellow-500/10 p-2">
              <Clock3 className="h-5 w-5 text-yellow-500" />
            </div>

            <span className="text-xs text-muted-foreground">
              Awaiting completion
            </span>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Pending Payments
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            {formatCurrency(
              pendingPayments,
              primaryCurrency,
            )}
          </h2>
        </div>

        {/* Completed Payments */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-purple-500/10 p-2">
              <CheckCircle2 className="h-5 w-5 text-purple-500" />
            </div>

            <span className="text-xs text-muted-foreground">
              All currencies
            </span>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Completed Payments
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            {completedPayments}
          </h2>
        </div>
      </div>

      {/* Revenue Chart and Payout Summary */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-border bg-card p-6 xl:col-span-2">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">
                Revenue Overview
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Monthly gross earnings for the last six months
              </p>
            </div>

            <span className="text-sm font-medium text-muted-foreground">
              {primaryCurrency.toUpperCase()}
            </span>
          </div>

          {chartData.length > 0 && maxRevenue > 0 ? (
            <div className="mt-8">
              <div className="flex h-56 items-end justify-between gap-3">
                {chartData.map((item, index) => {
                  const height =
                    maxRevenue > 0
                      ? (item.revenue / maxRevenue) * 100
                      : 0;

                  return (
                    <div
                      key={`${item.month}-${index}`}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                    >
                      <span className="text-center text-xs text-muted-foreground">
                        {formatCurrency(
                          item.revenue,
                          primaryCurrency,
                        )}
                      </span>

                      <div className="flex h-full w-full items-end">
                        <div
                          title={`${item.month}: ${formatCurrency(
                            item.revenue,
                            primaryCurrency,
                          )}`}
                          style={{
                            height: `${Math.max(height, 2)}%`,
                          }}
                          className="w-full rounded-t-md bg-primary transition-all duration-500"
                        />
                      </div>

                      <span className="text-xs text-muted-foreground">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex h-56 items-center justify-center">
              <div className="text-center">
                <Wallet className="mx-auto h-8 w-8 text-muted-foreground" />

                <p className="mt-3 text-sm text-muted-foreground">
                  No revenue data available yet.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Payout Summary */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Wallet className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h2 className="font-semibold">
                Payout Summary
              </h2>

              <p className="text-xs text-muted-foreground">
                Owner payout information
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              Payout Status
            </p>

            <p className="mt-1 text-lg font-semibold">
              Not Available
            </p>

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Automatic owner payout processing is not configured
              yet. Your gross earnings show successfully paid and
              fulfilled rental payments.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Gross Earnings
              </span>

              <span className="font-medium">
                {formatCurrency(
                  grossAmount,
                  primaryCurrency,
                )}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Current Month
              </span>

              <span className="font-medium">
                {formatCurrency(
                  currentMonthAmount,
                  primaryCurrency,
                )}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Pending Payments
              </span>

              <span className="font-medium">
                {formatCurrency(
                  pendingPayments,
                  primaryCurrency,
                )}
              </span>
            </div>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <p className="text-xs leading-5 text-muted-foreground">
              Net payout and platform fees are not calculated because
              no payout or fee policy is currently configured.
            </p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex flex-col justify-between gap-4 border-b border-border p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold">
              Recent Transactions
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Latest payment records from your rental bookings
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={dateFilter}
              onChange={(event) =>
                setDateFilter(
                  event.target.value as
                    | "all"
                    | "this-month"
                    | "last-month",
                )
              }
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Transactions</option>
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
            </select>

            <button
              type="button"
              disabled
              title="Report export is not implemented yet."
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm opacity-50"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">
                  Transaction
                </th>

                <th className="px-6 py-4 font-medium">
                  Customer
                </th>

                <th className="px-6 py-4 font-medium">
                  Equipment
                </th>

                <th className="px-6 py-4 font-medium">
                  Date
                </th>

                <th className="px-6 py-4 font-medium">
                  Amount
                </th>

                <th className="px-6 py-4 font-medium">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction._id}
                  className="transition hover:bg-muted/30"
                >
                  <td className="px-6 py-4">
                    <span
                      title={getTransactionReference(transaction)}
                      className="block max-w-[150px] truncate font-medium"
                    >
                      {getTransactionReference(
                        transaction,
                      ).slice(0, 18)}
                      ...
                    </span>

                    <span className="mt-1 block text-xs text-muted-foreground">
                      {transaction.booking
                        ? `Booking: ${transaction.booking.slice(0, 8)}`
                        : "No booking reference"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {getReferenceName(
                      transaction.customer,
                      "Customer",
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {getReferenceName(
                      transaction.equipment,
                      "Equipment",
                    )}
                  </td>

                  <td className="px-6 py-4 text-muted-foreground">
                    {formatDate(transaction.createdAt)}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {formatCurrency(
                      transaction.amount,
                      transaction.currency,
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                        transaction.status,
                        transaction.fulfillmentStatus,
                      )}`}
                    >
                      {getStatusLabel(
                        transaction.status,
                        transaction.fulfillmentStatus,
                      )}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center"
                  >
                    <ArrowDownLeft className="mx-auto h-8 w-8 text-muted-foreground" />

                    <p className="mt-3 font-medium">
                      No transactions found
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Payment transactions will appear here when
                      available.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Transaction Cards */}
        <div className="divide-y divide-border md:hidden">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction._id}
              className="space-y-3 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {getReferenceName(
                      transaction.equipment,
                      "Equipment",
                    )}
                  </p>

                  <p
                    title={getTransactionReference(transaction)}
                    className="mt-1 truncate text-xs text-muted-foreground"
                  >
                    {getTransactionReference(
                      transaction,
                    )}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                    transaction.status,
                    transaction.fulfillmentStatus,
                  )}`}
                >
                  {getStatusLabel(
                    transaction.status,
                    transaction.fulfillmentStatus,
                  )}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Customer
                  </p>

                  <p className="mt-1 font-medium">
                    {getReferenceName(
                      transaction.customer,
                      "Customer",
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Date
                  </p>

                  <p className="mt-1 font-medium">
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm text-muted-foreground">
                  Amount
                </span>

                <span className="font-semibold">
                  {formatCurrency(
                    transaction.amount,
                    transaction.currency,
                  )}
                </span>
              </div>
            </div>
          ))}

          {filteredTransactions.length === 0 && (
            <div className="px-5 py-12 text-center">
              <ArrowDownLeft className="mx-auto h-8 w-8 text-muted-foreground" />

              <p className="mt-3 font-medium">
                No transactions found
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Payment transactions will appear here when
                available.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-border px-6 py-4">
          <p className="text-xs text-muted-foreground">
            Showing {filteredTransactions.length} of{" "}
            {transactions.length} latest transactions. The API
            currently returns up to 50 records.
          </p>
        </div>
      </div>
    </div>
  );
}
