"use client";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StockSim from "./components/StockSim";
import FundSim from "./components/FundSim";
import EtfSim from "./components/EtfSim";
import FxSim from "./components/FxSim";
import ReitSim from "./components/ReitSim";

// ============================================================
// 型定義
// ============================================================
type Goal = { id: string; label: string; emoji: string; desc: string; riskHint: string };
type Profile = { id: string; label: string; emoji: string; amount: number };
type InvestType = { id: string; label: string; emoji: string; risk: string; returnRate: [number, number]; desc: string; color: string };
type Event = { label: string; change: number; comment: string; emoji: string };
type DecisionResult = { kept: boolean; finalAmount: number; altAmount: number; reason: string; lesson: string };

// ============================================================
// データ定義
// ============================================================
const GOALS: Goal[] = [
  { id: "grow", label: "お金を増やしたい", emoji: "📈", desc: "積極的に資産を増やすことを目指す", riskHint: "リスクを取るほどリターンも大きくなります" },
  { id: "stable", label: "安定して運用したい", emoji: "🛡️", desc: "大きな損失を避けながら少しずつ増やす", riskHint: "安全重視なら安定型がおすすめ" },
  { id: "saving", label: "老後の備えをしたい", emoji: "🏠", desc: "長期的にコツコツ積み立てる", riskHint: "長期なら時間を味方にできます" },
  { id: "short", label: "短期で稼ぎたい", emoji: "⚡", desc: "短期間で大きなリターンを狙う", riskHint: "高リターンには高リスクが伴います" },
];

const PROFILES: Profile[] = [
  { id: "student", label: "大学生", emoji: "🎓", amount: 100000 },
  { id: "worker", label: "社会人（20〜30代）", emoji: "💼", amount: 500000 },
  { id: "mid", label: "社会人（40〜50代）", emoji: "🏢", amount: 1000000 },
  { id: "senior", label: "シニア（60代〜）", emoji: "🌿", amount: 3000000 },
];

const INVEST_TYPES: InvestType[] = [
  {
    id: "safe", label: "安定型", emoji: "🛡️", risk: "低",
    returnRate: [0.01, 0.03],
    desc: "国債・定期預金など。ほぼ元本保証で少しずつ増える",
    color: "#3B82F6",
  },
  {
    id: "balance", label: "バランス型", emoji: "⚖️", risk: "中",
    returnRate: [0.04, 0.10],
    desc: "株式・債券を組み合わせ。リスクとリターンのバランスが良い",
    color: "#8B5CF6",
  },
  {
    id: "growth", label: "成長型", emoji: "🚀", risk: "高",
    returnRate: [0.08, 0.30],
    desc: "株式・新興国など。大きく増える可能性があるが損失も大きい",
    color: "#F59E0B",
  },
];

const EVENTS: Event[][] = [
  // 安定型シナリオ
  [
    { label: "市場は安定して推移", change: 0.02, comment: "大きな変化はなく、少しずつ増えています", emoji: "😊" },
    { label: "小幅な下落がありました", change: -0.01, comment: "安定型は下落も小さめです", emoji: "😐" },
    { label: "回復して上昇", change: 0.015, comment: "安定した運用が続いています", emoji: "😊" },
  ],
  // バランス型シナリオ
  [
    { label: "株式市場が好調！", change: 0.08, comment: "バランス型も恩恵を受けています", emoji: "😄" },
    { label: "世界的な不安で下落", change: -0.06, comment: "債券部分が下落を和らげています", emoji: "😟" },
    { label: "回復＋上昇！", change: 0.09, comment: "バランス型らしい安定した回復です", emoji: "🎉" },
  ],
  // 成長型シナリオ
  [
    { label: "テック株が急騰！", change: 0.25, comment: "成長型は大きな上昇の恩恵を受けました", emoji: "🚀" },
    { label: "暴落警報⚠️ 市場が急落", change: -0.22, comment: "成長型は下落も激しいです。焦らないことが大切", emoji: "😱" },
    { label: "緩やかに回復中", change: 0.10, comment: "長期目線で持ち続けることが大切です", emoji: "📈" },
  ],
];

const DECISION_SCENARIOS: Record<string, { question: string; keepLabel: string; sellLabel: string }> = {
  up: {
    question: "資産が増えています！💰 どうしますか？",
    keepLabel: "このまま持ち続ける",
    sellLabel: "今すぐ売って利益確定する",
  },
  down: {
    question: "資産が下がっています📉 どうしますか？",
    keepLabel: "信じて持ち続ける",
    sellLabel: "損失を抑えて売る（損切り）",
  },
};

// ============================================================
// ステップ表示コンポーネント
// ============================================================
function StepIndicator({ current }: { current: number }) {
  const steps = ["目的設定", "投資選択", "価格変動", "判断", "結果"];
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className={`flex flex-col items-center`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < current ? "bg-blue-600 text-white" : i === current ? "bg-blue-600 text-white ring-4 ring-blue-200" : "bg-gray-200 text-gray-400"}`}>
              {i < current ? "✓" : i + 1}
            </div>
            <span className={`text-xs mt-1 hidden sm:block ${i === current ? "text-blue-600 font-bold" : "text-gray-400"}`}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-8 h-0.5 mb-4 ${i < current ? "bg-blue-600" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// STEP 1：目的設定
// ============================================================
function Step1({ onNext }: { onNext: (goal: Goal, profile: Profile) => void }) {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🎯</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">まず、目的を決めよう</h2>
        <p className="text-gray-500">投資を始める前に「なんのために投資するか」を明確にすることが大切です</p>
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-gray-700 mb-3">あなたの投資の目的は？</h3>
        <div className="grid grid-cols-2 gap-3">
          {GOALS.map((g) => (
            <button
              key={g.id}
              onClick={() => setGoal(g)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${goal?.id === g.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300 bg-white"}`}
            >
              <div className="text-2xl mb-1">{g.emoji}</div>
              <div className="font-bold text-gray-900 text-sm">{g.label}</div>
              <div className="text-xs text-gray-500 mt-1">{g.desc}</div>
            </button>
          ))}
        </div>
        {goal && (
          <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700">
            💡 {goal.riskHint}
          </div>
        )}
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-gray-700 mb-3">あなたのプロフィールは？</h3>
        <div className="grid grid-cols-2 gap-3">
          {PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => setProfile(p)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${profile?.id === p.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300 bg-white"}`}
            >
              <div className="text-2xl mb-1">{p.emoji}</div>
              <div className="font-bold text-gray-900 text-sm">{p.label}</div>
              <div className="text-xs text-gray-500 mt-1">想定資金：¥{p.amount.toLocaleString()}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => goal && profile && onNext(goal, profile)}
        disabled={!goal || !profile}
        className="w-full py-4 rounded-2xl font-bold text-white transition-all text-lg disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 active:scale-95"
      >
        次へ →
      </button>
    </div>
  );
}

// ============================================================
// STEP 2：投資選択
// ============================================================
function Step2({ goal, profile, onNext }: { goal: Goal; profile: Profile; onNext: (type: InvestType) => void }) {
  const [selected, setSelected] = useState<InvestType | null>(null);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">💼</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">投資タイプを選ぼう</h2>
        <p className="text-gray-500">{profile.emoji} {profile.label}として ¥{profile.amount.toLocaleString()} を投資します</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-sm text-blue-700">
        🎯 あなたの目的：<span className="font-bold">{goal.emoji} {goal.label}</span>
      </div>

      <div className="space-y-4 mb-8">
        {INVEST_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelected(type)}
            className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${selected?.id === type.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300 bg-white"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{type.emoji}</span>
                <span className="font-bold text-gray-900 text-lg">{type.label}</span>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${type.risk === "低" ? "bg-blue-100 text-blue-700" : type.risk === "中" ? "bg-purple-100 text-purple-700" : "bg-amber-100 text-amber-700"}`}>
                リスク {type.risk}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{type.desc}</p>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-gray-400">期待リターン（年）</p>
                <p className="font-bold text-sm" style={{ color: type.color }}>
                  {(type.returnRate[0] * 100).toFixed(0)}〜{(type.returnRate[1] * 100).toFixed(0)}%
                </p>
              </div>
              <div className="flex-1">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${type.returnRate[1] * 250}%`, background: type.color, maxWidth: "100%" }} />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => selected && onNext(selected)}
        disabled={!selected}
        className="w-full py-4 rounded-2xl font-bold text-white transition-all text-lg disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 active:scale-95"
      >
        この投資タイプで始める →
      </button>
    </div>
  );
}

// ============================================================
// STEP 3：価格変動
// ============================================================
function Step3({ investType, profile, onNext }: { investType: InvestType; profile: Profile; onNext: (amount: number, events: Event[]) => void }) {
  const [phase, setPhase] = useState(0);
  const [amount, setAmount] = useState(profile.amount);
  const [history, setHistory] = useState<number[]>([profile.amount]);
  const [shownEvents, setShownEvents] = useState<Event[]>([]);
  const [animating, setAnimating] = useState(false);

  const typeIndex = INVEST_TYPES.findIndex(t => t.id === investType.id);
  const events = EVENTS[typeIndex];

  const runNextEvent = () => {
    if (phase >= events.length || animating) return;
    setAnimating(true);
    setTimeout(() => {
      const event = events[phase];
      const newAmount = Math.round(amount * (1 + event.change));
      setAmount(newAmount);
      setHistory(h => [...h, newAmount]);
      setShownEvents(e => [...e, event]);
      setPhase(p => p + 1);
      setAnimating(false);
    }, 1200);
  };

  const profit = amount - profile.amount;
  const profitPct = ((profit / profile.amount) * 100).toFixed(1);
  const isUp = profit >= 0;

  // ミニチャート
  const maxH = Math.max(...history);
  const minH = Math.min(...history);
  const rangeH = maxH - minH || 1;
  const chartPoints = history.map((v, i) => {
    const x = (i / (history.length - 1 || 1)) * 260 + 10;
    const y = 60 - ((v - minH) / rangeH) * 50 + 5;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">⏳</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">時間が経過しています…</h2>
        <p className="text-gray-500">{investType.emoji} {investType.label}で運用中</p>
      </div>

      {/* 資産表示 */}
      <div className="bg-gray-900 rounded-2xl p-6 mb-6 text-center">
        <p className="text-gray-400 text-sm mb-1">現在の資産</p>
        <p className="text-4xl font-bold text-white mb-2">¥{amount.toLocaleString()}</p>
        <p className={`text-lg font-bold ${isUp ? "text-green-400" : "text-red-400"}`}>
          {isUp ? "+" : ""}{profit.toLocaleString()}円 （{isUp ? "+" : ""}{profitPct}%）
        </p>

        {/* ミニチャート */}
        {history.length > 1 && (
          <div className="mt-4">
            <svg width="100%" viewBox="0 0 280 70" style={{ overflow: "visible" }}>
              <polyline points={chartPoints} fill="none" stroke={isUp ? "#22c55e" : "#ef4444"} strokeWidth="2.5" strokeLinejoin="round" />
              {history.map((v, i) => {
                const x = (i / (history.length - 1 || 1)) * 260 + 10;
                const y = 60 - ((v - minH) / rangeH) * 50 + 5;
                return <circle key={i} cx={x} cy={y} r="4" fill={isUp ? "#22c55e" : "#ef4444"} />;
              })}
            </svg>
          </div>
        )}
      </div>

      {/* イベントログ */}
      {shownEvents.length > 0 && (
        <div className="space-y-2 mb-6">
          {shownEvents.map((e, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${e.change >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <span className="text-xl">{e.emoji}</span>
              <div>
                <p className="text-sm font-bold text-gray-900">{e.label}</p>
                <p className="text-xs text-gray-600">{e.comment}</p>
              </div>
              <span className={`ml-auto text-sm font-bold ${e.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                {e.change >= 0 ? "+" : ""}{(e.change * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      )}

      {phase < events.length ? (
        <button
          onClick={runNextEvent}
          disabled={animating}
          className="w-full py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all text-lg disabled:opacity-50"
        >
          {animating ? "⏳ 時間が経過中…" : phase === 0 ? "▶ 運用スタート！" : "▶ さらに時間を進める"}
        </button>
      ) : (
        <button
          onClick={() => onNext(amount, shownEvents)}
          className="w-full py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all text-lg active:scale-95"
        >
          ここで判断する →
        </button>
      )}
    </div>
  );
}

// ============================================================
// STEP 4：判断
// ============================================================
function Step4({ amount, initialAmount, onNext }: { amount: number; initialAmount: number; onNext: (kept: boolean) => void }) {
  const isUp = amount >= initialAmount;
  const scenario = isUp ? DECISION_SCENARIOS.up : DECISION_SCENARIOS.down;
  const profit = amount - initialAmount;
  const profitPct = ((profit / initialAmount) * 100).toFixed(1);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">{isUp ? "🤔💰" : "😰📉"}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">判断の時です</h2>
        <p className="text-gray-500">あなたならどうしますか？</p>
      </div>

      <div className={`rounded-2xl p-6 mb-6 text-center border-2 ${isUp ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}>
        <p className="text-sm text-gray-500 mb-1">現在の資産</p>
        <p className="text-3xl font-bold text-gray-900 mb-1">¥{amount.toLocaleString()}</p>
        <p className={`text-lg font-bold ${isUp ? "text-green-600" : "text-red-500"}`}>
          {isUp ? "+" : ""}{profit.toLocaleString()}円 ({isUp ? "+" : ""}{profitPct}%)
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8">
        <p className="text-lg font-bold text-gray-900 text-center mb-6">{scenario.question}</p>
        <div className="space-y-3">
          <button
            onClick={() => onNext(true)}
            className="w-full py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all active:scale-95 text-base"
          >
            📦 {scenario.keepLabel}
          </button>
          <button
            onClick={() => onNext(false)}
            className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 text-base border-2 ${isUp ? "border-green-500 text-green-700 hover:bg-green-50" : "border-red-400 text-red-600 hover:bg-red-50"}`}
          >
            💸 {scenario.sellLabel}
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
        💡 <span className="font-bold">投資の心得：</span>
        {isUp ? "「もっと上がるかも」という欲と、「下がる前に売りたい」という恐れの間で判断することが投資の難しさです。" : "「いつか戻る」という信念と「損を確定させたくない」という心理の葛藤が投資の本質です。"}
      </div>
    </div>
  );
}

// ============================================================
// STEP 5：結果
// ============================================================
function Step5({
  goal, profile, investType, finalAmount, kept, events, onRestart
}: {
  goal: Goal; profile: Profile; investType: InvestType;
  finalAmount: number; kept: boolean; events: Event[];
  onRestart: () => void;
}) {
  const initial = profile.amount;
  const profit = finalAmount - initial;
  const profitPct = ((profit / initial) * 100).toFixed(1);
  const isWin = profit >= 0;
  const altAmount = kept
    ? Math.round(finalAmount * (1 + (Math.random() * 0.05 - 0.03)))
    : Math.round(initial * (1 + INVEST_TYPES.find(t => t.id === investType.id)!.returnRate[0] * 2));

  const lessons: Record<string, string> = {
    safe: "安定型は大きく増えませんが、大きく減りません。「守る」投資の本質を体験しました。",
    balance: "バランス型は上昇も下落も適度。分散投資のメリットを実感できましたか？",
    growth: "成長型は大きく動きます。長期保有することで報われることが多いです。",
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">{isWin ? "🎉" : "📚"}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isWin ? "おめでとうございます！" : "お疲れ様でした！"}
        </h2>
        <p className="text-gray-500">これがあなたの投資体験の結果です</p>
      </div>

      {/* 最終結果 */}
      <div className={`rounded-2xl p-6 mb-6 text-center border-2 ${isWin ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}>
        <p className="text-sm text-gray-500 mb-1">最終資産</p>
        <p className="text-4xl font-bold text-gray-900 mb-2">¥{finalAmount.toLocaleString()}</p>
        <p className={`text-xl font-bold ${isWin ? "text-green-600" : "text-red-500"}`}>
          {isWin ? "+" : ""}{profit.toLocaleString()}円 ({isWin ? "+" : ""}{profitPct}%)
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {kept ? "📦 持ち続けた場合の結果" : "💸 売った場合の結果"}
        </p>
      </div>

      {/* もし逆の選択をしていたら */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6">
        <p className="font-bold text-gray-700 mb-3">🔄 もし逆の選択をしていたら？</p>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">あなたの選択</p>
            <p className="text-lg font-bold text-gray-900">¥{finalAmount.toLocaleString()}</p>
          </div>
          <div className="text-2xl">vs</div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">{kept ? "売っていたら" : "持ち続けたら"}</p>
            <p className={`text-lg font-bold ${altAmount > finalAmount ? "text-green-600" : "text-red-500"}`}>
              ¥{altAmount.toLocaleString()}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          {altAmount > finalAmount ? "逆の選択の方が良い結果でした。投資に正解はありません。" : "あなたの選択は良い結果でした！"}
        </p>
      </div>

      {/* 体験サマリー */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
        <p className="font-bold text-gray-900 mb-4">📋 あなたの投資体験まとめ</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">目的</span><span className="font-medium">{goal.emoji} {goal.label}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">プロフィール</span><span className="font-medium">{profile.emoji} {profile.label}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">投資タイプ</span><span className="font-medium">{investType.emoji} {investType.label}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">初期資金</span><span className="font-medium">¥{initial.toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">最終資産</span><span className={`font-bold ${isWin ? "text-green-600" : "text-red-500"}`}>¥{finalAmount.toLocaleString()}</span></div>
        </div>
      </div>

      {/* 学んだこと */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8">
        <p className="font-bold text-blue-900 mb-2">💡 この体験から学べること</p>
        <p className="text-sm text-blue-800 leading-relaxed">{lessons[investType.id]}</p>
        <p className="text-sm text-blue-700 mt-2 leading-relaxed">
          投資は「いつ買って、いつ売るか」という判断の連続です。正解はなく、自分の目的とリスク許容度に合った方法を選ぶことが大切です。
        </p>
      </div>

      {/* ボタン */}
      <div className="space-y-3">
        <button
          onClick={onRestart}
          className="w-full py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all text-lg active:scale-95"
        >
          🔄 もう一度体験する
        </button>
        <p className="text-center text-sm text-gray-400">別の目的・投資タイプでも試してみましょう</p>
      </div>
    </div>
  );
}

// ============================================================
// メインページ
// ============================================================
const FREE_SIM_CATEGORIES = [
  { id: "stock", label: "株式", desc: "個別企業の株を売買して利益を狙う" },
  { id: "fund", label: "投資信託", desc: "積立・複利効果をシミュレーション" },
  { id: "etf", label: "ETF", desc: "指数連動型ファンドを売買体験" },
  { id: "fx", label: "FX", desc: "リアル為替レートで通貨売買を体験" },
  { id: "reit", label: "REIT", desc: "不動産投資の家賃収入をシミュレーション" },
];

export default function SimulatorPage() {
  const [mode, setMode] = useState<"select" | "experience" | "free">("select");
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [investType, setInvestType] = useState<InvestType | null>(null);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [kept, setKept] = useState(false);
  const [freeSim, setFreeSim] = useState<string | null>(null);

  const restart = () => {
    setStep(0); setGoal(null); setProfile(null);
    setInvestType(null); setCurrentAmount(0); setEvents([]);
    setMode("select");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* モード選択 */}
        {mode === "select" && (
          <div>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">投資シミュレーター</h1>
              <p className="text-gray-500">実際に投資を体験して、お金の動かし方を学ぼう</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <button
                onClick={() => setMode("experience")}
                className="bg-white rounded-3xl p-8 border-2 border-blue-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all text-left group"
              >
                <div className="text-4xl mb-4">🎮</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">投資体験ツアー</h2>
                <p className="text-sm text-gray-500 mb-4">目的設定→投資→価格変動→判断→結果の5ステップで投資を体験</p>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">初心者おすすめ</span>
                  <span className="text-xs text-gray-400">約2分</span>
                </div>
              </button>
              <button
                onClick={() => setMode("free")}
                className="bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-gray-400 shadow-sm hover:shadow-md transition-all text-left"
              >
                <div className="text-4xl mb-4">📊</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">自由シミュレーター</h2>
                <p className="text-sm text-gray-500 mb-4">株式・投資信託・ETF・FX・REITを自由に操作して体験</p>
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">自由に操作</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* 体験ツアー */}
        {mode === "experience" && (
          <div>
            <button onClick={restart} className="mb-6 text-sm text-blue-600 hover:underline flex items-center gap-1">
              ← トップに戻る
            </button>
            <StepIndicator current={step} />
            {step === 0 && <Step1 onNext={(g, p) => { setGoal(g); setProfile(p); setStep(1); }} />}
            {step === 1 && goal && profile && <Step2 goal={goal} profile={profile} onNext={(t) => { setInvestType(t); setCurrentAmount(profile.amount); setStep(2); }} />}
            {step === 2 && investType && profile && <Step3 investType={investType} profile={profile} onNext={(amt, evs) => { setCurrentAmount(amt); setEvents(evs); setStep(3); }} />}
            {step === 3 && profile && <Step4 amount={currentAmount} initialAmount={profile.amount} onNext={(k) => { setKept(k); setStep(4); }} />}
            {step === 4 && goal && profile && investType && (
              <Step5 goal={goal} profile={profile} investType={investType} finalAmount={currentAmount} kept={kept} events={events} onRestart={restart} />
            )}
          </div>
        )}

        {/* 自由シミュレーター */}
        {mode === "free" && (
          <div>
            <button onClick={() => { setMode("select"); setFreeSim(null); }} className="mb-6 text-sm text-blue-600 hover:underline flex items-center gap-1">
              ← トップに戻る
            </button>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">自由シミュレーター</h1>
            <p className="text-gray-500 mb-8">投資の種類を選んでシミュレーションを始めよう。</p>
            {!freeSim ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {FREE_SIM_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFreeSim(cat.id)}
                    className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-left"
                  >
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{cat.label}</h2>
                    <p className="text-sm text-gray-500 mb-4">{cat.desc}</p>
                    <span className="text-sm text-blue-600 font-medium">シミュレーションする →</span>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <button onClick={() => setFreeSim(null)} className="mb-6 text-sm text-blue-600 hover:underline flex items-center gap-1">
                  ← 投資の種類を選び直す
                </button>
                {freeSim === "stock" && <StockSim />}
                {freeSim === "fund" && <FundSim />}
                {freeSim === "etf" && <EtfSim />}
                {freeSim === "fx" && <FxSim />}
                {freeSim === "reit" && <ReitSim />}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
