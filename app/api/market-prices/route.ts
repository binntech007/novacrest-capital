import { NextResponse } from "next/server";

type CoinPrice = {
  id: string;
  symbol: string;
  price: number;
  change24h: number;
};

const COINS = [
  {
    id: "bitcoin",
    symbol: "BTC/USD",
  },
  {
    id: "ethereum",
    symbol: "ETH/USD",
  },
];

export async function GET() {
  try {
    const ids = COINS.map((coin) => coin.id).join(",");

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: {
          Accept: "application/json",
        },
        next: {
          revalidate: 15,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Market API returned ${response.status}`
      );
    }

    const data = await response.json();

    const prices: CoinPrice[] = COINS.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol,
      price: Number(data?.[coin.id]?.usd ?? 0),
      change24h: Number(
        data?.[coin.id]?.usd_24h_change ?? 0
      ),
    }));

    return NextResponse.json(
      {
        success: true,
        prices,
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=15, stale-while-revalidate=30",
        },
      }
    );
  } catch (error) {
    console.error("MARKET PRICE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to retrieve live market prices.",
      },
      { status: 500 }
    );
  }
}