"use client";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const stocks = [
  { id: "7203", name: "トヨタ自動車", price: 3200, change: 1.2, history: [2800,2900,2850,3000,2950,3100,3050,3200] },
  { id: "6758", name: "ソニーグループ", price: 12800, change: -0.8, history: [13200,13000,12900,13100,12800,12600,12750,12800] },
  { id: "9984", name: "ソフトバンクG", price: 7400, change: 2.1, history: [6800,7000,6900,7100,7200,7000,7300,7400] },
  { id: "6861", name: "キーエンス", price: 65000, change: 0.5, history: [62000,63000,62500,64000,63500,64500,64800,65000] },
  { id: "AAPL", name: "Apple", price: 21500, change: 0.9, history: [20000,20500,20200,21000,20800,21200,21300,21500] },
  { id: "NVDA", name: "NVIDIA", price: 98000, change: 3.2, history: [85000,88000,87000,90000,92000,94000,95000,98000] },
  { id: "MSFT", name: "Microsoft", price: 45000, change: -0.4, history: [44000,45000,44500,45500,45200,45800,45300,45000] },
];

const labels = ["8週前","7週前","6週前","5週前","4週前","3週前","2週前","今週"];

export default function StockSim() {
  const [cash, setCash] = useState(1000000);
  const [holdings, setHoldings] = useState<{ [key: string]: number }>({});
  const [message, setMessage] = useState("");
  const [selectedChart, setSelectedChart] = useState(stocks[0]);

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
      y: { ticks: { callback: (v: number) => "¥" + v.toLocaleString() } },
    },
  };

  return (
    <div>
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
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">株価チャート</h2>
          <select value={selectedChart.id} onChange={(e) => setSelectedChart(stocks.find((s) => s.id === e.target.value) || stocks[0])} className="border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-900">
            {stocks.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <Line data={chartData} options={chartOptions as any} />
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
