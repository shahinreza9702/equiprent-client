
import type { ReactNode } from "react";

import { DashboardGuard } from "@/components/auth/dashboard-guard";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardGuard allowedRoles={["admin"]}>
      {children}
    </DashboardGuard>
  );
}
