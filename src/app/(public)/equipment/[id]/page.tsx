
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { equipmentData } from "@/components/home/featured-equipment/equipment-data";

interface EquipmentDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Async content: Dynamic params are accessed inside Suspense.
async function EquipmentDetailsContent({
  params,
}: EquipmentDetailsPageProps) {
  const { id } = await params;

  const equipment = equipmentData.find(
    (item) => item.id === id
  );

  if (!equipment) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link href="/equipment" className="transition-colors hover:text-primary">
          Equipment
        </Link>
        <span>/</span>
        <span className="font-medium text-primary">{equipment.name}</span>
      </div>

      {/* Back Button */}
      <Link
        href="/equipment"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-brand-accent"
      >
        <ArrowLeft className="size-4" />
        Back to Equipment
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.5fr_0.85fr]">
        {/* Left: Equipment Information */}
        <div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border bg-muted">
            <Image
              src={equipment.image}
              alt={equipment.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 65vw"
              className="object-cover"
            />

            <div className="absolute left-5 top-5 rounded-full bg-background/95 px-4 py-2 text-xs font-semibold text-primary shadow-sm">
              {equipment.category}
            </div>

            {equipment.featured && (
              <div className="absolute right-5 top-5 rounded-full bg-brand-accent px-4 py-2 text-xs font-semibold text-primary shadow-sm">
                Featured
              </div>
            )}
          </div>

          {/* Equipment Details */}
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                <Star className="size-4 fill-brand-accent text-brand-accent" />
                {equipment.rating.toFixed(1)}
                <span className="font-normal text-muted-foreground">
                  Rating
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {equipment.location}
              </div>
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {equipment.name}
            </h1>

            <p className="mt-5 text-base leading-8 text-muted-foreground">
              {equipment.description}
            </p>
          </div>

          {/* Owner Information */}
          <div className="mt-10 rounded-2xl border border-border bg-card p-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Equipment Owner
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-primary">
                  {equipment.owner.name}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="size-4 fill-brand-accent text-brand-accent" />
                    {equipment.owner.rating.toFixed(1)} Owner Rating
                  </span>

                  {equipment.owner.verified && (
                    <span className="flex items-center gap-1 text-sm font-medium text-green-700">
                      <ShieldCheck className="size-4" />
                      Verified Owner
                    </span>
                  )}
                </div>
              </div>

              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="size-6" />
              </div>
            </div>

            <p className="mt-5 border-t border-border pt-4 text-xs leading-6 text-muted-foreground">
              Owner information shown here is sample data for demonstration.
            </p>
          </div>
        </div>

        {/* Right: Rental Price Card */}
        <aside>
          <div className="sticky top-28 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
            <p className="text-sm font-medium text-muted-foreground">
              Rental Price
            </p>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">
                ৳{equipment.price.toLocaleString("en-BD")}
              </span>
              <span className="text-sm text-muted-foreground">
                / {equipment.rentalUnit}
              </span>
            </div>

            <div className="my-6 border-t border-border" />

            <h2 className="text-lg font-bold text-primary">
              Rental Summary
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Category</span>
                <span className="text-right font-medium text-primary">
                  {equipment.category}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Location</span>
                <span className="text-right font-medium text-primary">
                  {equipment.location}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Rental Period</span>
                <span className="font-medium capitalize text-primary">
                  Per {equipment.rentalUnit}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Availability</span>
                <span className="font-semibold text-green-700">
                  Listed
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-muted/70 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-700" />
                <p className="text-sm leading-6 text-muted-foreground">
                  Review the equipment details before proceeding with a rental.
                </p>
              </div>
            </div>

            <Button
              className="mt-6 h-12 w-full gap-2 bg-brand-accent font-semibold text-primary hover:bg-brand-accent/90"
              render={<Link href="/login" />}
              nativeButton={false}
            >
              Sign In to Book
              <ArrowRight className="size-4" />
            </Button>

            <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
              Sign in to continue with the booking process.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

// Synchronous page component: Suspense wraps dynamic content.
export default function EquipmentDetailsPage({
  params,
}: EquipmentDetailsPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground sm:px-6 lg:px-8">
            Loading equipment details...
          </div>
        }
      >
        <EquipmentDetailsContent params={params} />
      </Suspense>
    </main>
  );
}
