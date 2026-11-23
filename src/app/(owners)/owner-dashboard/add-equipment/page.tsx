
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  MapPin,
  Package,
  Upload,
  AlertCircle,
  LoaderCircle,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api";

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

interface ImageUploadResponse {
  imageUrl: string;
}

export default function AddEquipmentPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    setError("");
    setImagePreview("");
    setSelectedImage(null);

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Only JPEG, PNG, and WebP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(null);
    setImagePreview("");

    const input = document.getElementById(
      "equipment-image",
    ) as HTMLInputElement | null;

    if (input) input.value = "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setSuccess("");
    setError("");

    const form = event.currentTarget;

    try {
      if (!selectedImage) {
        throw new Error("Please select an equipment image.");
      }

      // Upload image to ImgBB through backend
      const imageFormData = new FormData();
      imageFormData.append("image", selectedImage);

      const uploadResponse = await apiRequest<ImageUploadResponse>(
        "/equipments/upload-image",
        {
          method: "POST",
          body: imageFormData,
        },
      );

      const imageUrl = uploadResponse.data?.imageUrl;

      if (!imageUrl) {
        throw new Error("Image upload failed. Please try again.");
      }

      // Prepare equipment data
      const formData = new FormData(form);

      const payload = {
        name: String(formData.get("name") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim(),
        category: String(formData.get("category") ?? ""),
        rentalPrice: Number(formData.get("rentalPrice")),
        rentalType: String(formData.get("rentalType") ?? ""),
        location: String(formData.get("location") ?? "").trim(),
        availableQuantity: Number(
          formData.get("availableQuantity"),
        ),
        condition: String(formData.get("condition") ?? ""),
        brand: String(formData.get("brand") ?? "").trim(),
        model: String(formData.get("model") ?? "").trim(),
        image: imageUrl,
        rentalTerms: String(formData.get("rentalTerms") ?? "").trim(),
      };

      // Submit equipment
      await apiRequest("/equipments", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSuccess(
        "Equipment submitted successfully! It is now waiting for admin approval.",
      );

      form.reset();
      removeImage();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit equipment. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

  const labelClass = "text-sm font-medium";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/owner-dashboard/equipment"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Back to My Equipment
          </Link>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Add New Equipment
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Provide equipment details to create a new rental listing.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
          <Package className="size-4" />
          New Listing
        </div>
      </div>

      {/* Approval Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-900">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">
            Admin approval required
          </p>
          <p className="mt-1 text-xs leading-5 text-blue-800">
            Your equipment will be submitted for admin review. It will become
            publicly available after approval.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Basic Information
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tell renters what equipment you are offering.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="equipment-name" className={labelClass}>
                Equipment Name *
              </label>
              <input
                id="equipment-name"
                name="name"
                required
                minLength={2}
                maxLength={150}
                placeholder="e.g. Professional Hydraulic Excavator"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className={labelClass}>
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                defaultValue=""
                className={inputClass}
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="condition" className={labelClass}>
                Equipment Condition *
              </label>
              <select
                id="condition"
                name="condition"
                required
                defaultValue="Good"
                className={inputClass}
              >
                <option>Brand New</option>
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="brand" className={labelClass}>
                Brand *
              </label>
              <input
                id="brand"
                name="brand"
                required
                minLength={1}
                placeholder="e.g. Caterpillar"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="model" className={labelClass}>
                Model *
              </label>
              <input
                id="model"
                name="model"
                required
                minLength={1}
                placeholder="e.g. 320D"
                className={inputClass}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="description" className={labelClass}>
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                minLength={10}
                maxLength={1500}
                rows={5}
                placeholder="Describe your equipment, its features, specifications and suitable uses..."
                className="w-full resize-y rounded-lg border border-input bg-background px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
              <p className="text-xs text-muted-foreground">
                Provide at least 10 characters of useful information.
              </p>
            </div>
          </div>
        </section>

        {/* Rental Pricing */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Rental Pricing
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Set a rental price for your equipment.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="rental-price" className={labelClass}>
                Rental Price (BDT) *
              </label>
              <input
                id="rental-price"
                name="rentalPrice"
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="e.g. 2500"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="rental-type" className={labelClass}>
                Rental Type *
              </label>
              <select
                id="rental-type"
                name="rentalType"
                required
                defaultValue="daily"
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
            <h2 className="text-lg font-semibold text-foreground">
              Location & Quantity
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tell renters where your equipment is located and how many units
              are available.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="location" className={labelClass}>
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="location"
                  name="location"
                  required
                  minLength={2}
                  placeholder="e.g. Chattogram, Bangladesh"
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="available-quantity" className={labelClass}>
                Available Quantity *
              </label>
              <input
                id="available-quantity"
                name="availableQuantity"
                type="number"
                min="1"
                step="1"
                required
                defaultValue="1"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Equipment Image */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Equipment Image
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload a clear image of your equipment.
            </p>
          </div>

          <div className="space-y-3">
            <label htmlFor="equipment-image" className={labelClass}>
              Select Equipment Image *
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
                      {selectedImage?.name}
                    </p>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeImage}
                      disabled={isSubmitting}
                      className="gap-2"
                    >
                      <X className="size-4" />
                      Remove image
                    </Button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="equipment-image"
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
                id="equipment-image"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required
                disabled={isSubmitting}
                onChange={handleImageChange}
                className={imagePreview ? "hidden" : "sr-only"}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Your image will be securely uploaded through our backend to
              ImgBB.
            </p>
          </div>
        </section>

        {/* Rental Terms */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Rental Terms
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Explain the conditions renters must follow.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="rental-terms" className={labelClass}>
              Terms & Conditions *
            </label>
            <textarea
              id="rental-terms"
              name="rentalTerms"
              required
              minLength={5}
              maxLength={2000}
              rows={4}
              placeholder="e.g. Equipment must be returned in its original condition. Transportation costs are the renter's responsibility."
              className="w-full resize-y rounded-lg border border-input bg-background px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
        </section>

        {/* Feedback */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="size-5" />
              Equipment submitted successfully!
            </div>
            <p className="mt-2">{success}</p>
            <Link
              href="/owner-dashboard/equipment"
              className="mt-3 inline-block font-semibold underline"
            >
              Go to My Equipment
            </Link>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            render={<Link href="/owner-dashboard/equipment" />}
            nativeButton={false}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="gap-2 bg-brand-accent text-primary hover:bg-brand-accent/90"
          >
            {isSubmitting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            {isSubmitting ? "Uploading & Submitting..." : "Submit for Approval"}
          </Button>
        </div>
      </form>
    </div>
  );
}
