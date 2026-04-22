"use client";
import { useState } from "react";

const stocks = [
  { id: "7203", name: "トヨタ自動車", price: 3200, change: 1.2, history: [
    { open: 2780, close: 2850, high: 2900, low: 2750 },
    { open: 2850, close: 2800, high: 2880, low: 2770 },
    { open: 2800, close: 2950, high: 2980, low: 2790 },
    { open: 2950, close: 2900, high: 2970, low: 2870 },
    { open: 2900, close: 3050, high: 3100, low: 2880 },
    { open: 3050, close: 2980, high: 3080, low: 2950 },
    { open: 2980, close: 3150, high: 3200, low: 2960 },
    { open: 3150, close: 3200, high: 3250, low: 3100 },
  ]},
  { id: "6758", name: "ソニーグループ", price: 12800, change: -0.8, history: [
    { open: 13300, close: 13100, high: 13400, low: 13050 },
    { open: 13100, close: 13200, high: 13250, low: 13000 },
    { open: 13200, close: 12950, high: 13220, low: 12900 },
    { open: 12950, close: 13100, high: 13150, low: 12900 },
    { open: 13100, close: 12750, high: 13120, low: 12700 },
    { open: 12750, close: 12650, high: 12800, low: 12600 },
    { open: 12650, close: 12820, high: 12850, low: 12620 },
    { open: 12820, close: 12800, high: 12870, low: 12750 },
  ]},
  { id: "9984", name: "ソフトバンクG", price: 7400, change: 2.1, history: [
    { open: 6780, close: 6900, high: 6950, low: 6750 },
    { open: 6900, close: 6850, high: 6930, low: 6820 },
    { open: 6850, close: 7050, high: 7100, low: 6830 },
    { open: 7050, close: 7150, high: 7200, low: 7020 },
    { open: 7150, close: 7050, high: 7180, low: 7000 },
    { open: 7050, close: 7250, high: 7300, low: 7030 },
    { open: 7250, close: 7350, high: 7400, low: 7220 },
    { open: 7350, close: 7400, high: 7450, low: 7320 },
  ]},
  { id: "6861", name: "キーエンス", price: 65000, change: 0.5, history: [
    { open: 61500, close: 62500, high: 63000, low: 61200 },
    { open: 62500, close: 62000, high: 62800, low: 61800 },
    { open: 62000, close: 63500, high: 64000, low: 61900 },
    { open: 63500, close: 63000, high: 63800, low: 62800 },
    { open: 63000, close: 64200, high: 64500, low: 62900 },
    { open: 64200, close: 64600, high: 64900, low: 64000 },
    { open: 64600, close: 64900, high: 65200, low: 64400 },
    { open: 64900, close: 65000, high: 65300, low: 64800 },
  ]},
  { id: "AAPL", name: "Apple", price: 21500, change: 0.9, history: [
    { open: 19800, close: 20200, high: 20400, low: 19700 },
    { open: 20200, close: 20100, high: 20350, low: 20000 },
    { open: 20100, close: 20800, high: 21000, low: 20050 },
    { open: 20800, close: 20600, high: 20900, low: 20500 },
    { open: 20600, close: 21100, high: 21200, low: 20550 },
    { open: 21100, close: 21300, high: 21400, low: 21000 },
    { open: 21300, close: 21200, high: 21450, low: 21100 },
    { open: 21200, close: 21500, high: 21600, low: 21150 },
  ]},
  { id: "NVDA", name: "NVIDIA", price: 98000, change: 3.2, history: [
    { open: 84000, close: 87000, high: 88000, low: 83500 },
    { open: 87000, close: 86000, high: 87500, low: 85500 },
    { open: 86000, close: 89500, high: 90000, low: 85800 },
    { open: 89500, close: 91500, high: 92000, low: 89200 },
    { open: 91500, close: 93500, high: 94000, low: 91200 },
    { open: 93500, close: 94500, high: 95000, low: 93200 },
    { open: 94500, close: 96500, high: 97000, low: 94200 },
    { open: 96500, close: 98000, high: 98500, low: 96200 },
  ]},
  { id: "MSFT", name: "Microsoft", price: 45000, change: -0.4, history: [
    { open: 43800, close: 44500, high: 44800, low: 43600 },
    { open: 44500, close: 44200, high: 44700, low: 44000 },
    { open: 44200, close: 45200, high: 45500, low: 44100 },
    { open: 45200, close: 45000, high: 45400, low: 44900 },
    { open: 45000, close: 45600, high: 45800, low: 44950 },
    { open: 45600, close: 45200, high: 45700, low: 45100 },
    { open: 45200, close: 45400, high: 45600, low: 45100 },
    { open: 45400, close: 45000, high: 45500, low: 44900 },
  ]},
];

const LABELS = ["8週前","7週前","6週前","5週前","4週前","3週前","2週前","今週"];
const W = 640;
const H = 280;
const PAD = { top: 20, right: 20, bottom: 30, left: 70 };

function CandlestickChart({ data, name }: { data: typeof stocks[0]["history"]; name: string }) {
  const allValues = data.flatMap((d) => [d.high, d.low]);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const range = maxVal - minVal || 1;
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const toY = (v: number) => PAD.top + chartH - ((v - minVal) / range) * chartH;
  const candleW = Math.floor(chartW / data.length) - 6;
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
      {LABELS.map((label, i) => (
        <text key={i} x={PAD.left + spacing * i + spacing / 2} y={H - 8} textAnchor="middle" fill="#6B7280" fontSize="10">{label}</text>
      ))}
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

        {/* ローソク足の図解 */}
        <div className="bg-gray-900 rounded-2xl p-4 mb-5 flex justify-center gap-12">
          {/* 陽線 */}
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
          {/* 陰線 */}
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

        {/* 説明リスト */}
        <div className="space-y-3 mb-5">
          <div className="flex gap-3 items-start bg-gray-50 rounded-xl p-3">
            <span className="text-lg">📌</span>
            <div>
              <p className="text-sm font-bold text-gray-900">ローソク足とは？</p>
              <p className="text-xs text-gray-600 mt-0.5">1本のローソクで「始値・高値・安値・終値」の4つの価格を表します。株の動きを一目で把握できます。</p>
            </div>
          </div>
          <div className="flex gap-3 items-start bg-green-50 rounded-xl p-3">
            <span className="text-lg">🟩</span>
            <div>
              <p className="text-sm font-bold text-gray-900">緑（陽線）＝上昇した</p>
              <p className="text-xs text-gray-600 mt-0.5">その週の終わりの価格が、始まりより高かった＝株価が上がった週です。</p>
            </div>
          </div>
          <div className="flex gap-3 items-start bg-red-50 rounded-xl p-3">
            <span className="text-lg">🟥</span>
            <div>
              <p className="text-sm font-bold text-gray-900">赤（陰線）＝下落した</p>
              <p className="text-xs text-gray-600 mt-0.5">その週の終わりの価格が、始まりより低かった＝株価が下がった週です。</p>
            </div>
          </div>
          <div className="flex gap-3 items-start bg-gray-50 rounded-xl p-3">
            <span className="text-lg">📏</span>
            <div>
              <p className="text-sm font-bold text-gray-900">ヒゲ（上下の細い線）</p>
              <p className="text-xs text-gray-600 mt-0.5">上のヒゲ＝その週の最高値、下のヒゲ＝その週の最安値を表しています。</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
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
  const [selectedChart, setSelectedChart] = useState(stocks[0]);
  const [showGuide, setShowGuide] = useState(false);

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
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
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
            value={selectedChart.id}
            onChange={(e) => setSelectedChart(stocks.find((s) => s.id === e.target.value) || stocks[0])}
            className="border border-gray-600 rounded-lg px-3 py-1 text-sm text-white bg-gray-800"
          >
            {stocks.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <CandlestickChart data={selectedChart.history} name={selectedChart.name} />
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
