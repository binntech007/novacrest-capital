
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

type AdminLayoutClientProps = {
  children: React.ReactNode;
  name: string;
  email: string;
};

export default function AdminLayoutClient({
  children,
  name,
  email,
}: AdminLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090c13] text-white">
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <div className="hidden shrink-0 lg:block">
          <AdminSidebar />
        </div>

        {/* Mobile sidebar drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <div className="absolute inset-y-0 left-0 flex w-[min(85vw,320px)] flex-col border-r border-slate-800 bg-[#101621] shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 p-4">
                <span className="text-sm font-semibold text-slate-300">
                  Admin navigation
                </span>

                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                <AdminSidebar
                  mobile
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main dashboard */}
        <div className="min-w-0 flex-1">
          <div className="sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b border-slate-800 bg-[#090c13]/95 px-4 backdrop-blur-md lg:hidden">
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
            >
              <Menu size={22} />
            </button>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold">Novacrest Capital</p>
              <p className="text-xs text-slate-400">Admin dashboard</p>
            </div>
          </div>

          <AdminHeader name={name} email={email} />

          <main className="min-w-0 p-3 sm:p-5 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
