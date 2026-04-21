import { NextResponse } from "next/server";

export const revalidate = 60;

const SYMBOLS = [
  { symbol: "7203.T", name: "トヨタ自動車", category: "日本株" },
  { symbol: "6758.T", name: "ソニーグループ", category: "日本株" },
  { symbol: "9984.T", name: "ソフトバンクG", category: "日本株" },
  { symbol: "6861.T", name: "キーエンス", category: "日本株" },
  { symbol: "8306.T", name: "三菱UFJ FG", category: "日本株" },
  { symbol: "AAPL", name: "Apple", category: "米国株" },
  { symbol: "MSFT", name: "Microsoft", category: "米国株" },
  { symbol: "NVDA", name: "NVIDIA", category: "米国株" },
  { symbol: "AMZN", name: "Amazon", category: "米国株" },
  { symbol: "GOOGL", name: "Alphabet", category: "米国株" },
  { symbol: "^N225", name: "日経平均", category: "指数" },
  { symbol: "^GSPC", name: "S&P500", category: "指数" },
  { symbol: "1306.T", name: "TOPIX ETF", category: "ETF" },
  { symbol: "2558.T", name: "S&P500 ETF", category: "ETF" },
];

export async function GET() {
  try {
    const symbolList = SYMBOLS.map((s) => s.symbol).join(",");
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolList}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,currency`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`Yahoo Finance API error: ${res.status}`);

    const json = await res.json();
    const quotes = json?.quoteResponse?.result ?? [];

    const stocks = SYMBOLS.map((s) => {
      const q = quotes.find((r: { symbol: string }) => r.symbol === s.symbol);
      return {
        symbol: s.symbol,
        name: s.name,
        category: s.category,
        price: q?.regularMarketPrice ?? null,
        change: q?.regularMarketChange ?? null,
        changePercent: q?.regularMarketChangePercent ?? null,
        currency: q?.currency ?? (s.symbol.endsWith(".T") ? "JPY" : "USD"),
      };
    });

    return NextResponse.json({ stocks, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.error("Stock API error:", err);
    return NextResponse.json(
      { error: "株価データの取得に失敗しました", stocks: [] },
      { status: 500 }
    );
  }
}