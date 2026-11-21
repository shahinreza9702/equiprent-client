
"use client";

import { useState } from "react";
import {
  ShieldCheck,
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  LockKeyhole,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type AdminProfile = {
  fullName: string;
  email: string;
  phone: string;
  designation: string;
};

const initialProfile: AdminProfile = {
  fullName: "Shahin Reza",
  email: "admin@equiprent.com",
  phone: "+880 1712-345678",
  designation: "Platform Administrator",
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(initialProfile);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);
  const [showNewPassword, setShowNewPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [hasChanges, setHasChanges] = useState(false);

  const updateProfile = (
    field: keyof AdminProfile,
    value: string
  ) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));

    setHasChanges(true);
    setProfileMessage("");
  };

  const handleProfileSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setProfileMessage(
      "Your profile changes have been saved successfully in this demo."
    );

    setHasChanges(false);
  };

  const handleReset = () => {
    setProfile(initialProfile);
    setHasChanges(false);
    setProfileMessage("");
  };

  const handlePasswordSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "New password must be at least 8 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "New password must be different from your current password."
      );
      return;
    }

    setPasswordMessage(
      "Password validation successful. Actual password updates will be available after backend integration."
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div>
        <p className="text-sm font-medium text-brand-accent">
          Account Management
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Admin Profile Settings
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Manage your administrator profile and account security settings.
        </p>
      </div>

      {/* Demo Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <AlertCircle className="mt-0.5 size-5 shrink-0 text-blue-600" />

        <div>
          <p className="text-sm font-semibold text-blue-900">
            Demo Preview
          </p>

          <p className="mt-1 text-sm leading-6 text-blue-800">
            Profile information and password actions are frontend
            demonstrations only. Changes are not saved to a database
            or authentication service.
          </p>
        </div>
      </div>

      {/* Profile Summary */}
      <section className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="h-28 bg-primary" />

        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-11 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl border-4 border-background bg-brand-accent text-3xl font-bold text-primary shadow-sm">
                {profile.fullName
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div className="pb-1">
                <h2 className="text-xl font-bold text-primary">
                  {profile.fullName}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {profile.designation}
                </p>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="size-4" />
              Administrator Account
            </div>
          </div>

          <div className="mt-6 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Mail className="size-4" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Email Address
                </p>

                <p className="mt-1 text-sm font-medium text-primary">
                  {profile.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Phone className="size-4" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Phone Number
                </p>

                <p className="mt-1 text-sm font-medium text-primary">
                  {profile.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Information */}
      <section className="rounded-xl border border-border bg-background p-5 sm:p-7">
        <div className="flex items-start gap-3 border-b border-border pb-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
            <UserRound className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-primary">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Update your administrator account details.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleProfileSubmit}
          className="mt-6 space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Full Name"
              value={profile.fullName}
              placeholder="Enter your full name"
              onChange={(value) =>
                updateProfile("fullName", value)
              }
              icon={<UserRound className="size-4" />}
            />

            <FormField
              label="Email Address"
              value={profile.email}
              placeholder="Enter your email"
              onChange={(value) =>
                updateProfile("email", value)
              }
              icon={<Mail className="size-4" />}
              type="email"
            />

            <FormField
              label="Phone Number"
              value={profile.phone}
              placeholder="Enter your phone number"
              onChange={(value) =>
                updateProfile("phone", value)
              }
              icon={<Phone className="size-4" />}
              type="tel"
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-primary">
                Designation
              </label>

              <div className="flex h-11 items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 text-sm text-muted-foreground">
                <ShieldCheck className="size-4" />
                {profile.designation}
              </div>

              <p className="mt-1.5 text-xs text-muted-foreground">
                Administrator designation is managed by the platform.
              </p>
            </div>
          </div>

          {profileMessage && (
            <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              {profileMessage}
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
            >
              <RotateCcw className="size-4" />
              Reset Changes
            </Button>

            <Button type="submit" disabled={!hasChanges}>
              <Save className="size-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </section>

      {/* Account Information */}
      <section className="rounded-xl border border-border bg-background p-5 sm:p-7">
        <div className="flex items-start gap-3 border-b border-border pb-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
            <ShieldCheck className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-primary">
              Account Information
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Overview of your administrator account.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <InfoItem
            icon={<ShieldCheck className="size-4" />}
            label="Account Role"
            value="Administrator"
          />

          <InfoItem
            icon={<CheckCircle2 className="size-4" />}
            label="Account Status"
            value="Active"
          />

          <InfoItem
            icon={<CalendarDays className="size-4" />}
            label="Member Since"
            value="November 2026"
          />

          <InfoItem
            icon={<KeyRound className="size-4" />}
            label="Access Level"
            value="Full Platform Access"
          />
        </div>
      </section>

      {/* Change Password */}
      <section className="rounded-xl border border-border bg-background p-5 sm:p-7">
        <div className="flex items-start gap-3 border-b border-border pb-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
            <LockKeyhole className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-primary">
              Change Password
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Update your account password using the form below.
            </p>
          </div>
        </div>

        <form
          onSubmit={handlePasswordSubmit}
          className="mt-6 max-w-2xl space-y-5"
        >
          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            showPassword={showCurrentPassword}
            onToggle={() =>
              setShowCurrentPassword((previous) => !previous)
            }
          />

          <PasswordField
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            showPassword={showNewPassword}
            onToggle={() =>
              setShowNewPassword((previous) => !previous)
            }
          />

          <PasswordField
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            showPassword={showConfirmPassword}
            onToggle={() =>
              setShowConfirmPassword((previous) => !previous)
            }
          />

          <p className="text-xs text-muted-foreground">
            Your new password must contain at least 8 characters.
          </p>

          {passwordError && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {passwordError}
            </div>
          )}

          {passwordMessage && (
            <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              {passwordMessage}
            </div>
          )}

          <div className="border-t border-border pt-5">
            <Button type="submit">
              <LockKeyhole className="size-4" />
              Update Password
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

function FormField({
  label,
  value,
  placeholder,
  onChange,
  icon,
  type = "text",
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-primary">
        {label}
      </label>

      <div className="flex h-11 items-center gap-2 rounded-lg border border-border px-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
        <span className="text-muted-foreground">{icon}</span>

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-primary outline-none placeholder:text-muted-foreground"
          required
        />
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  showPassword,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-primary">
        {label}
      </label>

      <div className="flex h-11 items-center gap-2 rounded-lg border border-border px-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
        <LockKeyhole className="size-4 text-muted-foreground" />

        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-primary outline-none placeholder:text-muted-foreground"
          autoComplete="off"
          required
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="text-muted-foreground transition hover:text-primary"
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </div>

      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-semibold text-primary">
          {value}
        </p>
      </div>
    </div>
  );
}
