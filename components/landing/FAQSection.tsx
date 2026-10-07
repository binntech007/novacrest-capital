"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  HelpCircle,
  MessageCircleQuestion,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const faqs = [
  {
    question: "What markets can I explore?",
    answer:
      "The Novacrest Capital experience is designed around cryptocurrency, stocks, shares and commodities.",
    category: "Markets",
    color: "emerald",
  },
  {
    question: "Do I need an account to use the dashboard?",
    answer:
      "Yes. Your dashboard, wallet, investments and account features are available after you create an account and sign in.",
    category: "Account",
    color: "blue",
  },
  {
    question: "Can I manage my investments from one place?",
    answer:
      "Yes. The dashboard is designed to bring your wallet, investments and market activity together in one place.",
    category: "Portfolio",
    color: "violet",
  },
  {
    question: "Are the market prices on this page live?",
    answer:
      "The figures in this landing-page preview are illustrative. Connect an authorized market-data provider before presenting prices as live market data.",
    category: "Market Data",
    color: "cyan",
  },
  {
    question: "Can I access my account from a phone?",
    answer:
      "Yes. The landing page and dashboard are designed with responsive layouts so they can adapt to desktop, tablet and mobile screens.",
    category: "Accessibility",
    color: "emerald",
  },
];

const colorStyles = {
  emerald: {
    badge:
      "border-emerald-400/15 bg-emerald-400/[0.05] text-emerald-300",
    icon:
      "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300",
    glow: "bg-emerald-400/10",
    openBorder: "group-open:border-emerald-400/25",
    openText: "group-open:text-emerald-300",
  },

  blue: {
    badge: "border-blue-400/15 bg-blue-400/[0.05] text-blue-300",
    icon: "border-blue-400/15 bg-blue-400/[0.06] text-blue-300",
    glow: "bg-blue-400/10",
    openBorder: "group-open:border-blue-400/25",
    openText: "group-open:text-blue-300",
  },

  violet: {
    badge:
      "border-violet-400/15 bg-violet-400/[0.05] text-violet-300",
    icon:
      "border-violet-400/15 bg-violet-400/[0.06] text-violet-300",
    glow: "bg-violet-400/10",
    openBorder: "group-open:border-violet-400/25",
    openText: "group-open:text-violet-300",
  },

  cyan: {
    badge: "border-cyan-400/15 bg-cyan-400/[0.05] text-cyan-300",
    icon: "border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-300",
    glow: "bg-cyan-400/10",
    openBorder: "group-open:border-cyan-400/25",
    openText: "group-open:text-cyan-300",
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
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

export function FAQSection() {
  return (
    <section
      id="faq"
      className="relative overflow-hidden border-t border-white/[0.06] bg-[#050a12]"
    >
      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Emerald */}

        <motion.div
          className="absolute left-[5%] top-24 h-80 w-80 rounded-full bg-emerald-400/[0.035] blur-[130px]"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Violet */}

        <motion.div
          className="absolute right-[5%] bottom-10 h-96 w-96 rounded-full bg-violet-400/[0.025] blur-[140px]"
          animate={{
            x: [0, -30, 0],
            y: [0, 25, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Subtle grid */}

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}

      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-28">
        {/* =======================================================
            HEADER
        ======================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Badge */}

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/[0.045] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
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

            Frequently asked questions
          </div>

          {/* Heading */}

          <h2 className="mt-6 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
              know.
            </span>
          </h2>

          {/* Description */}

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Find answers to common questions about the Novacrest Capital
            platform, your account and the markets available to explore.
          </p>
        </motion.div>

        {/* =======================================================
            FAQ CONTENT
        ======================================================== */}

        <div className="mx-auto mt-14 grid max-w-6xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          {/* =====================================================
              LEFT INFO PANEL
          ====================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="lg:sticky lg:top-28"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 sm:p-7">
              {/* Glow */}

              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-400/[0.07] blur-3xl" />

              <div className="relative">
                {/* Icon */}

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
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300"
                >
                  <MessageCircleQuestion className="h-6 w-6" />
                </motion.div>

                <h3 className="mt-6 text-xl font-semibold tracking-tight text-white">
                  Have more questions?
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Explore the platform and learn more about how your Novacrest
                  Capital experience is organized.
                </p>

                {/* Trust items */}

                <div className="mt-7 space-y-3 border-t border-white/[0.06] pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/10 bg-emerald-400/[0.05]">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    </div>

                    <span className="text-xs text-slate-400">
                      Secure account experience
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-400/10 bg-blue-400/[0.05]">
                      <Sparkles className="h-4 w-4 text-blue-400" />
                    </div>

                    <span className="text-xs text-slate-400">
                      Modern platform experience
                    </span>
                  </div>
                </div>

                {/* CTA */}

                <Link
                  href="/register"
                  className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
                >
                  Create your account

                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* =====================================================
              FAQ LIST
          ====================================================== */}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.1,
            }}
            className="space-y-3"
          >
            {faqs.map((faq, index) => {
              const style =
                colorStyles[
                  faq.color as keyof typeof colorStyles
                ];

              return (
                <motion.details
                  key={faq.question}
                  variants={itemVariants}
                  className={`group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] transition-all duration-500 hover:-translate-y-0.5 hover:bg-white/[0.04] ${style.openBorder}`}
                >
                  {/* Hover glow */}

                  <div
                    className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-all duration-700 group-hover:opacity-100 ${style.glow}`}
                  />

                  <summary className="relative flex cursor-pointer list-none items-center gap-4 px-5 py-5 sm:px-6 [&::-webkit-details-marker]:hidden">
                    {/* Number */}

                    <span className="hidden w-7 shrink-0 text-xs font-semibold text-slate-600 sm:block">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Icon */}

                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${style.icon}`}
                    >
                      <HelpCircle className="h-4 w-4" />
                    </span>

                    {/* Question */}

                    <span className="flex-1 text-left">
                      <span className="block text-sm font-semibold text-white sm:text-[15px]">
                        {faq.question}
                      </span>

                      <span
                        className={`mt-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600 transition-colors ${style.openText}`}
                      >
                        {faq.category}
                      </span>
                    </span>

                    {/* Plus */}

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-slate-500 transition-all duration-300 group-open:rotate-45 group-open:bg-white/[0.05]">
                      <span className="text-xl font-light leading-none">
                        +
                      </span>
                    </span>
                  </summary>

                  {/* Answer */}

                  <div className="relative px-5 pb-5 sm:px-6 sm:pb-6 sm:pl-[5.9rem]">
                    <div className="border-t border-white/[0.06] pt-4">
                      <p className="max-w-2xl text-sm leading-7 text-slate-400">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </motion.details>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}