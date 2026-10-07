"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Wallet,
  LayoutDashboard,
  ArrowLeftRight,
  ChartNoAxesColumnIncreasing,
  ShieldCheck,
  Settings,
  LogOut,
  CircleHelp,
  X,
  Bot,
  TrendingUp,
} from "lucide-react";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Wallet",
    href: "/dashboard/wallet",
    icon: Wallet,
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: ArrowLeftRight,
  },
  {
    label: "Investment Plans",
    href: "/dashboard/investments",
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    label: "KYC Verification",
    href: "/dashboard/kyc",
    icon: ShieldCheck,
  },
  {
    label: "Trading Bot",
    href: "/dashboard/trading-bot",
    icon: Bot,
  },
  {
    label: "Demo Trading",
    href: "/dashboard/demo-trading",
    icon: TrendingUp,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

type Props = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

export default function DashboardSidebar({
  mobileOpen = false,
  onClose,
}: Props) {
  const pathname = usePathname();

  async function handleSignOut() {
    try {
      await signOut({
        callbackUrl: "/login",
      });
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        id="customer-dashboard-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-72 flex-col border-r border-white/[0.08] bg-[#0b1120] px-5 py-6 transition-transform duration-300 lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:w-64 lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
        aria-label="Customer navigation"
      >
        {/* Logo */}
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
              <Wallet className="h-5 w-5 text-white" />
            </div>

            <div>
              <p className="text-lg font-bold text-white">
                Novacrest
              </p>

              <p className="text-xs tracking-[0.2em] text-slate-400">
                CAPITAL
              </p>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section title */}
        <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Customer portal
        </p>

        {/* Navigation */}
        <nav className="space-y-1.5 overflow-y-auto">
          {navigation.map(({ label, href, icon: Icon }) => {
            const active =
              href === "/dashboard"
                ? pathname === href
                : pathname === href ||
                  pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  active
                    ? "bg-violet-600/15 font-medium text-violet-300"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="mt-auto space-y-4 border-t border-white/[0.08] pt-5">
          {/* Help */}
          <Link
            href="/dashboard/help"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 hover:bg-white/[0.04] hover:text-white"
          >
            <CircleHelp className="h-[18px] w-[18px]" />
            Help center
          </Link>

          {/* Security card */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
            <ShieldCheck className="mb-3 h-5 w-5 text-emerald-400" />

            <p className="text-sm font-semibold text-white">
              Account security
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-400">
              Keep your password and verification codes private.
            </p>
          </div>

          {/* Sign out */}
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}