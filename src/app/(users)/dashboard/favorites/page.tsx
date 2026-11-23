
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  MapPin,
  Package,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiRequest, ApiError } from "@/lib/api";

interface FavoriteEquipment {
  _id: string;
  name: string;
  category: string;
  location: string;
  rentalPrice: number;
  rentalType: string;
  image?: string;
  status: "available" | "unavailable";
}

interface Favorite {
  _id: string;
  equipment: FavoriteEquipment | null;
}

interface FavoriteListResponse {
  favorites: Favorite[];
  total: number;
  available: number;
}

export default function MyFavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await apiRequest<FavoriteListResponse>("/favorites");

      setFavorites(response.data?.favorites ?? []);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to load your favorites. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadFavorites();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadFavorites]);

  const removeFavorite = async (equipmentId: string) => {
    try {
      setRemovingId(equipmentId);
      setError("");

      await apiRequest(`/favorites/${equipmentId}`, {
        method: "DELETE",
      });

      setFavorites((current) =>
        current.filter(
          (favorite) => favorite.equipment?._id !== equipmentId,
        ),
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to remove this equipment from favorites.",
      );
    } finally {
      setRemovingId(null);
    }
  };

  const savedEquipment = favorites.filter(
    (favorite) => favorite.equipment !== null,
  );

  const availableCount = savedEquipment.filter(
    (favorite) => favorite.equipment?.status === "available",
  ).length;

  const formatPrice = (price: number) =>
    `৳${price.toLocaleString("en-BD")}`;

  const getRentalType = (type: string) => {
    const labels: Record<string, string> = {
      hourly: "/ hour",
      daily: "/ day",
      weekly: "/ week",
      monthly: "/ month",
    };

    return labels[type.toLowerCase()] ?? ` / ${type}`;
  };

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-brand-accent">
            Customer Portal
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            My Favorites
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Keep track of the equipment you love and want to rent.
          </p>
        </div>

        <Button
          className="w-full gap-2 bg-brand-accent text-primary hover:bg-brand-accent/90 sm:w-auto"
          render={<Link href="/equipment" />}
          nativeButton={false}
        >
          Browse Equipment
          <ArrowRight className="size-4" />
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-6 shadow-sm">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Saved Equipment
            </p>

            <p className="mt-2 text-3xl font-bold text-primary">
              {savedEquipment.length.toString().padStart(2, "0")}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Equipment saved to your collection
            </p>
          </div>

          <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <Heart className="size-6 fill-current" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-6 shadow-sm">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Available Equipment
            </p>

            <p className="mt-2 text-3xl font-bold text-primary">
              {availableCount.toString().padStart(2, "0")}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Currently available for rental
            </p>
          </div>

          <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Package className="size-6" />
          </div>
        </div>
      </div>

      {/* Favorites Section */}
      <section>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-primary">
              Saved Equipment
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Your favorite rental equipment.
            </p>
          </div>

          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {savedEquipment.length} Saved
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-border"
              >
                <div className="h-52 bg-muted" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                  <div className="h-10 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => void loadFavorites()}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && savedEquipment.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-background px-6 py-14 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-50 text-red-500">
              <Heart className="size-8" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-primary">
              No Favorites Yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              You haven&aphos;t saved any equipment yet. Explore our collection
              and add your favorite equipment here.
            </p>

            <Button
              className="mt-6 gap-2 bg-brand-accent text-primary hover:bg-brand-accent/90"
              render={<Link href="/equipment" />}
              nativeButton={false}
            >
              Explore Equipment
              <ArrowRight className="size-4" />
            </Button>
          </div>
        )}

        {/* Equipment Cards */}
        {!loading && !error && savedEquipment.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {savedEquipment.map((favorite) => {
              const equipment = favorite.equipment!;

              return (
                <article
                  key={favorite._id}
                  className="group overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Equipment Image */}
                  <div className="relative flex h-52 items-center justify-center overflow-hidden bg-muted">
                    {equipment.image ? (
                      <Image
                        src={equipment.image}
                        alt={equipment.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <Package className="size-14 text-muted-foreground/40" />
                    )}

                    <span className="absolute left-4 top-4 z-10 max-w-[70%] truncate rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
                      {equipment.category}
                    </span>

                    <button
                      type="button"
                      aria-label={`Remove ${equipment.name} from favorites`}
                      title="Remove from favorites"
                      disabled={removingId === equipment._id}
                      onClick={() => void removeFavorite(equipment._id)}
                      className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-background text-red-500 shadow-sm transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Heart className="size-4 fill-current" />
                    </button>
                  </div>

                  {/* Equipment Information */}
                  <div className="space-y-4 p-5">
                    <div>
                      <h4 className="text-lg font-bold text-primary transition-colors group-hover:text-brand-accent">
                        {equipment.name}
                      </h4>

                      <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="size-4 shrink-0" />
                        <span className="truncate">
                          {equipment.location}
                        </span>
                      </div>

                      <span
                        className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${equipment.status === "available"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                          }`}
                      >
                        {equipment.status === "available"
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Rental Price
                        </p>

                        <p className="mt-1 text-xl font-bold text-primary">
                          {formatPrice(equipment.rentalPrice)}
                          <span className="text-xs font-normal text-muted-foreground">
                            {" "}
                            {getRentalType(equipment.rentalType)}
                          </span>
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label={`Remove ${equipment.name} from favorites`}
                          title="Remove from favorites"
                          disabled={removingId === equipment._id}
                          onClick={() =>
                            void removeFavorite(equipment._id)
                          }
                        >
                          <Trash2 className="size-4" />
                        </Button>

                        <Button
                          size="sm"
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                          render={
                            <Link href={`/equipment/${equipment._id}`} />
                          }
                          nativeButton={false}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-dashed border-border bg-background p-6 text-center sm:flex-row sm:text-left">
        <div>
          <h3 className="font-bold text-primary">
            Looking for something else?
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Explore our collection and find the right equipment for your next project.
          </p>
        </div>

        <Button
          variant="outline"
          className="shrink-0 gap-2"
          render={<Link href="/equipment" />}
          nativeButton={false}
        >
          Explore More
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
