
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Image from "next/image";
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
  X,
  XCircle,
  ImagePlus,
  Upload,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";

type ApprovalStatus = "approved" | "pending" | "rejected";
type RentalType = "daily" | "weekly" | "monthly";
type AvailabilityStatus = "available" | "unavailable";

interface EquipmentApiItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  rentalPrice: number;
  rentalType: RentalType;
  availableQuantity: number;
  condition: string;
  brand: string;
  model: string;
  image: string;
  rentalTerms: string;
  status: AvailabilityStatus;
  approvalStatus: ApprovalStatus;
  createdAt?: string;
}

interface EquipmentApiResponse {
  equipments: EquipmentApiItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ImageUploadResponse {
  imageUrl: string;
}

interface OwnerEquipment {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rentalType: RentalType;
  approvalStatus: ApprovalStatus;
  availabilityStatus: AvailabilityStatus;
  availableQuantity: number;
  condition: string;
  brand: string;
  model: string;
  rentalTerms: string;
  addedDate: string;
  image: string;
}

interface EquipmentFormData {
  name: string;
  description: string;
  category: string;
  rentalPrice: string;
  rentalType: RentalType;
  location: string;
  availableQuantity: string;
  condition: string;
  brand: string;
  model: string;
  rentalTerms: string;
}

const categories = [
  "Construction",
  "Photography",
  "Vehicles",
  "Agriculture",
  "Electronics",
  "Event Equipment",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const statusLabels: Record<ApprovalStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
};

const statusStyles: Record<ApprovalStatus, string> = {
  approved: "bg-green-50 text-green-700 ring-green-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  rejected: "bg-red-50 text-red-700 ring-red-600/20",
};

const rentalLabels: Record<RentalType, string> = {
  daily: "per day",
  weekly: "per week",
  monthly: "per month",
};

const inputClass =
  "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

const labelClass = "text-sm font-medium text-primary";

const formatDate = (date?: string) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const mapEquipment = (item: EquipmentApiItem): OwnerEquipment => ({
  id: item._id,
  name: item.name,
  description: item.description,
  category: item.category,
  location: item.location,
  price: item.rentalPrice,
  rentalType: item.rentalType,
  approvalStatus: item.approvalStatus,
  availabilityStatus: item.status,
  availableQuantity: item.availableQuantity,
  condition: item.condition,
  brand: item.brand,
  model: item.model,
  rentalTerms: item.rentalTerms,
  addedDate: formatDate(item.createdAt),
  image: item.image,
});

const createFormData = (
  equipment: OwnerEquipment,
): EquipmentFormData => ({
  name: equipment.name,
  description: equipment.description,
  category: equipment.category,
  rentalPrice: String(equipment.price),
  rentalType: equipment.rentalType,
  location: equipment.location,
  availableQuantity: String(equipment.availableQuantity),
  condition: equipment.condition,
  brand: equipment.brand,
  model: equipment.model,
  rentalTerms: equipment.rentalTerms,
});

export default function OwnerEquipmentPage() {
  const [equipmentData, setEquipmentData] = useState<OwnerEquipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [selectedEquipment, setSelectedEquipment] =
    useState<OwnerEquipment | null>(null);

  const [editingEquipment, setEditingEquipment] =
    useState<OwnerEquipment | null>(null);

  const [formData, setFormData] = useState<EquipmentFormData | null>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [deletingEquipmentId, setDeletingEquipmentId] = useState<
    string | null
  >(null);

  const [editError, setEditError] = useState("");

  // Fetch owner equipment
  const fetchEquipments = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await apiRequest<EquipmentApiResponse>(
        "/equipments/owner/my-equipment",
      );

      const equipments = response.data?.equipments ?? [];
      const mappedEquipments = equipments.map(mapEquipment);

      setEquipmentData(mappedEquipments);

      setSelectedEquipment((previous) => {
        if (!previous) return null;

        return (
          mappedEquipments.find((item) => item.id === previous.id) ?? null
        );
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load your equipment.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial API request
  useEffect(() => {
    let isActive = true;

    void Promise.resolve().then(() => {
      if (isActive) {
        return fetchEquipments();
      }
    });

    return () => {
      isActive = false;
    };
  }, [fetchEquipments]);

  // Dynamic categories
  const dynamicCategories = useMemo(
    () => [...new Set(equipmentData.map((item) => item.category))].sort(),
    [equipmentData],
  );

  // Search and filters
  const filteredEquipment = useMemo(() => {
    return equipmentData.filter((equipment) => {
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        equipment.name.toLowerCase().includes(query) ||
        equipment.id.toLowerCase().includes(query);

      const matchesStatus =
        selectedStatus === "All" ||
        equipment.approvalStatus === selectedStatus;

      const matchesCategory =
        selectedCategory === "All" ||
        equipment.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [equipmentData, searchQuery, selectedStatus, selectedCategory]);

  // Dashboard statistics
  const stats = [
    {
      label: "Total Equipment",
      value: equipmentData.length,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Approved",
      value: equipmentData.filter(
        (item) => item.approvalStatus === "approved",
      ).length,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Pending Review",
      value: equipmentData.filter(
        (item) => item.approvalStatus === "pending",
      ).length,
      icon: Clock3,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Rejected",
      value: equipmentData.filter(
        (item) => item.approvalStatus === "rejected",
      ).length,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("All");
    setSelectedCategory("All");
  };

  // Open edit modal
  const handleEdit = (equipment: OwnerEquipment) => {
    setEditingEquipment(equipment);
    setFormData(createFormData(equipment));
    setSelectedImage(null);
    setImagePreview(equipment.image);
    setEditError("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Release temporary image preview
  const releaseImagePreview = () => {
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  // Close edit modal
  const closeEditModal = () => {
    if (isSaving) return;

    releaseImagePreview();

    setEditingEquipment(null);
    setFormData(null);
    setSelectedImage(null);
    setImagePreview("");
    setEditError("");
  };

  // Handle image selection
  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    setEditError("");

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setEditError("Only JPEG, PNG, and WebP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setEditError("Image size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    releaseImagePreview();

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Remove selected replacement image
  const removeSelectedImage = () => {
    releaseImagePreview();

    setSelectedImage(null);
    setImagePreview(editingEquipment?.image ?? "");

    const input = document.getElementById(
      "edit-equipment-image",
    ) as HTMLInputElement | null;

    if (input) input.value = "";
  };

  // Update form fields
  const handleFormChange = (
    field: keyof EquipmentFormData,
    value: string,
  ) => {
    setFormData((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        [field]: value,
      };
    });
  };

  // Update equipment
  const handleUpdateEquipment = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!editingEquipment || !formData) return;

    setIsSaving(true);
    setEditError("");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Keep existing ImgBB URL unless a replacement image is selected.
      let imageUrl = editingEquipment.image;

      // Upload replacement image to ImgBB when selected.
      if (selectedImage) {
        const imageFormData = new FormData();
        imageFormData.append("image", selectedImage);

        const uploadResponse = await apiRequest<ImageUploadResponse>(
          "/equipments/upload-image",
          {
            method: "POST",
            body: imageFormData,
          },
        );

        const uploadedImageUrl = uploadResponse.data?.imageUrl;

        if (!uploadedImageUrl) {
          throw new Error("Image upload failed. Please try again.");
        }

        imageUrl = uploadedImageUrl;
      }

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        rentalPrice: Number(formData.rentalPrice),
        rentalType: formData.rentalType,
        location: formData.location.trim(),
        availableQuantity: Number(formData.availableQuantity),
        condition: formData.condition.trim(),
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        image: imageUrl,
        rentalTerms: formData.rentalTerms.trim(),
      };

      await apiRequest<EquipmentApiItem>(
        `/equipments/${editingEquipment.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        },
      );

      releaseImagePreview();

      setEditingEquipment(null);
      setFormData(null);
      setSelectedImage(null);
      setImagePreview("");

      setSuccessMessage(
        "Equipment updated successfully. It is now waiting for admin review.",
      );

      await fetchEquipments();
    } catch (error) {
      setEditError(
        error instanceof Error
          ? error.message
          : "Failed to update equipment.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Delete equipment
  const handleDeleteEquipment = async (equipment: OwnerEquipment) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${equipment.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingEquipmentId(equipment.id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await apiRequest<null>(`/equipments/${equipment.id}`, {
        method: "DELETE",
      });

      setEquipmentData((previous) =>
        previous.filter((item) => item.id !== equipment.id),
      );

      setSelectedEquipment((previous) =>
        previous?.id === equipment.id ? null : previous,
      );

      setSuccessMessage(`"${equipment.name}" was deleted successfully.`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete equipment.",
      );
    } finally {
      setDeletingEquipmentId(null);
    }
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

      {/* Feedback Messages */}
      {successMessage && (
        <div
          role="status"
          className="flex items-start justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          <p>{successMessage}</p>

          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            aria-label="Dismiss success message"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <p>{errorMessage}</p>

          <button
            type="button"
            onClick={() => setErrorMessage("")}
            aria-label="Dismiss error message"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

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
                {isLoading
                  ? "Loading equipment..."
                  : `${filteredEquipment.length} equipment found`}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
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

              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                aria-label="Filter by category"
              >
                <option value="All">All Categories</option>

                {dynamicCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value)}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                aria-label="Filter by approval status"
              >
                <option value="All">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <Package className="mb-4 size-9 animate-pulse text-muted-foreground" />

            <h4 className="font-semibold text-primary">
              Loading your equipment
            </h4>

            <p className="mt-2 text-sm text-muted-foreground">
              Please wait while we retrieve your equipment listings.
            </p>
          </div>
        ) : errorMessage && equipmentData.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <XCircle className="mb-4 size-10 text-red-500" />

            <h4 className="text-lg font-bold text-primary">
              Unable to load equipment
            </h4>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {errorMessage}
            </p>

            <Button
              className="mt-5"
              onClick={() => void fetchEquipments()}
            >
              Try Again
            </Button>
          </div>
        ) : equipmentData.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <Package className="mb-4 size-10 text-muted-foreground" />

            <h4 className="text-lg font-bold text-primary">
              No equipment yet
            </h4>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              You haven&apos;t added any equipment. Start by creating your
              first equipment listing.
            </p>

            <Button
              className="mt-5 gap-2"
              render={<Link href="/owner-dashboard/add-equipment" />}
              nativeButton={false}
            >
              <Plus className="size-4" />
              Add Equipment
            </Button>
          </div>
        ) : filteredEquipment.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-muted/40">
                <tr className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4">Equipment</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Rental Price</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Approval Status</th>
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
                        <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted text-muted-foreground">
                          {equipment.image ? (
                            <Image
                              src={equipment.image}
                              alt={equipment.name}
                              width={48}
                              height={48}
                              unoptimized
                              className="size-full object-cover"
                            />
                          ) : (
                            <Package className="size-5" />
                          )}
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

                      <p className="text-xs text-muted-foreground">
                        {rentalLabels[equipment.rentalType]}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {equipment.availableQuantity}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[equipment.approvalStatus]}`}
                      >
                        {statusLabels[equipment.approvalStatus]}
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
                          onClick={() => handleEdit(equipment)}
                          disabled={Boolean(deletingEquipmentId) || isSaving}
                          aria-label={`Edit ${equipment.name}`}
                          title="Edit equipment"
                          className="rounded-lg p-2 text-muted-foreground transition hover:bg-amber-50 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Pencil className="size-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleDeleteEquipment(equipment)}
                          disabled={
                            deletingEquipmentId === equipment.id || isSaving
                          }
                          aria-label={`Delete ${equipment.name}`}
                          title="Delete equipment"
                          className="rounded-lg p-2 text-muted-foreground transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {deletingEquipmentId === equipment.id ? (
                            <LoaderCircle className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
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
            <SlidersHorizontal className="mb-4 size-9 text-muted-foreground" />

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
              <p className="mt-1 break-all font-semibold text-primary">
                {selectedEquipment.id}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="mt-1 flex items-center gap-1 font-semibold text-primary">
                <MapPin className="size-4 shrink-0" />
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
                className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[selectedEquipment.approvalStatus]}`}
              >
                {statusLabels[selectedEquipment.approvalStatus]}
              </span>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Rental Price</p>
              <p className="mt-1 font-semibold text-primary">
                ৳{selectedEquipment.price.toLocaleString("en-BD")}{" "}
                {rentalLabels[selectedEquipment.rentalType]}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Available Quantity
              </p>
              <p className="mt-1 font-semibold text-primary">
                {selectedEquipment.availableQuantity}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Condition</p>
              <p className="mt-1 font-semibold capitalize text-primary">
                {selectedEquipment.condition}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Availability</p>
              <p className="mt-1 font-semibold capitalize text-primary">
                {selectedEquipment.availabilityStatus}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Brand</p>
              <p className="mt-1 font-semibold text-primary">
                {selectedEquipment.brand}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Model</p>
              <p className="mt-1 font-semibold text-primary">
                {selectedEquipment.model}
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-border pt-5">
            <p className="text-xs text-muted-foreground">Description</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-primary">
              {selectedEquipment.description}
            </p>
          </div>

          <div className="mt-5 border-t border-border pt-5">
            <p className="text-xs text-muted-foreground">Rental Terms</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-primary">
              {selectedEquipment.rentalTerms}
            </p>
          </div>
        </section>
      )}

      {/* Edit Equipment Modal */}
      {editingEquipment && formData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEditModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-equipment-title"
            className="my-auto w-full max-w-5xl rounded-2xl border border-border bg-background shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-border p-5 sm:p-6">
              <div>
                <p className="mb-2 text-sm text-muted-foreground">
                  Owner Workspace / Equipment
                </p>

                <h3
                  id="edit-equipment-title"
                  className="text-xl font-bold text-primary sm:text-2xl"
                >
                  Edit Equipment
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Update your equipment listing information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={isSaving}
                aria-label="Close edit form"
                className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted disabled:opacity-40"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateEquipment}>
              <div className="max-h-[70vh] space-y-6 overflow-y-auto p-5 sm:p-7">
                {/* Basic Information */}
                <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-foreground">
                      Basic Information
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Tell renters what equipment you are offering.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <label htmlFor="edit-name" className={labelClass}>
                        Equipment Name *
                      </label>
                      <input
                        id="edit-name"
                        required
                        minLength={2}
                        maxLength={150}
                        value={formData.name}
                        onChange={(event) =>
                          handleFormChange("name", event.target.value)
                        }
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="edit-category" className={labelClass}>
                        Category *
                      </label>
                      <select
                        id="edit-category"
                        required
                        value={formData.category}
                        onChange={(event) =>
                          handleFormChange("category", event.target.value)
                        }
                        className={inputClass}
                      >
                        {!categories.includes(formData.category) && (
                          <option value={formData.category}>
                            {formData.category}
                          </option>
                        )}

                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="edit-condition" className={labelClass}>
                        Equipment Condition *
                      </label>
                      <select
                        id="edit-condition"
                        required
                        value={formData.condition}
                        onChange={(event) =>
                          handleFormChange("condition", event.target.value)
                        }
                        className={inputClass}
                      >
                        {!["Brand New", "Excellent", "Good", "Fair"].includes(
                          formData.condition,
                        ) && (
                          <option value={formData.condition}>
                            {formData.condition}
                          </option>
                        )}
                        <option>Brand New</option>
                        <option>Excellent</option>
                        <option>Good</option>
                        <option>Fair</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="edit-brand" className={labelClass}>
                        Brand *
                      </label>
                      <input
                        id="edit-brand"
                        required
                        minLength={1}
                        value={formData.brand}
                        onChange={(event) =>
                          handleFormChange("brand", event.target.value)
                        }
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="edit-model" className={labelClass}>
                        Model *
                      </label>
                      <input
                        id="edit-model"
                        required
                        minLength={1}
                        value={formData.model}
                        onChange={(event) =>
                          handleFormChange("model", event.target.value)
                        }
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <label htmlFor="edit-description" className={labelClass}>
                        Description *
                      </label>
                      <textarea
                        id="edit-description"
                        required
                        minLength={10}
                        maxLength={1500}
                        rows={5}
                        value={formData.description}
                        onChange={(event) =>
                          handleFormChange("description", event.target.value)
                        }
                        className="w-full resize-y rounded-lg border border-input bg-background px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      />
                    </div>
                  </div>
                </section>

                {/* Rental Pricing */}
                <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-foreground">
                      Rental Pricing
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Set a rental price for your equipment.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="edit-price" className={labelClass}>
                        Rental Price (BDT) *
                      </label>
                      <input
                        id="edit-price"
                        type="number"
                        min="0.01"
                        step="0.01"
                        required
                        value={formData.rentalPrice}
                        onChange={(event) =>
                          handleFormChange("rentalPrice", event.target.value)
                        }
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="edit-rental-type" className={labelClass}>
                        Rental Type *
                      </label>
                      <select
                        id="edit-rental-type"
                        required
                        value={formData.rentalType}
                        onChange={(event) =>
                          handleFormChange("rentalType", event.target.value)
                        }
                        className={inputClass}
                      >
                        <option value="daily">Per Day</option>
                        <option value="weekly">Per Week</option>
                        <option value="monthly">Per Month</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Location and Quantity */}
                <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-foreground">
                      Location & Quantity
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Tell renters where your equipment is located and how
                      many units are available.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="edit-location" className={labelClass}>
                        Location *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="edit-location"
                          required
                          minLength={2}
                          value={formData.location}
                          onChange={(event) =>
                            handleFormChange("location", event.target.value)
                          }
                          className={`${inputClass} pl-9`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="edit-quantity"
                        className={labelClass}
                      >
                        Available Quantity *
                      </label>
                      <input
                        id="edit-quantity"
                        type="number"
                        min="0"
                        step="1"
                        required
                        value={formData.availableQuantity}
                        onChange={(event) =>
                          handleFormChange(
                            "availableQuantity",
                            event.target.value,
                          )
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                </section>

                {/* Equipment Image */}
                <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-foreground">
                      Equipment Image
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Keep the existing image or upload a replacement.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label
                      htmlFor="edit-equipment-image"
                      className={labelClass}
                    >
                      Select Equipment Image
                    </label>

                    <div className="rounded-xl border-2 border-dashed border-border p-5 transition hover:border-primary/50">
                      {imagePreview ? (
                        <div className="space-y-3">
                          <div className="relative h-64 w-full overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={imagePreview}
                              alt="Equipment preview"
                              fill
                              unoptimized
                              className="object-contain"
                              sizes="(max-width: 768px) 100vw, 768px"
                            />
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-muted-foreground">
                              {selectedImage?.name ??
                                "Current equipment image"}
                            </p>

                            {selectedImage && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={removeSelectedImage}
                                disabled={isSaving}
                                className="gap-2"
                              >
                                <X className="size-4" />
                                Remove replacement
                              </Button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="edit-equipment-image"
                          className="flex cursor-pointer flex-col items-center justify-center gap-3 py-8 text-center"
                        >
                          <div className="rounded-full bg-primary/10 p-4 text-primary">
                            <ImagePlus className="size-7" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold">
                              Click to upload an image
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              JPEG, PNG or WebP · Maximum 5 MB
                            </p>
                          </div>
                        </label>
                      )}

                      <input
                        id="edit-equipment-image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={isSaving}
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </div>

                    <p className="text-xs text-muted-foreground">
                      A replacement image will be uploaded to ImgBB through
                      the backend before saving your changes.
                    </p>
                  </div>
                </section>

                {/* Rental Terms */}
                <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-foreground">
                      Rental Terms
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Explain the conditions renters must follow.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="edit-rental-terms" className={labelClass}>
                      Terms & Conditions *
                    </label>
                    <textarea
                      id="edit-rental-terms"
                      required
                      minLength={5}
                      maxLength={2000}
                      rows={4}
                      value={formData.rentalTerms}
                      onChange={(event) =>
                        handleFormChange("rentalTerms", event.target.value)
                      }
                      className="w-full resize-y rounded-lg border border-input bg-background px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                    />
                  </div>
                </section>

                {/* Approval Notice */}
                <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-900">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">
                      Admin approval required
                    </p>
                    <p className="mt-1 text-xs leading-5 text-blue-800">
                      Updating this listing will change its approval status
                      to Pending. An admin must review it again before it
                      becomes publicly available.
                    </p>
                  </div>
                </div>

                {/* Edit Error */}
                {editError && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
                  >
                    <AlertCircle className="mt-0.5 size-5 shrink-0" />
                    <p>{editError}</p>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-border p-5 sm:flex-row sm:justify-end sm:p-6">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSaving}
                  onClick={closeEditModal}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSaving}
                  className="gap-2 bg-brand-accent text-primary hover:bg-brand-accent/90"
                >
                  {isSaving ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Upload className="size-4" />
                  )}
                  {isSaving ? "Uploading & Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
