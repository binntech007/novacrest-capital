import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/coins/markets";

export async function GET() {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;

    const url = new URL(COINGECKO_URL);

    url.searchParams.set("vs_currency", "usd");
    url.searchParams.set("order", "market_cap_desc");
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", "1");
    url.searchParams.set("sparkline", "false");
    url.searchParams.set("price_change_percentage", "24h");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(apiKey
          ? {
              "x-cg-demo-api-key": apiKey,
            }
          : {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("CoinGecko error:", errorText);

      return NextResponse.json(
        {
          error: "Unable to retrieve cryptocurrency market data.",
        },
        {
          status: response.status,
        },
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Crypto market API error:", error);

    return NextResponse.json(
      {
        error: "Failed to retrieve cryptocurrency market data.",
      },
      {
        status: 500,
      },
    );
  }
}