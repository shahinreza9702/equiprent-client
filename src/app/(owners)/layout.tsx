
import type { ReactNode } from "react";

import { DashboardGuard } from "@/components/auth/dashboard-guard";

export default function OwnersLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardGuard allowedRoles={["owner"]}>
      {children}
    </DashboardGuard>
  );
}
