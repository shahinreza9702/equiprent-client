
"use client";

import { useState } from "react";
import {
  Package,
  CheckCircle2,
  Clock3,
  XCircle,
  Search,
  Eye,
  MapPin,
  CalendarDays,
  UserRound,
  X,
  AlertCircle,
  Check,
  Ban,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type EquipmentStatus = "Approved" | "Pending" | "Rejected";

type AdminEquipment = {
  id: string;
  name: string;
  category: string;
  owner: string;
  location: string;
  price: number;
  rentalUnit: "day" | "hour";
  status: EquipmentStatus;
  submittedDate: string;
  description: string;
};

const initialEquipment: AdminEquipment[] = [
  {
    id: "EQ-1001",
    name: "Professional Excavator",
    category: "Construction",
    owner: "Rahim Ahmed",
    location: "Dhaka",
    price: 4500,
    rentalUnit: "day",
    status: "Approved",
    submittedDate: "2026-11-02",
    description:
      "Heavy-duty excavator suitable for construction and large-scale earthmoving projects.",
  },
  {
    id: "EQ-1002",
    name: "Canon EOS R5 Camera",
    category: "Photography",
    owner: "Nusrat Jahan",
    location: "Chattogram",
    price: 2500,
    rentalUnit: "day",
    status: "Pending",
    submittedDate: "2026-11-15",
    description:
      "Professional mirrorless camera for photography, video production, and events.",
  },
  {
    id: "EQ-1003",
    name: "Toyota Hiace",
    category: "Vehicles",
    owner: "Karim Uddin",
    location: "Dhaka",
    price: 6000,
    rentalUnit: "day",
    status: "Approved",
    submittedDate: "2026-11-08",
    description:
      "Spacious passenger van suitable for family trips, group travel, and transportation.",
  },
  {
    id: "EQ-1004",
    name: "Heavy Duty Generator",
    category: "Electronics",
    owner: "Sabbir Hossain",
    location: "Sylhet",
    price: 1800,
    rentalUnit: "day",
    status: "Pending",
    submittedDate: "2026-11-17",
    description:
      "Reliable power generator for construction sites and temporary electricity needs.",
  },
  {
    id: "EQ-1005",
    name: "Professional Drone",
    category: "Photography",
    owner: "Tanvir Hasan",
    location: "Chattogram",
    price: 1500,
    rentalUnit: "day",
    status: "Rejected",
    submittedDate: "2026-10-28",
    description:
      "Aerial photography drone for outdoor filming and professional content creation.",
  },
  {
    id: "EQ-1006",
    name: "Event Sound System",
    category: "Event Equipment",
    owner: "Farhana Akter",
    location: "Dhaka",
    price: 1200,
    rentalUnit: "day",
    status: "Approved",
    submittedDate: "2026-11-12",
    description:
      "Complete sound system for small events, presentations, and private functions.",
  },
  {
    id: "EQ-1007",
    name: "Industrial Water Pump",
    category: "Construction",
    owner: "Mahmud Hasan",
    location: "Rajshahi",
    price: 900,
    rentalUnit: "hour",
    status: "Pending",
    submittedDate: "2026-11-19",
    description:
      "Industrial water pump for construction, drainage, and water management projects.",
  },
  {
    id: "EQ-1008",
    name: "Agricultural Power Tiller",
    category: "Agriculture",
    owner: "Abdul Karim",
    location: "Rangpur",
    price: 2000,
    rentalUnit: "day",
    status: "Approved",
    submittedDate: "2026-11-10",
    description:
      "Agricultural tiller suitable for soil preparation and small-scale farming.",
  },
];

const categories = [
  "All Categories",
  "Construction",
  "Photography",
  "Vehicles",
  "Electronics",
  "Event Equipment",
  "Agriculture",
];

const statusFilters = [
  "All",
  "Approved",
  "Pending",
  "Rejected",
] as const;

export default function AdminEquipmentPage() {
  const [equipment, setEquipment] = useState(initialEquipment);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");
  const [activeFilter, setActiveFilter] =
    useState<(typeof statusFilters)[number]>("All");
  const [selectedEquipment, setSelectedEquipment] =
    useState<AdminEquipment | null>(null);

  const totalEquipment = equipment.length;

  const approvedCount = equipment.filter(
    (item) => item.status === "Approved"
  ).length;

  const pendingCount = equipment.filter(
    (item) => item.status === "Pending"
  ).length;

  const rejectedCount = equipment.filter(
    (item) => item.status === "Rejected"
  ).length;

  const query = searchQuery.trim().toLowerCase();

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query) ||
      item.owner.toLowerCase().includes(query);

    const matchesCategory =
      categoryFilter === "All Categories" ||
      item.category === categoryFilter;

    const matchesStatus =
      activeFilter === "All" || item.status === activeFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const updateStatus = (
    id: string,
    status: EquipmentStatus
  ) => {
    setEquipment((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );

    setSelectedEquipment((previous) =>
      previous?.id === id
        ? { ...previous, status }
        : previous
    );
  };

  const statusStyles: Record<EquipmentStatus, string> = {
    Approved: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Rejected: "bg-red-50 text-red-700",
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
            Equipment Management
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review, monitor, and manage equipment listed on EquipRent.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm">
          <Package className="size-4 text-muted-foreground" />
          <span className="font-medium text-primary">
            {totalEquipment} Equipment
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
            This page uses sample equipment records. Approval changes
            are temporary and will reset when the page reloads.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Equipment"
          value={totalEquipment}
          icon={<Package className="size-5" />}
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Approved"
          value={approvedCount}
          icon={<CheckCircle2 className="size-5" />}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Pending Review"
          value={pendingCount}
          icon={<Clock3 className="size-5" />}
          iconClass="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Rejected"
          value={rejectedCount}
          icon={<XCircle className="size-5" />}
          iconClass="bg-red-50 text-red-600"
        />
      </div>

      {/* Equipment Management */}
      <section className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="border-b border-border p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-primary">
                All Equipment
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Review equipment listings and manage approval status.
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
                placeholder="Search name, ID or owner..."
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((filter) => (
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

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-primary outline-none focus:border-primary"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-4 font-semibold">Equipment</th>
                <th className="px-5 py-4 font-semibold">Owner</th>
                <th className="px-5 py-4 font-semibold">Category</th>
                <th className="px-5 py-4 font-semibold">Rental Price</th>
                <th className="px-5 py-4 font-semibold">Submitted</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredEquipment.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                        <Package className="size-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-primary">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-primary">
                      {item.owner}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {item.location}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">
                    {item.category}
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-semibold text-primary">
                      ৳{item.price.toLocaleString("en-US")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      / {item.rentalUnit}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">
                    {new Date(
                      `${item.submittedDate}T00:00:00`
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedEquipment(item)}
                      >
                        <Eye className="size-3.5" />
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEquipment.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center"
                  >
                    <Package className="mx-auto size-8 text-muted-foreground/50" />
                    <p className="mt-3 font-medium text-primary">
                      No equipment found
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border px-5 py-4">
          <p className="text-xs text-muted-foreground">
            Showing {filteredEquipment.length} of {totalEquipment} equipment records
          </p>
        </div>
      </section>

      {/* Equipment Details Panel */}
      {selectedEquipment && (
        <section className="rounded-xl border border-border bg-background p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
                Equipment Details
              </p>
              <h2 className="mt-1 text-xl font-bold text-primary">
                {selectedEquipment.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedEquipment.id}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Close equipment details"
              onClick={() => setSelectedEquipment(null)}
            >
              <X className="size-5" />
            </Button>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <DetailItem
              icon={<UserRound className="size-4" />}
              label="Equipment Owner"
              value={selectedEquipment.owner}
            />

            <DetailItem
              icon={<Package className="size-4" />}
              label="Category"
              value={selectedEquipment.category}
            />

            <DetailItem
              icon={<MapPin className="size-4" />}
              label="Location"
              value={selectedEquipment.location}
            />

            <DetailItem
              icon={<CalendarDays className="size-4" />}
              label="Submission Date"
              value={selectedEquipment.submittedDate}
            />

            <DetailItem
              icon={<Package className="size-4" />}
              label="Rental Price"
              value={`৳${selectedEquipment.price.toLocaleString("en-US")} / ${selectedEquipment.rentalUnit}`}
            />
          </div>

          <div className="mt-5 rounded-lg bg-muted/50 p-4">
            <p className="text-sm font-semibold text-primary">
              Description
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {selectedEquipment.description}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
            <div>
              <p className="text-sm font-medium text-primary">
                Current Status
              </p>
              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedEquipment.status]}`}
              >
                {selectedEquipment.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedEquipment.status !== "Approved" && (
                <Button
                  size="sm"
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() =>
                    updateStatus(selectedEquipment.id, "Approved")
                  }
                >
                  <Check className="size-4" />
                  Approve
                </Button>
              )}

              {selectedEquipment.status !== "Rejected" && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    updateStatus(selectedEquipment.id, "Rejected")
                  }
                >
                  <Ban className="size-4" />
                  Reject
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
        <p className="mt-1 text-sm font-semibold text-primary">
          {value}
        </p>
      </div>
    </div>
  );
}
