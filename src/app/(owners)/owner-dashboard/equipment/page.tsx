
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  MapPin,
  Package,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type EquipmentStatus = "Approved" | "Pending" | "Rejected";

interface OwnerEquipment {
  id: string;
  name: string;
  category: string;
  location: string;
  price: number;
  status: EquipmentStatus;
  bookings: number;
  addedDate: string;
  image: string;
}

const equipmentData: OwnerEquipment[] = [
  {
    id: "EQ-001",
    name: "Professional Excavator",
    category: "Construction",
    location: "Dhaka, Bangladesh",
    price: 4500,
    status: "Approved",
    bookings: 12,
    addedDate: "Oct 12, 2026",
    image: "/images/equipment/excavator.jpg",
  },
  {
    id: "EQ-002",
    name: "Canon EOS R5 Camera",
    category: "Photography",
    location: "Chattogram, Bangladesh",
    price: 2500,
    status: "Approved",
    bookings: 8,
    addedDate: "Oct 15, 2026",
    image: "/images/equipment/camera.jpg",
  },
  {
    id: "EQ-003",
    name: "Toyota Hiace",
    category: "Vehicles",
    location: "Dhaka, Bangladesh",
    price: 6000,
    status: "Pending",
    bookings: 0,
    addedDate: "Oct 18, 2026",
    image: "/images/equipment/hiace.jpg",
  },
  {
    id: "EQ-004",
    name: "Heavy Duty Generator",
    category: "Electronics",
    location: "Sylhet, Bangladesh",
    price: 1800,
    status: "Approved",
    bookings: 15,
    addedDate: "Oct 20, 2026",
    image: "/images/equipment/generator.jpg",
  },
  {
    id: "EQ-005",
    name: "Professional Drone",
    category: "Photography",
    location: "Chattogram, Bangladesh",
    price: 1500,
    status: "Rejected",
    bookings: 0,
    addedDate: "Oct 22, 2026",
    image: "/images/equipment/drone.jpg",
  },
  {
    id: "EQ-006",
    name: "Event Sound System",
    category: "Event Equipment",
    location: "Dhaka, Bangladesh",
    price: 1200,
    status: "Pending",
    bookings: 0,
    addedDate: "Oct 25, 2026",
    image: "/images/equipment/sound-system.jpg",
  },
];

const statusStyles: Record<EquipmentStatus, string> = {
  Approved: "bg-green-50 text-green-700 ring-green-600/20",
  Pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Rejected: "bg-red-50 text-red-700 ring-red-600/20",
};

export default function OwnerEquipmentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedEquipment, setSelectedEquipment] =
    useState<OwnerEquipment | null>(null);

  const filteredEquipment = useMemo(() => {
    return equipmentData.filter((equipment) => {
      const matchesSearch =
        equipment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        equipment.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" ||
        equipment.status === selectedStatus;

      const matchesCategory =
        selectedCategory === "All" ||
        equipment.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, selectedStatus, selectedCategory]);

  const stats = [
    {
      label: "Total Equipment",
      value: equipmentData.length,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Approved",
      value: equipmentData.filter((item) => item.status === "Approved").length,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Pending Review",
      value: equipmentData.filter((item) => item.status === "Pending").length,
      icon: Clock3,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Rejected",
      value: equipmentData.filter((item) => item.status === "Rejected").length,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("All");
    setSelectedCategory("All");
  };

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            Owner Workspace / Equipment
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            My Equipment
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Manage your equipment listings and monitor their approval status.
          </p>
        </div>

        <Button
          className="w-full gap-2 bg-brand-accent text-primary hover:bg-brand-accent/90 sm:w-auto"
          render={<Link href="/owner-dashboard/add-equipment" />}
          nativeButton={false}
        >
          <Plus className="size-4" />
          Add New Equipment
        </Button>
      </div>

      {/* Demo Notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        <strong>Demo Preview:</strong> The equipment information shown here is
        sample data. Real equipment management will be connected to the backend
        later.
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-background p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon className="size-5" />
                </div>
              </div>

              <p className="mt-4 text-3xl font-bold text-primary">
                {stat.value.toString().padStart(2, "0")}
              </p>
            </div>
          );
        })}
      </div>

      {/* Equipment List */}
      <section className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
        <div className="border-b border-border p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h3 className="text-lg font-bold text-primary">
                All Equipment
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {filteredEquipment.length} equipment found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="search"
                  placeholder="Search equipment..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm outline-none transition focus:border-primary sm:w-56"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                aria-label="Filter by category"
              >
                <option value="All">All Categories</option>
                <option value="Construction">Construction</option>
                <option value="Photography">Photography</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Electronics">Electronics</option>
                <option value="Event Equipment">Event Equipment</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value)}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                aria-label="Filter by status"
              >
                <option value="All">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredEquipment.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-muted/40">
                <tr className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4">Equipment</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Daily Price</th>
                  <th className="px-6 py-4">Bookings</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredEquipment.map((equipment) => (
                  <tr
                    key={equipment.id}
                    className="transition-colors hover:bg-muted/20"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                          <Package className="size-5" />
                        </div>

                        <div>
                          <p className="font-semibold text-primary">
                            {equipment.name}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {equipment.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {equipment.category}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-primary">
                        ৳{equipment.price.toLocaleString("en-BD")}
                      </p>
                      <p className="text-xs text-muted-foreground">per day</p>
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {equipment.bookings}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[equipment.status]}`}
                      >
                        {equipment.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedEquipment(equipment)}
                          aria-label={`View ${equipment.name}`}
                          title="View details"
                          className="rounded-lg p-2 text-muted-foreground transition hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="size-4" />
                        </button>

                        <button
                          type="button"
                          disabled
                          aria-label={`Edit ${equipment.name}`}
                          title="Editing will be available after backend integration"
                          className="cursor-not-allowed rounded-lg p-2 text-muted-foreground/40"
                        >
                          <Pencil className="size-4" />
                        </button>

                        <button
                          type="button"
                          disabled
                          aria-label={`Delete ${equipment.name}`}
                          title="Deletion will be available after backend integration"
                          className="cursor-not-allowed rounded-lg p-2 text-muted-foreground/40"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <SlidersHorizontal className="size-7" />
            </div>

            <h4 className="text-lg font-bold text-primary">
              No equipment found
            </h4>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              We couldn&apos;t find any equipment matching your search or
              filters. Try adjusting your filters.
            </p>

            <Button
              variant="outline"
              className="mt-5"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>

      {/* Selected Equipment Details */}
      {selectedEquipment && (
        <section className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Equipment Details
              </p>
              <h3 className="mt-2 text-xl font-bold text-primary">
                {selectedEquipment.name}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setSelectedEquipment(null)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              Close
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Equipment ID</p>
              <p className="mt-1 font-semibold text-primary">
                {selectedEquipment.id}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="mt-1 flex items-center gap-1 font-semibold text-primary">
                <MapPin className="size-4" />
                {selectedEquipment.location}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Date Added</p>
              <p className="mt-1 flex items-center gap-1 font-semibold text-primary">
                <CalendarDays className="size-4" />
                {selectedEquipment.addedDate}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Approval Status</p>
              <span
                className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[selectedEquipment.status]}`}
              >
                {selectedEquipment.status}
              </span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
