import { NextResponse } from "next/server";

const stocks = [
  { symbol: "7203.T", name: "トヨタ自動車", category: "日本株", price: 3200, change: 45.5, changePercent: 1.44, currency: "JPY" },
  { symbol: "6758.T", name: "ソニーグループ", category: "日本株", price: 2850, change: -12.0, changePercent: -0.42, currency: "JPY" },
  { symbol: "9984.T", name: "ソフトバンクG", category: "日本株", price: 9120, change: 88.0, changePercent: 0.97, currency: "JPY" },
  { symbol: "6861.T", name: "キーエンス", category: "日本株", price: 65800, change: -320.0, changePercent: -0.48, currency: "JPY" },
  { symbol: "8306.T", name: "三菱UFJ FG", category: "日本株", price: 1520, change: 18.5, changePercent: 1.23, currency: "JPY" },
  { symbol: "AAPL", name: "Apple", category: "米国株", price: 189.50, change: 2.30, changePercent: 1.23, currency: "USD" },
  { symbol: "MSFT", name: "Microsoft", category: "米国株", price: 415.20, change: -3.10, changePercent: -0.74, currency: "USD" },
  { symbol: "NVDA", name: "NVIDIA", category: "米国株", price: 875.40, change: 15.60, changePercent: 1.82, currency: "USD" },
  { symbol: "AMZN", name: "Amazon", category: "米国株", price: 182.30, change: 1.20, changePercent: 0.66, currency: "USD" },
  { symbol: "GOOGL", name: "Alphabet", category: "米国株", price: 165.80, change: -0.90, changePercent: -0.54, currency: "USD" },
  { symbol: "^N225", name: "日経平均", category: "指数", price: 38500, change: 320.0, changePercent: 0.84, currency: "JPY" },
  { symbol: "^GSPC", name: "S&P500", category: "指数", price: 5218.0, change: -12.5, changePercent: -0.24, currency: "USD" },
  { symbol: "1306.T", name: "TOPIX ETF", category: "ETF", price: 2680, change: 22.0, changePercent: 0.83, currency: "JPY" },
  { symbol: "2558.T", name: "S&P500 ETF", category: "ETF", price: 19850, change: -85.0, changePercent: -0.43, currency: "JPY" },
];

export async function GET() {
  return NextResponse.json({ stocks, updatedAt: new Date().toISOString() });
}
