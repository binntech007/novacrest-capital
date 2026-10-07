"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bitcoin,
  Clock3,
  RefreshCw,
  Search,
  TrendingUp,
} from "lucide-react";

type CryptoMarket = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number | null;
};

function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "$0.00";
  }

  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }

  if (value >= 1) {
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })}`;
}

function formatPrice(value: number) {
  if (value >= 1000) {
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  if (value >= 1) {
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    })}`;
  }

  if (value >= 0.01) {
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })}`;
  }

  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 10,
  })}`;
}

function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}

export default function LiveMarketPage() {
  const [markets, setMarkets] = useState<CryptoMarket[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function fetchMarkets(showLoader = false) {
    try {
      if (showLoader) {
        setRefreshing(true);
      }

      setError("");

      const response = await fetch("/api/crypto/markets", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to load cryptocurrency data.",
        );
      }

      setMarkets(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load cryptocurrency data.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchMarkets();

    const interval = setInterval(() => {
      fetchMarkets();
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  const filteredMarkets = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return markets;
    }

    return markets.filter(
      (coin) =>
        coin.name.toLowerCase().includes(value) ||
        coin.symbol.toLowerCase().includes(value),
    );
  }, [markets, search]);

  const marketStats = useMemo(() => {
    const totalMarketCap = markets.reduce(
      (total, coin) => total + (coin.market_cap || 0),
      0,
    );

    const totalVolume = markets.reduce(
      (total, coin) => total + (coin.total_volume || 0),
      0,
    );

    return {
      totalMarketCap,
      totalVolume,
    };
  }, [markets]);

  return (
    <div className="min-h-screen bg-[#070c16] text-white">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-white/[0.06] bg-[#080e19]">
        <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              {/* Badge */}

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                Live cryptocurrency
              </div>

              <h1 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                Crypto Markets
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Monitor cryptocurrency prices, market movements, trading
                volume and market capitalization in one place.
              </p>
            </div>

            {/* Refresh */}

            <button
              type="button"
              onClick={() => fetchMarkets(true)}
              disabled={refreshing}
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-emerald-400/20 hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />

              {refreshing ? "Updating..." : "Refresh markets"}
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8">
        {/* =====================================================
            SUMMARY CARDS
        ====================================================== */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {/* Number of assets */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/[0.07] bg-[#0b1220] p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Assets displayed
              </p>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/[0.06] text-emerald-400">
                <Bitcoin className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-4 text-2xl font-semibold text-white">
              {markets.length || "—"}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Top cryptocurrencies by market cap
            </p>
          </motion.div>

          {/* Market cap */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-2xl border border-white/[0.07] bg-[#0b1220] p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Combined market cap
              </p>

              <TrendingUp className="h-4 w-4 text-cyan-400" />
            </div>

            <p className="mt-4 text-2xl font-semibold text-white">
              {markets.length
                ? formatCurrency(marketStats.totalMarketCap)
                : "—"}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Across displayed assets
            </p>
          </motion.div>

          {/* Volume */}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="rounded-2xl border border-white/[0.07] bg-[#0b1220] p-5 sm:col-span-2 xl:col-span-1"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                24h volume
              </p>

              <Clock3 className="h-4 w-4 text-violet-400" />
            </div>

            <p className="mt-4 text-2xl font-semibold text-white">
              {markets.length
                ? formatCurrency(marketStats.totalVolume)
                : "—"}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Reported trading volume
            </p>
          </motion.div>
        </div>

        {/* =====================================================
            MARKET LIST
        ====================================================== */}

        <section className="mt-8 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0b1220]">
          {/* Header */}

          <div className="border-b border-white/[0.06] p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Cryptocurrency markets
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Showing up to 100 cryptocurrencies ranked by market
                  capitalization.
                </p>
              </div>

              {/* Search */}

              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search cryptocurrency..."
                  className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.025] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/25 focus:bg-white/[0.035]"
                />
              </div>
            </div>
          </div>

          {/* Loading */}

          {loading && (
            <div className="space-y-2 p-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-xl bg-white/[0.025]"
                />
              ))}
            </div>
          )}

          {/* Error */}

          {!loading && error && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-400/10 bg-rose-400/[0.05] text-rose-400">
                !
              </div>

              <h3 className="mt-4 text-sm font-semibold text-white">
                Market data unavailable
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500">
                {error}
              </p>

              <button
                type="button"
                onClick={() => fetchMarkets(true)}
                className="mt-5 rounded-xl bg-emerald-400 px-4 py-2.5 text-xs font-semibold text-[#04110b] transition hover:bg-emerald-300"
              >
                Try again
              </button>
            </div>
          )}

          {/* =================================================
              DESKTOP TABLE
          ================================================== */}

          {!loading &&
            !error &&
            filteredMarkets.length > 0 && (
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-white/[0.05]">
                      <th className="w-16 px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                        #
                      </th>

                      <th className="px-4 py-4 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                        Cryptocurrency
                      </th>

                      <th className="px-4 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                        Price
                      </th>

                      <th className="px-4 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                        24h Change
                      </th>

                      <th className="px-4 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                        24h Volume
                      </th>

                      <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                        Market Cap
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredMarkets.map((coin, index) => {
                      const change =
                        coin.price_change_percentage_24h ?? 0;

                      const positive = change >= 0;

                      return (
                        <motion.tr
                          key={coin.id}
                          initial={{
                            opacity: 0,
                          }}
                          animate={{
                            opacity: 1,
                          }}
                          transition={{
                            duration: 0.2,
                            delay: Math.min(index * 0.01, 0.5),
                          }}
                          className="group border-b border-white/[0.035] transition hover:bg-white/[0.025]"
                        >
                          {/* Rank */}

                          <td className="px-6 py-4">
                            <span className="text-xs font-medium text-slate-600">
                              {coin.market_cap_rank ?? index + 1}
                            </span>
                          </td>

                          {/* Coin */}

                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025]">
                                <img
                                  src={coin.image}
                                  alt={coin.name}
                                  className="h-6 w-6"
                                />
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-white">
                                  {coin.name}
                                </p>

                                <p className="mt-0.5 text-[10px] font-medium uppercase text-slate-600">
                                  {coin.symbol}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Price */}

                          <td className="px-4 py-4 text-right">
                            <span className="text-sm font-semibold text-white">
                              {formatPrice(
                                coin.current_price,
                              )}
                            </span>
                          </td>

                          {/* Change */}

                          <td className="px-4 py-4 text-right">
                            <span
                              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                                positive
                                  ? "bg-emerald-400/[0.07] text-emerald-400"
                                  : "bg-rose-400/[0.07] text-rose-400"
                              }`}
                            >
                              {positive ? (
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              ) : (
                                <ArrowDownRight className="h-3.5 w-3.5" />
                              )}

                              {Math.abs(change).toFixed(2)}%
                            </span>
                          </td>

                          {/* Volume */}

                          <td className="px-4 py-4 text-right">
                            <span className="text-xs text-slate-400">
                              {formatCurrency(
                                coin.total_volume,
                              )}
                            </span>
                          </td>

                          {/* Market cap */}

                          <td className="px-6 py-4 text-right">
                            <span className="text-xs font-medium text-slate-300">
                              {formatCurrency(
                                coin.market_cap,
                              )}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          {/* =================================================
              MOBILE LIST
          ================================================== */}

          {!loading &&
            !error &&
            filteredMarkets.length > 0 && (
              <div className="space-y-2 p-3 md:hidden">
                {filteredMarkets.map((coin, index) => {
                  const change =
                    coin.price_change_percentage_24h ?? 0;

                  const positive = change >= 0;

                  return (
                    <motion.div
                      key={coin.id}
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.25,
                        delay: Math.min(index * 0.015, 0.5),
                      }}
                      className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="w-5 text-[10px] text-slate-600">
                            {coin.market_cap_rank ??
                              index + 1}
                          </span>

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025]">
                            <img
                              src={coin.image}
                              alt={coin.name}
                              className="h-6 w-6"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {coin.name}
                            </p>

                            <p className="mt-0.5 text-[10px] uppercase text-slate-600">
                              {coin.symbol}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-white">
                            {formatPrice(
                              coin.current_price,
                            )}
                          </p>

                          <p
                            className={`mt-1 text-xs font-semibold ${
                              positive
                                ? "text-emerald-400"
                                : "text-rose-400"
                            }`}
                          >
                            {positive ? "+" : ""}
                            {change.toFixed(2)}%
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.05] pt-3">
                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-slate-600">
                            24h Volume
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {formatCurrency(
                              coin.total_volume,
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] uppercase tracking-wider text-slate-600">
                            Market Cap
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {formatCurrency(
                              coin.market_cap,
                            )}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

          {/* No results */}

          {!loading &&
            !error &&
            filteredMarkets.length === 0 && (
              <div className="px-6 py-16 text-center">
                <Search className="mx-auto h-8 w-8 text-slate-700" />

                <h3 className="mt-4 text-sm font-semibold text-white">
                  No cryptocurrency found
                </h3>

                <p className="mt-2 text-xs text-slate-600">
                  Try searching for another coin or symbol.
                </p>
              </div>
            )}

          {/* =================================================
              FOOTER
          ================================================== */}

          <div className="flex flex-col gap-3 border-t border-white/[0.05] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

              <p className="text-[10px] text-slate-600">
                Market data refreshes automatically every 60 seconds.
              </p>
            </div>

            {lastUpdated && (
              <p className="text-[10px] text-slate-600">
                Last updated{" "}
                {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}