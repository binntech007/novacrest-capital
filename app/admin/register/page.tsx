
"use client";

import { useState } from "react";
import {
  ShieldAlert,
  KeyRound,
  UserRound,
  Mail,
  LockKeyhole,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";

export default function AdminRegisterPage() {
  const [form, setForm] = useState({
    secret: "",
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  function updateField(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const response = await fetch("/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Admin registration failed."
        );
      }

      setSuccess(true);
      setMessage(
        "Admin account created successfully. You can now sign in."
      );

      setForm({
        secret: "",
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    {
      name: "secret",
      label: "AUTHORIZATION KEY / SECRET PASSPHRASE",
      placeholder: "Enter admin registration secret",
      icon: KeyRound,
      type: "password",
      autoComplete: "off",
    },
    {
      name: "name",
      label: "LEGAL FULL NAME",
      placeholder: "Official Name",
      icon: UserRound,
      type: "text",
      autoComplete: "name",
    },
    {
      name: "email",
      label: "CORPORATE EMAIL ADDRESS",
      placeholder: "admin@novacrest.com",
      icon: Mail,
      type: "email",
      autoComplete: "email",
    },
    {
      name: "password",
      label: "ADMIN PASSWORD",
      placeholder: "At least 12 characters",
      icon: LockKeyhole,
      type: "password",
      autoComplete: "new-password",
    },
  ] as const;

  return (
    <main className="min-h-screen bg-[#0a0d14] px-4 py-10 text-white flex items-center justify-center">
      <section className="w-full max-w-140 rounded-2xl border border-slate-700/70 bg-[#151c28] px-6 py-9 shadow-2xl sm:px-10">
        <header className="mb-9 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-500/40 bg-violet-500/10 text-violet-400">
            <ShieldAlert size={36} />
          </div>

          <p className="mb-2 text-sm font-semibold tracking-wide">
            NOVACREST <span className="text-violet-400">CAPITAL</span>
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Compliance Admin Setup
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Internal Audit &amp; System Oversight Provisioning
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => {
            const Icon = field.icon;

            return (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-semibold text-slate-400"
                >
                  {field.label}
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-[#0b1018] px-4 transition focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/10">
                  <Icon
                    size={21}
                    className="shrink-0 text-slate-500"
                  />

                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={form[field.name]}
                    onChange={updateField}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    required
                    minLength={
                      field.name === "password" ? 12 : undefined
                    }
                    maxLength={field.name === "secret" ? 256 : 254}
                    className="h-15 min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>
            );
          })}

          <div className="rounded-2xl border border-slate-700 bg-[#101722] p-4">
            <div className="flex items-start gap-3">
              <LockKeyhole
                size={20}
                className="mt-0.5 shrink-0 text-violet-400"
              />

              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Restricted Internal Access
                </p>

                <p className="mt-1 text-sm leading-5 text-slate-400">
                  Administrator accounts have elevated permissions.
                  Only authorized personnel should create an account.
                </p>
              </div>
            </div>
          </div>

          {message && (
            <div
              role="status"
              aria-live="polite"
              className={`rounded-xl border p-3 text-sm ${
                success
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/30 bg-red-500/10 text-red-300"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-violet-600 px-5 font-bold text-white shadow-lg shadow-violet-950/40 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle className="animate-spin" size={20} />
                Creating Account...
              </>
            ) : (
              <>
                Provision Admin Account
                <ArrowRight size={21} />
              </>
            )}
          </button>
        </form>
      </section>
    </main>
  );
}
