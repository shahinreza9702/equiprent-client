
import Link from "next/link";
import { Menu, Search, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Equipment", href: "/equipment" },
  { label: "Categories", href: "/categories" },
  { label: "How It Works", href: "/how-it-works" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
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

        {/* Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="icon" aria-label="Search equipment">
            <Search />
          </Button>

          <Button variant="outline" className="gap-2">
            <UserRound />
            Sign In
          </Button>

          <Button className="bg-brand-accent text-primary hover:bg-brand-accent/90">
            List Equipment
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu />
        </Button>
      </div>
    </header>
  );
}
