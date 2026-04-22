"use client";
import { useState, useEffect, useRef } from "react";

// ============================================================
// データ
// ============================================================
const SCENARIOS = [
  [100, 112, 108, 125, 119, 138, 121, 144, 132, 156],
  [100, 88, 72, 85, 68, 79, 61, 74, 55, 68],
  [100, 115, 98, 112, 89, 103, 78, 95, 88, 72],
  [100, 92, 105, 118, 108, 132, 145, 128, 152, 168],
];

const STATUS_UP = ["市場は過熱しています", "買いが殺到しています", "上昇が止まりません", "みんな強気です"];
const STATUS_DOWN = ["売りが集中しています", "恐怖が広がっています", "下落が続いています", "判断が分かれています"];
const OTHERS_UP = ["他の{n}%が今も持ち続けています", "今{n}%が買い増し中です", "{n}%が楽観的です", "まだ{n}%が様子見です"];
const OTHERS_DOWN = ["他の{n}%がすでに売りました", "{n}%が今売っています", "急いで{n}%が手放しています", "{n}%が損切りしました"];
const FEEDBACKS = ["正解はない", "誰もが同じ迷いをする", "早かった", "遅かった", "良い耐え方だった", "次は変わるかもしれない"];

function rnd(arr: string[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function rndN() { return Math.floor(Math.random() * 30 + 55); }

// ============================================================
// Chart（軸なし・数値なし・1ライン）
// ============================================================
function Chart({ prices, color, shake }: { prices: number[]; color: string; shake: boolean }) {
  const W = 400; const H = 160;
  const min = Math.min(...prices) - 8;
  const max = Math.max(...prices) + 8;
  const range = max - min || 1;
  const n = prices.length;
  const pts = prices.map((p, i) => {
    const x = (i / (n - 1 || 1)) * W;
    const y = H - ((p - min) / range) * H;
    return `${x},${y}`;
  }).join(" ");
  const last = pts.split(" ").pop()!;
  const lx = parseFloat(last.split(",")[0]);
  const ly = parseFloat(last.split(",")[1]);
  const fill = `0,${H} ${pts} ${W},${H}`;

  return (
    <div className={shake ? "animate-pulse" : ""} style={{ transition: "all 0.3s" }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={fill} fill="url(#g)" />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={lx} cy={ly} r="6" fill={color} />
        <circle cx={lx} cy={ly} r="12" fill={color} opacity="0.2">
          <animate attributeName="r" values="8;16;8" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

// ============================================================
// SocialPressure（他人行動・リアルタイム変化）
// ============================================================
function SocialPressure({ isUp }: { isUp: boolean }) {
  const [n, setN] = useState(rndN());
  const [text, setText] = useState("");
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const update = () => {
      const newN = rndN();
      setN(newN);
      const tpl = rnd(isUp ? OTHERS_UP : OTHERS_DOWN);
      setText(tpl.replace("{n}", String(newN)));
      setFlash(true);
      setTimeout(() => setFlash(false), 400);
    };
    update();
    const t = setInterval(update, 2800);
    return () => clearInterval(t);
  }, [isUp]);

  return (
    <div className={`text-center transition-all duration-300 ${flash ? "scale-105" : "scale-100"}`}>
      <p className={`text-lg font-black ${isUp ? "text-green-400" : "text-red-400"}`}>
        {text}
      </p>
    </div>
  );
}

// ============================================================
// HomeScreen
// ============================================================
function HomeScreen({ onStart }: { onStart: () => void }) {
  const [n, setN] = useState(72);
  useEffect(() => {
    const t = setInterval(() => setN(rndN()), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-xs w-full">
        <p className="text-green-400 text-xs font-bold tracking-widest mb-6 uppercase">今 {n}% が動いています</p>
        <h1 className="text-white text-5xl font-black mb-3 leading-tight">
          売る？<br />持つ？
        </h1>
        <p className="text-gray-500 text-sm mb-12">正解はない。でも決めなければならない。</p>
        <button
          onClick={onStart}
          className="w-full py-5 rounded-2xl bg-white text-black text-xl font-black active:scale-95 transition-all"
        >
          始める
        </button>
      </div>
    </div>
  );
}

// ============================================================
// GameScreen
// ============================================================
function GameScreen({ onSell, onHold }: { onSell: () => void; onHold: () => void }) {
  const scenario = useRef(SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]).current;
  const [idx, setIdx] = useState(1);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const prices = scenario.slice(0, idx + 1);
  const isUp = scenario[idx] >= scenario[0];
  const color = isUp ? "#22c55e" : "#ef4444";
  const status = rnd(isUp ? STATUS_UP : STATUS_DOWN);
  const isLast = idx >= scenario.length - 1;

  // 自動進行（3秒ごとにグラフが動く）
  useEffect(() => {
    if (isLast) return;
    const t = setTimeout(() => {
      const next = scenario[idx + 1];
      const curr = scenario[idx];
      if (Math.abs(next - curr) > 18) {
        setShake(true);
        setFlash(next > curr ? "#22c55e" : "#ef4444");
        setTimeout(() => { setShake(false); setFlash(null); }, 600);
      }
      setIdx(i => i + 1);
    }, 3000);
    return () => clearTimeout(t);
  }, [idx, isLast]);

  return (
    <div className="min-h-screen bg-black flex flex-col px-4 py-10 relative">
      {/* フラッシュ演出 */}
      {flash && (
        <div className="absolute inset-0 pointer-events-none rounded-none z-10" style={{ background: flash, opacity: 0.08 }} />
      )}

      {/* 状態ラベル */}
      <div className="text-center mb-6">
        <p className="text-gray-500 text-xs mb-2 tracking-widest uppercase">状況</p>
        <p className="text-white text-xl font-black">{status}</p>
      </div>

      {/* チャート */}
      <div className="mb-6 rounded-2xl overflow-hidden" style={{ background: "#0a0a0a" }}>
        <Chart prices={prices} color={color} shake={shake} />
      </div>

      {/* 他人の行動 */}
      <div className="mb-10">
        <SocialPressure isUp={isUp} />
      </div>

      {/* 判断ボタン */}
      <div className="mt-auto grid grid-cols-2 gap-3">
        <button
          onClick={onSell}
          className="py-6 rounded-2xl text-xl font-black transition-all active:scale-95"
          style={{ background: "#1a0000", border: "2px solid #ef4444", color: "#ef4444" }}
          onTouchStart={e => (e.currentTarget.style.background = "#ef4444", e.currentTarget.style.color = "#000")}
          onTouchEnd={e => (e.currentTarget.style.background = "#1a0000", e.currentTarget.style.color = "#ef4444")}
        >
          💸 売る
        </button>
        <button
          onClick={isLast ? onHold : () => {}}
          className="py-6 rounded-2xl text-xl font-black transition-all active:scale-95"
          style={{ background: "#001a00", border: "2px solid #22c55e", color: "#22c55e" }}
          onTouchStart={e => (e.currentTarget.style.background = "#22c55e", e.currentTarget.style.color = "#000")}
          onTouchEnd={e => (e.currentTarget.style.background = "#001a00", e.currentTarget.style.color = "#22c55e")}
        >
          📦 持つ
        </button>
      </div>
      {!isLast && (
        <p className="text-gray-700 text-center text-xs mt-3">「持つ」は最後の判断で使えます</p>
      )}
    </div>
  );
}

// ============================================================
// ResultScreen
// ============================================================
function ResultScreen({ sold, onRestart }: { sold: boolean; onRestart: () => void }) {
  const feedback = rnd(FEEDBACKS);
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-xs w-full">
        <p className="text-7xl mb-8">{sold ? "💸" : "📦"}</p>
        <p className="text-white text-3xl font-black mb-3">
          {sold ? "売りました" : "持ち続けました"}
        </p>
        <div className="bg-gray-900 rounded-2xl p-5 mb-10">
          <p className="text-gray-300 text-lg font-bold">「{feedback}」</p>
        </div>
        <button
          onClick={onRestart}
          className="w-full py-5 rounded-2xl bg-white text-black text-xl font-black active:scale-95 transition-all mb-3"
        >
          もう一度
        </button>
        <p className="text-gray-700 text-xs">毎回シナリオが変わります</p>
      </div>
    </div>
  );
}

// ============================================================
// メイン
// ============================================================
type Screen = "home" | "game" | "result";

export default function SimulatorPage() {
  const [screen, setScreen] = useState<Screen>("home");
  const [sold, setSold] = useState(false);

  if (screen === "home") return <HomeScreen onStart={() => setScreen("game")} />;
  if (screen === "game") return (
    <GameScreen
      onSell={() => { setSold(true); setScreen("result"); }}
      onHold={() => { setSold(false); setScreen("result"); }}
    />
  );
  return <ResultScreen sold={sold} onRestart={() => setScreen("home")} />;
}
