"use client";
import { useState, useEffect, useRef } from "react";

// ============================================================
// データ・型定義
// ============================================================
const START_AMOUNT = 10000;

type Scenario = {
  name: string;
  prices: number[];
  events: string[];
  trend: "up" | "down" | "mixed";
};

const SCENARIOS: Scenario[] = [
  {
    name: "テクノロジー株",
    prices: [100, 108, 115, 111, 122, 118, 135, 128, 142, 138],
    events: ["AI関連株に注目集まる", "大手が好決算を発表", "一時利益確定売り", "再び買いが集まる", "高値更新"],
    trend: "up",
  },
  {
    name: "新興国株",
    prices: [100, 94, 88, 92, 84, 78, 82, 74, 69, 75],
    events: ["利上げ懸念が広がる", "売りが加速", "少し戻す", "再び下落", "底値を探る展開"],
    trend: "down",
  },
  {
    name: "高配当株",
    prices: [100, 104, 98, 106, 102, 110, 105, 112, 108, 115],
    events: ["配当利回りが注目される", "一時調整", "買い直し", "安定した上昇", "新高値"],
    trend: "up",
  },
  {
    name: "仮想通貨関連",
    prices: [100, 118, 132, 115, 142, 128, 155, 138, 122, 145],
    events: ["急騰スタート", "利確売り", "再上昇", "大きく揺れる", "乱高下続く"],
    trend: "mixed",
  },
];

const BROKERS = [
  { name: "SBI証券", point: "口座数No.1・手数料ゼロ", url: "https://www.sbisec.co.jp/" },
  { name: "楽天証券", point: "楽天ポイントで投資できる", url: "https://www.rakuten-sec.co.jp/" },
  { name: "松井証券", point: "25歳以下は手数料無料", url: "https://www.matsui.co.jp/" },
];

function rndN(min: number, max: number) { return Math.floor(Math.random() * (max - min) + min); }

// ============================================================
// Chart（シンプル・感情重視）
// ============================================================
function Chart({ prices, highlightIdx }: { prices: number[]; highlightIdx?: number }) {
  const W = 360; const H = 120;
  const min = Math.min(...prices) - 5;
  const max = Math.max(...prices) + 5;
  const range = max - min || 1;
  const n = prices.length;
  const pts = prices.map((p, i) => {
    const x = (i / (n - 1 || 1)) * (W - 20) + 10;
    const y = H - 10 - ((p - min) / range) * (H - 20);
    return { x, y };
  });
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  const fill = `10,${H - 10} ${polyline} ${pts[pts.length - 1].x},${H - 10}`;
  const last = pts[pts.length - 1];
  const isUp = prices[prices.length - 1] >= prices[0];
  const color = isUp ? "#22c55e" : "#ef4444";

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fill} fill="url(#chartGrad)" />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === highlightIdx ? 6 : 3} fill={i === highlightIdx ? "#FBBF24" : color} opacity={i === highlightIdx ? 1 : 0.5} />
      ))}
      <circle cx={last.x} cy={last.y} r="5" fill={color} />
    </svg>
  );
}

// ============================================================
// HomeScreen
// ============================================================
function HomeScreen({ onStart }: { onStart: () => void }) {
  const [count, setCount] = useState(rndN(1200, 2000));
  useEffect(() => {
    const t = setInterval(() => setCount(c => c + rndN(1, 5)), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* ヒーロー */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-green-950 border border-green-800 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-green-400 text-xs font-bold">今日 {count.toLocaleString()} 人が体験中</span>
        </div>

        <h1 className="text-white text-4xl font-black mb-4 leading-tight">
          1万円で、<br />
          <span className="text-green-400">あなたの投資判断</span>を<br />試してみる。
        </h1>
        <p className="text-gray-400 text-base mb-10 max-w-xs">
          バイト代1回分。それで投資の感覚がわかる。
        </p>

        {/* ミニプレビュー */}
        <div className="w-full max-w-xs bg-gray-900 rounded-2xl p-4 mb-10 border border-gray-800">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-400 text-xs">シミュレーション例</span>
            <span className="text-green-400 text-xs font-bold">+1,450円</span>
          </div>
          <Chart prices={[100, 105, 102, 110, 107, 115, 112, 118]} />
          <p className="text-gray-600 text-xs text-center mt-2">※仮想のシミュレーションです</p>
        </div>

        <button
          onClick={onStart}
          className="w-full max-w-xs py-5 rounded-2xl bg-green-500 text-black text-xl font-black hover:bg-green-400 transition-all active:scale-95 mb-4"
        >
          1万円で体験スタート
        </button>
        <p className="text-gray-600 text-xs">お金は一切かかりません・約2分</p>
      </div>
    </div>
  );
}

// ============================================================
// SimulatorScreen（メイン体験）
// ============================================================
function SimulatorScreen({ onEnd }: { onEnd: (result: { amount: number; sold: boolean; scenario: Scenario; sellIdx: number }) => void }) {
  const scenario = useRef(SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]).current;
  const [idx, setIdx] = useState(2);
  const [othersN, setOthersN] = useState(rndN(55, 80));
  const [othersDir, setOthersDir] = useState<"sell" | "hold">(Math.random() > 0.5 ? "sell" : "hold");
  const [flash, setFlash] = useState(false);
  const prices = scenario.prices.slice(0, idx + 1);
  const currentRate = scenario.prices[idx] / 100;
  const currentAmount = Math.round(START_AMOUNT * currentRate);
  const diff = currentAmount - START_AMOUNT;
  const isUp = diff >= 0;
  const isLast = idx >= scenario.prices.length - 1;

  // 他人の行動を数秒ごとに変化
  useEffect(() => {
    const t = setInterval(() => {
      setOthersN(rndN(50, 85));
      setOthersDir(Math.random() > 0.5 ? "sell" : "hold");
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // 自動でグラフ進行
  useEffect(() => {
    if (isLast) return;
    const t = setTimeout(() => setIdx(i => i + 1), 3500);
    return () => clearTimeout(t);
  }, [idx, isLast]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col px-4 py-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-gray-500 text-xs">シミュレーション中</p>
          <p className="text-white text-sm font-bold">{scenario.name}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-xs">投資額</p>
          <p className="text-white text-sm font-bold">¥{START_AMOUNT.toLocaleString()}</p>
        </div>
      </div>

      {/* 現在資産 */}
      <div className="text-center mb-6">
        <p className="text-gray-400 text-xs mb-1">現在の評価額</p>
        <p className="text-white text-5xl font-black mb-1">¥{currentAmount.toLocaleString()}</p>
        <p className={`text-2xl font-black ${isUp ? "text-green-400" : "text-red-400"}`}>
          {isUp ? "+" : ""}{diff.toLocaleString()}円
          <span className="text-lg ml-2">({isUp ? "+" : ""}{((diff / START_AMOUNT) * 100).toFixed(1)}%)</span>
        </p>
      </div>

      {/* チャート */}
      <div className="bg-gray-900 rounded-2xl p-4 mb-4 border border-gray-800">
        <Chart prices={prices} />
        <p className="text-gray-600 text-xs text-center mt-2">{scenario.events[Math.min(idx - 1, scenario.events.length - 1)]}</p>
      </div>

      {/* 他人の行動（同調圧） */}
      <div className={`rounded-2xl p-4 mb-6 border transition-all duration-300 ${flash ? "scale-105" : "scale-100"} ${othersDir === "sell" ? "bg-red-950 border-red-900" : "bg-blue-950 border-blue-900"}`}>
        <div className="flex items-center justify-between">
          <p className={`text-sm font-bold ${othersDir === "sell" ? "text-red-400" : "text-blue-400"}`}>
            今 {othersN}% が{othersDir === "sell" ? "売っています" : "持ち続けています"}
          </p>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-2 h-4 rounded-full ${i < Math.round(othersN / 20) ? (othersDir === "sell" ? "bg-red-400" : "bg-blue-400") : "bg-gray-700"}`} />
            ))}
          </div>
        </div>
        <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${othersDir === "sell" ? "bg-red-400" : "bg-blue-400"}`}
            style={{ width: `${othersN}%` }}
          />
        </div>
      </div>

      {/* 判断ボタン */}
      <div className="mt-auto space-y-3">
        <p className="text-gray-500 text-xs text-center mb-2">あなたはどうする？</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onEnd({ amount: currentAmount, sold: true, scenario, sellIdx: idx })}
            className="py-5 rounded-2xl border-2 border-red-500 text-red-400 text-xl font-black hover:bg-red-500 hover:text-white transition-all active:scale-95"
            style={{ background: "#1a0000" }}
          >
            💸 売る
          </button>
          <button
            onClick={isLast ? () => onEnd({ amount: currentAmount, sold: false, scenario, sellIdx: idx }) : undefined}
            disabled={!isLast}
            className={`py-5 rounded-2xl border-2 text-xl font-black transition-all active:scale-95 ${isLast ? "border-green-500 text-green-400 hover:bg-green-500 hover:text-white" : "border-gray-700 text-gray-600 cursor-not-allowed"}`}
            style={{ background: isLast ? "#001a00" : "#111" }}
          >
            📦 持つ
          </button>
        </div>
        {!isLast && (
          <p className="text-gray-700 text-xs text-center">「持つ」は最後まで待つと選べます</p>
        )}
      </div>
    </div>
  );
}

// ============================================================
// ResultScreen（口座開設導線）
// ============================================================
function ResultScreen({
  amount, sold, scenario, sellIdx, onRestart,
}: {
  amount: number; sold: boolean; scenario: Scenario; sellIdx: number; onRestart: () => void;
}) {
  const [showBrokers, setShowBrokers] = useState(false);
  const diff = amount - START_AMOUNT;
  const isWin = diff >= 0;

  // もし持ち続けていたら？
  const finalAmount = Math.round(START_AMOUNT * scenario.prices[scenario.prices.length - 1] / 100);
  const finalDiff = finalAmount - START_AMOUNT;
  const altIsBetter = sold ? finalDiff > diff : false;

  const getFeedback = () => {
    if (sold && isWin) return { text: "利確は正解。でも、その後が続きました", sub: "売るタイミングは難しい" };
    if (sold && !isWin) return { text: "損切りの判断、悪くありません", sub: "損を小さくする判断も立派な投資" };
    if (!sold && isWin) return { text: "信じて持ち続けた結果です", sub: "長期保有の強さを実感できました" };
    return { text: "持ち続けた結果、損失が拡大しました", sub: "損切りという判断も重要です" };
  };

  const feedback = getFeedback();

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col px-4 py-8">
      {/* 結果 */}
      <div className="text-center mb-8">
        <p className="text-gray-400 text-sm mb-2">あなたの結果</p>
        <p className="text-white text-5xl font-black mb-2">¥{amount.toLocaleString()}</p>
        <p className={`text-2xl font-black mb-1 ${isWin ? "text-green-400" : "text-red-400"}`}>
          {isWin ? "+" : ""}{diff.toLocaleString()}円
        </p>
        <p className="text-gray-500 text-sm">{sold ? "売った時点" : "最終"}</p>
      </div>

      {/* フィードバック */}
      <div className="bg-gray-900 rounded-2xl p-5 mb-4 border border-gray-800">
        <p className="text-white text-lg font-bold mb-1">「{feedback.text}」</p>
        <p className="text-gray-400 text-sm">{feedback.sub}</p>
      </div>

      {/* もし逆の選択なら */}
      {sold && (
        <div className={`rounded-2xl p-4 mb-6 border ${altIsBetter ? "bg-green-950 border-green-900" : "bg-gray-900 border-gray-800"}`}>
          <p className="text-gray-400 text-xs mb-1">もし最後まで持ち続けていたら…</p>
          <p className={`text-lg font-black ${finalDiff >= 0 ? "text-green-400" : "text-red-400"}`}>
            ¥{finalAmount.toLocaleString()}（{finalDiff >= 0 ? "+" : ""}{finalDiff.toLocaleString()}円）
          </p>
          <p className="text-gray-500 text-xs mt-1">
            {altIsBetter ? "持ち続けた方が良かったかもしれません" : "あなたの判断は正解でした"}
          </p>
        </div>
      )}

      {/* 区切り */}
      <div className="border-t border-gray-800 my-6" />

      {/* 口座開設導線（自然に） */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-5 mb-6 border border-gray-700">
        <p className="text-green-400 text-xs font-bold mb-2">💡 気づきましたか？</p>
        <p className="text-white font-bold text-base mb-2">
          この体験は実際の市場と<br />同じ仕組みです。
        </p>
        <p className="text-gray-400 text-sm mb-4">
          実際の投資は<span className="text-white font-bold">1,000円から</span>始められます。
          証券口座の開設は<span className="text-green-400 font-bold">完全無料</span>、5分で申し込みできます。
        </p>

        <button
          onClick={() => setShowBrokers(!showBrokers)}
          className="w-full py-3 rounded-xl bg-green-500 text-black font-black text-base hover:bg-green-400 transition-all active:scale-95"
        >
          {showBrokers ? "閉じる" : "無料で口座を開く方法を見る"}
        </button>

        {showBrokers && (
          <div className="mt-4 space-y-3">
            <p className="text-gray-500 text-xs">初心者におすすめの証券会社</p>
            {BROKERS.map((b) => (
              
                key={b.name}
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-all"
              >
                <div>
                  <p className="text-white font-bold text-sm">{b.name}</p>
                  <p className="text-gray-400 text-xs">{b.point}</p>
                </div>
                <span className="text-green-400 text-xs font-bold">無料で開く →</span>
              </a>
            ))}
            <p className="text-gray-600 text-xs text-center mt-2">
              ※口座開設は各証券会社のサービスです。投資は自己責任でお願いします。
            </p>
          </div>
        )}
      </div>

      {/* もう一度 */}
      <div className="space-y-3">
        <button
          onClick={onRestart}
          className="w-full py-4 rounded-2xl bg-gray-800 text-white font-black text-lg hover:bg-gray-700 transition-all active:scale-95"
        >
          🔄 別のシナリオを試す
        </button>
        <p className="text-gray-700 text-xs text-center">毎回異なるシナリオで体験できます</p>
      </div>
    </div>
  );
}

// ============================================================
// メイン
// ============================================================
type Screen = "home" | "sim" | "result";
type ResultData = { amount: number; sold: boolean; scenario: Scenario; sellIdx: number };

export default function SimulatorPage() {
  const [screen, setScreen] = useState<Screen>("home");
  const [result, setResult] = useState<ResultData | null>(null);

  if (screen === "home") return <HomeScreen onStart={() => setScreen("sim")} />;
  if (screen === "sim") return <SimulatorScreen onEnd={(r) => { setResult(r); setScreen("result"); }} />;
  if (screen === "result" && result) return <ResultScreen {...result} onRestart={() => { setResult(null); setScreen("home"); }} />;
  return null;
}
