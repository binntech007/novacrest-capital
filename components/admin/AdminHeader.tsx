
"use client";

import { LogOut, ShieldCheck } from "lucide-react";
import { adminSignOut } from "@/app/admin/(protected)/actions";

type AdminHeaderProps = {
  name: string;
  email: string;
};

export default function AdminHeader({
  name,
  email,
}: AdminHeaderProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "A";

  return (
    <header className="flex w-full min-w-0 flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-[#101621] px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs text-slate-400 sm:text-sm">
          <ShieldCheck
            size={15}
            className="shrink-0 text-violet-400"
          />
          <span className="truncate">
            Novacrest Capital / Administration
          </span>
        </div>

        <h1 className="mt-1 truncate text-xl font-bold text-white sm:text-2xl">
          Dashboard Overview
        </h1>

        <p className="mt-1 hidden text-xs text-slate-500 sm:block">
          Manage customers, deposits, withdrawals, and transactions.
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="hidden min-w-0 max-w-48 text-right md:block">
          <p className="truncate text-sm font-semibold text-white">
            {name}
          </p>
          <p className="truncate text-xs text-slate-400">
            {email}
          </p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-violet-400">
            Administrator
          </p>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/15 font-bold text-violet-300 sm:h-11 sm:w-11"
          aria-label={`Administrator ${name}`}
          title={name}
        >
          {initial}
        </div>

        <form action={adminSignOut}>
          <button
            type="submit"
            aria-label="Sign out"
            title="Sign out"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/50 text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 sm:h-11 sm:w-11"
          >
            <LogOut size={19} />
          </button>
        </form>
      </div>

      <div className="w-full min-w-0 border-t border-slate-800 pt-3 md:hidden">
        <p className="truncate text-sm font-semibold text-slate-200">
          {name}
        </p>
        <p className="truncate text-xs text-slate-400">
          {email}
        </p>
      </div>
    </header>
  );
}
