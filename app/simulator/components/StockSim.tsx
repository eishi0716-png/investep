"use client";
import { useState } from "react";

type Candle = { open: number; close: number; high: number; low: number };

const BASE_PRICE: Record<string, number> = {
  "7203": 3200, "6758": 12800, "9984": 7400,
  "6861": 65000, "AAPL": 21500, "NVDA": 98000, "MSFT": 45000,
};

function generateCandles(base: number, count: number, volatility: number): Candle[] {
  const candles: Candle[] = [];
  let price = base * (0.88 + Math.random() * 0.04);
  for (let i = 0; i < count; i++) {
    const open = price;
    const change = (Math.random() - 0.48) * volatility;
    const close = Math.max(open + change, open * 0.9);
    const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.3 / base);
    const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.3 / base);
    candles.push({
      open: Math.round(open),
      close: Math.round(close),
      high: Math.round(high),
      low: Math.round(low),
    });
    price = close;
  }
  return candles;
}

type TimeFrame = "15m" | "1d" | "1w";

const TIME_FRAMES: { id: TimeFrame; label: string; count: number; volatility: number; labelFn: (i: number, count: number) => string }[] = [
  {
    id: "15m", label: "15分足", count: 16, volatility: 0.008,
    labelFn: (i, count) => {
      const labels = ["9:00","9:15","9:30","9:45","10:00","10:15","10:30","10:45","11:00","11:15","11:30","12:30","12:45","13:00","13:15","13:30"];
      return labels[i] || "";
    },
  },
  {
    id: "1d", label: "日足", count: 20, volatility: 0.025,
    labelFn: (i, count) => {
      if (i === 0) return "20日前";
      if (i === count - 1) return "今日";
      if (i % 5 === 0) return `${count - 1 - i}日前`;
      return "";
    },
  },
  {
    id: "1w", label: "週足", count: 12, volatility: 0.06,
    labelFn: (i, count) => {
      if (i === 0) return "12週前";
      if (i === count - 1) return "今週";
      if (i % 3 === 0) return `${count - 1 - i}週前`;
      return "";
    },
  },
];

const stocks = [
  { id: "7203", name: "トヨタ自動車", price: 3200, change: 1.2 },
  { id: "6758", name: "ソニーグループ", price: 12800, change: -0.8 },
  { id: "9984", name: "ソフトバンクG", price: 7400, change: 2.1 },
  { id: "6861", name: "キーエンス", price: 65000, change: 0.5 },
  { id: "AAPL", name: "Apple", price: 21500, change: 0.9 },
  { id: "NVDA", name: "NVIDIA", price: 98000, change: 3.2 },
  { id: "MSFT", name: "Microsoft", price: 45000, change: -0.4 },
];

const W = 640;
const H = 280;
const PAD = { top: 20, right: 20, bottom: 30, left: 70 };

function CandlestickChart({ data, name, labelFn }: { data: Candle[]; name: string; labelFn: (i: number, count: number) => string }) {
  const allValues = data.flatMap((d) => [d.high, d.low]);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const range = maxVal - minVal || 1;
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const toY = (v: number) => PAD.top + chartH - ((v - minVal) / range) * chartH;
  const candleW = Math.max(Math.floor(chartW / data.length) - 3, 3);
  const spacing = chartW / data.length;
  const yTicks = 5;
  const tickValues = Array.from({ length: yTicks }, (_, i) =>
    Math.round(minVal + (range / (yTicks - 1)) * i)
  );
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ background: "#111827", borderRadius: 12 }}>
      {tickValues.map((v, i) => (
        <g key={i}>
          <line x1={PAD.left} y1={toY(v)} x2={W - PAD.right} y2={toY(v)} stroke="#374151" strokeWidth="0.5" strokeDasharray="4 4" />
          <text x={PAD.left - 6} y={toY(v)} textAnchor="end" dominantBaseline="central" fill="#9CA3AF" fontSize="10">
            {v >= 10000 ? (v / 1000).toFixed(0) + "k" : v.toLocaleString()}
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const x = PAD.left + spacing * i + spacing / 2;
        const isUp = d.close >= d.open;
        const color = isUp ? "#22c55e" : "#ef4444";
        const bodyTop = toY(Math.max(d.open, d.close));
        const bodyBot = toY(Math.min(d.open, d.close));
        const bodyH = Math.max(bodyBot - bodyTop, 1);
        return (
          <g key={i}>
            <line x1={x} y1={toY(d.high)} x2={x} y2={bodyTop} stroke={color} strokeWidth="1.5" />
            <line x1={x} y1={bodyBot} x2={x} y2={toY(d.low)} stroke={color} strokeWidth="1.5" />
            <rect x={x - candleW / 2} y={bodyTop} width={candleW} height={bodyH} fill={color} stroke={color} strokeWidth="1" opacity={isUp ? 1 : 0.85} />
          </g>
        );
      })}
      {data.map((_, i) => {
        const label = labelFn(i, data.length);
        if (!label) return null;
        return (
          <text key={i} x={PAD.left + spacing * i + spacing / 2} y={H - 8} textAnchor="middle" fill="#6B7280" fontSize="10">{label}</text>
        );
      })}
      <text x={PAD.left} y={14} fill="#E5E7EB" fontSize="11" fontWeight="bold">{name}</text>
    </svg>
  );
}

function HowToReadChart({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">📊 ローソク足チャートの見方</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
        </div>
        <div className="bg-gray-900 rounded-2xl p-4 mb-5 flex justify-center gap-12">
          <div className="flex flex-col items-center gap-1">
            <svg width="60" height="120" viewBox="0 0 60 120">
              <line x1="30" y1="5" x2="30" y2="25" stroke="#22c55e" strokeWidth="2"/>
              <rect x="15" y="25" width="30" height="50" fill="#22c55e" rx="2"/>
              <line x1="30" y1="75" x2="30" y2="110" stroke="#22c55e" strokeWidth="2"/>
              <text x="30" y="8" textAnchor="middle" fill="#22c55e" fontSize="9">高値</text>
              <text x="52" y="30" textAnchor="start" fill="#9CA3AF" fontSize="8">始値</text>
              <text x="52" y="72" textAnchor="start" fill="#9CA3AF" fontSize="8">終値</text>
              <text x="30" y="118" textAnchor="middle" fill="#22c55e" fontSize="9">安値</text>
            </svg>
            <span className="text-green-500 text-sm font-bold">陽線（上昇）</span>
            <span className="text-gray-500 text-xs">終値 ＞ 始値</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <svg width="60" height="120" viewBox="0 0 60 120">
              <line x1="30" y1="5" x2="30" y2="25" stroke="#ef4444" strokeWidth="2"/>
              <rect x="15" y="25" width="30" height="50" fill="#ef4444" rx="2" opacity="0.85"/>
              <line x1="30" y1="75" x2="30" y2="110" stroke="#ef4444" strokeWidth="2"/>
              <text x="30" y="8" textAnchor="middle" fill="#ef4444" fontSize="9">高値</text>
              <text x="52" y="30" textAnchor="start" fill="#9CA3AF" fontSize="8">始値</text>
              <text x="52" y="72" textAnchor="start" fill="#9CA3AF" fontSize="8">終値</text>
              <text x="30" y="118" textAnchor="middle" fill="#ef4444" fontSize="9">安値</text>
            </svg>
            <span className="text-red-500 text-sm font-bold">陰線（下落）</span>
            <span className="text-gray-500 text-xs">終値 ＜ 始値</span>
          </div>
        </div>
        <div className="space-y-3 mb-5">
          <div className="flex gap-3 items-start bg-gray-50 rounded-xl p-3">
            <span className="text-lg">📌</span>
            <div>
              <p className="text-sm font-bold text-gray-900">ローソク足とは？</p>
              <p className="text-xs text-gray-600 mt-0.5">1本のローソクで「始値・高値・安値・終値」の4つの価格を表します。</p>
            </div>
          </div>
          <div className="flex gap-3 items-start bg-green-50 rounded-xl p-3">
            <span className="text-lg">🟩</span>
            <div>
              <p className="text-sm font-bold text-gray-900">緑（陽線）＝上昇した</p>
              <p className="text-xs text-gray-600 mt-0.5">終わりの価格が始まりより高かった＝株価が上がった期間です。</p>
            </div>
          </div>
          <div className="flex gap-3 items-start bg-red-50 rounded-xl p-3">
            <span className="text-lg">🟥</span>
            <div>
              <p className="text-sm font-bold text-gray-900">赤（陰線）＝下落した</p>
              <p className="text-xs text-gray-600 mt-0.5">終わりの価格が始まりより低かった＝株価が下がった期間です。</p>
            </div>
          </div>
          <div className="flex gap-3 items-start bg-blue-50 rounded-xl p-3">
            <span className="text-lg">⏱️</span>
            <div>
              <p className="text-sm font-bold text-gray-900">時間軸について</p>
              <p className="text-xs text-gray-600 mt-0.5">15分足＝15分ごと、日足＝1日ごと、週足＝1週間ごとの値動きを表します。</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
          わかった！チャートを見る
        </button>
      </div>
    </div>
  );
}

export default function StockSim() {
  const [cash, setCash] = useState(1000000);
  const [holdings, setHoldings] = useState<{ [key: string]: number }>({});
  const [message, setMessage] = useState("");
  const [selectedStockId, setSelectedStockId] = useState(stocks[0].id);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("1d");
  const [showGuide, setShowGuide] = useState(false);

  const selectedStock = stocks.find((s) => s.id === selectedStockId) || stocks[0];
  const tf = TIME_FRAMES.find((t) => t.id === timeFrame)!;
  const chartData = generateCandles(BASE_PRICE[selectedStockId], tf.count, tf.volatility * BASE_PRICE[selectedStockId]);

  const buy = (stock: typeof stocks[0]) => {
    if (cash < stock.price) { setMessage("資金が足りません。"); return; }
    setCash((c) => c - stock.price);
    setHoldings((h) => ({ ...h, [stock.id]: (h[stock.id] || 0) + 1 }));
    setMessage(stock.name + "を1株購入しました。");
  };

  const sell = (stock: typeof stocks[0]) => {
    if (!holdings[stock.id] || holdings[stock.id] === 0) { setMessage("保有株がありません。"); return; }
    setCash((c) => c + stock.price);
    setHoldings((h) => ({ ...h, [stock.id]: h[stock.id] - 1 }));
    setMessage(stock.name + "を1株売却しました。");
  };

  const totalAsset = cash + stocks.reduce((sum, s) => sum + (holdings[s.id] || 0) * s.price, 0);
  const profit = totalAsset - 1000000;

  return (
    <div>
      {showGuide && <HowToReadChart onClose={() => setShowGuide(false)} />}

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 text-sm text-blue-700">
        株式投資とは：個別企業の株を売買して値上がり益や配当金を狙う投資方法です。
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-400 mb-1">保有現金</p>
          <p className="text-2xl font-bold text-gray-900">¥{cash.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-400 mb-1">総資産</p>
          <p className="text-2xl font-bold text-blue-600">¥{totalAsset.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-400 mb-1">損益</p>
          <p className={"text-2xl font-bold " + (profit >= 0 ? "text-green-600" : "text-red-500")}>
            {profit >= 0 ? "+" : ""}¥{profit.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="rounded-2xl p-6 border border-gray-800 shadow-sm mb-8" style={{background:"#111827"}}>
        {/* チャートヘッダー */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white">株価チャート</h2>
            <button
              onClick={() => setShowGuide(true)}
              className="flex items-center gap-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full transition-all border border-blue-500/30"
            >
              📖 チャートの見方
            </button>
          </div>
          <select
            value={selectedStockId}
            onChange={(e) => setSelectedStockId(e.target.value)}
            className="border border-gray-600 rounded-lg px-3 py-1 text-sm text-white bg-gray-800"
          >
            {stocks.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {/* 時間軸ボタン */}
        <div className="flex gap-2 mb-4">
          {TIME_FRAMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeFrame(t.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                timeFrame === t.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <CandlestickChart data={chartData} name={selectedStock.name} labelFn={tf.labelFn} />

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{background:"#22c55e"}}></span><span className="text-xs text-gray-400">陽線（上昇）</span></div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{background:"#ef4444"}}></span><span className="text-xs text-gray-400">陰線（下落）</span></div>
        </div>
      </div>

      {message && <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-3 rounded-xl mb-4">{message}</div>}

      <div className="grid grid-cols-1 gap-4">
        {stocks.map((stock) => (
          <div key={stock.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{stock.name}</p>
              <p className="text-xs text-gray-400">{stock.id}</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900">¥{stock.price.toLocaleString()}</p>
              <p className={"text-xs font-medium " + (stock.change >= 0 ? "text-green-600" : "text-red-500")}>
                {stock.change >= 0 ? "+" : ""}{stock.change}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">保有数</p>
              <p className="font-bold text-gray-900">{holdings[stock.id] || 0}株</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => buy(stock)} className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">買う</button>
              <button onClick={() => sell(stock)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">売る</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
