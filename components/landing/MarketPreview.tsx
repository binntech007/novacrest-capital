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
  TrendingUp,
} from "lucide-react";

const markets = [
  {
    name: "Cryptocurrency",
    symbol: "BTC / USD",
    value: "$67,500",
    change: "+2.45%",
    href: "/dashboard/live-market",
    icon: Bitcoin,

    // Emerald — primary Novacrest brand
    accent: {
      text: "text-emerald-300",
      textStrong: "text-emerald-400",
      bg: "bg-emerald-400/[0.07]",
      border: "border-emerald-400/15",
      hoverBorder: "group-hover:border-emerald-400/30",
      hoverBg: "group-hover:bg-emerald-400/[0.035]",
      glow: "group-hover:bg-emerald-400/10",
      dot: "bg-emerald-400",
      line: "via-emerald-400/60",
      chart: "text-emerald-400/60",
    },

    label: "Digital assets",
  },

  {
    name: "Stocks",
    symbol: "GLOBAL STOCKS",
    value: "8,420.18",
    change: "+1.18%",
    href: "/dashboard/stock-market",
    icon: LineChart,

    // Blue — financial/data accent
    accent: {
      text: "text-blue-300",
      textStrong: "text-blue-400",
      bg: "bg-blue-400/[0.07]",
      border: "border-blue-400/15",
      hoverBorder: "group-hover:border-blue-400/30",
      hoverBg: "group-hover:bg-blue-400/[0.035]",
      glow: "group-hover:bg-blue-400/10",
      dot: "bg-blue-400",
      line: "via-blue-400/60",
      chart: "text-blue-400/60",
    },

    label: "Global equities",
  },

  {
    name: "Shares",
    symbol: "EQUITIES",
    value: "4,218.64",
    change: "+0.84%",
    href: "/dashboard/shares",
    icon: BarChart3,

    // Violet — portfolio/analytics
    accent: {
      text: "text-violet-300",
      textStrong: "text-violet-400",
      bg: "bg-violet-400/[0.07]",
      border: "border-violet-400/15",
      hoverBorder: "group-hover:border-violet-400/30",
      hoverBg: "group-hover:bg-violet-400/[0.035]",
      glow: "group-hover:bg-violet-400/10",
      dot: "bg-violet-400",
      line: "via-violet-400/60",
      chart: "text-violet-400/60",
    },

    label: "Company shares",
  },

  {
    name: "Commodities",
    symbol: "GOLD / USD",
    value: "$2,350",
    change: "+0.42%",
    href: "/dashboard/commodities",
    icon: Coins,

    // Cyan — real-world/market asset accent
    accent: {
      text: "text-cyan-300",
      textStrong: "text-cyan-400",
      bg: "bg-cyan-400/[0.07]",
      border: "border-cyan-400/15",
      hoverBorder: "group-hover:border-cyan-400/30",
      hoverBg: "group-hover:bg-cyan-400/[0.035]",
      glow: "group-hover:bg-cyan-400/10",
      dot: "bg-cyan-400",
      line: "via-cyan-400/60",
      chart: "text-cyan-400/60",
    },

    label: "Real assets",
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
    y: 25,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
};

export function MarketPreview() {
  return (
    <section className="relative overflow-hidden pb-24 sm:pb-28">
      {/* =========================================================
          AMBIENT BACKGROUND
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Emerald glow */}
        <motion.div
          className="absolute left-[8%] top-20 h-72 w-72 rounded-full bg-emerald-400/[0.045] blur-[110px]"
          animate={{
            x: [0, 35, 0],
            y: [0, -20, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Cyan glow */}
        <motion.div
          className="absolute right-[10%] top-10 h-80 w-80 rounded-full bg-cyan-400/[0.035] blur-[120px]"
          animate={{
            x: [0, -30, 0],
            y: [0, 25, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Violet glow */}
        <motion.div
          className="absolute bottom-0 left-[42%] h-64 w-64 rounded-full bg-violet-400/[0.025] blur-[120px]"
          animate={{
            x: [0, 25, 0],
            y: [0, -25, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Subtle center gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(34,211,238,0.025),transparent_45%)]" />
      </div>

      {/* =========================================================
          CONTENT
      ========================================================== */}

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* =======================================================
            SECTION HEADING
        ======================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.65,
            ease: "easeOut",
          }}
          className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/10 bg-cyan-400/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-cyan-400"
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

              Market preview
            </div>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Keep every market in view.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-slate-500 sm:text-right">
            Explore the major market categories available through the
            Novacrest Capital experience.
          </p>
        </motion.div>

        {/* =======================================================
            MAIN MARKET PANEL
        ======================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 35,
            scale: 0.985,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.75,
            ease: "easeOut",
          }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#071019]/95 shadow-2xl shadow-black/30"
        >
          {/* Top gradient line */}

          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

          {/* =====================================================
              PANEL HEADER
          ====================================================== */}

          <div className="border-b border-white/10 px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Left */}

              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{
                    scale: 1.06,
                    rotate: -4,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-300"
                >
                  <TrendingUp className="h-5 w-5" />
                </motion.div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Market overview
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Multiple markets. One view.
                  </p>
                </div>
              </div>

              {/* Right status */}

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-1.5 text-xs text-slate-400">
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

                Market access
              </div>
            </div>
          </div>

          {/* =====================================================
              MARKET CARDS
          ====================================================== */}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            className="grid md:grid-cols-2 lg:grid-cols-4"
          >
            {markets.map((market, index) => {
              const Icon = market.icon;
              const accent = market.accent;

              return (
                <motion.div
                  key={market.name}
                  variants={cardVariants}
                  className={`relative ${
                    index !== markets.length - 1
                      ? "border-b border-white/10 lg:border-b-0 lg:border-r"
                      : ""
                  }`}
                >
                  <Link
                    href={market.href}
                    className={`group relative block overflow-hidden p-6 transition-colors duration-300 ${accent.hoverBg}`}
                  >
                    {/* Hover glow */}

                    <div
                      className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl opacity-0 transition-all duration-500 group-hover:opacity-100 ${accent.glow}`}
                    />

                    {/* Top accent line */}

                    <div
                      className={`pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${accent.line}`}
                    />

                    <div className="relative">
                      {/* Icon + Arrow */}

                      <div className="flex items-start justify-between">
                        <motion.div
                          whileHover={{
                            rotate: -4,
                            scale: 1.08,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                          }}
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${accent.border} ${accent.bg} ${accent.text}`}
                        >
                          <Icon className="h-5 w-5" />
                        </motion.div>

                        <ArrowUpRight
                          className={`h-4 w-4 text-slate-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${accent.text}`}
                        />
                      </div>

                      {/* Market name */}

                      <p className="mt-7 text-sm font-semibold text-white">
                        {market.name}
                      </p>

                      {/* Symbol */}

                      <div className="mt-1 flex items-center gap-2">
                        <p className="text-xs text-slate-500">
                          {market.symbol}
                        </p>

                        <span className="h-1 w-1 rounded-full bg-slate-700" />

                        <p className="text-xs text-slate-600">
                          {market.label}
                        </p>
                      </div>

                      {/* Value + chart */}

                      <div className="mt-6 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-2xl font-semibold tracking-tight text-white">
                            {market.value}
                          </p>

                          <div className="mt-2 flex items-center gap-1.5">
                            <motion.span
                              className={`h-1.5 w-1.5 rounded-full ${accent.dot}`}
                              animate={{
                                opacity: [1, 0.45, 1],
                                scale: [1, 0.8, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: index * 0.15,
                              }}
                            />

                            <span
                              className={`text-xs font-medium ${accent.textStrong}`}
                            >
                              {market.change}
                            </span>
                          </div>
                        </div>

                        {/* Mini chart */}

                        <motion.svg
                          viewBox="0 0 64 28"
                          className={`h-8 w-16 ${accent.chart}`}
                          aria-hidden="true"
                          initial={{
                            opacity: 0,
                            pathLength: 0,
                          }}
                          whileInView={{
                            opacity: 1,
                            pathLength: 1,
                          }}
                          viewport={{
                            once: true,
                          }}
                          transition={{
                            duration: 1,
                            delay: 0.25 + index * 0.1,
                          }}
                        >
                          <path
                            d={
                              index % 2 === 0
                                ? "M2 23 L12 19 L21 21 L31 12 L40 15 L49 7 L62 3"
                                : "M2 22 L12 16 L21 18 L31 14 L40 17 L50 8 L62 5"
                            }
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </motion.svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* =====================================================
              INFORMATION BAR
          ====================================================== */}

          <div className="flex flex-col gap-4 border-t border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-start gap-3">
              {/* Amber is intentionally reserved for notices */}

              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-400/70" />

              <p className="max-w-3xl text-xs leading-5 text-slate-500">
                Market figures shown here are illustrative placeholders.
                Connect an approved market-data provider before presenting
                prices as live.
              </p>
            </div>

            <Link
              href="#markets"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
            >
              View all markets

              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}