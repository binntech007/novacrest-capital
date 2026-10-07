"use client";

import { useMemo, useState } from "react";
import {
  Search,
  TrendingDown,
  TrendingUp,
  X,
  Layers3,
} from "lucide-react";

type Share = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  category: string;
};

const shares: Share[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 189.84,
    change: 1.24,
    category: "Technology",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 421.56,
    change: 0.86,
    category: "Technology",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 875.32,
    change: 2.41,
    category: "Technology",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 182.91,
    change: 1.17,
    category: "Consumer",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 176.24,
    change: 0.72,
    category: "Technology",
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 514.63,
    change: 1.93,
    category: "Technology",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 248.98,
    change: -1.42,
    category: "Automotive",
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 198.45,
    change: 0.54,
    category: "Financial",
  },
  {
    symbol: "V",
    name: "Visa Inc.",
    price: 278.36,
    change: 0.43,
    category: "Financial",
  },
  {
    symbol: "MA",
    name: "Mastercard Inc.",
    price: 472.81,
    change: 0.67,
    category: "Financial",
  },
  {
    symbol: "WMT",
    name: "Walmart Inc.",
    price: 68.42,
    change: 0.92,
    category: "Retail",
  },
  {
    symbol: "XOM",
    name: "Exxon Mobil Corporation",
    price: 118.27,
    change: -0.31,
    category: "Energy",
  },
  {
    symbol: "ORCL",
    name: "Oracle Corporation",
    price: 138.72,
    change: 1.35,
    category: "Technology",
  },
  {
    symbol: "COST",
    name: "Costco Wholesale",
    price: 886.41,
    change: 0.58,
    category: "Retail",
  },
  {
    symbol: "NFLX",
    name: "Netflix Inc.",
    price: 642.18,
    change: 1.76,
    category: "Entertainment",
  },
  {
    symbol: "HD",
    name: "Home Depot",
    price: 352.64,
    change: -0.22,
    category: "Retail",
  },
  {
    symbol: "PG",
    name: "Procter & Gamble",
    price: 168.92,
    change: 0.36,
    category: "Consumer",
  },
  {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    price: 156.73,
    change: -0.18,
    category: "Healthcare",
  },
  {
    symbol: "BAC",
    name: "Bank of America",
    price: 39.84,
    change: 0.63,
    category: "Financial",
  },
  {
    symbol: "CRM",
    name: "Salesforce",
    price: 291.46,
    change: 1.12,
    category: "Technology",
  },
  {
    symbol: "ABBV",
    name: "AbbVie Inc.",
    price: 171.28,
    change: 0.41,
    category: "Healthcare",
  },
  {
    symbol: "CVX",
    name: "Chevron Corporation",
    price: 157.93,
    change: -0.27,
    category: "Energy",
  },
  {
    symbol: "KO",
    name: "Coca-Cola Company",
    price: 61.74,
    change: 0.24,
    category: "Consumer",
  },
  {
    symbol: "MRK",
    name: "Merck & Co.",
    price: 124.38,
    change: 0.52,
    category: "Healthcare",
  },
  {
    symbol: "AMD",
    name: "Advanced Micro Devices",
    price: 162.47,
    change: 2.18,
    category: "Technology",
  },
  {
    symbol: "PEP",
    name: "PepsiCo Inc.",
    price: 176.54,
    change: -0.14,
    category: "Consumer",
  },
  {
    symbol: "ADBE",
    name: "Adobe Inc.",
    price: 521.83,
    change: 0.94,
    category: "Technology",
  },
  {
    symbol: "CSCO",
    name: "Cisco Systems",
    price: 48.26,
    change: 0.47,
    category: "Technology",
  },
  {
    symbol: "ACN",
    name: "Accenture",
    price: 318.72,
    change: -0.35,
    category: "Technology",
  },
  {
    symbol: "MCD",
    name: "McDonald's Corporation",
    price: 287.64,
    change: 0.29,
    category: "Consumer",
  },
  {
    symbol: "IBM",
    name: "IBM",
    price: 192.47,
    change: 0.81,
    category: "Technology",
  },
  {
    symbol: "ABT",
    name: "Abbott Laboratories",
    price: 112.36,
    change: 0.44,
    category: "Healthcare",
  },
  {
    symbol: "LIN",
    name: "Linde plc",
    price: 458.21,
    change: 0.38,
    category: "Industrial",
  },
  {
    symbol: "INTU",
    name: "Intuit Inc.",
    price: 641.52,
    change: 1.24,
    category: "Technology",
  },
  {
    symbol: "QCOM",
    name: "Qualcomm",
    price: 171.83,
    change: 1.67,
    category: "Technology",
  },
  {
    symbol: "TXN",
    name: "Texas Instruments",
    price: 194.26,
    change: 0.73,
    category: "Technology",
  },
  {
    symbol: "AMAT",
    name: "Applied Materials",
    price: 211.47,
    change: 1.84,
    category: "Technology",
  },
  {
    symbol: "CAT",
    name: "Caterpillar Inc.",
    price: 347.18,
    change: -0.16,
    category: "Industrial",
  },
  {
    symbol: "GE",
    name: "GE Aerospace",
    price: 176.43,
    change: 0.92,
    category: "Industrial",
  },
  {
    symbol: "DIS",
    name: "Walt Disney Company",
    price: 96.74,
    change: 0.61,
    category: "Entertainment",
  },
  {
    symbol: "VZ",
    name: "Verizon Communications",
    price: 41.26,
    change: -0.11,
    category: "Telecommunications",
  },
  {
    symbol: "PFE",
    name: "Pfizer Inc.",
    price: 28.63,
    change: 0.28,
    category: "Healthcare",
  },
  {
    symbol: "NKE",
    name: "Nike Inc.",
    price: 91.47,
    change: -0.46,
    category: "Consumer",
  },
  {
    symbol: "UPS",
    name: "United Parcel Service",
    price: 145.82,
    change: 0.32,
    category: "Industrial",
  },
  {
    symbol: "LOW",
    name: "Lowe's Companies",
    price: 231.64,
    change: 0.57,
    category: "Retail",
  },
  {
    symbol: "INTC",
    name: "Intel Corporation",
    price: 31.74,
    change: 1.43,
    category: "Technology",
  },
  {
    symbol: "BA",
    name: "Boeing Company",
    price: 178.36,
    change: -0.72,
    category: "Industrial",
  },
  {
    symbol: "GS",
    name: "Goldman Sachs",
    price: 485.21,
    change: 0.64,
    category: "Financial",
  },
  {
    symbol: "MS",
    name: "Morgan Stanley",
    price: 94.82,
    change: 0.48,
    category: "Financial",
  },
  {
    symbol: "RTX",
    name: "RTX Corporation",
    price: 104.63,
    change: 0.36,
    category: "Industrial",
  },
  {
    symbol: "SBUX",
    name: "Starbucks Corporation",
    price: 91.28,
    change: -0.21,
    category: "Consumer",
  },
  {
    symbol: "PYPL",
    name: "PayPal Holdings",
    price: 67.45,
    change: 0.89,
    category: "Financial",
  },
  {
    symbol: "UBER",
    name: "Uber Technologies",
    price: 72.84,
    change: 1.31,
    category: "Technology",
  },
  {
    symbol: "SHOP",
    name: "Shopify Inc.",
    price: 78.26,
    change: 1.94,
    category: "Technology",
  },
];

function formatPrice(price: number) {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function SharesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(shares.map((share) => share.category)),
      ).sort(),
    ],
    [],
  );

  const filteredShares = useMemo(() => {
    const query = search.toLowerCase().trim();

    return shares.filter((share) => {
      const matchesSearch =
        !query ||
        share.symbol.toLowerCase().includes(query) ||
        share.name.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All" ||
        share.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <main className="min-h-screen bg-[#080d19] text-white">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <section className="border-b border-white/10 bg-[#080d19]">
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                  <Layers3 className="h-5 w-5 text-violet-400" />
                </div>

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
                  Equity Shares
                </span>
              </div>

              <h1 className="text-2xl font-bold sm:text-3xl">
                Shares
              </h1>

              <p className="mt-2 max-w-xl text-sm text-slate-400">
                Browse popular company shares across major
                market sectors.
              </p>
            </div>

            {/* COUNT */}
            <div className="rounded-2xl border border-white/10 bg-[#0c1424] px-5 py-4">
              <p className="text-xs text-slate-500">
                Shares Available
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {shares.length}+
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10">
        {/* SEARCH */}
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search shares by name or symbol..."
            className="h-12 w-full rounded-xl border border-white/10 bg-[#0c1424] pl-11 pr-11 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-violet-400/40 focus:ring-1 focus:ring-violet-400/20"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* CATEGORY FILTERS */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => {
            const active = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-xl border px-4 py-2 text-xs font-medium transition ${
                  active
                    ? "border-violet-400/30 bg-violet-500/10 text-violet-300"
                    : "border-white/10 bg-[#0c1424] text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* ===================================================
            DESKTOP TABLE
        =================================================== */}
        <section className="mt-6 hidden overflow-hidden rounded-2xl border border-white/10 bg-[#0c1424] lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Share
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Price
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Change
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Sector
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredShares.map((share) => {
                  const positive = share.change >= 0;

                  return (
                    <tr
                      key={share.symbol}
                      className="border-b border-white/5 transition hover:bg-white/[0.025]"
                    >
                      {/* SHARE */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/5 text-xs font-bold text-violet-200">
                            {share.symbol.slice(0, 3)}
                          </div>

                          <div>
                            <p className="font-semibold text-white">
                              {share.symbol}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                              {share.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* PRICE */}
                      <td className="px-5 py-4 text-right">
                        <span className="font-medium tabular-nums text-white">
                          {formatPrice(share.price)}
                        </span>
                      </td>

                      {/* CHANGE */}
                      <td className="px-5 py-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                            positive
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-rose-500/10 text-rose-400"
                          }`}
                        >
                          {positive ? (
                            <TrendingUp className="h-3.5 w-3.5" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5" />
                          )}

                          {positive ? "+" : ""}
                          {share.change.toFixed(2)}%
                        </span>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-5 py-4 text-right">
                        <span className="rounded-full border border-violet-400/10 bg-violet-400/5 px-3 py-1 text-xs text-violet-300">
                          {share.category}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredShares.length === 0 && (
            <div className="px-5 py-16 text-center">
              <Search className="mx-auto h-8 w-8 text-slate-700" />

              <p className="mt-3 text-sm text-slate-400">
                No shares found.
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Try another company or sector.
              </p>
            </div>
          )}
        </section>

        {/* ===================================================
            MOBILE CARDS
        =================================================== */}
        <section className="mt-6 space-y-3 lg:hidden">
          {filteredShares.map((share) => {
            const positive = share.change >= 0;

            return (
              <div
                key={share.symbol}
                className="rounded-2xl border border-white/10 bg-[#0c1424] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/5 text-xs font-bold text-violet-200">
                      {share.symbol.slice(0, 3)}
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-white">
                        {share.symbol}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {share.name}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                      positive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {positive ? (
                      <TrendingUp className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" />
                    )}

                    {positive ? "+" : ""}
                    {share.change.toFixed(2)}%
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-500">
                      Share Price
                    </p>

                    <p className="mt-1 text-xl font-bold tabular-nums text-white">
                      {formatPrice(share.price)}
                    </p>
                  </div>

                  <span className="rounded-full border border-violet-400/10 bg-violet-400/5 px-3 py-1 text-xs text-violet-300">
                    {share.category}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredShares.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-[#0c1424] px-5 py-16 text-center">
              <Search className="mx-auto h-8 w-8 text-slate-700" />

              <p className="mt-3 text-sm text-slate-400">
                No shares found.
              </p>
            </div>
          )}
        </section>

        {/* FOOTER */}
        <div className="border-t border-white/5 py-6 text-xs text-slate-600">
          Share information displayed on this page is for
          informational purposes.
        </div>
      </div>
    </main>
  );
}