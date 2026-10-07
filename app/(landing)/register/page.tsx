
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";

export default function CustomerRegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/customer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Registration failed.");
        return;
      }

      router.push("/login?registered=1");
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "h-12 w-full rounded-xl border border-slate-700 bg-[#0b1018] px-4 text-white outline-none placeholder:text-slate-600 focus:border-violet-500";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090c13] px-4 py-10 text-white">
      <section className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#151c28] p-6 shadow-2xl sm:p-9">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 text-violet-400">
            <ShieldCheck size={30} />
          </div>

          <p className="text-sm font-bold tracking-[0.2em] text-violet-400">
            NOVACREST CAPITAL
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Register to access your customer account.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="mb-2 block text-sm text-slate-300">
                First name
              </label>
              <div className="relative">
                <UserRound size={18} className="absolute left-3 top-3.5 text-slate-500" />
                <input
                  id="firstName"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`${inputClass} pl-10`}
                  placeholder="First name"
                  minLength={2}
                  maxLength={60}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="mb-2 block text-sm text-slate-300">
                Last name
              </label>
              <input
                id="lastName"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
                placeholder="Last name"
                minLength={2}
                maxLength={60}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
              Email address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3.5 text-slate-500" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputClass} pl-10`}
                placeholder="you@example.com"
                maxLength={254}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-slate-300">
              Password
            </label>
            <div className="relative">
              <LockKeyhole size={18} className="absolute left-3 top-3.5 text-slate-500" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} px-10`}
                placeholder="At least 12 characters"
                minLength={12}
                maxLength={128}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-3.5 text-slate-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm text-slate-300">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              placeholder="Re-enter your password"
              minLength={12}
              maxLength={128}
              required
            />
          </div>

          {error && (
            <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-bold transition hover:bg-violet-500 disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle size={20} className="animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create account <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-violet-400 hover:text-violet-300">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
