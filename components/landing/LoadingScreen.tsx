"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#050912]"
    >
      {/* =====================================================
          BACKGROUND GLOWS
      ====================================================== */}

      <motion.div
        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.06] blur-[120px]"
        animate={{
          scale: [0.9, 1.1, 0.9],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute left-[20%] top-[20%] h-48 w-48 rounded-full bg-cyan-400/[0.035] blur-[100px]"
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* =====================================================
          SUBTLE GRID
      ====================================================== */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* =====================================================
          LOADER CONTENT
      ====================================================== */}

      <div className="relative flex flex-col items-center">
        {/* Logo image space */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
            y: 15,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="relative"
        >
          {/* Logo glow */}

          <motion.div
            className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-2xl"
            animate={{
              opacity: [0.35, 0.7, 0.35],
              scale: [0.9, 1.08, 0.9],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Logo container */}

          <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-emerald-400/20 bg-[#071019] shadow-[0_0_40px_rgba(52,211,153,0.1)]">
            <Image
              src="/novacrest-logo.png"
              alt="Novacrest Capital logo"
              width={80}
              height={80}
              priority
              className="h-full w-full object-contain p-2.5"
            />

            <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
          </div>
        </motion.div>

        {/* Brand name */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
          className="mt-6 text-center"
        >
          <h1 className="text-2xl font-bold tracking-[-0.03em] text-white">
            Novacrest
          </h1>

          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-emerald-300">
            Capital
          </p>
        </motion.div>

        {/* Loading indicator */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.35,
          }}
          className="mt-9"
        >
          <div className="h-1 w-40 overflow-hidden rounded-full bg-white/[0.07]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400"
              initial={{
                width: "0%",
              }}
              animate={{
                width: "100%",
              }}
              transition={{
                duration: 1.2,
                ease: "easeInOut",
              }}
            />
          </div>

          <p className="mt-3 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-slate-600">
            Loading platform
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}