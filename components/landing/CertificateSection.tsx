"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    title: "Corporate identity",
    description: "Company information and corporate documentation.",
    icon: Building2,
    color: "emerald",
  },
  {
    title: "Corporate documentation",
    description: "Review the available company documentation.",
    icon: FileCheck2,
    color: "blue",
  },
  {
    title: "Transparency",
    description: "Access documentation before making important decisions.",
    icon: ShieldCheck,
    color: "cyan",
  },
];

const colorStyles = {
  emerald: {
    icon: "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300",
    border: "hover:border-emerald-400/25",
    glow: "bg-emerald-400/10",
  },
  blue: {
    icon: "border-blue-400/20 bg-blue-400/[0.08] text-blue-300",
    border: "hover:border-blue-400/25",
    glow: "bg-blue-400/10",
  },
  cyan: {
    icon: "border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300",
    border: "hover:border-cyan-400/25",
    glow: "bg-cyan-400/10",
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
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function CertificateSection() {
  return (
    <section
      id="certificate"
      className="relative overflow-hidden border-y border-white/[0.06] bg-[#050a12]"
    >
      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Emerald glow */}
        <motion.div
          className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-emerald-400/[0.035] blur-[130px]"
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

        {/* Cyan glow */}
        <motion.div
          className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-400/[0.035] blur-[140px]"
          animate={{
            x: [0, -25, 0],
            y: [0, 20, 0],
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
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* =========================================================
          CONTENT
      ========================================================== */}

      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* =====================================================
              LEFT CONTENT
          ====================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -35,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.75,
              ease: "easeOut",
            }}
          >
            {/* Badge */}

            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
              }}
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

              Corporate Information
            </motion.div>

            {/* Heading */}

            <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
              Built with a commitment to{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                transparency.
              </span>
            </h2>

            {/* Description */}

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
              Learn more about Novacrest Capital through our corporate
              documentation and company information.
            </p>

            {/* =================================================
                FEATURE LIST
            ================================================== */}

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{
                once: true,
                amount: 0.15,
              }}
              className="mt-8 space-y-3"
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
                    className={`group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition-all duration-500 hover:-translate-y-1 ${style.border}`}
                  >
                    {/* Hover glow */}

                    <div
                      className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-3xl transition-all duration-500 group-hover:opacity-100 ${style.glow}`}
                    />

                    <div className="relative flex items-center gap-4">
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
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${style.icon}`}
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
                VERIFIED DOCUMENTATION
            ================================================== */}

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
                duration: 0.6,
                delay: 0.35,
              }}
              className="mt-8 flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/15 bg-emerald-400/[0.06]">
                <BadgeCheck className="h-4 w-4 text-emerald-400" />
              </div>

              <div>
                <p className="text-xs font-semibold text-white">
                  Corporate documentation
                </p>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  Review the document displayed alongside this section.
                </p>
              </div>
            </motion.div>

            {/* Optional CTA */}

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
                duration: 0.6,
                delay: 0.45,
              }}
              className="mt-6"
            >
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
              >
                Get started with Novacrest
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* =====================================================
              VISIBLE CERTIFICATE
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
              duration: 0.85,
              ease: "easeOut",
            }}
            className="relative"
          >
            {/* Certificate glow */}

            <motion.div
              className="pointer-events-none absolute inset-8 rounded-[3rem] bg-emerald-400/[0.06] blur-[90px]"
              animate={{
                opacity: [0.4, 0.7, 0.4],
                scale: [0.96, 1.04, 0.96],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Certificate container */}

            <motion.div
              whileHover={{
                y: -5,
              }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 20,
              }}
              className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#080f18] p-3 shadow-2xl shadow-black/50"
            >
              {/* Top accent */}

              <div className="pointer-events-none absolute inset-x-12 top-0 z-10 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />

              {/* Actual certificate */}

              <div className="relative overflow-hidden rounded-xl bg-white">
                <Image
                  src="/inovacrest-certificate.png"
                  alt="Novacrest Capital corporate certificate"
                  width={1024}
                  height={1448}
                  priority
                  className="block h-auto w-full object-contain"
                />
              </div>

              {/* Bottom document information */}

              <div className="flex flex-col gap-3 px-3 pb-2 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Novacrest Capital
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Corporate documentation
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Documentation
                </div>
              </div>
            </motion.div>

            {/* Floating badge */}

            <motion.div
              animate={{
                y: [0, -7, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-3 top-8 hidden rounded-2xl border border-emerald-400/15 bg-[#071019]/95 p-3 shadow-2xl backdrop-blur-xl sm:block lg:-right-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.07]">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Corporate
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Documentation
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