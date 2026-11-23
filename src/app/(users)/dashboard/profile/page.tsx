
"use client";

import { useState, type FormEvent } from "react";
import {
  Camera,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiRequest, ApiError } from "@/lib/api";
import { useAuth, type AuthUser } from "@/providers/auth-provider";

export default function ProfileSettingsPage() {
  const { user, isLoading, refreshUser, updateUser } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <ProfileSettingsForm
      key={user?._id ?? "guest"}
      user={user}
      refreshUser={refreshUser}
      updateUser={updateUser}
    />
  );
}

interface ProfileSettingsFormProps {
  user: AuthUser | null;
  refreshUser: () => Promise<AuthUser | null>;
  updateUser: (updatedUser: AuthUser) => void;
}

function ProfileSettingsForm({
  user,
  refreshUser,
  updateUser,
}: ProfileSettingsFormProps) {
  const isAuthenticated = Boolean(user);

  const [fullName, setFullName] = useState(user?.name ?? "John Doe");
  const [email, setEmail] = useState(
    user?.email ?? "john.doe@example.com"
  );
  const [phone, setPhone] = useState(
    user?.phone ?? "+880 1XXX-XXXXXX"
  );

  const [location, setLocation] = useState("Dhaka, Bangladesh");
  const [bio, setBio] = useState(
    "Equipment rental enthusiast looking for reliable tools and equipment for my projects."
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSuccessMessage("");
    setProfileError("");
    setPasswordError("");

    if (!fullName.trim()) {
      setProfileError("Please enter your full name.");
      return;
    }

    if (!isAuthenticated) {
      setSuccessMessage("Profile changes saved in this demo.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await apiRequest<AuthUser>("/users/me", {
        method: "PATCH",
        body: JSON.stringify({
          name: fullName.trim(),
          phone: phone.trim(),
        }),
      });

      if (!response.data) {
        throw new Error("Updated profile was not returned.");
      }

      updateUser(response.data);

      setFullName(response.data.name);
      setEmail(response.data.email);
      setPhone(response.data.phone ?? "");

      setSuccessMessage("Your profile has been updated successfully.");
    } catch (error) {
      setProfileError(
        error instanceof ApiError
          ? error.message
          : "Unable to update your profile. Please try again."
      );

      // Refresh the profile if the session has expired.
      if (error instanceof ApiError && error.status === 401) {
        await refreshUser();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSuccessMessage("");
    setPasswordError("");

    if (isAuthenticated) {
      setPasswordError(
        "Password updates are not available yet. The backend endpoint needs to be implemented."
      );
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordError("");
    setSuccessMessage("Password validation passed in this demo.");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div>
        <p className="text-sm font-medium text-brand-accent">
          Customer Portal
        </p>

        <h2 className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Profile Settings
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Manage your personal information and account preferences.
        </p>
      </div>

      {/* Profile Overview */}
      <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative flex size-24 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserRound className="size-12" />

            <button
              type="button"
              disabled
              aria-label="Upload profile photo"
              title="Photo upload will be available later"
              className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border-2 border-background bg-brand-accent text-primary"
            >
              <Camera className="size-4" />
            </button>
          </div>

          <div>
            <h3 className="text-xl font-bold text-primary">
              {fullName || "Your Name"}
            </h3>

            <p className="mt-1 text-sm capitalize text-muted-foreground">
              {user?.role ?? "Customer"} Account
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Profile photo upload will be available after backend integration.
            </p>
          </div>
        </div>
      </section>

      {/* Personal Information */}
      <section className="rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserRound className="size-5" />
          </div>

          <div>
            <h3 className="font-bold text-primary">
              Personal Information
            </h3>
            <p className="text-sm text-muted-foreground">
              Update your basic account details.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-primary"
              >
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                minLength={2}
                maxLength={100}
                className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none transition focus:border-primary"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-primary"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  readOnly={isAuthenticated}
                  required
                  className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary read-only:cursor-not-allowed read-only:bg-muted"
                />
              </div>

              {isAuthenticated && (
                <p className="text-xs text-muted-foreground">
                  Email address cannot currently be changed.
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-primary"
              >
                Phone Number
              </label>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label
                htmlFor="location"
                className="text-sm font-medium text-primary"
              >
                Location
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="location"
                  type="text"
                  value={isAuthenticated ? "" : location}
                  onChange={(event) => setLocation(event.target.value)}
                  disabled={isAuthenticated}
                  placeholder={
                    isAuthenticated
                      ? "Location is not available yet"
                      : ""
                  }
                  className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-muted"
                />
              </div>
            </div>
          </div>

          {/* About Me */}
          <div className="space-y-2">
            <label
              htmlFor="bio"
              className="text-sm font-medium text-primary"
            >
              About Me
            </label>

            <textarea
              id="bio"
              value={isAuthenticated ? "" : bio}
              onChange={(event) => setBio(event.target.value)}
              disabled={isAuthenticated}
              rows={4}
              maxLength={300}
              placeholder={
                isAuthenticated
                  ? "About Me is not available yet"
                  : ""
              }
              className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-muted"
            />

            <p className="text-right text-xs text-muted-foreground">
              {isAuthenticated ? 0 : bio.length}/300 characters
            </p>
          </div>

          {isAuthenticated && (
            <p className="text-xs text-muted-foreground">
              Location and About Me will become editable after backend support is added.
            </p>
          )}

          {profileError && (
            <p role="alert" className="text-sm font-medium text-red-600">
              {profileError}
            </p>
          )}

          <div className="flex flex-col items-start gap-3 border-t border-border pt-5">
            <Button
              type="submit"
              disabled={isSaving}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="size-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </section>

      {/* Change Password */}
      <section className="rounded-2xl border border-border bg-background p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <LockKeyhole className="size-5" />
          </div>

          <div>
            <h3 className="font-bold text-primary">
              Change Password
            </h3>
            <p className="text-sm text-muted-foreground">
              Choose a strong password for your account.
            </p>
          </div>
        </div>

        {isAuthenticated && (
          <p className="mb-5 text-sm text-muted-foreground">
            Password updates are not supported by the backend yet.
          </p>
        )}

        <form onSubmit={handleChangePassword} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="currentPassword"
                className="text-sm font-medium text-primary"
              >
                Current Password
              </label>

              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
                required
                disabled={isAuthenticated}
                className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-muted"
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="text-sm font-medium text-primary"
              >
                New Password
              </label>

              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength={8}
                required
                disabled={isAuthenticated}
                className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-muted"
                placeholder="At least 8 characters"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-primary"
              >
                Confirm New Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                minLength={8}
                required
                disabled={isAuthenticated}
                className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-muted"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {passwordError && (
            <p role="alert" className="text-sm font-medium text-red-600">
              {passwordError}
            </p>
          )}

          <Button
            type="submit"
            variant="outline"
            disabled={isAuthenticated}
            className="gap-2"
          >
            <LockKeyhole className="size-4" />
            Update Password
          </Button>
        </form>
      </section>

      {/* Success Message */}
      {successMessage && (
        <p
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
        >
          {successMessage}
        </p>
      )}

      {/* Demo Notice */}
      {!isAuthenticated && (
        <p className="text-center text-xs text-muted-foreground">
          Demo profile settings. Changes are not saved to a server yet.
        </p>
      )}
    </div>
  );
}
