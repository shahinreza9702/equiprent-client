
"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth, type UserRole } from "@/providers/auth-provider";

interface DashboardGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

const dashboardRoutes: Record<UserRole, string> = {
  customer: "/dashboard",
  owner: "/owner-dashboard",
  admin: "/admin-dashboard",
};

export function DashboardGuard({
  children,
  allowedRoles,
}: DashboardGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.replace(dashboardRoutes[user.role]);
    }
  }, [user, isLoading, allowedRoles, router, pathname]);

  if (isLoading || !user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto size-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            Verifying your account...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
