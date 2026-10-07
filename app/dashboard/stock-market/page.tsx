"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  Search,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";

type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
};

const stocks: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 189.84, change: 1.24 },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 421.56, change: 0.86 },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 875.32, change: 2.41 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 182.91, change: 1.17 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 176.24, change: 0.72 },
  { symbol: "META", name: "Meta Platforms Inc.", price: 514.63, change: 1.93 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 248.98, change: -1.42 },
  { symbol: "AVGO", name: "Broadcom Inc.", price: 164.37, change: 1.08 },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", price: 198.45, change: 0.54 },
  { symbol: "V", name: "Visa Inc.", price: 278.36, change: 0.43 },
  { symbol: "MA", name: "Mastercard Inc.", price: 472.81, change: 0.67 },
  { symbol: "WMT", name: "Walmart Inc.", price: 68.42, change: 0.92 },
  { symbol: "XOM", name: "Exxon Mobil Corporation", price: 118.27, change: -0.31 },
  { symbol: "ORCL", name: "Oracle Corporation", price: 138.72, change: 1.35 },
  { symbol: "COST", name: "Costco Wholesale", price: 886.41, change: 0.58 },
  { symbol: "NFLX", name: "Netflix Inc.", price: 642.18, change: 1.76 },
  { symbol: "HD", name: "Home Depot", price: 352.64, change: -0.22 },
  { symbol: "PG", name: "Procter & Gamble", price: 168.92, change: 0.36 },
  { symbol: "JNJ", name: "Johnson & Johnson", price: 156.73, change: -0.18 },
  { symbol: "BAC", name: "Bank of America", price: 39.84, change: 0.63 },
  { symbol: "CRM", name: "Salesforce", price: 291.46, change: 1.12 },
  { symbol: "ABBV", name: "AbbVie Inc.", price: 171.28, change: 0.41 },
  { symbol: "CVX", name: "Chevron Corporation", price: 157.93, change: -0.27 },
  { symbol: "KO", name: "Coca-Cola Company", price: 61.74, change: 0.24 },
  { symbol: "MRK", name: "Merck & Co.", price: 124.38, change: 0.52 },
  { symbol: "AMD", name: "Advanced Micro Devices", price: 162.47, change: 2.18 },
  { symbol: "PEP", name: "PepsiCo Inc.", price: 176.54, change: -0.14 },
  { symbol: "ADBE", name: "Adobe Inc.", price: 521.83, change: 0.94 },
  { symbol: "CSCO", name: "Cisco Systems", price: 48.26, change: 0.47 },
  { symbol: "ACN", name: "Accenture", price: 318.72, change: -0.35 },
  { symbol: "MCD", name: "McDonald's Corporation", price: 287.64, change: 0.29 },
  { symbol: "IBM", name: "IBM", price: 192.47, change: 0.81 },
  { symbol: "ABT", name: "Abbott Laboratories", price: 112.36, change: 0.44 },
  { symbol: "LIN", name: "Linde plc", price: 458.21, change: 0.38 },
  { symbol: "INTU", name: "Intuit Inc.", price: 641.52, change: 1.24 },
  { symbol: "QCOM", name: "Qualcomm", price: 171.83, change: 1.67 },
  { symbol: "TXN", name: "Texas Instruments", price: 194.26, change: 0.73 },
  { symbol: "AMAT", name: "Applied Materials", price: 211.47, change: 1.84 },
  { symbol: "CAT", name: "Caterpillar Inc.", price: 347.18, change: -0.16 },
  { symbol: "GE", name: "GE Aerospace", price: 176.43, change: 0.92 },
  { symbol: "DIS", name: "Walt Disney Company", price: 96.74, change: 0.61 },
  { symbol: "VZ", name: "Verizon Communications", price: 41.26, change: -0.11 },
  { symbol: "PFE", name: "Pfizer Inc.", price: 28.63, change: 0.28 },
  { symbol: "NKE", name: "Nike Inc.", price: 91.47, change: -0.46 },
  { symbol: "UPS", name: "United Parcel Service", price: 145.82, change: 0.32 },
  { symbol: "LOW", name: "Lowe's Companies", price: 231.64, change: 0.57 },
  { symbol: "INTC", name: "Intel Corporation", price: 31.74, change: 1.43 },
  { symbol: "BA", name: "Boeing Company", price: 178.36, change: -0.72 },
  { symbol: "GS", name: "Goldman Sachs", price: 485.21, change: 0.64 },
  { symbol: "MS", name: "Morgan Stanley", price: 94.82, change: 0.48 },
  { symbol: "RTX", name: "RTX Corporation", price: 104.63, change: 0.36 },
  { symbol: "SBUX", name: "Starbucks Corporation", price: 91.28, change: -0.21 },
  { symbol: "PYPL", name: "PayPal Holdings", price: 67.45, change: 0.89 },
  { symbol: "UBER", name: "Uber Technologies", price: 72.84, change: 1.31 },
  { symbol: "SHOP", name: "Shopify Inc.", price: 78.26, change: 1.94 },
];

function formatPrice(price: number) {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function StockMarketPage() {
  const [search, setSearch] = useState("");

  const filteredStocks = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return stocks;

    return stocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <main className="min-h-screen bg-[#080d19] text-white">
      {/* HEADER */}
      <section className="border-b border-white/10 bg-[#080d19]">
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10">
                  <BarChart3 className="h-5 w-5 text-cyan-400" />
                </div>

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
                  Global Markets
                </span>
              </div>

              <h1 className="text-2xl font-bold sm:text-3xl">
                Stock Market
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Explore major companies and their market information.
              </p>
            </div>

            {/* STOCK COUNT */}
            <div className="rounded-2xl border border-white/10 bg-[#0c1424] px-5 py-4">
              <p className="text-xs text-slate-500">
                Stocks Available
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {stocks.length}+
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10">
        {/* SEARCH */}
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search stocks by name or symbol..."
            className="h-12 w-full rounded-xl border border-white/10 bg-[#0c1424] pl-11 pr-11 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 hover:bg-white/5 hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="mt-6 hidden overflow-hidden rounded-2xl border border-white/10 bg-[#0c1424] lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Company
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Price
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Change
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Market
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredStocks.map((stock) => {
                  const positive = stock.change >= 0;

                  return (
                    <tr
                      key={stock.symbol}
                      className="border-b border-white/5 transition hover:bg-white/[0.025]"
                    >
                      {/* COMPANY */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-bold text-slate-200">
                            {stock.symbol.slice(0, 3)}
                          </div>

                          <div>
                            <p className="font-semibold text-white">
                              {stock.symbol}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                              {stock.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* PRICE */}
                      <td className="px-5 py-4 text-right">
                        <span className="font-medium tabular-nums text-white">
                          {formatPrice(stock.price)}
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
                          {stock.change.toFixed(2)}%
                        </span>
                      </td>

                      {/* MARKET */}
                      <td className="px-5 py-4 text-right">
                        <span className="rounded-full border border-cyan-400/10 bg-cyan-400/5 px-3 py-1 text-xs text-cyan-300">
                          US Market
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredStocks.length === 0 && (
            <div className="px-5 py-16 text-center">
              <Search className="mx-auto h-8 w-8 text-slate-700" />

              <p className="mt-3 text-sm text-slate-400">
                No stocks found.
              </p>
            </div>
          )}
        </div>

        {/* MOBILE CARDS */}
        <div className="mt-6 space-y-3 lg:hidden">
          {filteredStocks.map((stock) => {
            const positive = stock.change >= 0;

            return (
              <div
                key={stock.symbol}
                className="rounded-2xl border border-white/10 bg-[#0c1424] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-bold text-slate-200">
                      {stock.symbol.slice(0, 3)}
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-white">
                        {stock.symbol}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {stock.name}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                      positive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {positive ? "+" : ""}
                    {stock.change.toFixed(2)}%
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-xs text-slate-500">
                    Price
                  </p>

                  <p className="mt-1 text-xl font-bold tabular-nums text-white">
                    {formatPrice(stock.price)}
                  </p>
                </div>

                <div className="mt-4">
                  <span className="rounded-full border border-cyan-400/10 bg-cyan-400/5 px-3 py-1 text-xs text-cyan-300">
                    US Market
                  </span>
                </div>
              </div>
            );
          })}

          {filteredStocks.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-[#0c1424] px-5 py-16 text-center">
              <Search className="mx-auto h-8 w-8 text-slate-700" />

              <p className="mt-3 text-sm text-slate-400">
                No stocks found.
              </p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t border-white/5 py-6 text-xs text-slate-600">
          Stock information displayed on this page is for
          informational purposes.
        </div>
      </div>
    </main>
  );
}