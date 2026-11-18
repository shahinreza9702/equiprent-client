
import Link from "next/link";
import {
    ArrowUpRight,
    Globe,
    Mail,
    MapPin,
    Phone,
} from "lucide-react";

const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Explore Equipment", href: "/equipment" },
    { label: "Categories", href: "/categories" },
    { label: "How It Works", href: "/how-it-works" },
];

const categoryLinks = [
    { label: "Construction Equipment", href: "/categories/construction" },
    { label: "Photography Equipment", href: "/categories/photography" },
    { label: "Vehicles & Transportation", href: "/categories/vehicles" },
    { label: "Agriculture Equipment", href: "/categories/agriculture" },
    { label: "Electronics & Events", href: "/categories/electronics" },
];

const socialLinks = [
    { label: "Facebook", href: "https://www.facebook.com" },
    { label: "Instagram", href: "https://www.instagram.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com" },
];

export function Footer() {
    return (
        <footer className="relative overflow-hidden bg-[#111F38] text-white">
            {/* Background Decoration */}
            <div className="pointer-events-none absolute -right-40 -top-40 size-[400px] rounded-full bg-brand-accent/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Main Footer */}
                <div className="grid gap-12 border-b border-white/10 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.4fr_1fr] lg:gap-10 lg:py-20">

                    {/* Brand Information */}
                    <div>
                        <Link href="/" className="inline-flex items-center gap-2">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-brand-accent text-lg font-bold text-primary">
                                E
                            </span>

                            <span className="text-2xl font-bold tracking-tight">
                                Equip<span className="text-brand-accent">Rent</span>
                            </span>
                        </Link>

                        <p className="mt-6 max-w-xs text-sm leading-7 text-white/60">
                            Your trusted equipment rental marketplace. Discover quality
                            equipment, connect with owners, and make every project easier.
                        </p>

                        {/* Social Links */}
                        <div className="mt-7 flex items-center gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-brand-accent/50 hover:bg-brand-accent hover:text-primary"
                                >
                                    <Globe className="size-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-base font-bold text-white">
                            Quick Links
                        </h3>

                        <ul className="mt-6 space-y-4">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="inline-flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-brand-accent"
                                    >
                                        {link.label}
                                        <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-base font-bold text-white">
                            Popular Categories
                        </h3>

                        <ul className="mt-6 space-y-4">
                            {categoryLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/60 transition-colors hover:text-brand-accent"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-base font-bold text-white">
                            Get in Touch
                        </h3>

                        <ul className="mt-6 space-y-5">
                            <li className="flex items-start gap-3">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-accent" />
                                <span className="text-sm leading-6 text-white/60">
                                    Bangladesh
                                </span>
                            </li>

                            <li className="flex items-center gap-3">
                                <Mail className="size-4 shrink-0 text-brand-accent" />
                                <a
                                    href="mailto:support@equiprent.com"
                                    className="break-all text-sm text-white/60 transition-colors hover:text-brand-accent"
                                >
                                    support@equiprent.com
                                </a>
                            </li>

                            <li className="flex items-center gap-3">
                                <Phone className="size-4 shrink-0 text-brand-accent" />
                                <span className="text-sm text-white/60">
                                    Contact support
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="flex flex-col items-center justify-between gap-4 py-7 text-center sm:flex-row sm:text-left">
                    <p className="text-sm text-white/50">
                        © 2026 EquipRent. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6 text-sm text-white/50">
                        <Link
                            href="/privacy"
                            className="transition-colors hover:text-brand-accent"
                        >
                            Privacy Policy
                        </Link>

                        <Link
                            href="/terms"
                            className="transition-colors hover:text-brand-accent"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
