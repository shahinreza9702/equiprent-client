
"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiRequest, ApiError } from "@/lib/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing password reset link.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8 || password.length > 72) {
      setError("Password must be between 8 and 72 characters.");
      return;
    }

    try {
      setIsLoading(true);

      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      setIsSuccess(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to reset your password. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-40 -top-40 size-96 rounded-full bg-brand-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 size-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-xl lg:grid-cols-2">
        {/* Branding Panel */}
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
              <ShieldCheck className="size-7 text-brand-accent" />
            </div>

            <h1 className="max-w-md text-4xl font-bold leading-tight">
              Secure Your Account.
            </h1>

            <p className="mt-5 max-w-md leading-8 text-white/70">
              Create a new password to protect your EquipRent account.
              Choose a password that you have not used before.
            </p>
          </div>

          <p className="relative text-sm text-white/50">
            © 2026 EquipRent. All rights reserved.
          </p>
        </div>

        {/* Reset Password Form */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Brand */}
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-2 lg:hidden"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
                E
              </span>

              <span className="text-xl font-bold text-primary">
                Equip<span className="text-brand-accent">Rent</span>
              </span>
            </Link>

            <Link
              href="/login"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-4" />
              Back to Sign In
            </Link>

            {isSuccess ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-green-500/10">
                  <CheckCircle2 className="size-8 text-green-600" />
                </div>

                <h1 className="mt-6 text-2xl font-bold tracking-tight text-primary">
                  Password Reset Successful!
                </h1>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  Your password has been updated successfully.
                  You can now sign in using your new password.
                </p>

                <Button
                  onClick={() => router.push("/login")}
                  className="mt-8 h-11 w-full rounded-xl bg-brand-accent font-semibold text-primary hover:bg-brand-accent/90"
                >
                  Continue to Sign In
                </Button>
              </div>
            ) : !token ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
                  <LockKeyhole className="size-8 text-destructive" />
                </div>

                <h1 className="mt-6 text-2xl font-bold tracking-tight text-primary">
                  Invalid Reset Link
                </h1>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  This password reset link is missing its token.
                  Please request a new password reset link.
                </p>

                <Button
                  onClick={() => router.push("/forgot-password")}
                  variant="outline"
                  className="mt-8 h-11 w-full rounded-xl"
                >
                  Request New Reset Link
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-accent">
                    Account Security
                  </p>

                  <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary">
                    Create a new password
                  </h1>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Enter your new password below. Make sure it is
                    at least 8 characters long.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  {error && (
                    <p
                      className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}

                  {/* New Password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-semibold text-primary"
                    >
                      New Password
                    </label>

                    <div className="flex h-12 items-center gap-3 rounded-xl border border-input px-4 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                      <LockKeyhole className="size-4 shrink-0 text-muted-foreground" />

                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        minLength={8}
                        maxLength={72}
                        required
                        className="h-full w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((previous) => !previous)}
                        className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
                        aria-label={showPassword ? "Hide password" : "Show password"}
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
                      Confirm New Password
                    </label>

                    <div className="flex h-12 items-center gap-3 rounded-xl border border-input px-4 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                      <LockKeyhole className="size-4 shrink-0 text-muted-foreground" />

                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        minLength={8}
                        maxLength={72}
                        required
                        className="h-full w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((previous) => !previous)
                        }
                        className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    disabled={isLoading}
                    type="submit"
                    className="h-12 w-full rounded-xl bg-brand-accent font-semibold text-primary hover:bg-brand-accent/90"
                  >
                    {isLoading ? "Updating Password..." : "Reset Password"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <section className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading password reset...
          </p>
        </section>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
