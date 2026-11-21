
"use client";

import { useState } from "react";
import {
  Users,
  UserRound,
  BriefcaseBusiness,
  ShieldCheck,
  Search,
  Eye,
  ChevronDown,
  X,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type UserRole = "Customer" | "Owner" | "Admin";
type UserStatus = "Active" | "Suspended";

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

const initialUsers: PlatformUser[] = [
  {
    id: "USR-1001",
    name: "Rahim Ahmed",
    email: "rahim@example.com",
    phone: "+880 1712-345678",
    role: "Customer",
    status: "Active",
    location: "Dhaka, Bangladesh",
    joinedDate: "Nov 21, 2026",
  },
  {
    id: "USR-1002",
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    phone: "+880 1812-345678",
    role: "Owner",
    status: "Active",
    location: "Chattogram, Bangladesh",
    joinedDate: "Nov 20, 2026",
  },
  {
    id: "USR-1003",
    name: "Tanvir Hasan",
    email: "tanvir@example.com",
    phone: "+880 1912-345678",
    role: "Customer",
    status: "Active",
    location: "Sylhet, Bangladesh",
    joinedDate: "Nov 19, 2026",
  },
  {
    id: "USR-1004",
    name: "Sadia Islam",
    email: "sadia@example.com",
    phone: "+880 1612-345678",
    role: "Owner",
    status: "Suspended",
    location: "Rajshahi, Bangladesh",
    joinedDate: "Nov 18, 2026",
  },
  {
    id: "USR-1005",
    name: "Mahmudul Karim",
    email: "mahmud@example.com",
    phone: "+880 1512-345678",
    role: "Customer",
    status: "Active",
    location: "Khulna, Bangladesh",
    joinedDate: "Nov 17, 2026",
  },
  {
    id: "USR-1006",
    name: "Farhan Chowdhury",
    email: "farhan@example.com",
    phone: "+880 1312-345678",
    role: "Owner",
    status: "Active",
    location: "Dhaka, Bangladesh",
    joinedDate: "Nov 16, 2026",
  },
  {
    id: "USR-1007",
    name: "Admin User",
    email: "admin@example.com",
    phone: "+880 1412-345678",
    role: "Admin",
    status: "Active",
    location: "Dhaka, Bangladesh",
    joinedDate: "Nov 15, 2026",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] =
    useState<PlatformUser | null>(null);

  const query = searchQuery.trim().toLowerCase();

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !query ||
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.id.toLowerCase().includes(query);

    const matchesRole =
      roleFilter === "All" || user.role === roleFilter;

    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeCount = users.filter(
    (user) => user.status === "Active"
  ).length;

  const customerCount = users.filter(
    (user) => user.role === "Customer"
  ).length;

  const ownerCount = users.filter(
    (user) => user.role === "Owner"
  ).length;

  const adminCount = users.filter(
    (user) => user.role === "Admin"
  ).length;

  const toggleUserStatus = (userId: string) => {
    setUsers((previous) =>
      previous.map((user) =>
        user.id === userId
          ? {
              ...user,
              status:
                user.status === "Active" ? "Suspended" : "Active",
            }
          : user
      )
    );

    setSelectedUser((previous) =>
      previous?.id === userId
        ? {
            ...previous,
            status:
              previous.status === "Active" ? "Suspended" : "Active",
          }
        : previous
    );
  };

  const statCards = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Customers",
      value: customerCount,
      icon: UserRound,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    },
    {
      title: "Equipment Owners",
      value: ownerCount,
      icon: BriefcaseBusiness,
      color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    },
    {
      title: "Administrators",
      value: adminCount,
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

      {/* Demo Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
        <AlertCircle className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Demo User Records</p>
          <p className="mt-1 text-xs leading-5 opacity-80">
            These are sample users. Status changes are temporary and
            will reset when the page reloads. Real user management
            requires backend integration.
          </p>
        </div>
      </div>

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
                {stat.value}
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
                {filteredUsers.length} users found · {activeCount} active
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
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search name, email or ID..."
                className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div className="relative">
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
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
                onChange={(event) => setStatusFilter(event.target.value)}
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
              {filteredUsers.map((user) => (
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
              ))}

              {filteredUsers.length === 0 && (
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
              onClick={() => toggleUserStatus(selectedUser.id)}
            >
              {selectedUser.status === "Active"
                ? "Suspend Account"
                : "Activate Account"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
