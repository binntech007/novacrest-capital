"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bitcoin,
  Coins,
  LineChart,
  Sparkles,
} from "lucide-react";

const markets = [
  {
    name: "Cryptocurrency",
    description:
      "Explore digital assets and cryptocurrency markets from one secure dashboard.",
    href: "/dashboard/live-market",
    icon: Bitcoin,
    tag: "Digital Assets",
  },
  {
    name: "Stocks",
    description:
      "Follow major stock markets and discover opportunities across global equities.",
    href: "/dashboard/stock-market",
    icon: LineChart,
    tag: "Global Equities",
  },
  {
    name: "Shares",
    description:
      "Track individual shares and build a portfolio around the companies you follow.",
    href: "/dashboard/shares",
    icon: BarChart3,
    tag: "Company Shares",
  },
  {
    name: "Commodities",
    description:
      "Explore commodity-focused market information including metals and energy.",
    href: "/dashboard/commodities",
    icon: Coins,
    tag: "Real Assets",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut" as const,
    },
  },
};

export function MarketsSection() {
  return (
    <section
      id="markets"
      className="relative overflow-hidden border-y border-white/10 bg-[#050b14]"
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-emerald-400/[0.045] blur-[120px]"
          animate={{
            x: [0, 35, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-cyan-400/[0.035] blur-[130px]"
          animate={{
            x: [0, -30, 0],
            y: [0, 25, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.07),transparent_38%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-28">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="max-w-3xl"
        >
          {/* Label */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
              animate={{
                opacity: [1, 0.35, 1],
                scale: [1, 0.8, 1],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            Markets
          </div>

          {/* Heading */}
          <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
            Four market categories.
            <br />
            <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
              One account.
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Explore cryptocurrency, stocks, shares and commodities through one
            modern platform designed to keep your market experience simple and
            organized.
          </p>
        </motion.div>

        {/* Market cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
          {markets.map((market) => {
            const Icon = market.icon;

            return (
              <motion.div
                key={market.name}
                variants={cardVariants}
              >
                <Link
                  href={market.href}
                  className="group relative block h-full overflow-hidden rounded-3xl border border-white/10 bg-[#080f1b] p-6 transition-colors duration-500 hover:border-emerald-400/25 hover:bg-[#0a1421]"
                >
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/0 blur-3xl transition-all duration-700 group-hover:bg-emerald-400/10" />

                  {/* Top line */}
                  <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/0 to-transparent transition-all duration-500 group-hover:via-emerald-400/60" />

                  <div className="relative">
                    {/* Icon row */}
                    <div className="flex items-center justify-between">
                      <motion.div
                        whileHover={{
                          scale: 1.08,
                          rotate: -5,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                        }}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.07] text-emerald-300"
                      >
                        <Icon className="h-5 w-5" />
                      </motion.div>

                      <motion.div
                        whileHover={{
                          scale: 1.15,
                          x: 2,
                          y: -2,
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/[0.025]"
                      >
                        <ArrowUpRight className="h-4 w-4 text-slate-600 transition-colors group-hover:text-emerald-300" />
                      </motion.div>
                    </div>

                    {/* Tag */}
                    <div className="mt-7">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400/70">
                        {market.tag}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
                      {market.name}
                    </h3>

                    {/* Description */}
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {market.description}
                    </p>

                    {/* Bottom link */}
                    <div className="mt-7 flex items-center justify-between border-t border-white/5 pt-5">
                      <span className="flex items-center gap-2 text-sm font-medium text-emerald-300">
                        Explore market
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>

                      <Sparkles className="h-4 w-4 text-slate-700 transition-colors duration-300 group-hover:text-emerald-400/60" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom message */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.2,
          }}
          className="mt-8 flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.02] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]" />

            <p className="text-xs leading-5 text-slate-500">
              Explore each market through your Novacrest Capital account.
            </p>
          </div>

          <Link
            href="/register"
            className="group inline-flex items-center gap-2 text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
          >
            Get started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}