
"use client";

import { useState, type FormEvent } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [visible, setVisible] = useState<Record<PasswordField, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function toggleVisibility(field: PasswordField) {
    setVisible((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 12) {
      setErrorMessage(
        "Your new password must be at least 12 characters.",
      );
      return;
    }

    if (new TextEncoder().encode(newPassword).length > 72) {
      setErrorMessage(
        "Your new password must not exceed 72 UTF-8 bytes.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Your new passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage(
        "Choose a new password different from your current password.",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/customer/settings/password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to change your password.",
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccessMessage(
        result.message || "Password changed successfully.",
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function renderPasswordField({
    id,
    label,
    value,
    onChange,
    placeholder,
    field,
  }: {
    id: PasswordField;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    field: PasswordField;
  }) {
    return (
      <div>
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          {label}
        </label>

        <div className="relative">
          <LockKeyhole
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            id={id}
            name={id}
            type={visible[field] ? "text" : "password"}
            autoComplete={
              field === "currentPassword"
                ? "current-password"
                : "new-password"
            }
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            required
            maxLength={72}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          <button
            type="button"
            onClick={() => toggleVisibility(field)}
            aria-label={
              visible[field] ? "Hide password" : "Show password"
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-white"
          >
            {visible[field] ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={22}
            className="mt-0.5 shrink-0 text-emerald-400"
          />
          <div>
            <p className="font-medium text-slate-100">
              Keep your account secure
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Use a unique password of at least 12 characters.
              Avoid reusing a password from another account.
            </p>
          </div>
        </div>
      </div>

      {renderPasswordField({
        id: "currentPassword",
        field: "currentPassword",
        label: "Current password",
        value: currentPassword,
        onChange: setCurrentPassword,
        placeholder: "Enter your current password",
      })}

      {renderPasswordField({
        id: "newPassword",
        field: "newPassword",
        label: "New password",
        value: newPassword,
        onChange: setNewPassword,
        placeholder: "Enter your new password",
      })}

      {newPassword.length > 0 && (
        <p
          className={`-mt-3 text-xs ${
            newPassword.length >= 12 &&
            new TextEncoder().encode(newPassword).length <= 72
              ? "text-emerald-400"
              : "text-slate-400"
          }`}
        >
          {newPassword.length >= 12 &&
          new TextEncoder().encode(newPassword).length <= 72
            ? "Password length requirement met."
            : "Use at least 12 characters and no more than 72 UTF-8 bytes."}
        </p>
      )}

      {renderPasswordField({
        id: "confirmPassword",
        field: "confirmPassword",
        label: "Confirm new password",
        value: confirmPassword,
        onChange: setConfirmPassword,
        placeholder: "Enter your new password again",
      })}

      {confirmPassword.length > 0 && (
        <p
          className={`text-xs ${
            confirmPassword === newPassword
              ? "text-emerald-400"
              : "text-amber-400"
          }`}
        >
          {confirmPassword === newPassword
            ? "Passwords match."
            : "Passwords do not match yet."}
        </p>
      )}

      {successMessage && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300"
        >
          <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
        >
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="border-t border-slate-800 pt-5">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {loading ? (
            <>
              <LoaderCircle size={18} className="animate-spin" />
              Updating password...
            </>
          ) : (
            <>
              <LockKeyhole size={18} />
              Change password
            </>
          )}
        </button>
      </div>
    </form>
  );
}
