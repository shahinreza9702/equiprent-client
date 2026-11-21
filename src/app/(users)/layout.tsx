
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  CalendarDays,
  Heart,
  LayoutDashboard,
  Menu,
  Settings,
  UserRound,
  X,
} from "lucide-react";

const navigationLinks = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Bookings",
    href: "/dashboard/bookings",
    icon: CalendarDays,
  },
  {
    label: "My Favorites",
    href: "/dashboard/favorites",
    icon: Heart,
  },
  {
    label: "Profile Settings",
    href: "/dashboard/profile",
    icon: Settings,
  },
];

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary font-bold text-white">
            E
          </span>
          <span className="text-lg font-bold text-primary">
            Equip<span className="text-brand-accent">Rent</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          className="rounded-lg p-2 text-primary hover:bg-muted"
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-background transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Brand */}
          <div className="flex h-20 items-center border-b border-border px-7">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
                E
              </span>
              <span className="text-xl font-bold tracking-tight text-primary">
                Equip<span className="text-brand-accent">Rent</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-8">
            <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Customer Menu
            </p>

            <nav className="space-y-2">
              {navigationLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-primary"
                    }`}
                  >
                    <Icon className="size-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="border-t border-border p-5">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
            >
              <LayoutDashboard className="size-5" />
              Back to Website
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <div className="min-w-0 flex-1">
          {/* Desktop Header */}
          <header className="sticky top-0 z-30 hidden h-20 items-center justify-between border-b border-border bg-background/95 px-8 backdrop-blur lg:flex">
            <div>
              <p className="text-sm text-muted-foreground">
                Customer Portal
              </p>
              <h1 className="text-lg font-bold text-primary">
                My Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-5">
              <button
                type="button"
                aria-label="Notifications"
                className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                <Bell className="size-5" />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-brand-accent" />
              </button>

              <div className="flex items-center gap-3 border-l border-border pl-5">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Customer
                  </p>
                  <p className="text-xs text-muted-foreground">
                    My Account
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
