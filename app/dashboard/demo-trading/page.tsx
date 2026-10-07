
"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  ChartNoAxesCombined,
  Clock3,
  RefreshCcw,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";

type MarketAsset = {
  symbol: string;
  name: string;
  price: number;
  change: number;
};

type Position = {
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
};

type Trade = {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
  price: number;
  total: number;
  time: string;
};

type TimeRange = "1H" | "1D" | "1W" | "1M" | "1Y";

const INITIAL_BALANCE = 10000;

const INITIAL_MARKETS: MarketAsset[] = [
  { symbol: "BTC/USD", name: "Bitcoin", price: 67500, change: 2.45 },
  { symbol: "ETH/USD", name: "Ethereum", price: 3520, change: 1.82 },
  { symbol: "SOL/USD", name: "Solana", price: 148.5, change: -0.74 },
  { symbol: "EUR/USD", name: "Euro / US Dollar", price: 1.0845, change: 0.32 },
  { symbol: "XAU/USD", name: "Gold", price: 2350, change: -0.28 },
];

const RANGE_LABELS: Record<TimeRange, string> = {
  "1H": "1 hour",
  "1D": "1 day",
  "1W": "1 week",
  "1M": "1 month",
  "1Y": "1 year",
};

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

function priceFormat(value: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

/**
 * Generates deterministic illustrative chart data.
 * Replace this with a real, authorized market-data feed
 * if you later need live prices.
 */
function makeChartData(
  market: MarketAsset,
  range: TimeRange,
): number[] {
  const seed = market.symbol
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  const points = 48;
  const rangeFactor: Record<TimeRange, number> = {
    "1H": 0.006,
    "1D": 0.018,
    "1W": 0.035,
    "1M": 0.07,
    "1Y": 0.14,
  };

  const volatility = rangeFactor[range];
  const direction = market.change >= 0 ? 1 : -1;

  return Array.from({ length: points }, (_, index) => {
    const progress = index / (points - 1);
    const wave1 = Math.sin(index * 0.42 + seed) * 0.32;
    const wave2 = Math.sin(index * 0.17 + seed * 0.3) * 0.42;
    const wave3 = Math.cos(index * 0.83 + seed * 0.2) * 0.13;
    const trend = (progress - 0.5) * direction * 0.6;
    const movement = wave1 + wave2 + wave3 + trend;

    return Math.max(
      market.price * 0.1,
      market.price * (1 + movement * volatility),
    );
  });
}

export default function DemoTradingPage() {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [selectedSymbol, setSelectedSymbol] = useState("BTC/USD");
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [orderAmount, setOrderAmount] = useState("500");
  const [positions, setPositions] = useState<Position[]>([]);
  const [history, setHistory] = useState<Trade[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [timeRange, setTimeRange] = useState<TimeRange>("1D");

  const markets = INITIAL_MARKETS;

  const selectedMarket =
    markets.find((market) => market.symbol === selectedSymbol) ??
    markets[0];

  const selectedPosition = positions.find(
    (position) => position.symbol === selectedSymbol,
  );

  const amount = Number(orderAmount);
  const validAmount =
    orderAmount.trim() !== "" &&
    Number.isFinite(amount) &&
    amount > 0;

  const quantity =
    validAmount && selectedMarket.price > 0
      ? amount / selectedMarket.price
      : 0;

  const chartData = useMemo(
    () => makeChartData(selectedMarket, timeRange),
    [selectedMarket, timeRange],
  );

  const marketValue = useMemo(
    () =>
      positions.reduce((total, position) => {
        const market = markets.find(
          (item) => item.symbol === position.symbol,
        );

        return (
          total +
          position.quantity *
            (market?.price ?? position.averagePrice)
        );
      }, 0),
    [positions, markets],
  );

  const unrealizedProfit = useMemo(
    () =>
      positions.reduce((total, position) => {
        const market = markets.find(
          (item) => item.symbol === position.symbol,
        );

        const currentPrice = market?.price ?? position.averagePrice;

        return (
          total +
          (currentPrice - position.averagePrice) * position.quantity
        );
      }, 0),
    [positions, markets],
  );

  function notify(text: string, type: "success" | "error") {
    setMessage(text);
    setMessageType(type);
  }

  function placeOrder() {
    setMessage("");

    if (!validAmount) {
      notify("Enter a valid order amount greater than zero.", "error");
      return;
    }

    if (side === "BUY") {
      if (amount > balance) {
        notify("Insufficient demo funds for this order.", "error");
        return;
      }

      setBalance((current) => current - amount);

      setPositions((current) => {
        const existing = current.find(
          (position) => position.symbol === selectedSymbol,
        );

        if (!existing) {
          return [
            ...current,
            {
              symbol: selectedSymbol,
              name: selectedMarket.name,
              quantity,
              averagePrice: selectedMarket.price,
            },
          ];
        }

        const newQuantity = existing.quantity + quantity;
        const newAveragePrice =
          (existing.quantity * existing.averagePrice +
            quantity * selectedMarket.price) /
          newQuantity;

        return current.map((position) =>
          position.symbol === selectedSymbol
            ? {
                ...position,
                quantity: newQuantity,
                averagePrice: newAveragePrice,
              }
            : position,
        );
      });
    } else {
      if (!selectedPosition || selectedPosition.quantity <= 0) {
        notify("You have no open position for this asset.", "error");
        return;
      }

      const quantityToSell = Math.min(
        quantity,
        selectedPosition.quantity,
      );

      const saleValue = quantityToSell * selectedMarket.price;

      setBalance((current) => current + saleValue);

      setPositions((current) =>
        current
          .map((position) =>
            position.symbol === selectedSymbol
              ? {
                  ...position,
                  quantity: Math.max(
                    0,
                    position.quantity - quantityToSell,
                  ),
                }
              : position,
          )
          .filter((position) => position.quantity > 1e-10),
      );
    }

    const executedQuantity =
      side === "SELL" && selectedPosition
        ? Math.min(quantity, selectedPosition.quantity)
        : quantity;

    const trade: Trade = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      symbol: selectedSymbol,
      side,
      quantity: executedQuantity,
      price: selectedMarket.price,
      total: executedQuantity * selectedMarket.price,
      time: new Date().toLocaleString(),
    };

    setHistory((current) => [trade, ...current]);

    notify(
      `${side === "BUY" ? "Buy" : "Sell"} order simulated successfully.`,
      "success",
    );
  }

  function resetDemoAccount() {
    const confirmed = window.confirm(
      "Reset the demo balance to $10,000 and clear all positions and history?",
    );

    if (!confirmed) return;

    setBalance(INITIAL_BALANCE);
    setPositions([]);
    setHistory([]);
    setOrderAmount("500");
    setSide("BUY");
    setMessage("");
  }

  return (
    <main className="min-h-screen space-y-7 bg-[#080d19] p-4 text-white sm:p-6 lg:p-8">
      {/* Header */}
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Simulation environment
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Demo Trading
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Practice trading with virtual funds in a simulated environment.
          </p>
        </div>

        <button
          type="button"
          onClick={resetDemoAccount}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08]"
        >
          <RefreshCcw className="h-4 w-4" />
          Reset demo account
        </button>
      </section>

      {/* Demo notice */}
      <section className="flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
        <div>
          <p className="text-sm font-semibold text-amber-200">
            Virtual funds only
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Chart prices and market changes are illustrative sample data,
            not live quotes. Orders do not involve real money.
          </p>
        </div>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Demo Cash Balance"
          value={money(balance)}
          description="Virtual funds available"
          icon={<Wallet className="h-5 w-5" />}
          color="text-cyan-300"
          iconBg="bg-cyan-400/10"
        />

        <SummaryCard
          title="Open Positions"
          value={String(positions.length)}
          description="Assets currently held"
          icon={<Activity className="h-5 w-5" />}
          color="text-violet-300"
          iconBg="bg-violet-400/10"
        />

        <SummaryCard
          title="Position Value"
          value={money(marketValue)}
          description="Illustrative market value"
          icon={<ChartNoAxesCombined className="h-5 w-5" />}
          color="text-blue-300"
          iconBg="bg-blue-400/10"
        />

        <SummaryCard
          title="Unrealized P/L"
          value={money(unrealizedProfit)}
          description="Illustrative open-position result"
          icon={
            unrealizedProfit >= 0 ? (
              <ArrowUpRight className="h-5 w-5" />
            ) : (
              <ArrowDownRight className="h-5 w-5" />
            )
          }
          color={
            unrealizedProfit >= 0
              ? "text-emerald-300"
              : "text-rose-300"
          }
          iconBg={
            unrealizedProfit >= 0
              ? "bg-emerald-400/10"
              : "bg-rose-400/10"
          }
        />
      </section>

      {/* Trading graph */}
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1424]">
        <div className="flex flex-col justify-between gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <ChartNoAxesCombined className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold">Trading chart</h2>
                <p className="mt-1 text-xs text-slate-500">
                  {selectedMarket.name} · {selectedMarket.symbol}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="text-2xl font-bold tracking-tight sm:text-3xl">
                {priceFormat(selectedMarket.price)}
              </span>

              <span
                className={`inline-flex items-center gap-1 text-sm font-medium ${
                  selectedMarket.change >= 0
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {selectedMarket.change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {selectedMarket.change >= 0 ? "+" : ""}
                {selectedMarket.change.toFixed(2)}%
              </span>

              <span className="text-xs text-slate-500">
                Sample price · Not live
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(Object.keys(RANGE_LABELS) as TimeRange[]).map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                aria-pressed={timeRange === range}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  timeRange === range
                    ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30"
                    : "bg-white/[0.03] text-slate-400 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 sm:p-6">
          <TradingChart
            data={chartData}
            positive={selectedMarket.change >= 0}
            symbol={selectedMarket.symbol}
            rangeLabel={RANGE_LABELS[timeRange]}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] px-5 py-4 text-xs text-slate-500">
          <span>Illustrative historical pattern</span>
          <span>Range: {RANGE_LABELS[timeRange]}</span>
        </div>
      </section>

      {/* Watchlist and order ticket */}
      <section className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1424]">
          <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
            <div>
              <h2 className="font-semibold">Market watchlist</h2>
              <p className="mt-1 text-xs text-slate-500">
                Illustrative prices
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-cyan-300" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[450px] text-left text-sm">
              <thead className="bg-white/[0.02] text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Asset</th>
                  <th className="px-5 py-3 text-right font-medium">
                    Sample price
                  </th>
                  <th className="px-5 py-3 text-right font-medium">
                    Change
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.05]">
                {markets.map((market) => (
                  <tr
                    key={market.symbol}
                    onClick={() => {
                      setSelectedSymbol(market.symbol);
                      setMessage("");
                    }}
                    className={`cursor-pointer transition hover:bg-white/[0.03] ${
                      selectedSymbol === market.symbol
                        ? "bg-cyan-400/[0.06]"
                        : ""
                    }`}
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">
                        {market.symbol}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {market.name}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-right text-slate-200">
                      {priceFormat(market.price)}
                    </td>

                    <td
                      className={`px-5 py-4 text-right font-medium ${
                        market.change >= 0
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      {market.change >= 0 ? "+" : ""}
                      {market.change.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order ticket */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0d1424] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">Order ticket</h2>
              <p className="mt-1 text-xs text-slate-500">
                Simulated market order
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-[#080d19] p-1">
            <button
              type="button"
              onClick={() => {
                setSide("BUY");
                setMessage("");
              }}
              className={`rounded-lg py-3 text-sm font-semibold ${
                side === "BUY"
                  ? "bg-emerald-500 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => {
                setSide("SELL");
                setMessage("");
              }}
              className={`rounded-lg py-3 text-sm font-semibold ${
                side === "SELL"
                  ? "bg-rose-500 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sell
            </button>
          </div>

          <div className="mt-5">
            <label
              htmlFor="asset"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Trading asset
            </label>

            <select
              id="asset"
              value={selectedSymbol}
              onChange={(event) => {
                setSelectedSymbol(event.target.value);
                setMessage("");
              }}
              className="w-full rounded-xl border border-white/10 bg-[#080d19] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
            >
              {markets.map((market) => (
                <option key={market.symbol} value={market.symbol}>
                  {market.symbol} — {market.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5">
            <label
              htmlFor="orderAmount"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Order value (USD)
            </label>

            <input
              id="orderAmount"
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              value={orderAmount}
              onChange={(event) => setOrderAmount(event.target.value)}
              placeholder="Enter order value"
              className="w-full rounded-xl border border-white/10 bg-[#080d19] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
            />

            <div className="mt-2 flex flex-wrap gap-2">
              {[100, 250, 500, 1000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setOrderAmount(String(preset))}
                  className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs text-slate-400 hover:border-cyan-400/30 hover:text-cyan-300"
                >
                  ${preset.toLocaleString("en-US")}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <InfoRow
              label="Sample price"
              value={`$${priceFormat(selectedMarket.price)}`}
            />
            <InfoRow
              label="Estimated quantity"
              value={quantity.toFixed(8)}
            />
            <InfoRow
              label="Available demo cash"
              value={money(balance)}
            />

            {side === "SELL" && (
              <InfoRow
                label="Position quantity"
                value={(selectedPosition?.quantity ?? 0).toFixed(8)}
              />
            )}
          </div>

          {message && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-4 rounded-xl border p-3 text-sm ${
                messageType === "success"
                  ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300"
                  : "border-rose-400/20 bg-rose-400/[0.06] text-rose-300"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={placeOrder}
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold text-white ${
              side === "BUY"
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-rose-600 hover:bg-rose-500"
            }`}
          >
            {side === "BUY" ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            Simulate {side === "BUY" ? "Buy" : "Sell"} Order
          </button>

          <p className="mt-3 text-center text-xs leading-5 text-slate-500">
            Virtual execution only. No real funds are transferred.
          </p>
        </div>
      </section>

      {/* Open positions */}
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1424]">
        <div className="border-b border-white/[0.06] p-5">
          <h2 className="font-semibold">Open positions</h2>
          <p className="mt-1 text-xs text-slate-500">
            Your simulated holdings
          </p>
        </div>

        {positions.length === 0 ? (
          <EmptyState
            title="No open positions"
            description="Choose an asset and simulate a buy order to see your position here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Asset</th>
                  <th className="px-5 py-3 text-right font-medium">Quantity</th>
                  <th className="px-5 py-3 text-right font-medium">Entry</th>
                  <th className="px-5 py-3 text-right font-medium">Sample price</th>
                  <th className="px-5 py-3 text-right font-medium">Unrealized P/L</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.05]">
                {positions.map((position) => {
                  const market = markets.find(
                    (item) => item.symbol === position.symbol,
                  );
                  const currentPrice =
                    market?.price ?? position.averagePrice;
                  const profit =
                    (currentPrice - position.averagePrice) *
                    position.quantity;

                  return (
                    <tr key={position.symbol}>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">
                          {position.symbol}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {position.name}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-right text-slate-300">
                        {position.quantity.toFixed(8)}
                      </td>
                      <td className="px-5 py-4 text-right text-slate-300">
                        ${priceFormat(position.averagePrice)}
                      </td>
                      <td className="px-5 py-4 text-right text-slate-300">
                        ${priceFormat(currentPrice)}
                      </td>
                      <td
                        className={`px-5 py-4 text-right font-semibold ${
                          profit >= 0
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {profit >= 0 ? "+" : ""}
                        {money(profit)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Trade history */}
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1424]">
        <div className="flex items-center justify-between border-b border-white/[0.06] p-5">
          <div>
            <h2 className="font-semibold">Trade history</h2>
            <p className="mt-1 text-xs text-slate-500">
              Simulated orders in this session
            </p>
          </div>
          <Clock3 className="h-5 w-5 text-slate-500" />
        </div>

        {history.length === 0 ? (
          <EmptyState
            title="No trades yet"
            description="Your simulated buy and sell orders will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Asset</th>
                  <th className="px-5 py-3 font-medium">Side</th>
                  <th className="px-5 py-3 text-right font-medium">Quantity</th>
                  <th className="px-5 py-3 text-right font-medium">Price</th>
                  <th className="px-5 py-3 text-right font-medium">Value</th>
                  <th className="px-5 py-3 font-medium">Time</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.05]">
                {history.map((trade) => (
                  <tr key={trade.id}>
                    <td className="px-5 py-4 font-medium text-white">
                      {trade.symbol}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${
                          trade.side === "BUY"
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-rose-400/10 text-rose-300"
                        }`}
                      >
                        {trade.side}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-slate-300">
                      {trade.quantity.toFixed(8)}
                    </td>
                    <td className="px-5 py-4 text-right text-slate-300">
                      ${priceFormat(trade.price)}
                    </td>
                    <td className="px-5 py-4 text-right text-slate-200">
                      {money(trade.total)}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">
                      {trade.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <Bot className="mt-0.5 h-5 w-5 shrink-0 text-violet-300" />
        <p className="text-xs leading-6 text-slate-500">
          This demo uses illustrative sample prices and temporary client-side
          state. The graph is not a live market feed, and balances and trade
          history reset when the page reloads. A persistent demo account
          requires server-side validation and separate database records.
        </p>
      </footer>
    </main>
  );
}

/* Responsive SVG chart — no chart library required. */
function TradingChart({
  data,
  positive,
  symbol,
  rangeLabel,
}: {
  data: number[];
  positive: boolean;
  symbol: string;
  rangeLabel: string;
}) {
  const width = 900;
  const height = 300;
  const paddingLeft = 12;
  const paddingRight = 82;
  const paddingTop = 18;
  const paddingBottom = 28;

  const values = data.length > 0 ? data : [0, 1];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = max - min || Math.abs(max * 0.01) || 1;
  const lower = min - spread * 0.15;
  const upper = max + spread * 0.15;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const coords = values.map((value, index) => ({
    x: paddingLeft + (index / Math.max(values.length - 1, 1)) * chartWidth,
    y:
      paddingTop +
      ((upper - value) / (upper - lower)) * chartHeight,
    value,
  }));

  const linePoints = coords.map((point) => `${point.x},${point.y}`).join(" ");
  const first = coords[0];
  const last = coords[coords.length - 1];

  const areaPoints = [
    `${first.x},${height - paddingBottom}`,
    ...coords.map((point) => `${point.x},${point.y}`),
    `${last.x},${height - paddingBottom}`,
  ].join(" ");

  const lineColor = positive ? "#34d399" : "#fb7185";
  const gradientId = `chart-gradient-${symbol.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span>Price (illustrative)</span>
        <span>{rangeLabel} · {symbol}</span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Illustrative ${rangeLabel} trading graph for ${symbol}`}
        className="block h-auto w-full overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines and right-side labels */}
        {Array.from({ length: 5 }, (_, index) => {
          const y = paddingTop + (chartHeight / 4) * index;
          const value = upper - ((upper - lower) / 4) * index;

          return (
            <g key={index}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#ffffff"
                strokeOpacity="0.07"
                strokeDasharray="4 6"
              />
              <text
                x={width - paddingRight + 10}
                y={y + 4}
                fill="#64748b"
                fontSize="11"
              >
                {priceFormat(value)}
              </text>
            </g>
          );
        })}

        {/* Filled area under the line */}
        <polygon
          points={areaPoints}
          fill={`url(#${gradientId})`}
        />

        {/* Price line */}
        <polyline
          points={linePoints}
          fill="none"
          stroke={lineColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Latest price marker */}
        <line
          x1={last.x}
          y1={last.y}
          x2={width - paddingRight}
          y2={last.y}
          stroke={lineColor}
          strokeOpacity="0.65"
          strokeDasharray="4 4"
        />

        <circle
          cx={last.x}
          cy={last.y}
          r="5"
          fill={lineColor}
          stroke="#0d1424"
          strokeWidth="2"
        />

        {/* Time-axis labels */}
        {["Start", "25%", "50%", "75%", "Now"].map((label, index) => (
          <text
            key={label}
            x={paddingLeft + (chartWidth / 4) * index}
            y={height - 7}
            textAnchor={
              index === 0 ? "start" : index === 4 ? "end" : "middle"
            }
            fill="#64748b"
            fontSize="11"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon,
  color,
  iconBg,
}: {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  color: string;
  iconBg: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#111a2b] to-[#0a1020] p-5 shadow-lg shadow-black/10">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-3 break-words text-2xl font-bold tracking-tight text-white">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg} ${color}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="break-all text-right text-slate-200">{value}</span>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center px-5 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-500">
        <Activity className="h-6 w-6" />
      </div>

      <h3 className="mt-4 font-semibold text-slate-200">{title}</h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
