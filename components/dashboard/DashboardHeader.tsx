"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Bell,
  Menu,
  ChevronDown,
  UserRound,
  Settings,
  LogOut,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";

type DashboardHeaderProps = {
  name: string;
  image?: string | null;
  onMenuClick: () => void;
};

type MarketItem = {
  symbol: string;
  price: number;
  change: number;
};

const initialMarkets: MarketItem[] = [
  {
    symbol: "BTC/USD",
    price: 0,
    change: 0,
  },
  {
    symbol: "ETH/USD",
    price: 0,
    change: 0,
  },
];

function formatPrice(price: number) {
  if (price === 0) {
    return "Loading...";
  }

  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function DashboardHeader({
  name,
  image,
  onMenuClick,
}: DashboardHeaderProps) {
  const router = useRouter();

  const [markets, setMarkets] =
    useState<MarketItem[]>(initialMarkets);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [imageFailed, setImageFailed] =
    useState(false);

  const [marketError, setMarketError] =
    useState(false);

  const firstName =
    name.trim().split(/\s+/)[0] || "Customer";

  const initials =
    firstName.charAt(0).toUpperCase();

  /*
   * Load real market prices from our API.
   *
   * The API endpoint:
   *
   * /api/market-prices
   *
   * refreshes the market data every 15 seconds.
   */
  useEffect(() => {
    let cancelled = false;

    const loadMarketPrices = async () => {
      try {
        const response = await fetch(
          "/api/market-prices",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load market prices."
          );
        }

        const data = await response.json();

        if (
          !cancelled &&
          data?.success &&
          Array.isArray(data.prices)
        ) {
          const updatedMarkets: MarketItem[] =
            data.prices.map(
              (item: {
                symbol: string;
                price: number;
                change24h: number;
              }) => ({
                symbol: item.symbol,
                price: Number(item.price) || 0,
                change:
                  Number(item.change24h) || 0,
              })
            );

          setMarkets(updatedMarkets);
          setMarketError(false);
        }
      } catch (error) {
        console.error(
          "Failed to fetch live market prices:",
          error
        );

        if (!cancelled) {
          setMarketError(true);
        }
      }
    };

    loadMarketPrices();

    const interval = window.setInterval(
      loadMarketPrices,
      15000
    );

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  /*
   * Reset image error state whenever
   * the profile image changes.
   */
  useEffect(() => {
    setImageFailed(false);
  }, [image]);

  /*
   * Mobile back navigation.
   */
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#080d19]/95 backdrop-blur-xl">
      {/* =========================================================
          MARKET TICKER
      ========================================================= */}

      <div className="overflow-hidden border-b border-white/5 bg-[#060a13]">
        <div className="flex h-9 items-center gap-3 px-4 sm:px-6 lg:px-10">
          {/* MARKET WATCH LABEL */}

          <div className="flex shrink-0 items-center gap-2 border-r border-white/10 pr-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              Market Watch
            </span>
          </div>

          {/* TICKER */}

          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="ticker-track flex w-max items-center">
              {[...markets, ...markets].map(
                (market, index) => {
                  const positive =
                    market.change >= 0;

                  return (
                    <div
                      key={`${market.symbol}-${index}`}
                      className="flex shrink-0 items-center gap-2 px-4"
                    >
                      <span className="text-xs font-semibold text-slate-300">
                        {market.symbol}
                      </span>

                      <span className="text-xs tabular-nums text-white">
                        {formatPrice(market.price)}
                      </span>

                      <span
                        className={`flex items-center gap-0.5 text-[11px] font-medium tabular-nums ${
                          positive
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {positive ? (
                          <TrendingUp size={12} />
                        ) : (
                          <TrendingDown size={12} />
                        )}

                        {positive ? "+" : ""}
                        {market.change.toFixed(2)}%
                      </span>

                      <span className="ml-2 text-slate-700">
                        •
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* MARKET ERROR */}

        {marketError && (
          <div className="sr-only">
            Unable to update live market prices.
          </div>
        )}
      </div>

      {/* =========================================================
          MAIN HEADER
      ========================================================= */}

      <div className="flex h-[72px] items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* =======================================================
            LEFT SIDE
        ======================================================= */}

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {/* MOBILE BACK BUTTON */}

          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            title="Go back"
            className="flex items-center justify-center rounded-xl border border-white/10 p-2.5 text-slate-300 transition hover:border-emerald-400/30 hover:bg-emerald-500/10 hover:text-white lg:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            aria-controls="customer-dashboard-sidebar"
            title="Open menu"
            className="flex items-center justify-center rounded-xl border border-white/10 p-2.5 text-slate-300 transition hover:border-emerald-400/30 hover:bg-emerald-500/10 hover:text-white lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* PAGE TITLE */}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Activity className="hidden h-4 w-4 text-emerald-400 sm:block" />

              <p className="truncate text-xs text-slate-500">
                Customer portal
              </p>
            </div>

            <h1 className="mt-0.5 truncate text-lg font-semibold text-white">
              Dashboard
            </h1>
          </div>
        </div>

        {/* =======================================================
            RIGHT SIDE
        ======================================================= */}

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          {/* MARKET STATUS */}

          <div className="hidden items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/5 px-3 py-2 xl:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

            <span className="text-xs text-emerald-300">
              Live markets
            </span>
          </div>

          {/* NOTIFICATIONS */}

          <Link
            href="/dashboard/notifications"
            aria-label="Notifications"
            title="Notifications"
            className="relative rounded-xl border border-white/10 p-2.5 text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
          >
            <Bell className="h-5 w-5" />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-[#080d19] bg-emerald-400" />
          </Link>

          {/* PROFILE */}

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setProfileOpen((open) => !open)
              }
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
              title="Profile menu"
              className="flex items-center gap-2 rounded-xl border border-white/10 p-1.5 transition hover:border-white/20 hover:bg-white/5 sm:gap-3 sm:pl-2"
            >
              {/* PROFILE IMAGE */}

              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-emerald-400/30 bg-emerald-500/15 text-sm font-semibold text-emerald-200">
                {image && !imageFailed ? (
                  <img
                    src={image}
                    alt={`${firstName}'s profile`}
                    className="h-full w-full object-cover"
                    onError={() =>
                      setImageFailed(true)
                    }
                  />
                ) : (
                  initials
                )}
              </div>

              {/* NAME */}

              <div className="hidden text-left sm:block">
                <p className="max-w-28 truncate text-sm font-medium text-white">
                  {firstName}
                </p>

                <p className="text-[11px] text-slate-500">
                  Customer
                </p>
              </div>

              <ChevronDown
                size={15}
                className={`hidden text-slate-400 transition sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* ===================================================
                PROFILE DROPDOWN
            =================================================== */}

            {profileOpen && (
              <>
                {/* BACKDROP */}

                <button
                  type="button"
                  aria-label="Close profile menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() =>
                    setProfileOpen(false)
                  }
                />

                {/* DROPDOWN */}

                <div className="absolute right-0 top-full z-50 mt-3 w-60 overflow-hidden rounded-2xl border border-slate-700 bg-[#0c1424] p-2 shadow-2xl shadow-black/40">
                  {/* USER INFO */}

                  <div className="flex items-center gap-3 border-b border-white/10 px-3 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-emerald-400/30 bg-emerald-500/15 text-sm font-semibold text-emerald-200">
                      {image && !imageFailed ? (
                        <img
                          src={image}
                          alt={`${firstName}'s profile`}
                          className="h-full w-full object-cover"
                          onError={() =>
                            setImageFailed(true)
                          }
                        />
                      ) : (
                        initials
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {name || "Customer"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Customer account
                      </p>
                    </div>
                  </div>

                  {/* MY PROFILE */}

                  <Link
                    href="/dashboard/settings"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                    className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <UserRound size={17} />

                    My profile
                  </Link>

                  {/* SETTINGS */}

                  <Link
                    href="/dashboard/settings"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <Settings size={17} />

                    Settings
                  </Link>

                  <div className="my-2 border-t border-white/10" />

                  {/* NOTIFICATIONS */}

                  <Link
                    href="/dashboard/notifications"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <Bell size={17} />

                    Notifications
                  </Link>

                  {/* SIGN OUT */}

                  <Link
                    href="/api/auth/signout"
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-rose-300 transition hover:bg-rose-500/10"
                  >
                    <LogOut size={17} />

                    Sign out
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          TICKER ANIMATION
      ========================================================= */}

      <style jsx>{`
        .ticker-track {
          animation: ticker-scroll 38s linear infinite;
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }

        @keyframes ticker-scroll {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none;
          }
        }
      `}</style>
    </header>
  );
}