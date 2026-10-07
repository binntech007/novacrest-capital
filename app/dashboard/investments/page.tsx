import Link from "next/link";
import {
  ArrowRight,
  ChartNoAxesCombined,
  CircleDollarSign,
  Gem,
  Handshake,
  ShieldCheck,
  Clock3,
  Percent,
} from "lucide-react";

const plans = [
  {
    id: "gold",
    name: "Gold Plan",
    description: "For customers exploring the entry-level plan.",
    min: 1000,
    max: 5000,
    dailyRate: "5%",
    roi: "15%",
    duration: 3,
    commission: "10%",
    icon: CircleDollarSign,
    featured: false,
  },
  {
    id: "diamond",
    name: "Diamond Plan",
    description: "A higher investment tier with a longer term.",
    min: 3000,
    max: 10000,
    dailyRate: "4%",
    roi: "20%",
    duration: 5,
    commission: "10%",
    icon: Gem,
    featured: false,
  },
  {
    id: "platinum",
    name: "Platinum Plan",
    description: "A premium tier with a seven-day term.",
    min: 10000,
    max: 25000,
    dailyRate: "5%",
    roi: "35%",
    duration: 7,
    commission: "10%",
    icon: ChartNoAxesCombined,
    featured: true,
  },
  {
    id: "joint",
    name: "Joint Investment Plan",
    description: "A plan intended for joint investment arrangements.",
    min: 5000,
    max: 15000,
    dailyRate: "2.9%",
    roi: "40%",
    duration: 14,
    commission: "10%",
    icon: Handshake,
    featured: false,
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

export default function InvestmentsPage() {
  return (
    <main className="min-h-screen bg-[#080d19] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-400">
            <ShieldCheck size={16} />
            <span>Investment Plans</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Choose an Investment Plan
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Review the available plan terms and select a plan to continue with
            your investment.
          </p>
        </div>

        {/* Plans */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col overflow-hidden rounded-2xl border bg-[#101621] transition ${
                  plan.featured
                    ? "border-cyan-500/60 shadow-lg shadow-cyan-500/10"
                    : "border-slate-800"
                }`}
              >
                {plan.featured && (
                  <div className="absolute right-4 top-4 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold text-cyan-300">
                    Featured
                  </div>
                )}

                <div className="p-5">
                  {/* Icon */}
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-900">
                    <Icon size={23} className="text-cyan-400" />
                  </div>

                  <h2 className="text-xl font-semibold text-white">
                    {plan.name}
                  </h2>

                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-400">
                    {plan.description}
                  </p>

                  {/* Amount */}
                  <div className="mt-6 rounded-xl border border-slate-800 bg-[#0b111d] p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Investment Range
                    </p>

                    <p className="mt-1 text-lg font-semibold text-white">
                      {formatCurrency(plan.min)} – {formatCurrency(plan.max)}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="flex items-center gap-2 text-sm text-slate-400">
                        <Percent size={15} />
                        Daily Rate
                      </span>

                      <span className="text-sm font-medium text-white">
                        {plan.dailyRate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="flex items-center gap-2 text-sm text-slate-400">
                        <Percent size={15} />
                        Advertised ROI
                      </span>

                      <span className="text-sm font-medium text-white">
                        {plan.roi}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock3 size={15} />
                        Duration
                      </span>

                      <span className="text-sm font-medium text-white">
                        {plan.duration}{" "}
                        {plan.duration === 1 ? "day" : "days"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">
                        Commission
                      </span>

                      <span className="text-sm font-medium text-white">
                        {plan.commission}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-auto border-t border-slate-800 p-5">
                  <Link
                    href={`/dashboard/investments/new?plan=${plan.id}`}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      plan.featured
                        ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                        : "border border-slate-700 bg-slate-900 text-white hover:border-cyan-500/50 hover:bg-slate-800"
                    }`}
                  >
                    Start Investment
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notice */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-[#101621] p-5">
          <div className="flex gap-3">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-cyan-400"
            />

            <div>
              <h3 className="text-sm font-semibold text-white">
                Please review before investing
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                The rates and ROI displayed above are the terms configured for
                each plan and are not a guarantee of financial performance.
                Review the applicable terms, fees, withdrawal conditions, and
                risks before starting an investment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}