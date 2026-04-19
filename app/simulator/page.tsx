"use client";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StockSim from "./components/StockSim";
import FundSim from "./components/FundSim";
import EtfSim from "./components/EtfSim";
import FxSim from "./components/FxSim";
import ReitSim from "./components/ReitSim";

const categories = [
  { id: "stock", label: "株式", desc: "個別企業の株を売買して利益を狙う" },
  { id: "fund", label: "投資信託", desc: "積立・複利効果をシミュレーション" },
  { id: "etf", label: "ETF", desc: "指数連動型ファンドを売買体験" },
  { id: "fx", label: "FX", desc: "リアル為替レートで通貨売買を体験" },
  { id: "reit", label: "REIT", desc: "不動産投資の家賃収入をシミュレーション" },
];

export default function SimulatorPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="max-w-5xl mx-auto px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">投資シミュレーター</h1>
        <p className="text-gray-500 mb-10">投資の種類を選んでシミュレーションを始めよう。</p>
        {!selected ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelected(cat.id)}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-left"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-2">{cat.label}</h2>
                <p className="text-sm text-gray-500 mb-4">{cat.desc}</p>
                <span className="text-sm text-blue-600 font-medium">シミュレーションする →</span>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelected(null)}
              className="mb-8 text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              ← 投資の種類を選び直す
            </button>
            {selected === "stock" && <StockSim />}
            {selected === "fund" && <FundSim />}
            {selected === "etf" && <EtfSim />}
            {selected === "fx" && <FxSim />}
            {selected === "reit" && <ReitSim />}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
