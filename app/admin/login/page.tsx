
"use client";

import { FormEvent, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password, or your account is inactive.");
        return;
      }

      const session = await getSession();

      if (
        session?.user?.role !== "ADMIN" ||
        session.user.status !== "ACTIVE"
      ) {
        setError("This login is for authorized administrators only.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090c13] px-4 py-10 text-white">
      <section className="w-full max-w-120 rounded-2xl border border-slate-700/70 bg-[#151c28] p-7 shadow-2xl sm:p-10">
        <header className="mb-9 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-500/40 bg-violet-500/10 text-violet-400">
            <ShieldCheck size={35} />
          </div>

          <p className="mb-3 text-sm font-bold tracking-[0.2em] text-violet-400">
            NOVACREST CAPITAL
          </p>

          <h1 className="text-3xl font-bold">
            Administrator Login
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Sign in to access the internal administration portal.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              ADMIN EMAIL ADDRESS
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#0b1018] px-4 focus-within:border-violet-500">
              <Mail size={20} className="shrink-0 text-slate-500" />

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="admin@yourcompany.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                maxLength={254}
                className="h-14 min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              PASSWORD
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-[#0b1018] px-4 focus-within:border-violet-500">
              <LockKeyhole
                size={20}
                className="shrink-0 text-slate-500"
              />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="h-14 min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-slate-600"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-slate-400 transition hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
            >
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="rounded-xl border border-slate-700 bg-[#101722] p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={20}
                className="shrink-0 text-violet-400"
              />
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Restricted administrator access
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Only active accounts assigned the administrator role
                  can access the administration dashboard.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-violet-600 font-bold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle size={20} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In Securely
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="mt-7 text-center text-xs text-slate-500">
          Novacrest Capital · Authorized personnel only
        </p>
      </section>
    </main>
  );
}
