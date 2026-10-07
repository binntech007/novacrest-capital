import Link from "next/link";
import {
  Activity,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  Coins,
  LineChart,
} from "lucide-react";

const actions = [
  {
    title: "Live Market",
    description: "View live market prices and movements",
    href: "/dashboard/live-market",
    icon: Activity,
    color: "text-emerald-300 bg-emerald-500/10",
  },
  {
    title: "Stock Market",
    description: "Explore stocks and market performance",
    href: "/dashboard/stock-market",
    icon: BarChart3,
    color: "text-blue-300 bg-blue-500/10",
  },
  {
    title: "Shares",
    description: "View available shares and investments",
    href: "/dashboard/shares",
    icon: Coins,
    color: "text-purple-300 bg-purple-500/10",
  },
  {
    title: "Deposit",
    description: "Add funds to your wallet",
    href: "/dashboard/deposit",
    icon: ArrowDownLeft,
    color: "text-cyan-300 bg-cyan-500/10",
  },
  {
    title: "Withdraw",
    description: "Withdraw funds from your wallet",
    href: "/dashboard/withdraw",
    icon: ArrowUpRight,
    color: "text-orange-300 bg-orange-500/10",
  },
  {
    title: "Transfer",
    description: "Send money to another account",
    href: "/dashboard/transfer",
    icon: ArrowLeftRight,
    color: "text-violet-300 bg-violet-500/10",
  },
];

export default function QuickActions() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">
          Quick actions
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Access markets and manage your funds.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map(
          ({
            title,
            description,
            href,
            icon: Icon,
            color,
          }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#101727] p-5 transition hover:border-violet-400/30 hover:bg-[#141c30]"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">
                  {title}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  {description}
                </p>
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-violet-300" />
            </Link>
          ),
        )}
      </div>
    </section>
  );
}
