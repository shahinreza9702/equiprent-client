
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiRequest, ApiError } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";

interface PaymentVerificationResponse {
  sessionId: string;
  checkoutStatus: string | null;
  stripePaymentStatus: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  bookingId: string | null;
}

type VerificationState =
  | "verifying"
  | "success"
  | "processing"
  | "refund"
  | "error";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { user, isLoading: isAuthLoading } = useAuth();

  const [status, setStatus] =
    useState<VerificationState>("verifying");

  const [payment, setPayment] =
    useState<PaymentVerificationResponse | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthLoading || !user || !sessionId) return;

    let cancelled = false;

    const verifyPayment = async () => {
      setStatus("verifying");
      setError("");

      try {
        // Allow time for the Stripe webhook to create the booking.
        for (let attempt = 0; attempt < 10; attempt++) {
          if (cancelled) return;

          const response =
            await apiRequest<PaymentVerificationResponse>(
              `/payments/checkout-session/${encodeURIComponent(sessionId)}`,
            );

          if (!response.data) {
            throw new Error(
              "Payment verification returned no data.",
            );
          }

          const result = response.data;

          if (cancelled) return;

          setPayment(result);

          if (
            result.paymentStatus === "refunded" ||
            result.fulfillmentStatus === "requires_refund"
          ) {
            setStatus("refund");
            return;
          }

          if (
            result.paymentStatus === "paid" &&
            result.bookingId
          ) {
            setStatus("success");
            return;
          }

          if (result.paymentStatus === "failed") {
            setError("The payment could not be completed.");
            setStatus("error");
            return;
          }

          // Retry only while the payment/booking is being processed.
          if (attempt < 9) {
            await new Promise((resolve) =>
              setTimeout(resolve, 2000),
            );
          }
        }

        if (!cancelled) {
          setStatus("processing");
        }
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Unable to verify your payment.",
        );

        setStatus("error");
      }
    };

    void verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [sessionId, user, isAuthLoading]);

  if (isAuthLoading) {
    return (
      <StatusMessage
        icon={<LoaderCircle className="size-12 animate-spin" />}
        title="Checking your account"
        description="Please wait while we verify your session."
      />
    );
  }

  if (!user) {
    return (
      <StatusMessage
        icon={<AlertCircle className="size-12" />}
        title="Sign in required"
        description="Please sign in with the account used for this payment to verify your booking."
        action={
          <Button render={<Link href="/login" />} nativeButton={false}>
            Sign In
          </Button>
        }
      />
    );
  }

  if (!sessionId) {
    return (
      <StatusMessage
        icon={<AlertCircle className="size-12" />}
        title="Invalid payment session"
        description="A Checkout Session ID was not found. We cannot verify this payment."
        action={
          <Button render={<Link href="/equipment" />} nativeButton={false}>
            Browse Equipment
          </Button>
        }
      />
    );
  }

  if (status === "verifying") {
    return (
      <StatusMessage
        icon={<LoaderCircle className="size-12 animate-spin" />}
        title="Verifying your payment"
        description="Please wait while we confirm your payment and booking. Do not close this page."
      />
    );
  }

  if (status === "success") {
    return (
      <StatusMessage
        icon={<CheckCircle2 className="size-14 text-green-600" />}
        title="Payment Successful!"
        description="Your payment has been verified and your booking has been created successfully."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button render={<Link href="/dashboard/bookings" />} nativeButton={false}>
              View My Bookings
            </Button>

            <Button
              variant="outline"
              render={<Link href="/equipment" />}
              nativeButton={false}
            >
              Browse Equipment
            </Button>
          </div>
        }
      >
        {payment?.bookingId && (
          <div className="mt-5 rounded-lg bg-muted p-4 text-sm">
            <p className="text-muted-foreground">
              Booking Reference
            </p>
            <p className="mt-1 break-all font-semibold text-primary">
              {payment.bookingId}
            </p>
          </div>
        )}
      </StatusMessage>
    );
  }

  if (status === "refund") {
    return (
      <StatusMessage
        icon={<AlertCircle className="size-14 text-amber-600" />}
        title="Booking Could Not Be Confirmed"
        description="Your payment requires a refund or has already been refunded because the equipment could not be reserved. Please contact support if you need assistance."
        action={
          <Button
            variant="outline"
            render={<Link href="/dashboard/bookings" />}
            nativeButton={false}
          >
            View My Bookings
          </Button>
        }
      />
    );
  }

  if (status === "processing") {
    return (
      <StatusMessage
        icon={<Clock3 className="size-14 text-amber-600" />}
        title="Booking Is Still Processing"
        description="We received your verification response, but booking confirmation is taking longer than expected. Please check My Bookings again shortly."
        action={
          <Button render={<Link href="/dashboard/bookings" />} nativeButton={false}>
            View My Bookings
          </Button>
        }
      />
    );
  }

  return (
    <StatusMessage
      icon={<AlertCircle className="size-14 text-destructive" />}
      title="Payment Verification Failed"
      description={error || "We could not verify your payment."}
      action={
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 size-4" />
            Try Again
          </Button>

          <Button
            variant="outline"
            render={<Link href="/dashboard/bookings" />}
            nativeButton={false}
          >
            My Bookings
          </Button>
        </div>
      }
    />
  );
}

function StatusMessage({
  icon,
  title,
  description,
  action,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="flex justify-center text-primary">
          {icon}
        </div>

        <h1 className="mt-6 text-2xl font-bold text-primary">
          {title}
        </h1>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {description}
        </p>

        {children}

        {action && (
          <div className="mt-7">
            {action}
          </div>
        )}
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <StatusMessage
          icon={<LoaderCircle className="size-12 animate-spin" />}
          title="Loading"
          description="Preparing payment verification..."
        />
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
