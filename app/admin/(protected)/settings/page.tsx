import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeftRight,
  Bell,
  ChevronRight,
  CircleHelp,
  CreditCard,
  FileCheck2,
  KeyRound,
  LockKeyhole,
  LogOut,
  Mail,
  Settings2,
  ShieldCheck,
  UserRound,
  Wallet,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await auth();

  /*
   * --------------------------------------------------
   * AUTHENTICATION
   * --------------------------------------------------
   */

  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  /*
   * --------------------------------------------------
   * ACCOUNT STATUS
   * --------------------------------------------------
   */

  if (session.user.status !== "ACTIVE") {
    redirect(
      "/admin/login?error=account-unavailable"
    );
  }

  /*
   * --------------------------------------------------
   * ADMIN ONLY
   * --------------------------------------------------
   */

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const name =
    session.user.name?.trim() || "Administrator";

  const email =
    session.user.email || "No email available";

  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "A";

  return (
    <main className="min-h-screen bg-[#080d19] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* ============================================================
            HEADER
        ============================================================ */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
              <Settings2 className="h-6 w-6 text-violet-400" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-400">
                Administration
              </p>

              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                Settings
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Manage your administrator account, security,
            payment configuration, and other system settings.
          </p>
        </div>

        {/* ============================================================
            ADMIN PROFILE
        ============================================================ */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#101621]">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <UserRound className="h-5 w-5 text-slate-400" />

              <div>
                <h2 className="font-semibold text-white">
                  Administrator profile
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Your administrator account information.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">
                {/* Initials */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-lg font-bold text-violet-300">
                  {initials}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-white">
                    {name}
                  </h3>

                  <p className="mt-1 truncate text-sm text-slate-400">
                    {email}
                  </p>

                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                    <ShieldCheck className="h-3 w-3" />
                    Administrator
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-600">
                  Account status
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  <span className="text-sm font-medium text-emerald-300">
                    Active
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================
            SETTINGS GRID
        ============================================================ */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* ==========================================================
              SECURITY
          ========================================================== */}

          <SettingsSection
            title="Security"
            description="Manage administrator account security."
            icon={LockKeyhole}
          >
            <SettingsLink
              href="/admin/settings/password"
              icon={KeyRound}
              title="Change password"
              description="Update your administrator password."
            />

            <SettingsLink
              href="/admin/settings/security"
              icon={ShieldCheck}
              title="Security settings"
              description="Review account protection and security options."
            />

            <SettingsLink
              href="/admin/settings/sessions"
              icon={LockKeyhole}
              title="Active sessions"
              description="Review active administrator sessions."
            />
          </SettingsSection>

          {/* ==========================================================
              PAYMENT SETTINGS
          ========================================================== */}

          <SettingsSection
            title="Payment settings"
            description="Manage payment methods displayed to customers."
            icon={CreditCard}
          >
            <SettingsLink
              href="/admin/payment-settings"
              icon={Wallet}
              title="Payment methods"
              description="Manage bank and cryptocurrency payment settings."
            />

            <SettingsLink
              href="/admin/payment-settings"
              icon={CreditCard}
              title="Bank payment details"
              description="Manage the bank account customers see for deposits."
            />

            <SettingsLink
              href="/admin/payment-settings"
              icon={Wallet}
              title="Crypto deposit addresses"
              description="Add, edit, enable, or disable crypto addresses."
            />
          </SettingsSection>

          {/* ==========================================================
              CUSTOMER MANAGEMENT
          ========================================================== */}

          <SettingsSection
            title="Customer management"
            description="Quick access to important customer operations."
            icon={UserRound}
          >
            <SettingsLink
              href="/admin/users"
              icon={UserRound}
              title="Customers"
              description="View and manage customer accounts."
            />

            <SettingsLink
              href="/admin/kyc"
              icon={FileCheck2}
              title="KYC verification"
              description="Review customer identity verification requests."
            />

            <SettingsLink
              href="/admin/transactions"
              icon={ArrowLeftRight}
              title="Transactions"
              description="Monitor customer account activity."
            />
          </SettingsSection>

          {/* ==========================================================
              OPERATIONS
          ========================================================== */}

          <SettingsSection
            title="Operations"
            description="Manage day-to-day administration."
            icon={Settings2}
          >
            <SettingsLink
              href="/admin/withdrawals"
              icon={Wallet}
              title="Withdrawals"
              description="Review and manage withdrawal requests."
            />

            <SettingsLink
              href="/admin/transactions"
              icon={ArrowLeftRight}
              title="Transaction history"
              description="View system-wide transaction activity."
            />

            <SettingsLink
              href="/admin"
              icon={Settings2}
              title="Admin overview"
              description="Return to the administrator dashboard."
            />
          </SettingsSection>

        </div>

        {/* ============================================================
            ACCOUNT NOTIFICATIONS
        ============================================================ */}

        <section className="mt-6 rounded-2xl border border-white/10 bg-[#101621]">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-slate-400" />

              <div>
                <h2 className="font-semibold text-white">
                  Notifications
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Notification and communication settings.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-white/5">

            <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-slate-500" />

                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">
                    Administrator email
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {email}
                  </p>
                </div>
              </div>

              <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <Bell className="h-4 w-4 shrink-0 text-slate-500" />

                <div>
                  <p className="text-sm font-medium text-white">
                    Security notifications
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Login and account security notifications.
                  </p>
                </div>
              </div>

              <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                Enabled
              </span>
            </div>

          </div>
        </section>

        {/* ============================================================
            HELP
        ============================================================ */}

        <section className="mt-6 rounded-2xl border border-white/10 bg-[#101621]">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <CircleHelp className="h-5 w-5 text-blue-400" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Need help?
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Review the admin dashboard and account settings.
                </p>
              </div>
            </div>

            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              Back to dashboard
              <ChevronRight className="h-4 w-4" />
            </Link>

          </div>
        </section>

        {/* ============================================================
            SECURITY NOTICE
        ============================================================ */}

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] p-5">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

          <div>
            <p className="text-sm font-semibold text-amber-200">
              Administrator security
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Keep your administrator credentials private.
              Only authorized administrators should have access
              to this area.
            </p>
          </div>
        </div>

        {/* ============================================================
            FOOTER
        ============================================================ */}

        <div className="mt-8 border-t border-white/5 pt-5 text-center">
          <p className="text-[11px] text-slate-600">
            Novacrest Capital · Administrator Settings
          </p>
        </div>

      </div>
    </main>
  );
}

/* ================================================================
   SETTINGS SECTION
================================================================ */

function SettingsSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#101621]">
      <div className="border-b border-white/10 px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04]">
            <Icon className="h-5 w-5 text-slate-400" />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              {title}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {children}
      </div>
    </section>
  );
}

/* ================================================================
   SETTINGS LINK
================================================================ */

function SettingsLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 px-5 py-4 transition hover:bg-white/[0.03] sm:px-6"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
        <Icon className="h-4 w-4 text-slate-400 transition group-hover:text-violet-300" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-200 transition group-hover:text-white">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-slate-300" />
    </Link>
  );
}