
import { Suspense } from "react";
import { EquipmentListing } from "./equipment-listing";

interface EquipmentPageProps {
  searchParams: Promise<{
    search?: string;
    location?: string;
  }>;
}

async function EquipmentContent({
  searchParams,
}: EquipmentPageProps) {
  const params = await searchParams;

  return (
    <EquipmentListing
      initialSearch={params.search ?? ""}
      initialLocation={params.location ?? ""}
    />
  );
}

export default function EquipmentPage({
  searchParams,
}: EquipmentPageProps) {
  return (
    <main className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="border-b border-border/70 bg-primary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent">
            Explore Our Collection
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Find the Right Equipment
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
            Explore reliable equipment for your next project.
            Search by equipment name, category, or location.
          </p>
        </div>
      </section>

      {/* Equipment Listing */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="rounded-2xl border border-border p-10 text-center text-muted-foreground">
              Loading equipment...
            </div>
          }
        >
          <EquipmentContent searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
