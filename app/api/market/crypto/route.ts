
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const url = new URL(
      "https://api.coingecko.com/api/v3/coins/markets",
    );

    url.searchParams.set("vs_currency", "usd");
    url.searchParams.set(
      "ids",
      "bitcoin,ethereum,solana,binancecoin,ripple,dogecoin,cardano,avalanche-2,tron,the-open-network",
    );
    url.searchParams.set("order", "market_cap_desc");
    url.searchParams.set("per_page", "10");
    url.searchParams.set("page", "1");
    url.searchParams.set("sparkline", "false");
    url.searchParams.set("price_change_percentage", "24h");

    const headers: HeadersInit = {
      Accept: "application/json",
    };

    const apiKey = process.env.COINGECKO_API_KEY;

    if (apiKey) {
      headers["x-cg-demo-api-key"] = apiKey;
    }

    const response = await fetch(url, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error(
        "Crypto market provider returned:",
        response.status,
      );

      return NextResponse.json(
        { error: "Market data provider is unavailable." },
        { status: 502 },
      );
    }

    const data = await response.json();

    const coins = data.map((coin: Record<string, unknown>) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      current_price: coin.current_price,
      price_change_percentage_24h:
        coin.price_change_percentage_24h,
      market_cap_rank: coin.market_cap_rank,
    }));

    return NextResponse.json(coins, {
      headers: {
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Crypto market request failed:", error);

    return NextResponse.json(
      { error: "Unable to retrieve crypto prices." },
      { status: 502 },
    );
  }
}
