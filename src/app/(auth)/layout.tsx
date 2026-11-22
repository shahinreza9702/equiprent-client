
import type { ReactNode } from "react";

import { GuestGuard } from "@/components/auth/guest-guard";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <GuestGuard>
      <main className="flex min-h-screen flex-col bg-background">
        {children}
      </main>
    </GuestGuard>
  );
}
