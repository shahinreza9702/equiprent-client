"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Users,
  UserRound,
  BriefcaseBusiness,
  ShieldCheck,
  Search,
  Eye,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiRequest, ApiError } from "@/lib/api";

type UserRole = "Customer" | "Owner" | "Admin";
type UserStatus = "Active" | "Suspended";
type RoleFilter = "All" | UserRole;
type StatusFilter = "All" | UserStatus;

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  location: string;
  joinedDate: string;
}

interface AdminUserApi {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "customer" | "owner" | "admin";
  status: "active" | "blocked";
  joinedDate: string;
}

interface AdminUsersResponse {
  users: AdminUserApi[];
  stats: {
    totalUsers: number;
    customers: number;
    owners: number;
    admins: number;
    activeUsers: number;
  };
  pagination: {
    page: number;
    limit: number;
    totalUsers: number;
    totalPages: number;
  };
}

const emptyStats = {
  totalUsers: 0,
  customers: 0,
  owners: 0,
  admins: 0,
  activeUsers: 0,
};

const mapUser = (user: AdminUserApi): PlatformUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone ?? "Not provided",
  role:
    user.role === "customer"
      ? "Customer"
      : user.role === "owner"
        ? "Owner"
        : "Admin",
  status: user.status === "active" ? "Active" : "Suspended",
  location: "Not provided",
  joinedDate: new Date(user.joinedDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
});

export default function AdminUsersPage() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [stats, setStats] = useState(emptyStats);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFilteredUsers, setTotalFilteredUsers] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
      });

      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }

      if (roleFilter !== "All") {
        params.set("role", roleFilter.toLowerCase());
      }

      if (statusFilter !== "All") {
        params.set(
          "status",
          statusFilter === "Active" ? "active" : "blocked",
        );
      }

      const response = await apiRequest<AdminUsersResponse>(
        `/admin/users?${params.toString()}`,
      );

      if (!response.data) {
        throw new Error("Invalid users response from server.");
      }

      const result = response.data;

      const mappedUsers = result.users.map(mapUser);

      setUsers(mappedUsers);
      setStats(result.stats);
      setTotalPages(result.pagination.totalPages);
      setTotalFilteredUsers(result.pagination.totalUsers);

      setSelectedUser((previous) => {
        if (!previous) return null;

        return (
          mappedUsers.find((user) => user.id === previous.id) ?? null
        );
      });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to load users. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, roleFilter, statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void fetchUsers();
    }, searchQuery.trim() ? 350 : 0);

    return () => clearTimeout(timeout);
  }, [fetchUsers, searchQuery]);

  const handleRoleFilter = (value: RoleFilter) => {
    setRoleFilter(value);
    setPage(1);
  };

  const handleStatusFilter = (value: StatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const toggleUserStatus = async (user: PlatformUser) => {
    const nextStatus =
      user.status === "Active" ? "blocked" : "active";

    setUpdatingUserId(user.id);
    setError("");

    try {
      await apiRequest(`/admin/users/${user.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });

      await fetchUsers();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to update account status.",
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Customers",
      value: stats.customers,
      icon: UserRound,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    },
    {
      title: "Equipment Owners",
      value: stats.owners,
      icon: BriefcaseBusiness,
      color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    },
    {
      title: "Administrators",
      value: stats.admins,
      icon: ShieldCheck,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Heading */}
      <section>
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4 text-primary" />
          Platform Management
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          User Management
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          View platform members and manage their account status.
        </p>
      </section>

      {/* API Error */}
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
                {stats.totalUsers === 0 && isLoading ? (
                  <span className="inline-block h-7 w-12 animate-pulse rounded bg-muted" />
                ) : (
                  stat.value.toLocaleString()
                )}
              </p>
            </div>
          );
        })}
      </section>

      {/* User Management */}
      <section className="rounded-xl border border-border bg-background shadow-sm">
        <div className="border-b border-border p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                All Users
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {totalFilteredUsers} users found · {stats.activeUsers} active
                accounts
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Search name, email or ID..."
                className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div className="relative">
              <select
                value={roleFilter}
                onChange={(event) =>
                  handleRoleFilter(event.target.value as RoleFilter)
                }
                className="h-11 w-full appearance-none rounded-lg border border-border bg-background px-4 pr-10 text-sm outline-none focus:border-primary"
              >
                <option value="All">All Roles</option>
                <option value="Customer">Customer</option>
                <option value="Owner">Equipment Owner</option>
                <option value="Admin">Administrator</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) =>
                  handleStatusFilter(event.target.value as StatusFilter)
                }
                className="h-11 w-full appearance-none rounded-lg border border-border bg-background px-4 pr-10 text-sm outline-none focus:border-primary"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Joined Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Loader2 className="mx-auto size-6 animate-spin text-primary" />
                    <p className="mt-3 text-sm text-muted-foreground">
                      Loading users...
                    </p>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {user.name
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")}
                        </div>

                        <div>
                          <p className="font-medium text-foreground">
                            {user.name}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {user.location}
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {user.joinedDate}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
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
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-muted-foreground"
                  >
                    No users found matching your filters.
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
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              <ChevronLeft className="mr-1 size-4" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={isLoading || page >= totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
            >
              Next
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* User Details Panel */}
      {selectedUser && (
        <div className="rounded-xl border border-border bg-background p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                User Information
              </p>

              <h3 className="mt-2 text-lg font-semibold text-foreground">
                {selectedUser.name}
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                {selectedUser.id}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Close user details"
              onClick={() => setSelectedUser(null)}
            >
              <X />
            </Button>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <Mail className="size-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {selectedUser.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="size-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {selectedUser.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="size-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {selectedUser.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CalendarDays className="size-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Joined Date</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {selectedUser.joinedDate}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
            <div>
              <p className="text-sm font-medium text-foreground">
                Account Status
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Current status: {selectedUser.status}
              </p>
            </div>

            <Button
              variant={
                selectedUser.status === "Active" ? "destructive" : "default"
              }
              disabled={updatingUserId === selectedUser.id}
              onClick={() => void toggleUserStatus(selectedUser)}
            >
              {updatingUserId === selectedUser.id ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Updating...
                </>
              ) : selectedUser.status === "Active" ? (
                "Suspend Account"
              ) : (
                "Activate Account"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
