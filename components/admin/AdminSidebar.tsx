"use client";

import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  ArrowDownToLine,
  Settings,
  LockKeyhole,
  FileCheck2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    label: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Customers",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "KYC Verification",
    href: "/admin/kyc",
    icon: FileCheck2,
  },
  {
    label: "Transactions",
    href: "/admin/transactions",
    icon: ArrowLeftRight,
  },
  {
    label: "Withdrawals",
    href: "/admin/withdrawals",
    icon: ArrowDownToLine,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        sticky
        top-0
        hidden
        h-screen
        max-h-screen
        w-64
        shrink-0
        flex-col
        overflow-y-auto
        border-r
        border-slate-800
        bg-[#101621]
        p-5
        lg:flex
      "
    >
      {/* ================================================================ */}
      {/* LOGO                                                             */}
      {/* ================================================================ */}

      <Link
        href="/admin"
        className="mb-10 flex shrink-0 items-center gap-3"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400">
          <ShieldCheck size={25} />
        </div>

        <div>
          <p className="font-bold text-white">
            Novacrest
          </p>

          <p className="text-xs tracking-widest text-violet-400">
            CAPITAL
          </p>
        </div>
      </Link>

      {/* ================================================================ */}
      {/* SECTION TITLE                                                     */}
      {/* ================================================================ */}

      <p className="mb-3 shrink-0 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Administration
      </p>

      {/* ================================================================ */}
      {/* NAVIGATION                                                        */}
      {/* ================================================================ */}

      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={
                active ? "page" : undefined
              }
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                active
                  ? "bg-violet-600/15 font-medium text-violet-300"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={19} />

              <span>{item.label}</span>

              {/* PENDING KYC INDICATOR */}
              {item.href === "/admin/kyc" && (
                <span className="ml-auto h-2 w-2 rounded-full bg-amber-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ================================================================ */}
      {/* SECURITY CARD                                                     */}
      {/* ================================================================ */}

      <div className="mt-auto shrink-0 rounded-xl border border-slate-800 bg-[#0b1018] p-4">
        <LockKeyhole
          size={20}
          className="mb-3 text-violet-400"
        />

        <p className="text-sm font-semibold text-slate-200">
          Secure admin session
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          Administrative access is verified against
          your database.
        </p>
      </div>
    </aside>
  );
}