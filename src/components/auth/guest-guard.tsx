
"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/auth-provider";

const roleDashboard: Record<string, string> = {
  customer: "/dashboard",
  owner: "/owner-dashboard",
  admin: "/admin-dashboard",
};

export function GuestGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(roleDashboard[user.role] ?? "/");
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Checking your session..." : "Redirecting..."}
        </p>
      </main>
    );
  }

  return <>{children}</>;
}
