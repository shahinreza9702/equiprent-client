
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  Settings,
  Menu,
  X,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    label: "Overview",
    href: "/admin-dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin-dashboard/users",
    icon: Users,
  },
  {
    label: "Equipment",
    href: "/admin-dashboard/equipment",
    icon: Package,
  },
  {
    label: "Bookings",
    href: "/admin-dashboard/bookings",
    icon: ClipboardList,
  },
  {
    label: "Profile Settings",
    href: "/admin-dashboard/profile",
    icon: Settings,
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/admin-dashboard") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <>
      {/* Brand */}
      <Link
        href="/"
        onClick={closeMobileMenu}
        className="flex h-20 items-center gap-3 border-b border-border px-6"
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
          E
        </span>

        <span className="text-xl font-bold tracking-tight text-primary">
          Equip<span className="text-brand-accent">Rent</span>
        </span>
      </Link>

      {/* Admin Identity */}
      <div className="mx-4 mt-6 flex items-center gap-3 rounded-xl bg-muted/60 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <ShieldCheck className="size-5" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            Administrator
          </p>
          <p className="text-xs text-muted-foreground">
            Admin Workspace
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-7">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Management
        </p>

        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="size-5" />
                  {item.label}
                </span>

                {active && (
                  <ChevronRight className="size-4" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Back to Website */}
      <div className="border-t border-border p-4">
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
        >
          <ArrowLeft className="size-5" />
          Back to Website
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-border bg-background lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground">
            E
          </span>

          <span className="text-lg font-bold text-primary">
            Equip<span className="text-brand-accent">Rent</span>
          </span>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          aria-label={
            isMobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isMobileMenuOpen}
          onClick={() =>
            setIsMobileMenuOpen((previous) => !previous)
          }
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </header>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-black/40"
            onClick={closeMobileMenu}
          />

          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-border bg-background shadow-xl">
            <div className="flex items-center justify-end px-4 pt-3">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close navigation menu"
                onClick={closeMobileMenu}
              >
                <X />
              </Button>
            </div>

            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-72">
        <header className="hidden h-20 items-center justify-between border-b border-border bg-background px-8 lg:flex">
          <div>
            <p className="text-sm text-muted-foreground">
              EquipRent Administration
            </p>
            <h1 className="text-lg font-semibold text-foreground">
              Admin Workspace
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">
                Administrator
              </p>
              <p className="text-xs text-muted-foreground">
                Platform Admin
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
