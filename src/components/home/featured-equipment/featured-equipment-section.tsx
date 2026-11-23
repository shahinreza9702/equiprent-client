
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EquipmentCard, type EquipmentCardData } from "./equipment-card";
import { apiRequest } from "@/lib/api";

interface EquipmentListResponse {
  equipments: EquipmentCardData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function FeaturedEquipmentSection() {
  const [equipments, setEquipments] = useState<EquipmentCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchEquipments = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response =
          await apiRequest<EquipmentListResponse>("/equipments?limit=6");

        if (isMounted) {
          setEquipments(response.data?.equipments ?? []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load equipment.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchEquipments();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        >
          <div className="max-w-2xl">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-[0.18em] text-brand-accent">
              Available Collection
            </span>

            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Explore Available Equipment
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Discover quality equipment for your next project.
              Find the right tools and machinery at flexible rental prices.
            </p>
          </div>

          <Button
            nativeButton={false}
            render={<Link href="/equipment" />}
            variant="outline"
            className="w-fit gap-2"
          >
            Explore All Equipment
            <ArrowRight className="size-4" />
          </Button>
        </motion.div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-2xl bg-muted"
              />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {!isLoading && !error && equipments.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <h3 className="text-lg font-semibold text-primary">
              No equipment available yet
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Available equipment will appear here once approved.
            </p>
          </div>
        )}

        {!isLoading && !error && equipments.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {equipments.map((equipment, index) => (
              <motion.div
                key={equipment._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                }}
              >
                <EquipmentCard equipment={equipment} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
