
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState("customer");

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-40 -top-40 size-96 rounded-full bg-brand-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 size-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-xl lg:grid-cols-2">
        {/* Left: Branding Panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-white lg:flex">
          <div className="absolute -right-24 -top-24 size-72 rounded-full border-[40px] border-white/5" />
          <div className="absolute -bottom-32 -left-20 size-80 rounded-full bg-brand-accent/10 blur-2xl" />

          <Link href="/" className="relative flex items-center gap-2">
            <span className="flex size-11 items-center justify-center rounded-xl bg-brand-accent text-xl font-bold text-primary">
              E
            </span>

            <span className="text-2xl font-bold tracking-tight">
              Equip<span className="text-brand-accent">Rent</span>
            </span>
          </Link>

          <div className="relative my-12">
            <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-white/10">
              <UserRound className="size-7 text-brand-accent" />
            </div>

            <h1 className="max-w-md text-4xl font-bold leading-tight">
              Join EquipRent and Make Every Project Easier.
            </h1>

            <p className="mt-5 max-w-md leading-8 text-white/70">
              Create your account to discover equipment, connect with
              trusted owners, and manage your rental journey in one place.
            </p>
          </div>

          <p className="relative text-sm text-white/50">
            © 2026 EquipRent. All rights reserved.
          </p>
        </div>

        {/* Right: Registration Form */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Brand */}
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 lg:hidden"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
                E
              </span>

              <span className="text-xl font-bold text-primary">
                Equip<span className="text-brand-accent">Rent</span>
              </span>
            </Link>

            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-accent">
                Get Started
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Join EquipRent and get started today.
              </p>
            </div>

            <form
              className="mt-7 space-y-4"
              onSubmit={(event) => event.preventDefault()}
            >
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-primary"
                >
                  Full Name
                </label>

                <div className="flex h-11 items-center gap-3 rounded-xl border border-input px-4 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                  <UserRound className="size-4 shrink-0 text-muted-foreground" />

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    required
                    className="h-full w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-primary"
                >
                  Email Address
                </label>

                <div className="flex h-11 items-center gap-3 rounded-xl border border-input px-4 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                  <Mail className="size-4 shrink-0 text-muted-foreground" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    className="h-full w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-primary"
                >
                  Phone Number
                </label>

                <div className="flex h-11 items-center gap-3 rounded-xl border border-input px-4 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                  <Phone className="size-4 shrink-0 text-muted-foreground" />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+880 1XXXXXXXXX"
                    required
                    className="h-full w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Account Type */}
              <fieldset>
                <legend className="mb-2 text-sm font-semibold text-primary">
                  I want to join as
                </legend>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccountType("customer")}
                    aria-pressed={accountType === "customer"}
                    className={`rounded-xl border p-3 text-left transition-colors ${
                      accountType === "customer"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-input hover:border-primary/50"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-primary">
                      Customer
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      Rent equipment
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountType("owner")}
                    aria-pressed={accountType === "owner"}
                    className={`rounded-xl border p-3 text-left transition-colors ${
                      accountType === "owner"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-input hover:border-primary/50"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-primary">
                      Equipment Owner
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      List equipment
                    </span>
                  </button>
                </div>
              </fieldset>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-primary"
                >
                  Password
                </label>

                <div className="flex h-11 items-center gap-3 rounded-xl border border-input px-4 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                  <LockKeyhole className="size-4 shrink-0 text-muted-foreground" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    minLength={8}
                    required
                    className="h-full w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-primary"
                >
                  Confirm Password
                </label>

                <div className="flex h-11 items-center gap-3 rounded-xl border border-input px-4 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                  <LockKeyhole className="size-4 shrink-0 text-muted-foreground" />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    minLength={8}
                    required
                    className="h-full w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((previous) => !previous)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="mt-0.5 size-4 shrink-0 rounded border-input accent-primary"
                />

                <label
                  htmlFor="terms"
                  className="text-xs leading-5 text-muted-foreground"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-primary hover:text-brand-accent"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-semibold text-primary hover:text-brand-accent"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="h-12 w-full rounded-xl bg-brand-accent font-semibold text-primary hover:bg-brand-accent/90"
              >
                Create Account
              </Button>
            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary transition-colors hover:text-brand-accent"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
