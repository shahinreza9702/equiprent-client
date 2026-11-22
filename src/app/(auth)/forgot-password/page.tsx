
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { apiRequest, ApiError } from "@/lib/api";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    try {
      setIsLoading(true);

      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      setIsSubmitted(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to process your request. Please try again.",
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
              Your Account Security Matters.
            </h1>

            <p className="mt-5 max-w-md leading-8 text-white/70">
              We will help you get back into your EquipRent account.
              Follow the password recovery process to regain access.
            </p>
          </div>

          <p className="relative text-sm text-white/50">
            © 2026 EquipRent. All rights reserved.
          </p>
        </div>

        {/* Recovery Form */}
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

            {isSubmitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-green-500/10">
                  <CheckCircle2 className="size-8 text-green-600" />
                </div>

                <h1 className="mt-6 text-2xl font-bold tracking-tight text-primary">
                  Check Your Email
                </h1>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  If an account exists for{" "}
                  <span className="font-semibold text-primary">{email}</span>,
                  password recovery instructions will be sent to that address.
                </p>

                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="mt-8 h-11 w-full rounded-xl"
                >
                  Try Another Email
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-accent">
                    Account Recovery
                  </p>

                  <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary">
                    Forgot your password?
                  </h1>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    No worries! Enter the email address associated with
                    your account and we will guide you through recovery.
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
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-primary"
                    >
                      Email Address
                    </label>

                    <div className="flex h-12 items-center gap-3 rounded-xl border border-input px-4 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                      <Mail className="size-4 shrink-0 text-muted-foreground" />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        className="h-full w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

                  <Button
                    disabled={isLoading}
                    type="submit"
                    className="h-12 w-full rounded-xl bg-brand-accent font-semibold text-primary hover:bg-brand-accent/90"
                  >
                    {isLoading ? "Sending Instructions..." : "Send Recovery Instructions"}
                  </Button>
                </form>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-primary transition-colors hover:text-brand-accent"
                  >
                    Sign In
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
