"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";

const services = [
  {
    title: "Investment Plans",
    description:
      "Choose an investment plan that matches your goals and manage it from your dashboard.",
    icon: TrendingUp,
    number: "01",
    tag: "Build & Grow",
  },
  {
    title: "Market Access",
    description:
      "Explore cryptocurrency, stocks, shares and commodities in one unified experience.",
    icon: BarChart3,
    number: "02",
    tag: "Explore Markets",
  },
  {
    title: "Portfolio Management",
    description:
      "Keep track of your balances, investments and market activity from one place.",
    icon: Wallet,
    number: "03",
    tag: "Stay Organized",
  },
  {
    title: "Automated Trading",
    description:
      "Manage your trading-bot experience and monitor activity from your account.",
    icon: Sparkles,
    number: "04",
    tag: "Automation",
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

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative overflow-hidden border-b border-white/10 bg-[#050b14]"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-emerald-400/[0.045] blur-[120px]"
          animate={{
            x: [0, 40, 0],
            y: [0, -25, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400/[0.035] blur-[120px]"
          animate={{
            x: [0, -25, 0],
            y: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-20">
          {/* Section introduction */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="lg:sticky lg:top-32"
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
                }}
              />
              Services
            </div>

            {/* Heading */}
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
              Everything you need,
              <br />
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                in one place.
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
              Build your investment experience around the tools you need to
              explore markets, manage your wallet and keep track of your
              portfolio.
            </p>

            {/* Feature list */}
            <div className="mt-8 space-y-3">
              {[
                "Unified portfolio experience",
                "Multiple market categories",
                "Centralized account management",
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.2 + index * 0.1,
                    duration: 0.45,
                  }}
                  className="flex items-center gap-3 text-sm text-slate-400"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  {feature}
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/register"
              className="group mt-9 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
            >
              Start with Novacrest
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Service cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <motion.div
                  key={service.title}
                  variants={cardVariants}
                  className="group"
                >
                  <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[#080f1b] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-emerald-400/25 hover:bg-[#0a1421] hover:shadow-2xl hover:shadow-emerald-950/20">
                    {/* Hover glow */}
                    <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/0 blur-3xl transition-all duration-700 group-hover:bg-emerald-400/10" />

                    {/* Top accent */}
                    <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/0 to-transparent transition-all duration-500 group-hover:via-emerald-400/60" />

                    <div className="relative">
                      {/* Card header */}
                      <div className="flex items-start justify-between">
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

                        <span className="text-xs font-semibold tracking-[0.15em] text-slate-700 transition-colors duration-300 group-hover:text-emerald-400/50">
                          {service.number}
                        </span>
                      </div>

                      {/* Tag */}
                      <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400/70">
                        {service.tag}
                      </p>

                      {/* Title */}
                      <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        {service.description}
                      </p>

                      {/* Bottom */}
                      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-5">
                        <span className="text-xs font-medium text-slate-500 transition-colors group-hover:text-slate-300">
                          Learn more
                        </span>

                        <motion.div
                          whileHover={{
                            x: 3,
                            y: -3,
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-white/[0.025]"
                        >
                          <ArrowUpRight className="h-4 w-4 text-slate-600 transition-colors group-hover:text-emerald-300" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}