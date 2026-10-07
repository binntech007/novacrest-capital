"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  ShieldCheck,
  WalletCards,
  BarChart3,
  Eye,
  Activity,
} from "lucide-react";

const features = [
  {
    title: "Secure account access",
    description: "Protected access designed around your account.",
    icon: ShieldCheck,
    color: "emerald",
  },
  {
    title: "Organized wallet",
    description: "Keep your funds and account activity organized.",
    icon: WalletCards,
    color: "blue",
  },
  {
    title: "Portfolio overview",
    description: "Monitor investments and account performance.",
    icon: BarChart3,
    color: "violet",
  },
  {
    title: "Market visibility",
    description: "Keep your market activity within view.",
    icon: Eye,
    color: "cyan",
  },
];

const colorStyles = {
  emerald: {
    icon: "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300",
    glow: "bg-emerald-400/10",
    hover: "group-hover:border-emerald-400/25",
  },
  blue: {
    icon: "border-blue-400/20 bg-blue-400/[0.08] text-blue-300",
    glow: "bg-blue-400/10",
    hover: "group-hover:border-blue-400/25",
  },
  violet: {
    icon: "border-violet-400/20 bg-violet-400/[0.08] text-violet-300",
    glow: "bg-violet-400/10",
    hover: "group-hover:border-violet-400/25",
  },
  cyan: {
    icon: "border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300",
    glow: "bg-cyan-400/10",
    hover: "group-hover:border-cyan-400/25",
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
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
      duration: 0.65,
      ease: "easeOut" as const,
    },
  },
};

export function SecuritySection() {
  return (
    <section
      id="security"
      className="relative overflow-hidden border-y border-white/[0.06] bg-[#050a12]"
    >
      {/* =========================================================
          BACKGROUND EFFECTS
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Emerald glow */}
        <motion.div
          className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-emerald-400/[0.045] blur-[130px]"
          animate={{
            x: [0, 35, 0],
            y: [0, -25, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Cyan glow */}
        <motion.div
          className="absolute right-0 top-0 h-[30rem] w-[30rem] rounded-full bg-cyan-400/[0.035] blur-[140px]"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Violet glow */}
        <motion.div
          className="absolute bottom-0 left-[45%] h-80 w-80 rounded-full bg-violet-400/[0.025] blur-[130px]"
          animate={{
            x: [0, 25, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}

      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          {/* =====================================================
              LEFT CONTENT
          ====================================================== */}

          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.75,
              ease: "easeOut",
            }}
            className="relative z-10"
          >
            {/* Badge */}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.045] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400"
            >
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

              Security & Control
            </motion.div>

            {/* Heading */}

            <h2 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.4rem]">
              Your markets.
              <br />

              <span className="text-slate-300">
                Your dashboard.
              </span>

              <br />

              <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                Your control.
              </span>
            </h2>

            {/* Description */}

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              Keep your account, wallet, investments and market activity
              together in a single secure experience designed for clarity,
              visibility and control.
            </p>

            {/* =================================================
                FEATURES
            ================================================== */}

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15,
              }}
              className="mt-8 grid gap-3 sm:grid-cols-2"
            >
              {features.map((feature) => {
                const Icon = feature.icon;

                const style =
                  colorStyles[
                    feature.color as keyof typeof colorStyles
                  ];

                return (
                  <motion.div
                    key={feature.title}
                    variants={itemVariants}
                    className={`group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition-all duration-500 hover:-translate-y-1 ${style.hover}`}
                  >
                    {/* Glow */}

                    <div
                      className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-3xl transition-all duration-500 group-hover:opacity-100 ${style.glow}`}
                    />

                    <div className="relative flex items-start gap-3">
                      <motion.div
                        whileHover={{
                          scale: 1.08,
                          rotate: -4,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                        }}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${style.icon}`}
                      >
                        <Icon className="h-5 w-5" />
                      </motion.div>

                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          {feature.title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* =================================================
                CTA
            ================================================== */}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.35,
              }}
              className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-semibold text-[#04110b] shadow-[0_0_30px_rgba(52,211,153,0.12)] transition-all duration-300 hover:bg-emerald-300 hover:shadow-[0_0_40px_rgba(52,211,153,0.2)]"
              >
                Create Account

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="#security"
                className="group inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
              >
                Learn more about security

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Trust indicators */}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.5,
              }}
              className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/[0.06] pt-6"
            >
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Account protection
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <LockKeyhole className="h-4 w-4 text-cyan-400" />
                Secure access
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Activity className="h-4 w-4 text-blue-400" />
                Account monitoring
              </div>
            </motion.div>
          </motion.div>

          {/* =====================================================
              RIGHT IMAGE
          ====================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 40,
              scale: 0.96,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
            }}
            className="relative"
          >
            {/* Main image glow */}

            <motion.div
              className="absolute inset-8 rounded-[2rem] bg-cyan-400/[0.08] blur-[70px]"
              animate={{
                opacity: [0.4, 0.7, 0.4],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Image frame */}

            <motion.div
              whileHover={{
                y: -6,
              }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 20,
              }}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#071019] shadow-2xl shadow-black/50"
            >
              {/* Top line */}

              <div className="absolute inset-x-8 top-0 z-20 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

              <Image
                src="/Neon-Security.png"
                alt="Novacrest Capital security and portfolio dashboard"
                width={1600}
                height={900}
                priority={false}
                className="h-auto w-full object-cover transition-transform duration-1000 group-hover:scale-[1.025]"
              />

              {/* Image overlay */}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050a12]/40 via-transparent to-transparent" />

              {/* Bottom status */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: 0.8,
                  duration: 0.5,
                }}
                className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl border border-white/10 bg-[#071019]/85 px-4 py-3 backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  <motion.span
                    className="h-2 w-2 rounded-full bg-emerald-400"
                    animate={{
                      opacity: [1, 0.4, 1],
                      scale: [1, 0.85, 1],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                    }}
                  />

                  <div>
                    <p className="text-xs font-medium text-white">
                      Platform status
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Secure environment
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-emerald-400">
                  Protected
                </span>
              </motion.div>
            </motion.div>

            {/* =================================================
                FLOATING SECURITY CARD
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                x: 20,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.7,
                duration: 0.6,
              }}
              animate={{
                y: [0, -8, 0],
              }}
              className="absolute -right-3 top-8 hidden rounded-2xl border border-emerald-400/15 bg-[#071019]/90 p-4 shadow-2xl backdrop-blur-xl sm:block lg:-right-7"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.08] text-emerald-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Protected
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Security active
                  </p>
                </div>
              </div>
            </motion.div>

            {/* =================================================
                FLOATING MONITORING CARD
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                x: -20,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.9,
                duration: 0.6,
              }}
              animate={{
                y: [0, 7, 0],
              }}
              className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-blue-400/15 bg-[#071019]/90 p-4 shadow-2xl backdrop-blur-xl sm:block lg:-left-7"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-400/[0.08] text-blue-300">
                  <Activity className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Monitoring
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Account activity
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}