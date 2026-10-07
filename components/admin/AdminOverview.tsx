
import {
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Users,
} from "lucide-react";

type AdminOverviewProps = {
  name: string;
  email: string;
  customerCount: number;
  adminCount: number;
  activeUserCount: number;
};

export default function AdminOverview({
  name,
  email,
  customerCount,
  adminCount,
  activeUserCount,
}: AdminOverviewProps) {
  const metrics = [
    {
      label: "Registered Customers",
      value: customerCount,
      description: "Customer accounts",
      icon: Users,
    },
    {
      label: "Administrator Accounts",
      value: adminCount,
      description: "Privileged accounts",
      icon: ShieldCheck,
    },
    {
      label: "Active User Accounts",
      value: activeUserCount,
      description: "Accounts marked active",
      icon: Activity,
    },
  ];

  return (
    <div className="p-5 sm:p-8">
      <section className="mb-8 rounded-2xl border border-violet-500/20 bg-linear-to-r from-violet-600/15 to-[#151c28] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-violet-300">
              ADMINISTRATOR CONTROL CENTER
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Welcome back, {name}
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Review account activity and manage authorized
              administration functions from one place.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Account active
          </div>
        </div>
      </section>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-white">
          Account Overview
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Current account counts from your database.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-2xl border border-slate-800 bg-[#151c28] p-6 transition hover:border-violet-500/40"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Icon size={24} />
                </div>

                <ArrowUpRight
                  size={20}
                  className="text-slate-600"
                />
              </div>

              <p className="text-sm text-slate-400">
                {metric.label}
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {metric.value.toLocaleString()}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                {metric.description}
              </p>
            </article>
          );
        })}
      </div>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-[#151c28] p-6">
        <div className="flex items-center gap-3">
          <Activity size={22} className="text-violet-400" />
          <div>
            <h2 className="font-bold text-white">System Status</h2>
            <p className="mt-1 text-sm text-slate-400">
              Administrator account information.
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-slate-800 pt-5">
          <p className="text-sm text-slate-400">Signed in as</p>
          <p className="mt-1 break-all font-medium text-white">
            {email}
          </p>

          <p className="mt-3 text-sm text-slate-400">
            Access role
          </p>
          <p className="mt-1 font-medium text-violet-300">
            ADMIN
          </p>
        </div>
      </section>
    </div>
  );
}
