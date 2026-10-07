import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="border-t border-white/10">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-400/15 bg-gradient-to-br from-emerald-400/[0.10] via-white/[0.025] to-cyan-400/[0.05] px-7 py-14 text-center sm:px-12 sm:py-16">
          {/* Background effects */}
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            {/* Badge */}
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3.5 py-2 text-xs font-medium text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Start your journey
            </div>

            {/* Heading */}
            <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Build a clearer way to explore the markets.
            </h2>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
              Create your Novacrest Capital account and bring your wallet,
              investments and market activity together in one experience.
            </p>

            {/* Benefits */}
            <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Multi-market access
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Wallet management
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Portfolio dashboard
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-semibold text-[#04110b] transition hover:bg-emerald-300"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.07]"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
