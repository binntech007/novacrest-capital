import {
  Wallet,
  TrendingUp,
  Bot,
} from "lucide-react";

type BalanceCardsProps = {
  availableBalance: number;
  activeInvestmentAmount: number;
  tradingBotAmount: number;
  currency?: string;
};

function formatMoney(amount: number, currency: string) {
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safeAmount);
  } catch {
    return `${currency} ${safeAmount.toFixed(2)}`;
  }
}

export default function BalanceCards({
  availableBalance,
  activeInvestmentAmount,
  tradingBotAmount,
  currency = "USD",
}: BalanceCardsProps) {
  const cards = [
    {
      title: "Available Balance",
      amount: availableBalance,
      description: "Funds available in your wallet",
      icon: Wallet,
      iconStyle:
        "bg-blue-500/10 text-blue-400 ring-1 ring-blue-400/20",
      cardStyle:
        "border-blue-400/20 hover:border-blue-400/40",
      glowStyle: "bg-blue-500/5",
    },
    {
      title: "Active Investment ",
      amount: activeInvestmentAmount,
      description: "Funds allocated to active investments",
      icon: TrendingUp,
      iconStyle:
        "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-400/20",
      cardStyle:
        "border-emerald-400/20 hover:border-emerald-400/40",
      glowStyle: "bg-emerald-500/5",
    },
    {
      title: "Trading Bot Money",
      amount: tradingBotAmount,
      description: "Funds allocated to your trading bot",
      icon: Bot,
      iconStyle:
        "bg-violet-500/10 text-violet-400 ring-1 ring-violet-400/20",
      cardStyle:
        "border-violet-400/20 hover:border-violet-400/40",
      glowStyle: "bg-violet-500/5",
    },
  ];

  return (
    <section
      aria-label="Account summary"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
    >
      {cards.map((card) => {
        const Icon = card.icon;

        const formattedAmount = formatMoney(
          card.amount,
          currency
        );

        return (
          <div
            key={card.title}
            className={`relative isolate overflow-hidden rounded-2xl border ${card.cardStyle} bg-gradient-to-br from-[#111a2b] via-[#0d1525] to-[#0a1020] p-5 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 sm:p-6`}
          >
            {/* Subtle background glow */}
            <div
              className={`pointer-events-none absolute -right-10 -top-10 -z-10 h-32 w-32 rounded-full ${card.glowStyle} blur-3xl`}
            />

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-400">
                  {card.title}
                </p>

                <h3 className="mt-3 break-words text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {formattedAmount}
                </h3>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.iconStyle}`}
              >
                <Icon size={24} strokeWidth={1.8} />
              </div>
            </div>

            <div className="mt-5 border-t border-white/[0.06] pt-4">
              <p className="text-sm leading-5 text-slate-400">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}