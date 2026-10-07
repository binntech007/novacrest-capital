"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  Wallet,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    label: "Multi-market access",
  },
  {
    icon: Wallet,
    label: "Portfolio dashboard",
  },
  {
    icon: ShieldCheck,
    label: "Wallet management",
  },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute left-[12%] top-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-[110px]"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute right-[8%] top-10 h-96 w-96 rounded-full bg-cyan-400/[0.07] blur-[120px]"
          animate={{
            x: [0, -25, 0],
            y: [0, 30, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.10),transparent_45%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-2 text-xs font-medium text-emerald-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              One platform. Multiple markets.
            </motion.div>

            {/* Heading */}
            <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-[5.2rem]">
              Explore the markets that{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                move the world.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              Novacrest Capital brings cryptocurrency, stocks, shares and
              commodities together in one modern investment experience built
              around clarity, control and informed decisions.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-7 py-3.5 text-sm font-semibold text-[#04110b] shadow-lg shadow-emerald-400/10 transition hover:-translate-y-0.5 hover:bg-emerald-300"
              >
                Create Account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="#markets"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07]"
              >
                Explore Markets
              </Link>
            </div>

            {/* Feature points */}
            <div className="mt-9 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.45 + index * 0.1,
                      duration: 0.5,
                    }}
                    className="flex items-center gap-2.5 text-sm text-slate-400"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-400/10 bg-emerald-400/[0.06] text-emerald-300">
                      <Icon className="h-4 w-4" />
                    </div>

                    <span>{feature.label}</span>

                    <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-400/70 xl:hidden" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, x: 45, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
            className="relative min-h-[420px] sm:min-h-[520px] lg:min-h-[620px]"
          >
            {/* Glow behind image */}
            <div className="absolute inset-8 rounded-[3rem] bg-emerald-400/10 blur-[90px]" />

            {/* Image frame */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/10 bg-[#071019] shadow-2xl shadow-black/50"
            >
              <Image
                src="/novacrest-hero.png"
                alt="Novacrest Capital multi-market trading dashboard"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-right"
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#050912]/30 via-transparent to-transparent" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/5" />
            </motion.div>

            {/* Floating market status */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-5 left-5 z-20 rounded-2xl border border-emerald-400/20 bg-[#071019]/90 px-4 py-3 shadow-xl shadow-black/30 backdrop-blur-xl sm:left-8"
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Platform
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-white">
                    Multi-market dashboard
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating market chip */}
            <motion.div
              animate={{ y: [0, 9, 0], rotate: [0, 1.5, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-2 top-12 z-20 hidden rounded-2xl border border-white/10 bg-[#071019]/90 px-4 py-3 shadow-xl shadow-black/30 backdrop-blur-xl sm:block lg:-right-4"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Markets
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-sm font-semibold text-white">
                  Crypto · Stocks · Shares · Commodities
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
