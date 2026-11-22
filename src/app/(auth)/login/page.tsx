
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { apiRequest, ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const currentUser = await refreshUser();

      if (!currentUser) {
        throw new Error(
          "Login succeeded, but your session could not be verified. Please try again.",
        );
      }

      const dashboardRoutes = {
        customer: "/dashboard",
        owner: "/owner-dashboard",
        admin: "/admin-dashboard",
      } as const;

      router.replace(dashboardRoutes[currentUser.role]);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
              <ShieldCheck className="size-7 text-brand-accent" />
            </div>

            <h1 className="max-w-md text-4xl font-bold leading-tight">
              Everything You Need to Get the Job Done.
            </h1>

            <p className="mt-5 max-w-md leading-8 text-white/70">
              Discover quality equipment, connect with trusted owners,
              and make your next project easier with EquipRent.
            </p>
          </div>

          <p className="relative text-sm text-white/50">
            © 2026 EquipRent. All rights reserved.
          </p>
        </div>

        {/* Right: Login Form */}
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
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-4" />
              Back to Home
            </Link>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-accent">
                Welcome Back
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary">
                Sign in to your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Enter your credentials to access your EquipRent account.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              {/* Email */}
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
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-full w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-primary"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-primary transition-colors hover:text-brand-accent"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="flex h-12 items-center gap-3 rounded-xl border border-input px-4 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                  <LockKeyhole className="size-4 shrink-0 text-muted-foreground" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
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

              {/* Error Message */}
              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  {error}
                </p>
              )}

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="size-4 rounded border-input accent-primary"
                />

                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground"
                >
                  Remember me
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-xl bg-brand-accent font-semibold text-primary hover:bg-brand-accent/90"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Register Link */}
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary transition-colors hover:text-brand-accent"
              >
                Create an account
              </Link>
            </p>

            <p className="mt-8 text-center text-xs leading-5 text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
