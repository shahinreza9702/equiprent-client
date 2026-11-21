
"use client";

import { useState, type FormEvent } from "react";
import {
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  MapPin,
  Save,
  Store,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type ProfileForm = {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  businessEmail: string;
  businessPhone: string;
  address: string;
  city: string;
  postalCode: string;
  description: string;
};

const initialProfile: ProfileForm = {
  fullName: "Shahin Reza",
  email: "owner@equiprent.com",
  phone: "+880 1700-000000",
  businessName: "EquipRent Equipment Rental",
  businessType: "Equipment Rental",
  businessEmail: "business@equiprent.com",
  businessPhone: "+880 1800-000000",
  address: "House 12, Road 5",
  city: "Dhaka",
  postalCode: "1207",
  description:
    "Providing reliable and quality equipment rental services for construction, photography, transportation, and more.",
};

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof UserRound;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
        <Icon className="size-5" />
      </div>

      <div>
        <h2 className="font-semibold text-primary">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-primary">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-primary outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </label>
  );
}

export default function OwnerProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const updateProfile = (field: keyof ProfileForm, value: string) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSuccessMessage("");
  };

  const handleProfileSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSuccessMessage(
      "Your profile changes have been saved successfully in this demo.",
    );

    setPasswordError("");
  };

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPasswordError("");
    setSuccessMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setSuccessMessage(
      "Password validation successful. Real password updates will be available after backend integration.",
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    setSuccessMessage("");
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Owner Workspace / Profile Settings
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Profile Settings
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Manage your personal details and business information.
        </p>
      </div>

      {/* Demo Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <UserRound className="mt-0.5 size-5 shrink-0 text-blue-600" />

        <div>
          <p className="text-sm font-semibold text-blue-900">
            Demo Profile Settings
          </p>

          <p className="mt-1 text-sm leading-relaxed text-blue-800">
            Your changes are stored only in the current page session.
            Profile updates and password changes are not connected
            to a backend yet.
          </p>
        </div>
      </div>

      {/* Profile Summary */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
            SR
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-primary">
              {profile.fullName}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {profile.businessName}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Equipment Owner
              </span>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Demo Account
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-muted/60 px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Account Type
            </p>

            <p className="mt-1 text-sm font-semibold text-primary">
              Business Owner
            </p>
          </div>
        </div>
      </section>

      {/* Success Message */}
      {successMessage && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
        >
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />

          <p className="text-sm font-medium leading-relaxed text-emerald-800">
            {successMessage}
          </p>
        </div>
      )}

      {/* Personal and Business Information */}
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        {/* Personal Information */}
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <SectionHeading
            icon={UserRound}
            title="Personal Information"
            description="Update your personal account details."
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <FormField
              label="Full Name"
              value={profile.fullName}
              onChange={(value) => updateProfile("fullName", value)}
              placeholder="Enter your full name"
              required
            />

            <FormField
              label="Email Address"
              value={profile.email}
              onChange={(value) => updateProfile("email", value)}
              placeholder="Enter your email"
              type="email"
              required
            />

            <FormField
              label="Phone Number"
              value={profile.phone}
              onChange={(value) => updateProfile("phone", value)}
              placeholder="Enter your phone number"
              required
            />
          </div>
        </section>

        {/* Business Information */}
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <SectionHeading
            icon={Building2}
            title="Business Information"
            description="Manage your equipment rental business details."
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <FormField
              label="Business Name"
              value={profile.businessName}
              onChange={(value) => updateProfile("businessName", value)}
              placeholder="Enter business name"
              required
            />

            <FormField
              label="Business Type"
              value={profile.businessType}
              onChange={(value) => updateProfile("businessType", value)}
              placeholder="Enter business type"
              required
            />

            <FormField
              label="Business Email"
              value={profile.businessEmail}
              onChange={(value) => updateProfile("businessEmail", value)}
              placeholder="Enter business email"
              type="email"
            />

            <FormField
              label="Business Phone"
              value={profile.businessPhone}
              onChange={(value) => updateProfile("businessPhone", value)}
              placeholder="Enter business phone"
            />

            <div className="sm:col-span-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-primary">
                  Business Description
                </span>

                <textarea
                  value={profile.description}
                  onChange={(event) =>
                    updateProfile("description", event.target.value)
                  }
                  rows={4}
                  placeholder="Describe your business..."
                  className="w-full resize-y rounded-lg border border-border bg-background px-3 py-3 text-sm text-primary outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
              </label>
            </div>
          </div>
        </section>

        {/* Address Information */}
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <SectionHeading
            icon={MapPin}
            title="Address Information"
            description="Set your business location and contact address."
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FormField
                label="Street Address"
                value={profile.address}
                onChange={(value) => updateProfile("address", value)}
                placeholder="Enter street address"
              />
            </div>

            <FormField
              label="City"
              value={profile.city}
              onChange={(value) => updateProfile("city", value)}
              placeholder="Enter city"
            />

            <FormField
              label="Postal Code"
              value={profile.postalCode}
              onChange={(value) => updateProfile("postalCode", value)}
              placeholder="Enter postal code"
            />
          </div>
        </section>

        {/* Profile Form Actions */}
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Reset Changes
          </Button>

          <Button
            type="submit"
            className="w-full gap-2 sm:w-auto"
          >
            <Save className="size-4" />
            Save Changes
          </Button>
        </div>
      </form>

      {/* Password Section */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <SectionHeading
          icon={LockKeyhole}
          title="Change Password"
          description="Update your account password to keep your account secure."
        />

        <form
          onSubmit={handlePasswordSubmit}
          className="mt-6 space-y-5"
        >
          {[
            {
              label: "Current Password",
              value: currentPassword,
              setter: setCurrentPassword,
              visible: showCurrentPassword,
              toggle: setShowCurrentPassword,
            },
            {
              label: "New Password",
              value: newPassword,
              setter: setNewPassword,
              visible: showNewPassword,
              toggle: setShowNewPassword,
            },
            {
              label: "Confirm New Password",
              value: confirmPassword,
              setter: setConfirmPassword,
              visible: showConfirmPassword,
              toggle: setShowConfirmPassword,
            },
          ].map((field) => (
            <label
              key={field.label}
              className="block max-w-xl space-y-2"
            >
              <span className="text-sm font-medium text-primary">
                {field.label}
              </span>

              <span className="relative block">
                <input
                  type={field.visible ? "text" : "password"}
                  value={field.value}
                  onChange={(event) => {
                    field.setter(event.target.value);
                    setPasswordError("");
                    setSuccessMessage("");
                  }}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  minLength={field.label === "Current Password" ? undefined : 8}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 pr-12 text-sm text-primary outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10"
                />

                <button
                  type="button"
                  onClick={() => field.toggle(!field.visible)}
                  aria-label={
                    field.visible ? "Hide password" : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-primary"
                >
                  {field.visible ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </span>
            </label>
          ))}

          {passwordError && (
            <p role="alert" className="text-sm font-medium text-red-600">
              {passwordError}
            </p>
          )}

          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setPasswordError("");
                setSuccessMessage("");
              }}
              className="w-full sm:w-auto"
            >
              Clear Fields
            </Button>

            <Button type="submit" className="w-full sm:w-auto">
              Update Password
            </Button>
          </div>
        </form>
      </section>

      {/* Account Information */}
      <section className="rounded-xl border border-border bg-muted/30 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Store className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

          <div>
            <h2 className="text-sm font-semibold text-primary">
              Account Information
            </h2>

            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Your account role is currently set to Equipment Owner.
              Account verification, business document uploads, and
              account management will be available after backend
              integration.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
