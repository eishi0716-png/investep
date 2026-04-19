"use client";
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const PAIRS = [
  { id: "USDJPY", label: "ドル / 円", base: "USD", quote: "JPY" },
  { id: "EURJPY", label: "ユーロ / 円", base: "EUR", quote: "JPY" },
  { id: "GBPJPY", label: "ポンド / 円", base: "GBP", quote: "JPY" },
  { id: "AUDJPY", label: "豪ドル / 円", base: "AUD", quote: "JPY" },
  { id: "CNYJPY", label: "人民元 / 円", base: "CNY", quote: "JPY" },
  { id: "KRWJPY", label: "韓国ウォン / 円", base: "KRW", quote: "JPY" },
  { id: "CHFJPY", label: "スイスフラン / 円", base: "CHF", quote: "JPY" },
  { id: "CADJPY", label: "カナダドル / 円", base: "CAD", quote: "JPY" },
];

type Rates = { [key: string]: number };
type Position = { pair: string; type: "buy" | "sell"; rate: number; units: number };

const mockHistory: { [key: string]: number[] } = {
  USDJPY: [144.5,145.2,146.8,147.1,146.5,147.8,148.2,148.5],
  EURJPY: [157.2,158.5,159.1,160.2,159.8,160.5,161.0,161.2],
  GBPJPY: [184.5,185.2,186.8,187.1,186.5,187.8,188.2,188.4],
  AUDJPY: [95.2,96.1,96.8,97.2,96.9,97.1,97.3,97.3],
  CNYJPY: [19.8,20.0,20.1,20.2,20.3,20.3,20.4,20.4],
  KRWJPY: [0.104,0.105,0.106,0.107,0.107,0.108,0.108,0.108],
  CHFJPY: [162.5,163.2,164.1,164.8,164.5,165.0,165.1,165.2],
  CADJPY: [107.5,108.2,108.8,109.2,109.0,109.5,109.7,109.8],
};

const labels = ["8週前","7週前","6週前","5週前","4週前","3週前","2週前","今週"];

export default function FxSim() {
  const [rates, setRates] = useState<Rates>({});
  const [loading, setLoading] = useState(true);
  const [cash, setCash] = useState(1000000);
  const [positions, setPositions] = useState<Position[]>([]);
  const [message, setMessage] = useState("");
  const [units, setUnits] = useState(10000);
  const [selectedPair, setSelectedPair] = useState(PAIRS[0]);

  useEffect(() => {
    fetch("https://api.frankfurter.app/latest?from=JPY&to=USD,EUR,GBP,AUD,CHF,CAD,CNY,KRW")
      .then((r) => r.json())
      .then((data) => {
        const r: Rates = {};
        Object.entries(data.rates as Rates).forEach(([k, v]) => {
          r[k + "JPY"] = Math.round((1 / v) * 100) / 100;
        });
        setRates(r);
        setLoading(false);
      })
      .catch(() => {
        setRates({ USDJPY: 148.5, EURJPY: 161.2, GBPJPY: 188.4, AUDJPY: 97.3, CNYJPY: 20.4, KRWJPY: 0.108, CHFJPY: 165.2, CADJPY: 109.8 });
        setLoading(false);
      });
  }, []);

  const openPosition = (pair: typeof PAIRS[0], type: "buy" | "sell") => {
    const rate = rates[pair.id];
    if (!rate) return;
    const cost = units * 0.01;
    if (cash < cost) { setMessage("証拠金が足りません。"); return; }
    setCash((c) => c - cost);
    setPositions((p) => [...p, { pair: pair.id, type, rate, units }]);
    setMessage(pair.label + "の" + (type === "buy" ? "買い" : "売り") + "ポジションを建てました。");
  };

  const closePosition = (index: number) => {
    const pos = positions[index];
    const currentRate = rates[pos.pair];
    const pairInfo = PAIRS.find((p) => p.id === pos.pair);
    if (!currentRate || !pairInfo) return;
    const diff = pos.type === "buy" ? currentRate - pos.rate : pos.rate - currentRate;
    const pl = diff * pos.units;
    const margin = pos.units * 0.01;
    setCash((c) => c + margin + pl);
    setPositions((p) => p.filter((_, i) => i !== index));
    setMessage(pairInfo.label + "を決済しました。損益: " + (pl >= 0 ? "+" : "") + Math.round(pl) + "円");
  };

  const chartData = {
    labels,
    datasets: [{
      label: selectedPair.label,
      data: mockHistory[selectedPair.id],
      borderColor: "#2563eb",
      backgroundColor: "rgba(37,99,235,0.08)",
      borderWidth: 2,
      pointRadius: 4,
      tension: 0.4,
      fill: true,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        ticks: {
          callback: function(value: string | number) {
            return Number(value).toFixed(selectedPair.id === "KRWJPY" ? 4 : 2) + "円";
          }
        }
      }
    },
  };

  return (
    <div>
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 text-sm text-blue-700">
        FXとは：異なる通貨を売買して為替差益を狙う投資です。リアルタイムの為替レートでシミュレーションできます。
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-400 mb-1">証拠金残高</p>
          <p className="text-2xl font-bold text-gray-900">¥{Math.round(cash).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-400 mb-1">取引単位</p>
          <select value={units} onChange={(e) => setUnits(Number(e.target.value))} className="mt-1 border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-900">
            <option value={1000}>1,000通貨</option>
            <option value={10000}>10,000通貨</option>
            <option value={100000}>100,000通貨</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">為替チャート</h2>
          <select value={selectedPair.id} onChange={(e) => setSelectedPair(PAIRS.find((p) => p.id === e.target.value) || PAIRS[0])} className="border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-900">
            {PAIRS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>
        <Line data={chartData} options={chartOptions} />
      </div>
      {message && <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-3 rounded-xl mb-4">{message}</div>}
      {loading ? (
        <div className="text-center text-gray-400 py-8">為替レートを取得中...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 mb-8">
          {PAIRS.map((pair) => (
            <div key={pair.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{pair.label}</p>
                <p className="text-xs text-gray-400">{pair.base}/{pair.quote}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{rates[pair.id]?.toFixed(pair.id === "KRWJPY" ? 4 : 2)}</p>
                <p className="text-xs text-gray-400">円</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openPosition(pair, "buy")} className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">買い</button>
                <button onClick={() => openPosition(pair, "sell")} className="bg-red-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition-colors">売り</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {positions.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">保有ポジション</h2>
          <div className="flex flex-col gap-3">
            {positions.map((pos, i) => {
              const pairInfo = PAIRS.find((p) => p.id === pos.pair);
              const currentRate = rates[pos.pair];
              const diff = pos.type === "buy" ? currentRate - pos.rate : pos.rate - currentRate;
              const pl = diff * pos.units;
              return (
                <div key={i} className="flex items-center justify-between text-sm border-b border-gray-50 pb-3">
                  <span className="text-gray-700">{pairInfo?.label}</span>
                  <span className={"px-2 py-0.5 rounded-full text-xs font-medium " + (pos.type === "buy" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600")}>
                    {pos.type === "buy" ? "買い" : "売り"}
                  </span>
                  <span className="text-gray-500">建値: {pos.rate.toFixed(2)}</span>
                  <span className={"font-medium " + (pl >= 0 ? "text-green-600" : "text-red-500")}>
                    {pl >= 0 ? "+" : ""}{Math.round(pl)}円
                  </span>
                  <button onClick={() => closePosition(i)} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs hover:bg-gray-200 transition-colors">決済</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
