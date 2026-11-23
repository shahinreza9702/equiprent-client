
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  UserRound,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Equipment", href: "/equipment" },
  { label: "Categories", href: "/categories" },
  { label: "How It Works", href: "/how-it-works" },
];

const getDashboardPath = (role: string) => {
  switch (role) {
    case "owner":
      return "/owner-dashboard";

    case "admin":
      return "/admin-dashboard";

    case "customer":
    default:
      return "/dashboard";
  }
};

const getProfilePath = (role: string) => {
  switch (role) {
    case "owner":
      return "/owner-dashboard/profile";

    case "admin":
      return "/admin-dashboard/profile";

    case "customer":
    default:
      return "/dashboard/profile";
  }
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const router = useRouter();

  const {
    user,
    isLoading,
    logout,
  } = useAuth();

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setLogoutError("");
      closeMenu();

      await logout();

      router.replace("/login");
      router.refresh();
    } catch {
      setLogoutError("Unable to sign out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const dashboardPath = user
    ? getDashboardPath(user.role)
    : "/login";

  const profilePath = user
    ? getProfilePath(user.role)
    : "/login";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={closeMenu}
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            E
          </span>

          <span className="text-xl font-bold tracking-tight text-primary">
            Equip<span className="text-brand-accent">Rent</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search equipment"
            render={<Link href="/equipment" />}
            nativeButton={false}
          >
            <Search />
          </Button>

          {!isLoading && !user && (
            <>
              <Button
                variant="outline"
                className="gap-2"
                render={<Link href="/login" />}
                nativeButton={false}
              >
                <UserRound />
                Sign In
              </Button>

              <Button
                className="bg-brand-accent text-primary hover:bg-brand-accent/90"
                render={<Link href="/register" />}
                nativeButton={false}
              >
                List Equipment
              </Button>
            </>
          )}

          {!isLoading && user && (
            <>
              <Button
                variant="ghost"
                className="gap-2"
                render={<Link href={dashboardPath} />}
                nativeButton={false}
              >
                <LayoutDashboard className="size-4" />
                Dashboard
              </Button>

              <Button
                variant="outline"
                className="gap-2"
                render={<Link href={profilePath} />}
                nativeButton={false}
              >
                <UserRound className="size-4" />
                <span className="max-w-28 truncate">
                  {user.name || "Profile"}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                aria-label="Sign out"
                title="Sign out"
                disabled={isLoggingOut}
                onClick={handleLogout}
              >
                <LogOut className="size-5" />
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={
            isMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() =>
            setIsMenuOpen((previous) => !previous)
          }
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-border/70 bg-background px-4 py-5 shadow-lg md:hidden sm:px-6"
        >
          <nav className="flex flex-col gap-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-3 border-t border-border/70 pt-4">
            {!isLoading && !user && (
              <>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  render={
                    <Link
                      href="/login"
                      onClick={closeMenu}
                    />
                  }
                  nativeButton={false}
                >
                  <UserRound />
                  Sign In
                </Button>

                <Button
                  className="w-full bg-brand-accent text-primary hover:bg-brand-accent/90"
                  render={
                    <Link
                      href="/register"
                      onClick={closeMenu}
                    />
                  }
                  nativeButton={false}
                >
                  List Equipment
                </Button>
              </>
            )}

            {!isLoading && user && (
              <>
                <div className="rounded-xl bg-muted/60 p-4">
                  <p className="text-sm font-semibold text-primary">
                    {user.name}
                  </p>

                  <p className="mt-1 text-xs capitalize text-muted-foreground">
                    {user.role} account
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  render={
                    <Link
                      href={dashboardPath}
                      onClick={closeMenu}
                    />
                  }
                  nativeButton={false}
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  render={
                    <Link
                      href={profilePath}
                      onClick={closeMenu}
                    />
                  }
                  nativeButton={false}
                >
                  <UserRound className="size-4" />
                  My Profile
                </Button>

                <Button
                  variant="destructive"
                  className="w-full justify-start gap-2"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  {isLoggingOut ? "Signing Out..." : "Logout"}
                </Button>
              </>
            )}

            {logoutError && (
              <p
                role="alert"
                className="text-sm text-destructive"
              >
                {logoutError}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Desktop logout error */}
      {logoutError && !isMenuOpen && (
        <p
          role="alert"
          className="border-t border-border px-4 py-2 text-center text-sm text-destructive"
        >
          {logoutError}
        </p>
      )}
    </header>
  );
}
