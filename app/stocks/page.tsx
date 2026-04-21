"use client";

import { useEffect, useState, useCallback } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface StockData {
  symbol: string;
  name: string;
  category: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  currency: string;
}

const CATEGORIES = ["すべて", "日本株", "米国株", "指数", "ETF"];

function formatPrice(price: number | null, currency: string): string {
  if (price === null) return "---";
  if (currency === "JPY") {
    return price.toLocaleString("ja-JP", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });
  }
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatChange(val: number | null): string {
  if (val === null) return "---";
  const sign = val >= 0 ? "+" : "";
  return `${sign}${val.toFixed(2)}`;
}

function formatPercent(val: number | null): string {
  if (val === null) return "---";
  const sign = val >= 0 ? "+" : "";
  return `${sign}${val.toFixed(2)}%`;
}

export default function StocksPage() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("すべて");

  const fetchStocks = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/stocks");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStocks(data.stocks);
      setUpdatedAt(data.updatedAt);
    } catch (err) {
      setError("株価データの取得に失敗しました。しばらくしてから再試行してください。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
    const timer = setInterval(fetchStocks, 60000);
    return () => clearInterval(timer);
  }, [fetchStocks]);

  const filtered =
    selectedCategory === "すべて"
      ? stocks
      : stocks.filter((s) => s.category === selectedCategory);

  const risingCount = filtered.filter(
    (s) => s.changePercent !== null && s.changePercent >= 0
  ).length;
  const fallingCount = filtered.filter(
    (s) => s.changePercent !== null && s.changePercent < 0
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">株価・指数</h1>
              <p className="text-gray-500 text-sm">日本株・米国株・指数のリアルタイム株価</p>
            </div>
            <button
              onClick={fetchStocks}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-all disabled:opacity-50"
            >
              <svg className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              更新
            </button>
          </div>
          {updatedAt && (
            <p className="text-xs text-gray-400 mt-2">
              最終更新: {new Date(updatedAt).toLocaleTimeString("ja-JP")} · 次の自動更新まで約60秒
            </p>
          )}
        </div>

        {!loading && stocks.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="text-xs text-gray-400 mb-1">銘柄数</div>
              <div className="text-2xl font-bold text-gray-900">{filtered.length}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="text-xs text-gray-400 mb-1">上昇</div>
              <div className="text-2xl font-bold text-green-600">{risingCount}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="text-xs text-gray-400 mb-1">下落</div>
              <div className="text-2xl font-bold text-red-500">{fallingCount}</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="text-xs text-gray-400 mb-1">市場の雰囲気</div>
              <div className={`text-lg font-bold ${risingCount >= fallingCount ? "text-green-600" : "text-red-500"}`}>
                {risingCount >= fallingCount ? "📈 強気" : "📉 弱気"}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid gap-3 sm:grid-cols-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-16 bg-gray-100 rounded" />
                  </div>
                  <div className="h-7 w-20 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="grid gap-3 sm:grid-cols-2">
            {filtered.map((stock) => {
              const isUp = stock.changePercent !== null && stock.changePercent >= 0;
              const isDown = stock.changePercent !== null && stock.changePercent < 0;
              const noData = stock.price === null;
              return (
                <div
                  key={stock.symbol}
                  className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-sm ${
                    noData ? "border-gray-200 opacity-60" : isUp ? "border-green-100 hover:border-green-300" : "border-red-100 hover:border-red-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-base font-bold text-gray-900 truncate">{stock.name}</span>
                        <span className="shrink-0 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{stock.category}</span>
                      </div>
                      <div className="text-xs text-gray-400">{stock.symbol}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl font-bold text-gray-900">
                        {formatPrice(stock.price, stock.currency)}
                        <span className="text-xs font-normal text-gray-400 ml-1">{stock.currency}</span>
                      </div>
                      <div className={`text-sm font-medium mt-0.5 ${isUp ? "text-green-600" : isDown ? "text-red-500" : "text-gray-400"}`}>
                        {formatChange(stock.change)} <span className="font-bold">({formatPercent(stock.changePercent)})</span>
                      </div>
                    </div>
                  </div>
                  {!noData && (
                    <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isUp ? "bg-green-400" : "bg-red-400"}`}
                        style={{
                          width: `${Math.min(Math.abs(stock.changePercent ?? 0) * 10, 100)}%`,
                          marginLeft: isUp ? "50%" : undefined,
                          float: isDown ? "right" : undefined,
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl text-xs text-yellow-800">
          <span className="font-bold">免責事項：</span>
          掲載している株価データはYahoo Financeから取得しており、最大15〜20分の遅延がある場合があります。投資判断は必ずご自身の責任のもとで行ってください。
        </div>
      </div>
      <Footer />
    </div>
  );
}