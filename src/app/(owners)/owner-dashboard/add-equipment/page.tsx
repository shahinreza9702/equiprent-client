
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ImagePlus,
  MapPin,
  Package,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const categories = [
  "Construction",
  "Photography",
  "Vehicles",
  "Agriculture",
  "Electronics",
  "Event Equipment",
];

export default function AddEquipmentPage() {
  const [imageName, setImageName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

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

      {/* Demo Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">Listing preview mode</p>
          <p className="mt-1 text-xs leading-5 text-amber-800">
            This form is currently a frontend demonstration. Equipment
            details will not be saved until backend integration is completed.
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
              <label htmlFor="equipment-name" className="text-sm font-medium">
                Equipment Name <span className="text-destructive">*</span>
              </label>
              <input
                id="equipment-name"
                name="name"
                required
                maxLength={100}
                placeholder="e.g. Professional Hydraulic Excavator"
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category <span className="text-destructive">*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                defaultValue=""
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
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
              <label htmlFor="condition" className="text-sm font-medium">
                Equipment Condition
              </label>
              <select
                id="condition"
                name="condition"
                defaultValue="Good"
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                <option>Brand New</option>
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
              </select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                minLength={20}
                maxLength={1500}
                rows={5}
                placeholder="Describe your equipment, its features, specifications and suitable uses..."
                className="w-full resize-y rounded-lg border border-input bg-background px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
              <p className="text-xs text-muted-foreground">
                Provide at least 20 characters of useful information.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Rental Pricing
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Set a rental price that works for your equipment.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">
                Rental Price (BDT) <span className="text-destructive">*</span>
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="1"
                step="1"
                required
                placeholder="e.g. 2500"
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="rental-unit" className="text-sm font-medium">
                Rental Unit <span className="text-destructive">*</span>
              </label>
              <select
                id="rental-unit"
                name="rentalUnit"
                defaultValue="day"
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                <option value="hour">Per Hour</option>
                <option value="day">Per Day</option>
                <option value="week">Per Week</option>
                <option value="month">Per Month</option>
              </select>
            </div>
          </div>
        </section>

        {/* Location and Availability */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Location & Availability
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Help renters find your equipment.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="location"
                  name="location"
                  required
                  placeholder="e.g. Chattogram, Bangladesh"
                  className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="availability" className="text-sm font-medium">
                Availability
              </label>
              <select
                id="availability"
                name="availability"
                defaultValue="available"
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                <option value="available">Available for Rent</option>
                <option value="unavailable">Currently Unavailable</option>
              </select>
            </div>
          </div>
        </section>

        {/* Image Upload */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Equipment Images
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a clear image that represents your equipment.
            </p>
          </div>

          <label
            htmlFor="equipment-image"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 px-5 py-10 text-center transition hover:border-primary/50 hover:bg-muted/50"
          >
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              {imageName ? (
                <Camera className="size-6" />
              ) : (
                <ImagePlus className="size-6" />
              )}
            </div>

            <p className="text-sm font-semibold text-foreground">
              {imageName || "Click to select an equipment image"}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Select an image from your device. Upload is not connected yet.
            </p>

            <input
              id="equipment-image"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setImageName(file?.name ?? "");
              }}
            />

            <span className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium">
              <Upload className="size-4" />
              Choose Image
            </span>
          </label>
        </section>

        {/* Form Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            render={<Link href="/owner-dashboard/equipment" />}
            nativeButton={false}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="gap-2 bg-brand-accent text-primary hover:bg-brand-accent/90"
          >
            <Upload className="size-4" />
            Submit for Approval
          </Button>
        </div>

        {submitted && (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            <p className="font-semibold">Demo form submitted successfully!</p>
            <p className="mt-1">
              No equipment has been saved. Backend integration is required to
              create a real listing.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
