
"use client";

import { useState } from "react";
import {
  UserRound,
  ShieldCheck,
  Smartphone,
  Bell,
  Globe,
  LockKeyhole,
  CheckCircle2,
  ChevronRight,
  Settings as SettingsIcon,
  Monitor,
  Eye,
  Mail,
  Moon,
} from "lucide-react";

import EditProfileForm from "@/components/dashboard/EditProfileForm";
import ChangePasswordForm from "@/components/dashboard/ChangePasswordForm";

type SettingsPageProps = {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    image: string | null;
  };
};

type TabId =
  | "profile"
  | "security"
  | "two-factor"
  | "notifications"
  | "language"
  | "privacy";

const tabs: {
  id: TabId;
  label: string;
  description: string;
  icon: typeof UserRound;
}[] = [
  {
    id: "profile",
    label: "Profile",
    description: "Manage your personal information",
    icon: UserRound,
  },
  {
    id: "security",
    label: "Security",
    description: "Password and account security",
    icon: ShieldCheck,
  },
  {
    id: "two-factor",
    label: "Two-factor authentication",
    description: "Additional sign-in protection",
    icon: Smartphone,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Manage your updates",
    icon: Bell,
  },
  {
    id: "language",
    label: "Language and region",
    description: "Display preferences",
    icon: Globe,
  },
  {
    id: "privacy",
    label: "Privacy",
    description: "Privacy and data preferences",
    icon: LockKeyhole,
  },
];

function Toggle({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  const [enabled, setEnabled] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 py-5 last:border-b-0">
      <div>
        <p className="font-medium text-slate-100">{label}</p>
        <p className="mt-1 text-sm leading-5 text-slate-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        onClick={() => setEnabled((previous) => !previous)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          enabled ? "bg-emerald-600" : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            enabled ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <h2 className="text-xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}

export default function SettingsPage({ user }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <header className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
            <SettingsIcon size={25} />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Settings
            </h1>
            <p className="mt-1 text-sm text-slate-400 sm:text-base">
              Manage your Novacrest Capital account preferences.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[350px_minmax(0,1fr)]">
          {/* Settings sidebar */}
          <aside className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-xl shadow-black/10">
            <p className="px-3 py-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Account settings
            </p>

            <nav
              className="space-y-1.5"
              aria-label="Settings sections"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    aria-current={active ? "page" : undefined}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-4 text-left transition ${
                      active
                        ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/20"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <Icon
                      size={22}
                      className={`shrink-0 ${
                        active
                          ? "text-emerald-400"
                          : "text-slate-500"
                      }`}
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">
                        {tab.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-400">
                        {tab.description}
                      </span>
                    </span>

                    <ChevronRight
                      size={17}
                      className={
                        active
                          ? "shrink-0 text-emerald-400"
                          : "shrink-0 text-slate-600"
                      }
                    />
                  </button>
                );
              })}
            </nav>

            {/* Sidebar information */}
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4">
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-emerald-400"
              />

              <div>
                <p className="text-sm font-medium text-slate-200">
                  Account settings
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Manage your personal preferences and account information.
                </p>
              </div>
            </div>
          </aside>

          {/* Main settings panel */}
          <section className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10 sm:p-8">
            {/* Profile */}
            {activeTab === "profile" && (
              <>
                <SectionHeading
                  title="Personal information"
                  description="Update your name and profile picture."
                />

                <EditProfileForm
                  firstName={user.firstName}
                  lastName={user.lastName}
                  email={user.email}
                  image={user.image}
                />
              </>
            )}

            {/* Security / Change password */}
            {activeTab === "security" && (
              <>
                <SectionHeading
                  title="Change password"
                  description="Update your password to help keep your Novacrest Capital account secure."
                />

                <ChangePasswordForm />
              </>
            )}

            {/* Two-factor authentication */}
            {activeTab === "two-factor" && (
              <>
                <SectionHeading
                  title="Two-factor authentication"
                  description="Add another layer of protection to your account."
                />

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
                      <Smartphone size={24} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-white">
                        Additional sign-in protection
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Two-factor authentication requires an authentication
                        backend that can enroll and verify an additional
                        sign-in factor.
                      </p>

                      <span className="mt-4 inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
                        Not configured
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <>
                <SectionHeading
                  title="Notifications"
                  description="Choose the updates you want to receive."
                />

                <div>
                  <Toggle
                    label="Email notifications"
                    description="Receive account updates by email."
                    defaultChecked
                  />

                  <Toggle
                    label="Security alerts"
                    description="Receive notifications about important security events."
                    defaultChecked
                  />

                  <Toggle
                    label="Account activity"
                    description="Receive updates about activity on your account."
                    defaultChecked
                  />

                  <Toggle
                    label="Product announcements"
                    description="Receive optional news and product updates."
                  />
                </div>

                <p className="mt-5 text-xs leading-5 text-slate-500">
                  These notification preferences are currently local to
                  this page and are not saved to your account.
                </p>
              </>
            )}

            {/* Language and region */}
            {activeTab === "language" && (
              <>
                <SectionHeading
                  title="Language and region"
                  description="Manage how information is displayed in your account."
                />

                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="settings-language"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Language
                    </label>

                    <select
                      id="settings-language"
                      defaultValue="en"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="settings-region"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Region
                    </label>

                    <select
                      id="settings-region"
                      defaultValue="auto"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="auto">
                        Use application default
                      </option>
                    </select>
                  </div>

                  <p className="text-xs leading-5 text-slate-500">
                    Language and region preferences are not persisted yet.
                  </p>
                </div>
              </>
            )}

            {/* Privacy */}
            {activeTab === "privacy" && (
              <>
                <SectionHeading
                  title="Privacy"
                  description="Review your privacy and data preferences."
                />

                <div className="space-y-5">
                  <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                    <LockKeyhole
                      size={22}
                      className="mt-0.5 shrink-0 text-emerald-400"
                    />

                    <div>
                      <h3 className="font-medium text-white">
                        Account information
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        Your profile information is managed through your
                        account settings.
                      </p>
                    </div>
                  </div>

                  <Toggle
                    label="Personalized experience"
                    description="Allow preferences to customize your application experience."
                  />

                  <div className="rounded-xl border border-slate-800 p-4">
                    <div className="flex items-center gap-3">
                      <Eye
                        size={20}
                        className="text-slate-400"
                      />

                      <p className="font-medium text-white">
                        Profile visibility
                      </p>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Your profile settings do not change access permissions
                      or make private account information public.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Footer */}
            <footer className="mt-8 border-t border-slate-800 pt-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <Monitor size={15} />
                <span>Novacrest Capital</span>

                <span>·</span>

                <Moon size={15} />
                <span>Dark appearance</span>

                <span>·</span>

                <Mail size={15} />
                <span>Account preferences</span>
              </div>
            </footer>
          </section>
        </div>
      </div>
    </main>
  );
}
