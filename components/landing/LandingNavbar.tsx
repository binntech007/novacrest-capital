"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  {
    label: "Markets",
    href: "#markets",
  },
  {
    label: "Services",
    href: "#services",
  },
  {
    label: "How it works",
    href: "#how-it-works",
  },
  {
    label: "FAQ",
    href: "#faq",
  },
];

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 w-full">
      {/* =========================================================
          NAVBAR BACKGROUND
      ========================================================== */}

      <div className="border-b border-white/[0.07] bg-[#050912]/90 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* =====================================================
              BRAND
          ====================================================== */}

          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="group flex shrink-0 items-center gap-3"
            aria-label="Novacrest Capital home"
          >
            {/* Logo image space */}

            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-emerald-400/20 bg-[#071019] shadow-[0_0_25px_rgba(52,211,153,0.08)] transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-400/40 group-hover:shadow-[0_0_30px_rgba(52,211,153,0.16)]">
              {/* 
                Add your logo here:

                public/images/novacrest-logo.png
              */}

              <Image
                src="/novacrest-logo.png"
                alt="Novacrest Capital logo"
                width={44}
                height={44}
                priority
                className="h-full w-full object-contain p-1.5"
              />

              {/* Subtle border */}

              <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
            </div>

            {/* Brand text */}

            <div className="leading-none">
              <div className="text-[17px] font-bold tracking-[-0.025em] text-white transition-colors group-hover:text-emerald-50">
                Novacrest
              </div>

              <div className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.32em] text-emerald-300">
                Capital
              </div>
            </div>
          </Link>

          {/* =====================================================
              DESKTOP NAVIGATION
          ====================================================== */}

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.025] p-1 md:flex"
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative rounded-full px-4 py-2.5 text-[13px] font-medium text-slate-400 transition-all duration-300 hover:bg-white/[0.055] hover:text-white"
              >
                {item.label}

                {/* Hover indicator */}

                <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-emerald-400 transition-all duration-300 group-hover:w-4" />
              </a>
            ))}
          </nav>

          {/* =====================================================
              DESKTOP ACTIONS
          ====================================================== */}

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-slate-300 transition-all duration-300 hover:bg-white/[0.05] hover:text-white"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-emerald-400 px-5 py-2.5 text-[13px] font-semibold text-[#04110b] shadow-[0_0_25px_rgba(52,211,153,0.1)] transition-all duration-300 hover:bg-emerald-300 hover:shadow-[0_0_35px_rgba(52,211,153,0.2)]"
            >
              {/* Button shine */}

              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              <span className="relative">
                Get Started
              </span>

              <ArrowRight className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* =====================================================
              MOBILE MENU BUTTON
          ====================================================== */}

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-200 transition-all duration-300 hover:border-emerald-400/20 hover:bg-white/[0.07] hover:text-white md:hidden"
            aria-label={
              mobileOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* =========================================================
          MOBILE MENU
      ========================================================== */}

      <div
        className={`absolute left-0 right-0 top-[76px] px-5 transition-all duration-300 md:hidden ${
          mobileOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#071019]/95 shadow-2xl shadow-black/50 backdrop-blur-2xl">
            {/* Mobile header */}

            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-emerald-400/15 bg-[#080f18]">
                  <Image
                    src="/novacrest-logo.png"
                    alt="Novacrest Capital"
                    width={36}
                    height={36}
                    className="h-full w-full object-contain p-1"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Novacrest Capital
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Explore the platform
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-emerald-400">
                  Online
                </span>
              </div>
            </div>

            {/* Navigation */}

            <nav className="p-2">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="group flex items-center justify-between rounded-xl px-3 py-3.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/[0.05] hover:text-white"
                >
                  <span>{item.label}</span>

                  <ChevronRight className="h-4 w-4 text-slate-600 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-emerald-400" />
                </a>
              ))}
            </nav>

            {/* Mobile actions */}

            <div className="grid grid-cols-2 gap-2 border-t border-white/[0.07] p-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition-all duration-200 hover:bg-white/[0.05] hover:text-white"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="group flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-[#04110b] transition-all duration-200 hover:bg-emerald-300"
              >
                Get Started

                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile backdrop */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 top-[76px] -z-10 bg-black/30 backdrop-blur-[2px] md:hidden"
        />
      )}
    </header>
  );
}