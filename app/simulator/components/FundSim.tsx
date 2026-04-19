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

export default function FundSim() {
  const [monthly, setMonthly] = useState(30000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(20);

  const months = years * 12;
  const monthlyRate = rate / 100 / 12;
  const total = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  const principal = monthly * months;
  const profit = total - principal;

  const chartLabels = Array.from({ length: years }, (_, i) => (i + 1) + "年");
  const principalData = chartLabels.map((_, i) => monthly * (i + 1) * 12);
  const totalData = chartLabels.map((_, i) => {
    const m = (i + 1) * 12;
    return monthly * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate);
  });

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "総資産",
        data: totalData,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.08)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 2,
      },
      {
        label: "元本",
        data: principalData,
        borderColor: "#9ca3af",
        backgroundColor: "rgba(156,163,175,0.05)",
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0,
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" as const } },
    scales: {
      y: { ticks: { callback: (v: number) => "¥" + Math.round(v / 10000) + "万" } },
    },
  };

  return (
    <div>
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 text-sm text-blue-700">
        投資信託とは：毎月一定額を積み立て、複利の力で長期的に資産を増やす投資方法です。
      </div>
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">積立条件を設定</h2>
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">毎月の積立額</label>
              <span className="text-sm font-bold text-blue-600">¥{monthly.toLocaleString()}</span>
            </div>
            <input type="range" min="1000" max="100000" step="1000" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>¥1,000</span><span>¥100,000</span></div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">想定年利</label>
              <span className="text-sm font-bold text-blue-600">{rate}%</span>
            </div>
            <input type="range" min="1" max="15" step="0.5" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1%</span><span>15%</span></div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">積立期間</label>
              <span className="text-sm font-bold text-blue-600">{years}年</span>
            </div>
            <input type="range" min="1" max="40" step="1" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1年</span><span>40年</span></div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">資産推移チャート</h2>
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-400 mb-1">総積立額</p>
          <p className="text-2xl font-bold text-gray-900">¥{Math.round(principal).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-400 mb-1">最終資産額</p>
          <p className="text-2xl font-bold text-blue-600">¥{Math.round(total).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-400 mb-1">運用益</p>
          <p className="text-2xl font-bold text-green-600">+¥{Math.round(profit).toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">元本比率</span>
          <span className="font-medium">{Math.round((principal / total) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4 mb-4">
          <div className="bg-blue-600 h-4 rounded-full" style={{ width: Math.min((principal / total) * 100, 100) + "%" }}></div>
        </div>
        <div className="flex gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-600 rounded-full inline-block"></span>元本 {Math.round((principal / total) * 100)}%</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-200 rounded-full inline-block"></span>運用益 {Math.round((profit / total) * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
