
"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiRequest, ApiError } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";

interface EquipmentOwner {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  status: string;
}

interface Equipment {
  _id: string;
  name: string;
  description: string;
  category: string;
  rentalPrice: number;
  rentalType: "daily" | "weekly" | "monthly";
  location: string;
  availableQuantity: number;
  condition: string;
  brand: string;
  model: string;
  image: string;
  rentalTerms: string;
  status: "available" | "unavailable";
  approvalStatus: "pending" | "approved" | "rejected";
  owner: EquipmentOwner;
  createdAt?: string;
  updatedAt?: string;
}

function EquipmentDetailsContent() {
  const params = useParams<{ id: string }>();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthLoading || !user) return;

    let isMounted = true;

    const fetchEquipment = async () => {
      try {
        const response = await apiRequest<Equipment>(
          `/equipment/${params.id}`,
        );

        if (isMounted) {
          if (!response.data) {
            throw new Error("Equipment details were not returned.");
          }

          setEquipment(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof ApiError
              ? err.message
              : "Unable to load equipment details.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchEquipment();

    return () => {
      isMounted = false;
    };
  }, [params.id, user, isAuthLoading]);

  if (isAuthLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          Checking your session...
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-primary">
            Sign in to view equipment details
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Please sign in to view complete equipment information.
          </p>

          <Button
            className="mt-6 gap-2"
            render={<Link href="/login" />}
            nativeButton={false}
          >
            Sign In
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          Loading equipment details...
        </p>
      </main>
    );
  }

  if (error || !equipment) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-primary">
            Equipment not available
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            {error || "The requested equipment could not be found."}
          </p>

          <Button
            className="mt-6"
            variant="outline"
            render={<Link href="/equipment" />}
            nativeButton={false}
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to Equipment
          </Button>
        </div>
      </main>
    );
  }

  const canBook =
    user.role === "customer" &&
    equipment.status === "available" &&
    equipment.availableQuantity > 0;

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>

          <span>/</span>

          <Link href="/equipment" className="hover:text-primary">
            Equipment
          </Link>

          <span>/</span>

          <span className="font-medium text-primary">
            {equipment.name}
          </span>
        </div>

        <Link
          href="/equipment"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-brand-accent"
        >
          <ArrowLeft className="size-4" />
          Back to Equipment
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.5fr_0.85fr]">
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border bg-muted">
              {equipment.image ? (
                <Image
                  src={equipment.image}
                  alt={equipment.name}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}

              <div className="absolute left-5 top-5 rounded-full bg-background/95 px-4 py-2 text-xs font-semibold text-primary">
                {equipment.category}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" />
                  {equipment.location}
                </span>

                <span className="capitalize">
                  {equipment.condition} condition
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                {equipment.name}
              </h1>

              <p className="mt-5 leading-8 text-muted-foreground">
                {equipment.description}
              </p>

              <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Brand</p>
                  <p className="mt-1 font-semibold text-primary">
                    {equipment.brand}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Model</p>
                  <p className="mt-1 font-semibold text-primary">
                    {equipment.model}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Available Quantity
                  </p>
                  <p className="mt-1 font-semibold text-primary">
                    {equipment.availableQuantity}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Condition
                  </p>
                  <p className="mt-1 font-semibold capitalize text-primary">
                    {equipment.condition}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold text-primary">
                Equipment Owner
              </h2>

              <div className="mt-5 flex items-center gap-4">
                {equipment.owner.avatar ? (
                  <Image
                    src={equipment.owner.avatar}
                    alt={equipment.owner.name}
                    width={48}
                    height={48}
                    unoptimized
                    className="size-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ShieldCheck className="size-6" />
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-primary">
                    {equipment.owner.name}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {equipment.owner.email}
                  </p>

                  {equipment.owner.phone && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {equipment.owner.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-sm text-green-700">
                <ShieldCheck className="size-4" />
                Active Equipment Owner
              </div>
            </div>

            {equipment.rentalTerms && (
              <div className="mt-8 rounded-2xl border border-border bg-card p-6">
                <h2 className="text-lg font-bold text-primary">
                  Rental Terms
                </h2>

                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                  {equipment.rentalTerms}
                </p>
              </div>
            )}
          </div>

          <aside>
            <div className="sticky top-28 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
              <p className="text-sm font-medium text-muted-foreground">
                Rental Price
              </p>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  ৳{equipment.rentalPrice.toLocaleString("en-BD")}
                </span>

                <span className="text-sm capitalize text-muted-foreground">
                  / {equipment.rentalType}
                </span>
              </div>

              <div className="my-6 border-t border-border" />

              <h2 className="text-lg font-bold text-primary">
                Rental Summary
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium text-primary">
                    {equipment.category}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium text-primary">
                    {equipment.location}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Availability</span>
                  <span className="font-semibold capitalize text-primary">
                    {equipment.status === "available" &&
                    equipment.availableQuantity > 0
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-muted/70 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-700" />

                  <p className="text-sm leading-6 text-muted-foreground">
                    Review the equipment details and rental terms before
                    proceeding.
                  </p>
                </div>
              </div>

              {canBook ? (
                <Button
                  className="mt-6 h-12 w-full"
                  disabled
                  title="Booking workflow is not connected yet"
                >
                  Booking Coming Soon
                </Button>
              ) : user.role === "customer" ? (
                <Button className="mt-6 h-12 w-full" disabled>
                  Currently Unavailable
                </Button>
              ) : (
                <p className="mt-6 rounded-xl bg-muted p-4 text-center text-sm text-muted-foreground">
                  Booking is available for Customer accounts only.
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default function EquipmentDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">
            Loading equipment details...
          </p>
        </main>
      }
    >
      <EquipmentDetailsContent />
    </Suspense>
  );
}
