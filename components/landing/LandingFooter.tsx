import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "Markets", href: "#markets" },
      { label: "Services", href: "#services" },
      { label: "How it works", href: "#how-it-works" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Create account", href: "/register" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] bg-[#03070e]">
      {/* Background glow */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-emerald-400/[0.025] blur-[120px]" />

        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-cyan-400/[0.02] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* =====================================================
            MAIN FOOTER
        ====================================================== */}

        <div className="grid gap-12 py-14 md:grid-cols-[1.6fr_1fr_1fr] lg:py-16">
          {/* ===================================================
              BRAND
          ==================================================== */}

          <div className="max-w-sm">
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
              aria-label="Novacrest Capital home"
            >
              {/* Logo image space */}

              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-emerald-400/20 bg-[#071019] shadow-[0_0_25px_rgba(52,211,153,0.06)] transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-400/35 group-hover:shadow-[0_0_30px_rgba(52,211,153,0.12)]">
                <Image
                  src="/novacrest-logo.png"
                  alt="Novacrest Capital logo"
                  width={48}
                  height={48}
                  className="h-full w-full object-contain p-1.5"
                />

                <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
              </div>

              {/* Brand name */}

              <div className="leading-none">
                <div className="text-lg font-bold tracking-[-0.025em] text-white transition-colors group-hover:text-emerald-50">
                  Novacrest
                </div>

                <div className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.32em] text-emerald-300">
                  Capital
                </div>
              </div>
            </Link>

            {/* Description */}

            <p className="mt-5 text-sm leading-6 text-slate-500">
              A modern platform experience for exploring cryptocurrency,
              stocks, shares and commodities.
            </p>

            {/* Small brand status */}

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.45)]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">
                Novacrest Capital
              </span>
            </div>
          </div>

          {/* ===================================================
              FOOTER LINKS
          ==================================================== */}

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-white">
                {group.title}
              </h3>

              <nav className="mt-5 flex flex-col items-start gap-3">
                {group.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-slate-500 transition-colors duration-200 hover:text-emerald-300"
                  >
                    {link.label}

                    <ArrowUpRight className="h-3 w-3 translate-y-0.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* =====================================================
            BOTTOM BAR
        ====================================================== */}

        <div className="flex flex-col gap-5 border-t border-white/[0.07] py-7 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Novacrest Capital. All rights
            reserved.
          </p>

          <p className="max-w-xl leading-5 sm:text-right">
            Market information shown on the landing page may be illustrative
            unless connected to an authorized market-data provider.
          </p>
        </div>
      </div>
    </footer>
  );
}