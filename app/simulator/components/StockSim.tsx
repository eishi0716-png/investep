"use client";
import { useState, useEffect, useRef } from "react";

type Candle = { open: number; close: number; high: number; low: number };

const BASE_PRICE: Record<string, number> = {
  "7203": 3200, "6758": 12800, "9984": 7400,
  "6861": 65000, "AAPL": 21500, "NVDA": 98000, "MSFT": 45000,
};

function generateCandles(base: number, count: number, vol: number): Candle[] {
  const candles: Candle[] = [];
  let price = base * (0.92 + Math.random() * 0.04);
  for (let i = 0; i < count; i++) {
    const open = price;
    const change = (Math.random() - 0.47) * vol;
    const close = Math.max(open + change, open * 0.85);
    const wickUp = Math.random() * vol * 0.5;
    const wickDown = Math.random() * vol * 0.5;
    const high = Math.max(open, close) + Math.abs(wickUp);
    const low = Math.min(open, close) - Math.abs(wickDown);
    candles.push({ open: Math.round(open), close: Math.round(close), high: Math.round(high), low: Math.round(low) });
    price = close;
  }
  return candles;
}

// トレンド判定
function analyzeTrend(candles: Candle[]): { trend: "up" | "down" | "range"; label: string; emoji: string; color: string; comment: string } {
  if (candles.length < 3) return { trend: "range", label: "レンジ相場", emoji: "↔️", color: "#6B7280", comment: "方向感がない相場です。様子を見ましょう。" };
  const first = candles[0].close;
  const last = candles[candles.length - 1].close;
  const change = (last - first) / first * 100;
  if (change > 1.5) return { trend: "up", label: "上昇トレンド", emoji: "📈", color: "#22c55e", comment: "現在は上昇トレンド。短期的に買いが優勢です。" };
  if (change < -1.5) return { trend: "down", label: "下降トレンド", emoji: "📉", color: "#ef4444", comment: "現在は下降トレンド。売り圧力が強い状況です。慎重に。" };
  return { trend: "range", label: "レンジ相場", emoji: "↔️", color: "#F59E0B", comment: "方向感がない相場です。大きな動きが出るまで様子見も手です。" };
}

// ローソク足の解説生成
function getCandleComment(c: Candle): string {
  const body = Math.abs(c.close - c.open);
  const upperWick = c.high - Math.max(c.open, c.close);
  const lowerWick = Math.min(c.open, c.close) - c.low;
  const isUp = c.close >= c.open;
  if (upperWick > body * 1.5) return "上ヒゲが長い → 高値で売られた（売り圧が強い）";
  if (lowerWick > body * 1.5) return "下ヒゲが長い → 安値で買われた（底堅い）";
  if (body < (c.high - c.low) * 0.15) return "ほぼ横ばい → 売り買いが拮抗している";
  if (isUp && body > (c.high - c.low) * 0.6) return "強い陽線 → この時間は買いが非常に強かった";
  if (!isUp && body > (c.high - c.low) * 0.6) return "強い陰線 → この時間は売りが非常に強かった";
  if (isUp) return "陽線 → この時間は買いが強かった";
  return "陰線 → この時間は売りが強かった";
}

// 危険サイン判定
function getDangerSign(c: Candle): string | null {
  const body = Math.abs(c.close - c.open);
  const upperWick = c.high - Math.max(c.open, c.close);
  const lowerWick = Math.min(c.open, c.close) - c.low;
  const range = c.high - c.low;
  if (upperWick > body * 2 && upperWick > range * 0.4) return "売り圧強い";
  if (!( c.close >= c.open) && body > range * 0.7) return "急落注意";
  if (lowerWick > body * 2 && (c.close >= c.open)) return "底値買い";
  return null;
}

// 実時間ラベル生成
function getRealTimeLabel(i: number, count: number, tfId: string): string {
  const now = new Date();
  if (tfId === "1m") {
    const d = new Date(now.getTime() - (count - 1 - i) * 60 * 1000);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
  if (tfId === "15m") {
    const d = new Date(now.getTime() - (count - 1 - i) * 15 * 60 * 1000);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
  if (tfId === "1d") {
    const d = new Date(now.getTime() - (count - 1 - i) * 24 * 60 * 60 * 1000);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }
  if (tfId === "1w") {
    const d = new Date(now.getTime() - (count - 1 - i) * 7 * 24 * 60 * 60 * 1000);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }
  return "";
}

type TimeFrame = "1m" | "15m" | "1d" | "1w";
const TIME_FRAMES = [
  { id: "1m" as TimeFrame, label: "1分足", count: 20, vol: 0.002 },
  { id: "15m" as TimeFrame, label: "15分足", count: 16, vol: 0.006 },
  { id: "1d" as TimeFrame, label: "日足", count: 20, vol: 0.025 },
  { id: "1w" as TimeFrame, label: "週足", count: 12, vol: 0.06 },
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

const W = 640; const H = 300;
const PAD = { top: 50, right: 20, bottom: 40, left: 75 };

function SmartChart({ data, name, tfId }: { data: Candle[]; name: string; tfId: string }) {
  const [tooltip, setTooltip] = useState<{ i: number; x: number; y: number } | null>(null);
  const count = data.length;
  const tf = TIME_FRAMES.find(t => t.id === tfId)!;

  const allValues = data.flatMap((d) => [d.high, d.low]);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const range = maxVal - minVal || 1;
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const toY = (v: number) => PAD.top + chartH - ((v - minVal) / range) * chartH;
  const spacing = chartW / count;
  const currentPrice = data[data.length - 1]?.close ?? 0;
  const currentY = toY(currentPrice);
  const analysis = analyzeTrend(data);

  // ラベル表示間隔（多すぎない）
  const labelStep = Math.ceil(count / 5);

  return (
    <div className="relative">
      {/* トレンドバッジ */}
      <div className="flex items-center gap-3 mb-3">
        <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ background: analysis.color + "22", color: analysis.color, border: `1px solid ${analysis.color}44` }}>
          {analysis.emoji} {analysis.label}
        </span>
        <span className="text-xs text-gray-400">{analysis.comment}</span>
      </div>

      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        style={{ background: "#111827", borderRadius: 12, cursor: "crosshair" }}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* グリッド線 */}
        {Array.from({ length: 5 }, (_, i) => {
          const v = Math.round(minVal + (range / 4) * i);
          const y = toY(v);
          return (
            <g key={i}>
              <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#1F2937" strokeWidth="1" />
              <text x={PAD.left - 6} y={y} textAnchor="end" dominantBaseline="central" fill="#4B5563" fontSize="10">
                {v >= 10000 ? (v / 1000).toFixed(0) + "k" : v.toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* 現在価格ライン */}
        <line x1={PAD.left} y1={currentY} x2={W - PAD.right} y2={currentY} stroke="#FBBF24" strokeWidth="1" strokeDasharray="5 3" />
        <rect x={W - PAD.right} y={currentY - 9} width={72} height={18} rx={4} fill="#FBBF24" />
        <text x={W - PAD.right + 36} y={currentY} textAnchor="middle" dominantBaseline="central" fill="#111827" fontSize="10" fontWeight="bold">
          {currentPrice >= 10000 ? (currentPrice / 1000).toFixed(1) + "k" : currentPrice.toLocaleString()}円
        </text>

        {/* ローソク足 */}
        {data.map((d, i) => {
          const x = PAD.left + spacing * i + spacing / 2;
          const isUp = d.close >= d.open;
          const body = Math.abs(d.close - d.open);
          const totalRange = d.high - d.low;
          const strength = totalRange > 0 ? body / totalRange : 0;
          const color = isUp ? "#22c55e" : "#ef4444";
          const opacity = strength > 0.5 ? 1 : 0.45 + strength;
          const candleW = Math.max(Math.floor(spacing) - 4, 4);
          const bodyTop = toY(Math.max(d.open, d.close));
          const bodyBot = toY(Math.min(d.open, d.close));
          const bodyH = Math.max(bodyBot - bodyTop, 2);
          const danger = getDangerSign(d);

          return (
            <g
              key={i}
              onMouseEnter={(e) => setTooltip({ i, x: Math.min(x, W - 180), y: PAD.top })}
              style={{ cursor: "pointer" }}
            >
              {/* 強いローソクのグロー */}
              {strength > 0.6 && (
                <rect x={x - candleW / 2 - 2} y={bodyTop - 1} width={candleW + 4} height={bodyH + 2} rx={3} fill={color} opacity={0.15} />
              )}
              <line x1={x} y1={toY(d.high)} x2={x} y2={bodyTop} stroke={color} strokeWidth={strength > 0.6 ? 2 : 1.5} opacity={opacity} />
              <line x1={x} y1={bodyBot} x2={x} y2={toY(d.low)} stroke={color} strokeWidth={strength > 0.6 ? 2 : 1.5} opacity={opacity} />
              <rect
                x={x - candleW / 2} y={bodyTop}
                width={Math.max(candleW * (0.5 + strength * 0.5), 3)}
                height={bodyH}
                rx={1}
                fill={color}
                opacity={opacity}
              />
              {/* 危険サインラベル */}
              {danger && (
                <text x={x} y={toY(d.high) - 8} textAnchor="middle" fill="#FBBF24" fontSize="9" fontWeight="bold">
                  {danger === "急落注意" ? "⚠️" : danger === "売り圧強い" ? "↓" : "↑"}
                </text>
              )}
              {/* X軸ラベル（間引き表示） */}
              {i % labelStep === 0 && (
                <text x={x} y={H - 8} textAnchor="middle" fill="#4B5563" fontSize="9">
                  {getRealTimeLabel(i, count, tfId)}
                </text>
              )}
            </g>
          );
        })}

        {/* ホバーツールチップ */}
        {tooltip !== null && data[tooltip.i] && (() => {
          const d = data[tooltip.i];
          const comment = getCandleComment(d);
          const danger = getDangerSign(d);
          const isUp = d.close >= d.open;
          const tx = tooltip.x > W / 2 ? tooltip.x - 190 : tooltip.x + 10;
          return (
            <g>
              <rect x={tx} y={PAD.top} width={185} height={danger ? 110 : 92} rx={8} fill="#1F2937" stroke="#374151" strokeWidth="1" />
              <text x={tx + 10} y={PAD.top + 16} fill="#E5E7EB" fontSize="11" fontWeight="bold">
                {getRealTimeLabel(tooltip.i, count, tfId)}
              </text>
              <text x={tx + 10} y={PAD.top + 32} fill="#9CA3AF" fontSize="10">始値: {d.open.toLocaleString()}円</text>
              <text x={tx + 10} y={PAD.top + 46} fill="#9CA3AF" fontSize="10">高値: {d.high.toLocaleString()}円</text>
              <text x={tx + 10} y={PAD.top + 60} fill="#9CA3AF" fontSize="10">安値: {d.low.toLocaleString()}円</text>
              <text x={tx + 10} y={PAD.top + 74} fill={isUp ? "#22c55e" : "#ef4444"} fontSize="10" fontWeight="bold">終値: {d.close.toLocaleString()}円</text>
              <text x={tx + 10} y={PAD.top + 90} fill="#D1D5DB" fontSize="10">{comment.length > 22 ? comment.slice(0, 22) + "…" : comment}</text>
              {danger && (
                <text x={tx + 10} y={PAD.top + 105} fill="#FBBF24" fontSize="10" fontWeight="bold">⚠️ {danger}</text>
              )}
            </g>
          );
        })()}
      </svg>

      {/* 凡例 */}
      <div className="flex items-center gap-4 mt-3 flex-wrap">
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block bg-green-500"></span><span className="text-xs text-gray-400">陽線（上昇）</span></div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block bg-red-500"></span><span className="text-xs text-gray-400">陰線（下落）</span></div>
        <div className="flex items-center gap-1"><span className="text-yellow-400 text-xs">— —</span><span className="text-xs text-gray-400 ml-1">現在価格</span></div>
        <div className="flex items-center gap-1"><span className="text-yellow-400 text-xs">⚠️</span><span className="text-xs text-gray-400">注意サイン</span></div>
        <span className="text-xs text-gray-500 ml-auto">ローソクにカーソルを合わせると解説が出ます</span>
      </div>
    </div>
  );
}

function HowToReadChart({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
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
          </div>
        </div>
        <div className="space-y-3 mb-5">
          {[
            { icon: "📌", title: "ローソク足とは？", desc: "1本で「始値・高値・安値・終値」の4つの価格を表します。" },
            { icon: "🟩", title: "緑（陽線）＝上昇した", desc: "終わりの価格が始まりより高かった＝株価が上がった期間。" },
            { icon: "🟥", title: "赤（陰線）＝下落した", desc: "終わりの価格が始まりより低かった＝株価が下がった期間。" },
            { icon: "📏", title: "ヒゲ（細い線）の意味", desc: "上ヒゲ＝その期間の最高値、下ヒゲ＝最安値を表します。" },
            { icon: "⚠️", title: "注意サインについて", desc: "長い上ヒゲは「売り圧が強い」、急落は「⚠️注意」と表示します。" },
            { icon: "💡", title: "ツールチップ解説", desc: "ローソクにマウスを合わせると「この時間は〇〇が強かった」と解説が出ます。" },
            { icon: "⏱️", title: "時間軸について", desc: "1分足・15分足＝短期、日足＝中期、週足＝長期の値動きです。" },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-start bg-gray-50 rounded-xl p-3">
              <span className="text-lg">{item.icon}</span>
              <div>
                <p className="text-sm font-bold text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
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
  const [buyPrices, setBuyPrices] = useState<{ [key: string]: number }>({});
  const [message, setMessage] = useState("");
  const [selectedStockId, setSelectedStockId] = useState(stocks[0].id);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("1d");
  const [showGuide, setShowGuide] = useState(false);
  const [chartData, setChartData] = useState<Candle[]>([]);
  const [pulse, setPulse] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tf = TIME_FRAMES.find((t) => t.id === timeFrame)!;

  useEffect(() => {
    setChartData(generateCandles(BASE_PRICE[selectedStockId], tf.count, tf.vol * BASE_PRICE[selectedStockId]));
  }, [selectedStockId, timeFrame]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (timeFrame === "1m") {
      timerRef.current = setInterval(() => {
        setChartData(generateCandles(BASE_PRICE[selectedStockId], tf.count, tf.vol * BASE_PRICE[selectedStockId]));
        setPulse(true);
        setTimeout(() => setPulse(false), 400);
      }, 3000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timeFrame, selectedStockId]);

  const selectedStock = stocks.find((s) => s.id === selectedStockId) || stocks[0];
  const analysis = chartData.length > 0 ? analyzeTrend(chartData) : null;

  const buy = (stock: typeof stocks[0]) => {
    if (cash < stock.price) { setMessage("資金が足りません。"); return; }
    setCash((c) => c - stock.price);
    setHoldings((h) => ({ ...h, [stock.id]: (h[stock.id] || 0) + 1 }));
    setBuyPrices((b) => ({ ...b, [stock.id]: stock.price }));
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
  const profitableHoldings = stocks.filter((s) => (holdings[s.id] || 0) > 0 && buyPrices[s.id] && s.price > buyPrices[s.id]);

  return (
    <div>
      {showGuide && <HowToReadChart onClose={() => setShowGuide(false)} />}

      {profitableHoldings.length > 0 && (
        <div className="mb-6 rounded-2xl border-2 border-green-400 bg-green-50 p-4 animate-pulse">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💰</span>
            <div className="flex-1">
              <p className="font-bold text-green-800 text-sm mb-1">📈 売りどきかもしれません！</p>
              {profitableHoldings.map((s) => {
                const gain = (s.price - buyPrices[s.id]) * (holdings[s.id] || 0);
                const pct = ((s.price - buyPrices[s.id]) / buyPrices[s.id] * 100).toFixed(1);
                return (
                  <p key={s.id} className="text-xs text-green-700 mb-0.5">
                    <span className="font-bold">{s.name}</span>：
                    +¥{gain.toLocaleString()}（+{pct}%）の含み益が出ています！
                  </p>
                );
              })}
              <p className="text-xs text-green-600 mt-1">利益が出ているうちに売ることも大切な投資判断です。</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 text-sm text-blue-700">
        株式投資とは：個別企業の株を売買して値上がり益や配当金を狙う投資方法です。
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-400 mb-1">保有現金</p>
          <p className="text-xl font-bold text-gray-900">¥{cash.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-400 mb-1">総資産</p>
          <p className="text-xl font-bold text-blue-600">¥{totalAsset.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-400 mb-1">損益</p>
          <p className={"text-xl font-bold " + (profit >= 0 ? "text-green-600" : "text-red-500")}>
            {profit >= 0 ? "+" : ""}¥{profit.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="rounded-2xl p-5 border border-gray-800 shadow-sm mb-8" style={{ background: "#111827" }}>
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
          <div className="flex items-center gap-2">
            {timeFrame === "1m" && (
              <span className={`text-xs px-2 py-1 rounded-full font-bold transition-all ${pulse ? "bg-green-400 text-black" : "bg-green-900 text-green-300"}`}>
                ● LIVE
              </span>
            )}
            <select
              value={selectedStockId}
              onChange={(e) => setSelectedStockId(e.target.value)}
              className="border border-gray-600 rounded-lg px-3 py-1 text-sm text-white bg-gray-800"
            >
              {stocks.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          {TIME_FRAMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeFrame(t.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${timeFrame === t.id ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {chartData.length > 0 && <SmartChart data={chartData} name={selectedStock.name} tfId={timeFrame} />}

        {timeFrame === "1m" && <p className="text-xs text-gray-500 mt-2 text-right">3秒ごとに自動更新</p>}
      </div>

      {message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-3 rounded-xl mb-4">{message}</div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {stocks.map((stock) => {
          const held = holdings[stock.id] || 0;
          const bp = buyPrices[stock.id];
          const isProfit = held > 0 && bp && stock.price > bp;
          return (
            <div key={stock.id} className={`bg-white rounded-2xl p-5 border shadow-sm flex items-center justify-between transition-all ${isProfit ? "border-green-300 bg-green-50" : "border-gray-100"}`}>
              <div>
                <p className="font-semibold text-gray-900">{stock.name}</p>
                <p className="text-xs text-gray-400">{stock.id}</p>
                {isProfit && (
                  <p className="text-xs text-green-600 font-bold mt-1">
                    💰 +¥{((stock.price - bp) * held).toLocaleString()}の含み益
                  </p>
                )}
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900">¥{stock.price.toLocaleString()}</p>
                <p className={"text-xs font-medium " + (stock.change >= 0 ? "text-green-600" : "text-red-500")}>
                  {stock.change >= 0 ? "+" : ""}{stock.change}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">保有数</p>
                <p className="font-bold text-gray-900">{held}株</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => buy(stock)} className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">買う</button>
                <button onClick={() => sell(stock)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isProfit ? "bg-green-500 text-white hover:bg-green-600 animate-pulse" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>売る</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
