"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Wallet,
  UserPlus,
  BriefcaseBusiness,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Register for your Novacrest Capital account and complete the required account setup.",
    icon: UserPlus,
    accent: "emerald",
    label: "Get Started",
  },
  {
    number: "02",
    title: "Fund your wallet",
    description:
      "Add funds to your wallet and keep your account balance organized in one place.",
    icon: Wallet,
    accent: "blue",
    label: "Your Wallet",
  },
  {
    number: "03",
    title: "Explore the markets",
    description:
      "Browse cryptocurrency, stocks, shares and commodities through your dashboard.",
    icon: BarChart3,
    accent: "violet",
    label: "Explore Markets",
  },
  {
    number: "04",
    title: "Manage your portfolio",
    description:
      "Monitor your account, investments and market activity from your dashboard.",
    icon: BriefcaseBusiness,
    accent: "amber",
    label: "Stay In Control",
  },
];

const accentStyles = {
  emerald: {
    icon:
      "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300",
    number: "text-emerald-400",
    label: "text-emerald-400/70",
    line: "bg-emerald-400",
    glow: "bg-emerald-400/10",
    border: "group-hover:border-emerald-400/30",
  },
  blue: {
    icon:
      "border-blue-400/20 bg-blue-400/[0.08] text-blue-300",
    number: "text-blue-400",
    label: "text-blue-400/70",
    line: "bg-blue-400",
    glow: "bg-blue-400/10",
    border: "group-hover:border-blue-400/30",
  },
  violet: {
    icon:
      "border-violet-400/20 bg-violet-400/[0.08] text-violet-300",
    number: "text-violet-400",
    label: "text-violet-400/70",
    line: "bg-violet-400",
    glow: "bg-violet-400/10",
    border: "group-hover:border-violet-400/30",
  },
  amber: {
    icon:
      "border-amber-400/20 bg-amber-400/[0.08] text-amber-300",
    number: "text-amber-400",
    label: "text-amber-400/70",
    line: "bg-amber-400",
    glow: "bg-amber-400/10",
    border: "group-hover:border-amber-400/30",
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
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

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden border-y border-white/10 bg-[#060c15]"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-[10%] top-10 h-72 w-72 rounded-full bg-emerald-400/[0.04] blur-[120px]"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-0 right-[10%] h-80 w-80 rounded-full bg-violet-400/[0.035] blur-[130px]"
          animate={{
            x: [0, -30, 0],
            y: [0, 25, 0],
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
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="mx-auto max-w-3xl text-center"
        >
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
            How it works
          </div>

          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
            A simple path from{" "}
            <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
              account to portfolio.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400">
            Get started with a straightforward experience designed to keep
            your account, wallet and market activity organized.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="relative mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Desktop connecting line */}
          <div className="pointer-events-none absolute left-[12%] right-[12%] top-[47px] hidden h-px bg-gradient-to-r from-emerald-400/20 via-blue-400/20 via-violet-400/20 to-amber-400/20 lg:block" />

          {steps.map((step) => {
            const Icon = step.icon;
            const style =
              accentStyles[step.accent as keyof typeof accentStyles];

            return (
              <motion.div
                key={step.number}
                variants={cardVariants}
                className="group relative"
              >
                <div
                  className={`relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[#080f1b] p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${style.border}`}
                >
                  {/* Card glow */}
                  <div
                    className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-all duration-700 group-hover:opacity-100 ${style.glow}`}
                  />

                  <div className="relative">
                    {/* Number + icon */}
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
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${style.icon}`}
                      >
                        <Icon className="h-6 w-6" />
                      </motion.div>

                      <span
                        className={`text-3xl font-bold tracking-tight opacity-70 ${style.number}`}
                      >
                        {step.number}
                      </span>
                    </div>

                    {/* Label */}
                    <p
                      className={`mt-7 text-[10px] font-semibold uppercase tracking-[0.18em] ${style.label}`}
                    >
                      {step.label}
                    </p>

                    {/* Title */}
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {step.description}
                    </p>

                    {/* Bottom accent */}
                    <div className="mt-7 flex items-center justify-between border-t border-white/5 pt-5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2
                          className={`h-4 w-4 ${style.number}`}
                        />
                        <span className="text-xs text-slate-500">
                          Step {step.number}
                        </span>
                      </div>

                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        className="text-slate-700 transition-colors group-hover:text-slate-400"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}