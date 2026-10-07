"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import {
  ShieldCheck,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";

function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      // -------------------------------------------------------
      // SIGN IN WITH NEXTAUTH
      // -------------------------------------------------------

      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      // -------------------------------------------------------
      // LOGIN FAILED
      // -------------------------------------------------------

      if (!result || result.error) {
        setError(
          "Invalid email or password, or your account is inactive."
        );
        return;
      }

      // -------------------------------------------------------
      // GET CURRENT SESSION
      // -------------------------------------------------------

      const session = await getSession();

      if (!session?.user) {
        setError(
          "Unable to retrieve your session. Please try again."
        );
        return;
      }

      // -------------------------------------------------------
      // CHECK ACCOUNT STATUS
      // -------------------------------------------------------

      if (session.user.status !== "ACTIVE") {
        setError(
          "Your account is not active. Please contact support."
        );
        return;
      }

      // -------------------------------------------------------
      // SEND LOGIN NOTIFICATION EMAIL
      // -------------------------------------------------------
      //
      // The API gets the authenticated user's email from
      // auth(), so we do not send an email address from the
      // browser.
      //
      // If the email fails, we do NOT stop the login process.
      // The user has already authenticated successfully.
      // -------------------------------------------------------

      try {
        const emailResponse = await fetch(
          "/api/email/login-notification",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!emailResponse.ok) {
          console.error(
            "Login notification email could not be sent."
          );
        }
      } catch (emailError) {
        console.error(
          "LOGIN EMAIL REQUEST ERROR:",
          emailError
        );
      }

      // -------------------------------------------------------
      // REDIRECT BASED ON USER ROLE
      // -------------------------------------------------------

      if (session.user.role === "ADMIN") {
        router.replace("/admin");
      } else if (session.user.role === "CUSTOMER") {
        router.replace("/dashboard");
      } else {
        setError(
          "Your account does not have a recognized role."
        );
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "h-14 w-full rounded-xl border border-slate-700 bg-[#0b1018] px-4 text-white outline-none placeholder:text-slate-600 focus:border-violet-500";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090c13] px-4 py-10 text-white">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#151c28] p-7 shadow-2xl sm:p-9">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 text-violet-400">
            <ShieldCheck size={30} />
          </div>

          <p className="text-sm font-bold tracking-[0.2em] text-violet-400">
            NOVACREST CAPITAL
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Sign in to access your account.
          </p>
        </header>

        {/* =====================================================
            REGISTRATION SUCCESS MESSAGE
        ====================================================== */}

        {searchParams.get("registered") === "1" && (
          <p className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
            Your account has been created. You can now sign in.
          </p>
        )}

        {/* =====================================================
            LOGIN FORM
        ====================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* EMAIL */}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-slate-300"
            >
              Email address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-4.5 text-slate-500"
              />

              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                className={`${inputClass} pl-10`}
                placeholder="you@example.com"
                maxLength={254}
                required
              />
            </div>
          </div>

          {/* PASSWORD */}

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm text-slate-300"
            >
              Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-3 top-4.5 text-slate-500"
              />

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="current-password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                className={`${inputClass} px-10`}
                placeholder="Enter your password"
                maxLength={128}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute right-3 top-4.5 text-slate-400 transition hover:text-white"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 font-bold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircle
                  size={20}
                  className="animate-spin"
                />

                Signing in...
              </>
            ) : (
              <>
                Sign in

                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* =====================================================
            REGISTER LINK
        ====================================================== */}

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-violet-400 transition hover:text-violet-300"
          >
            Create one
          </Link>
        </p>

        {/* =====================================================
            ADMIN LOGIN
        ====================================================== */}

        <p className="mt-5 text-center text-xs text-slate-500">
          Administrator?{" "}
          <Link
            href="/admin/login"
            className="text-violet-400 transition hover:text-violet-300"
          >
            Admin login
          </Link>
        </p>
      </section>
    </main>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#090c13] text-white">
          Loading sign in...
        </main>
      }
    >
      <CustomerLoginForm />
    </Suspense>
  );
}