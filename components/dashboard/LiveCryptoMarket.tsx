
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap_rank: number | null;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: price < 1 ? 6 : 2,
  }).format(price);
}

export default function LiveCryptoMarket() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const fetchCoins = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);

    try {
      setError("");

      const response = await fetch(
        "/api/market/crypto",
        { cache: "no-store" },
      );

      if (!response.ok) {
        throw new Error("Unable to load crypto market prices.");
      }

      const data: Coin[] = await response.json();

      setCoins(data);
      setUpdatedAt(new Date());
    } catch {
      setError("Market prices are temporarily unavailable.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchCoins();

    const interval = window.setInterval(() => {
      void fetchCoins();
    }, 60_000);

    return () => window.clearInterval(interval);
  }, [fetchCoins]);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0c1424]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-500/10 p-2.5">
            <Activity className="h-5 w-5 text-emerald-400" />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              Live Crypto Market
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Cryptocurrency prices in USD
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void fetchCoins(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={
              refreshing ? "animate-spin" : ""
            }
          />
          Refresh
        </button>
      </div>

      <div className="p-5">
        {updatedAt && (
          <p className="mb-4 text-xs text-slate-500">
            Last fetched: {updatedAt.toLocaleTimeString()}
          </p>
        )}

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded-xl bg-slate-800/60"
              />
            ))}
          </div>
        ) : error && coins.length === 0 ? (
          <div
            role="alert"
            className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5 text-sm text-rose-300"
          >
            {error}
            <button
              type="button"
              onClick={() => void fetchCoins(true)}
              className="ml-2 underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {error && (
              <p className="mb-3 text-xs text-amber-400">
                Refresh failed. Showing the last successfully fetched prices.
              </p>
            )}

            <div className="space-y-1">
              {coins.map((coin) => {
                const change =
                  coin.price_change_percentage_24h;
                const positive = (change ?? 0) >= 0;

                return (
                  <div
                    key={coin.id}
                    className="flex items-center gap-3 rounded-xl px-2 py-4 transition hover:bg-white/[0.03] sm:px-3"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-800">
                      <img
                        src={coin.image}
                        alt=""
                        className="h-8 w-8"
                        loading="lazy"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {coin.name}
                      </p>
                      <p className="mt-1 text-xs uppercase text-slate-500">
                        {coin.symbol}
                        {coin.market_cap_rank
                          ? ` · Rank #${coin.market_cap_rank}`
                          : ""}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold tabular-nums text-white">
                        {formatPrice(coin.current_price)}
                      </p>

                      <p
                        className={`mt-1 inline-flex items-center justify-end gap-1 text-xs tabular-nums ${
                          change == null
                            ? "text-slate-400"
                            : positive
                              ? "text-emerald-400"
                              : "text-rose-400"
                        }`}
                      >
                        {change == null ? (
                          "Change unavailable"
                        ) : (
                          <>
                            {positive ? (
                              <TrendingUp size={13} />
                            ) : (
                              <TrendingDown size={13} />
                            )}
                            {positive ? "+" : ""}
                            {change.toFixed(2)}%
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-4 border-t border-slate-800 pt-4 text-xs leading-5 text-slate-500">
              Market data is informational and may be delayed.
              Prices are not quotes for executing trades.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
