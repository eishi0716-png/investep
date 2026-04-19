"use client";
import { useState } from "react";
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

const etfs = [
  { id: "1306", name: "TOPIX連動型ETF", index: "TOPIX", price: 2850, change: 0.8, history: [2600,2650,2700,2680,2750,2800,2820,2850] },
  { id: "1321", name: "日経225連動型ETF", index: "日経平均", price: 38500, change: 1.1, history: [35000,36000,35500,37000,36500,38000,37800,38500] },
  { id: "2558", name: "S&P500連動型ETF", index: "S&P500", price: 19800, change: 1.4, history: [17000,17500,18000,17800,18500,19000,19400,19800] },
  { id: "2559", name: "全世界株式ETF", index: "MSCI ACWI", price: 14200, change: 0.6, history: [12500,12800,13000,12900,13200,13800,14000,14200] },
  { id: "2633", name: "NASDAQ100連動型ETF", index: "NASDAQ100", price: 22400, change: 2.1, history: [18000,19000,18500,20000,20500,21000,21800,22400] },
];

const labels = ["8週前","7週前","6週前","5週前","4週前","3週前","2週前","今週"];

export default function EtfSim() {
  const [cash, setCash] = useState(1000000);
  const [holdings, setHoldings] = useState<{ [key: string]: number }>({});
  const [message, setMessage] = useState("");
  const [selectedChart, setSelectedChart] = useState(etfs[0]);

  const buy = (etf: typeof etfs[0]) => {
    if (cash < etf.price) { setMessage("資金が足りません。"); return; }
    setCash((c) => c - etf.price);
    setHoldings((h) => ({ ...h, [etf.id]: (h[etf.id] || 0) + 1 }));
    setMessage(etf.name + "を1口購入しました。");
  };

  const sell = (etf: typeof etfs[0]) => {
    if (!holdings[etf.id] || holdings[etf.id] === 0) { setMessage("保有ETFがありません。"); return; }
    setCash((c) => c + etf.price);
    setHoldings((h) => ({ ...h, [etf.id]: h[etf.id] - 1 }));
    setMessage(etf.name + "を1口売却しました。");
  };

  const totalAsset = cash + etfs.reduce((sum, e) => sum + (holdings[e.id] || 0) * e.price, 0);
  const profit = totalAsset - 1000000;

  const chartData = {
    labels,
    datasets: [{
      label: selectedChart.name,
      data: selectedChart.history,
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
            return "¥" + Number(value).toLocaleString();
          }
        }
      }
    },
  };

  return (
    <div>
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 text-sm text-blue-700">
        ETFとは：日経平均やS&P500などの指数に連動する投資信託を、株のようにリアルタイムで売買できる商品です。
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
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">価格チャート</h2>
          <select value={selectedChart.id} onChange={(e) => setSelectedChart(etfs.find((s) => s.id === e.target.value) || etfs[0])} className="border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-900">
            {etfs.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>
        <Line data={chartData} options={chartOptions} />
      </div>
      {message && <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-3 rounded-xl mb-4">{message}</div>}
      <div className="grid grid-cols-1 gap-4">
        {etfs.map((etf) => (
          <div key={etf.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">{etf.name}</p>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{etf.index}</span>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900">¥{etf.price.toLocaleString()}</p>
              <p className={"text-xs font-medium " + (etf.change >= 0 ? "text-green-600" : "text-red-500")}>
                {etf.change >= 0 ? "+" : ""}{etf.change}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">保有数</p>
              <p className="font-bold text-gray-900">{holdings[etf.id] || 0}口</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => buy(etf)} className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">買う</button>
              <button onClick={() => sell(etf)} className="bg-gray-100 text-gray-700 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">売る</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
