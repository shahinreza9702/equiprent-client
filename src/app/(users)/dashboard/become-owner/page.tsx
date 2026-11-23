
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Loader2,
  Send,
} from "lucide-react";

import Link from "next/link";
import { apiRequest, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";

type ApplicationStatus = "pending" | "approved" | "rejected";

interface OwnerApplication {
  _id: string;
  businessName: string;
  contactNumber: string;
  address: string;
  status: ApplicationStatus;
  createdAt: string;
  reviewedAt?: string;
}

interface ApplicationForm {
  businessName: string;
  contactNumber: string;
  address: string;
}

export default function BecomeOwnerPage() {
  const router = useRouter();

  const [application, setApplication] =
    useState<OwnerApplication | null>(null);

  const [form, setForm] = useState<ApplicationForm>({
    businessName: "",
    contactNumber: "",
    address: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadApplication = async () => {
      try {
        const response = await apiRequest<OwnerApplication | null>(
          "/owner-applications/me",
        );

        setApplication(response.data ?? null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your application.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadApplication();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await apiRequest<OwnerApplication>(
        "/owner-applications",
        {
          method: "POST",
          body: JSON.stringify(form),
        },
      );

      setApplication(response.data ?? null);
      setSuccess("Your owner application has been submitted successfully.");
      setForm({
        businessName: "",
        contactNumber: "",
        address: "",
      });
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to submit your application. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-7 animate-spin text-brand-accent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>

        <p className="text-sm font-medium text-brand-accent">
          OWNER PROGRAM
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Become an Equipment Owner
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Apply to list your equipment on EquipRent and manage your rental
          business through an Owner Dashboard.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive"
        >
          <AlertCircle className="size-5 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-sm text-green-700"
        >
          <CheckCircle2 className="size-5 shrink-0" />
          {success}
        </div>
      )}

      {application?.status === "pending" ? (
        <div className="rounded-2xl border border-amber-500/20 bg-background p-6 shadow-sm sm:p-8">
          <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
            <Clock3 className="size-6" />
          </div>

          <h3 className="mt-5 text-xl font-bold text-primary">
            Application Under Review
          </h3>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your application has been submitted and is waiting for Admin
            review. You will be able to access the Owner Dashboard after
            approval.
          </p>

          <div className="mt-6 space-y-3 rounded-xl bg-muted/40 p-4 text-sm">
            <p><strong>Business:</strong> {application.businessName}</p>
            <p><strong>Contact:</strong> {application.contactNumber}</p>
            <p><strong>Address:</strong> {application.address}</p>
            <p><strong>Status:</strong> Pending</p>
          </div>
        </div>
      ) : application?.status === "approved" ? (
        <div className="rounded-2xl border border-green-500/20 bg-background p-6 shadow-sm sm:p-8">
          <CheckCircle2 className="size-10 text-green-600" />
          <h3 className="mt-4 text-xl font-bold text-primary">
            Your Application Is Approved!
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account has been approved as an Equipment Owner.
          </p>
          <Button
            className="mt-6"
            onClick={() => router.push("/owner-dashboard")}
          >
            Go to Owner Dashboard
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-brand-accent/10 text-brand-accent">
              <BriefcaseBusiness className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-primary">
                Business Information
              </h3>
              <p className="text-sm text-muted-foreground">
                Provide your business details to apply.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="businessName" className="text-sm font-medium text-primary">
                Business Name
              </label>
              <input
                id="businessName"
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={150}
                placeholder="Enter your business name"
                className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="contactNumber" className="text-sm font-medium text-primary">
                Contact Number
              </label>
              <input
                id="contactNumber"
                name="contactNumber"
                type="tel"
                value={form.contactNumber}
                onChange={handleChange}
                required
                minLength={7}
                maxLength={20}
                placeholder="Enter your contact number"
                className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium text-primary">
                Business Address
              </label>
              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                minLength={5}
                maxLength={500}
                rows={4}
                placeholder="Enter your complete business address"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
              />
            </div>

            <div className="rounded-xl bg-muted/40 p-4 text-sm leading-6 text-muted-foreground">
              Your application will be reviewed by an Admin. Your account
              will remain a Customer account until it is approved.
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full gap-2 rounded-xl bg-brand-accent font-semibold text-primary hover:bg-brand-accent/90"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
