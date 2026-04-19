"use client";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const reits = [
  { id: "8951", name: "日本ビルファンド", type: "オフィス", price: 620000, yield: 3.2, history: [580000,590000,600000,595000,605000,610000,615000,620000] },
  { id: "8952", name: "ジャパンリアルエステイト", type: "オフィス", price: 580000, yield: 3.5, history: [550000,555000,560000,558000,565000,570000,575000,580000] },
  { id: "3269", name: "アドバンス・レジデンス", type: "住宅", price: 320000, yield: 4.1, history: [300000,305000,308000,310000,312000,315000,318000,320000] },
  { id: "3283", name: "日本プロロジスリート", type: "物流", price: 280000, yield: 3.8, history: [260000,265000,268000,270000,272000,275000,278000,280000] },
  { id: "3226", name: "日本リテールファンド", type: "商業施設", price: 180000, yield: 4.5, history: [165000,168000,170000,172000,174000,176000,178000,180000] },
];

const labels = ["8週前","7週前","6週前","5週前","4週前","3週前","2週前","今週"];

export default function ReitSim() {
  const [cash, setCash] = useState(3000000);
  const [holdings, setHoldings] = useState<{ [key: string]: number }>({});
  const [message, setMessage] = useState("");
  const [selectedChart, setSelectedChart] = useState(reits[0]);

  const buy = (reit: typeof reits[0]) => {
    if (cash < reit.price) { setMessage("資金が足りません。"); return; }
    setCash((c) => c - reit.price);
    setHoldings((h) => ({ ...h, [reit.id]: (h[reit.id] || 0) + 1 }));
    setMessage(reit.name + "を1口購入しました。");
  };

  const sell = (reit: typeof reits[0]) => {
    if (!holdings[reit.id] || holdings[reit.id] === 0) { setMessage("保有REITがありません。"); return; }
    setCash((c) => c + reit.price);
    setHoldings((h) => ({ ...h, [reit.id]: h[reit.id] - 1 }));
    setMessage(reit.name + "を1口売却しました。");
  };

  const totalAsset = cash + reits.reduce((sum, r) => sum + (holdings[r.id] || 0) * r.price, 0);
  const annualIncome = reits.reduce((sum, r) => sum + (holdings[r.id] || 0) * r.price * (r.yield / 100), 0);
  const monthlyIncome = annualIncome / 12;

  const chartData = {
    labels,
    datasets: [{
      label: selectedChart.name + " 価格推移",
      data: selectedChart.history,
      backgroundColor: "rgba(37,99,235,0.7)",
      borderColor: "#2563eb",
      borderWidth: 1,
      borderRadius: 6,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { ticks: { callback: (v: number) => "¥" + (v / 10000).toFixed(0) + "万" } },
    },
  };

  return (
    <div>
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 text-sm text-blue-700">
        REITとは：不動産投資信託のことで、複数の不動産に少額から投資でき、家賃収入に相当する分配金を受け取れます。
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-400 mb-1">保有現金</p>
          <p className="text-xl font-bold text-gray-900">¥{cash.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-400 mb-1">総資産</p>
          <p className="text-xl font-bold text-blue-600">¥{totalAsset.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-400 mb-1">年間分配金</p>
          <p className="text-xl font-bold text-green-600">¥{Math.round(annualIncome).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-400 mb-1">月間分配金</p>
          <p className="text-xl font-bold text-green-600">¥{Math.round(monthlyIncome).toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">価格チャート</h2>
          <select value={selectedChart.id} onChange={(e) => setSelectedChart(reits.find((r) => r.id === e.target.value) || reits[0])} className="border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-900">
            {reits.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <Bar data={chartData} options={chartOptions as any} />
      </div>
      {message && <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-3 rounded-xl mb-4">{message}</div>}
      <div className="grid grid-cols-1 gap-4">
        {reits.map((reit) => (
          <div key={reit.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{reit.name}</p>
              <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">{reit.type}</span>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900">¥{reit.price.toLocaleString()}</p>
              <p className="text-xs text-green-600 font-medium">利回り {reit.yield}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">保有数</p>
              <p className="font-bold text-gray-900">{holdings[reit.id] || 0}口</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">年間分配金</p>
              <p className="text-sm font-medium text-green-600">¥{Math.round((holdings[reit.id] || 0) * reit.price * (reit.yield / 100)).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => buy(reit)} className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">買う</button>
              <button onClick={() => sell(reit)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">売る</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
