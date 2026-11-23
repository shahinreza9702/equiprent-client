
"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiRequest, ApiError } from "@/lib/api";

interface FavoriteEquipment {
  _id: string;
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

interface FavoriteButtonProps {
  equipmentId: string;
  enabled: boolean;
}

export function FavoriteButton({
  equipmentId,
  enabled,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");

  const checkFavorite = useCallback(async () => {
    if (!enabled) {
      setInitializing(false);
      return;
    }

    try {
      setError("");

      const response =
        await apiRequest<FavoriteListResponse>("/favorites");

      const exists = (response.data?.favorites ?? []).some(
        (favorite) => favorite.equipment?._id === equipmentId,
      );

      setIsFavorite(exists);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to check favorite status.",
      );
    } finally {
      setInitializing(false);
    }
  }, [enabled, equipmentId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void checkFavorite();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [checkFavorite]);

  const toggleFavorite = async () => {
    try {
      setLoading(true);
      setError("");

      if (isFavorite) {
        await apiRequest(`/favorites/${equipmentId}`, {
          method: "DELETE",
        });

        setIsFavorite(false);
      } else {
        await apiRequest(`/favorites/${equipmentId}`, {
          method: "POST",
        });

        setIsFavorite(true);
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to update favorites. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!enabled) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={
          isFavorite ? "Remove from favorites" : "Add to favorites"
        }
        title={
          isFavorite ? "Remove from favorites" : "Add to favorites"
        }
        disabled={loading || initializing}
        onClick={() => void toggleFavorite()}
        className={
          isFavorite
            ? "border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
            : ""
        }
      >
        <Heart
          className={`size-5 ${
            isFavorite ? "fill-current" : ""
          }`}
        />
      </Button>

      {error && (
        <p className="max-w-48 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
