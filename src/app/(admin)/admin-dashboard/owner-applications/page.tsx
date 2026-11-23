
"use client";

import { useCallback, useEffect, useState } from "react";
import {
    ClipboardCheck,
    UserRound,
    BriefcaseBusiness,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Eye,
    X,
    Mail,
    Phone,
    MapPin,
    CalendarDays,
    AlertCircle,
    Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiRequest, ApiError } from "@/lib/api";

type ApplicationStatus = "pending" | "approved" | "rejected";
type StatusFilter = "all" | ApplicationStatus;

interface OwnerApplication {
    id: string;
    userId: string;
    applicant: {
        name: string;
        email: string;
        phone: string | null;
    } | null;
    businessName: string;
    contactNumber: string;
    address: string;
    status: ApplicationStatus;
    reviewedBy: string | null;
    reviewedAt: string | null;
    submittedAt: string;
}

interface OwnerApplicationsResponse {
    applications: OwnerApplication[];
    stats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    };
    pagination: {
        page: number;
        limit: number;
        totalApplications: number;
        totalPages: number;
    };
}

const emptyStats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
};

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

const statusStyles: Record<ApplicationStatus, string> = {
    pending:
        "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    approved:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    rejected:
        "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export default function OwnerApplicationsPage() {
    const [applications, setApplications] = useState<OwnerApplication[]>([]);
    const [stats, setStats] = useState(emptyStats);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const [selectedApplication, setSelectedApplication] =
        useState<OwnerApplication | null>(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalApplications, setTotalApplications] = useState(0);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [reviewingId, setReviewingId] = useState<string | null>(null);

    const fetchApplications = useCallback(async () => {
        setIsLoading(true);
        setError("");

        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: "10",
            });

            if (statusFilter !== "all") {
                params.set("status", statusFilter);
            }

            const response = await apiRequest<OwnerApplicationsResponse>(
                `/admin/owner-applications?${params.toString()}`,
            );

            if (!response.data) {
                throw new Error("Invalid owner applications response.");
            }

            const result = response.data;

            setApplications(result.applications);
            setStats(result.stats);
            setTotalPages(Math.max(1, result.pagination.totalPages));
            setTotalApplications(result.pagination.totalApplications);

            setSelectedApplication((previous) => {
                if (!previous) return null;

                return (
                    result.applications.find(
                        (application) => application.id === previous.id,
                    ) ?? null
                );
            });
        } catch (err) {
            setError(
                err instanceof ApiError
                    ? err.message
                    : err instanceof Error
                        ? err.message
                        : "Failed to load owner applications.",
            );
        } finally {
            setIsLoading(false);
        }
    }, [page, statusFilter]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            void fetchApplications();
        }, 0);

        return () => clearTimeout(timeout);
    }, [fetchApplications]);

    const handleStatusFilter = (value: StatusFilter) => {
        setStatusFilter(value);
        setPage(1);
        setSelectedApplication(null);
    };

    const reviewApplication = async (
        application: OwnerApplication,
        status: "approved" | "rejected",
    ) => {
        const action = status === "approved" ? "approve" : "reject";

        const confirmed = window.confirm(
            `Are you sure you want to ${action} this owner application?`,
        );

        if (!confirmed) return;

        setReviewingId(application.id);
        setError("");

        try {
            await apiRequest(
                `/admin/owner-applications/${application.id}/review`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ status }),
                },
            );

            setSelectedApplication(null);
            await fetchApplications();
        } catch (err) {
            setError(
                err instanceof ApiError
                    ? err.message
                    : err instanceof Error
                        ? err.message
                        : `Failed to ${action} application.`,
            );
        } finally {
            setReviewingId(null);
        }
    };

    const statCards = [
        {
            title: "Total Applications",
            value: stats.total,
            icon: ClipboardCheck,
            color: "bg-primary/10 text-primary",
        },
        {
            title: "Pending Review",
            value: stats.pending,
            icon: Clock,
            color:
                "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
        },
        {
            title: "Approved",
            value: stats.approved,
            icon: CheckCircle2,
            color:
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
        },
        {
            title: "Rejected",
            value: stats.rejected,
            icon: XCircle,
            color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Heading */}
            <section>
                <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <BriefcaseBusiness className="size-4 text-primary" />
                    Platform Management
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Owner Applications
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    Review customer applications and manage equipment owner
                    registrations.
                </p>
            </section>

            {/* Error */}
            {error && (
                <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-900 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200"
                >
                    <AlertCircle className="mt-0.5 size-5 shrink-0" />
                    <div>
                        <p className="text-sm font-semibold">Something went wrong</p>
                        <p className="mt-1 text-xs leading-5">{error}</p>
                    </div>
                </div>
            )}

            {/* Statistics */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((stat) => {
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

                                <div
                                    className={`flex size-10 items-center justify-center rounded-lg ${stat.color}`}
                                >
                                    <Icon className="size-5" />
                                </div>
                            </div>

                            <p className="mt-5 text-2xl font-bold text-foreground">
                                {stats.total === 0 && isLoading ? (
                                    <span className="inline-block h-7 w-12 animate-pulse rounded bg-muted" />
                                ) : (
                                    stat.value.toLocaleString()
                                )}
                            </p>
                        </div>
                    );
                })}
            </section>

            {/* Applications Table */}
            <section className="rounded-xl border border-border bg-background shadow-sm">
                <div className="border-b border-border p-5 sm:p-6">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">
                            All Applications
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                            {totalApplications} applications found
                        </p>
                    </div>

                    <div className="relative mt-5 max-w-xs">
                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                handleStatusFilter(event.target.value as StatusFilter)
                            }
                            className="h-11 w-full appearance-none rounded-lg border border-border bg-background px-4 pr-10 text-sm outline-none focus:border-primary"
                        >
                            <option value="all">All Applications</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left text-sm">
                        <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 font-medium">Applicant</th>
                                <th className="px-6 py-4 font-medium">Business Name</th>
                                <th className="px-6 py-4 font-medium">Submitted</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 text-right font-medium">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <Loader2 className="mx-auto size-6 animate-spin text-primary" />
                                        <p className="mt-3 text-sm text-muted-foreground">
                                            Loading applications...
                                        </p>
                                    </td>
                                </tr>
                            ) : applications.length > 0 ? (
                                applications.map((application) => (
                                    <tr
                                        key={application.id}
                                        className="transition-colors hover:bg-muted/30"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <UserRound className="size-5" />
                                                </div>

                                                <div>
                                                    <p className="font-medium text-foreground">
                                                        {application.applicant?.name ?? "Unknown Applicant"}
                                                    </p>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {application.applicant?.email ?? "Unavailable"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 font-medium text-foreground">
                                            {application.businessName}
                                        </td>

                                        <td className="px-6 py-4 text-muted-foreground">
                                            {formatDate(application.submittedAt)}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[application.status]}`}
                                            >
                                                {application.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedApplication(application)}
                                            >
                                                <Eye className="mr-1 size-4" />
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-sm text-muted-foreground"
                                    >
                                        No owner applications found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </p>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={isLoading || page <= 1}
                            onClick={() =>
                                setPage((current) => Math.max(1, current - 1))
                            }
                        >
                            <ChevronLeft className="mr-1 size-4" />
                            Previous
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={isLoading || page >= totalPages}
                            onClick={() =>
                                setPage((current) =>
                                    Math.min(totalPages, current + 1),
                                )
                            }
                        >
                            Next
                            <ChevronRight className="ml-1 size-4" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Application Details */}
            {selectedApplication && (
                <section className="rounded-xl border border-border bg-background p-5 shadow-sm sm:p-6">
                    <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Application Details
                            </p>

                            <h3 className="mt-2 text-lg font-semibold text-foreground">
                                {selectedApplication.businessName}
                            </h3>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Application ID: {selectedApplication.id}
                            </p>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Close application details"
                            onClick={() => setSelectedApplication(null)}
                        >
                            <X />
                        </Button>
                    </div>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div className="flex items-center gap-3">
                            <UserRound className="size-5 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Applicant</p>
                                <p className="mt-1 text-sm font-medium text-foreground">
                                    {selectedApplication.applicant?.name ?? "Unavailable"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Mail className="size-5 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">Email</p>
                                <p className="mt-1 break-all text-sm font-medium text-foreground">
                                    {selectedApplication.applicant?.email ?? "Unavailable"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Phone className="size-5 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Applicant Phone
                                </p>
                                <p className="mt-1 text-sm font-medium text-foreground">
                                    {selectedApplication.applicant?.phone ?? "Not provided"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Phone className="size-5 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Business Contact
                                </p>
                                <p className="mt-1 text-sm font-medium text-foreground">
                                    {selectedApplication.contactNumber}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 sm:col-span-2">
                            <MapPin className="mt-0.5 size-5 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Business Address
                                </p>
                                <p className="mt-1 text-sm font-medium text-foreground">
                                    {selectedApplication.address}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <CalendarDays className="size-5 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Submitted Date
                                </p>
                                <p className="mt-1 text-sm font-medium text-foreground">
                                    {formatDate(selectedApplication.submittedAt)}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">Current Status</p>
                            <span
                                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles[selectedApplication.status]}`}
                            >
                                {selectedApplication.status}
                            </span>
                        </div>
                    </div>

                    {selectedApplication.status === "pending" && (
                        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-border pt-5">
                            <Button
                                variant="destructive"
                                disabled={reviewingId === selectedApplication.id}
                                onClick={() =>
                                    void reviewApplication(selectedApplication, "rejected")
                                }
                            >
                                {reviewingId === selectedApplication.id ? (
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                ) : (
                                    <XCircle className="mr-2 size-4" />
                                )}
                                Reject Application
                            </Button>

                            <Button
                                disabled={reviewingId === selectedApplication.id}
                                onClick={() =>
                                    void reviewApplication(selectedApplication, "approved")
                                }
                            >
                                {reviewingId === selectedApplication.id ? (
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="mr-2 size-4" />
                                )}
                                Approve Application
                            </Button>
                        </div>
                    )}

                    {selectedApplication.status !== "pending" &&
                        selectedApplication.reviewedAt && (
                            <div className="mt-6 border-t border-border pt-5">
                                <p className="text-sm text-muted-foreground">
                                    Reviewed on {formatDate(selectedApplication.reviewedAt)}
                                </p>
                            </div>
                        )}
                </section>
            )}
        </div>
    );
}
