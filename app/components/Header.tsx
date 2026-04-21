"use client";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#0f2044] px-8 py-4 sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a href="/" className="text-white text-xl font-bold tracking-widest hover:opacity-80 transition-opacity">
          Investep
        </a>
        <nav className="hidden sm:flex items-center gap-1">
          <a href="/glossary" className="px-4 py-2 rounded-full text-sm font-medium text-blue-200 hover:text-white hover:bg-white/10 transition-all">用語解説</a>
          <a href="/compare" className="px-4 py-2 rounded-full text-sm font-medium text-blue-200 hover:text-white hover:bg-white/10 transition-all">証券会社比較</a>
          <a href="/simulator" className="px-4 py-2 rounded-full text-sm font-medium text-blue-200 hover:text-white hover:bg-white/10 transition-all">シミュレーター</a>
          <a href="/news" className="px-4 py-2 rounded-full text-sm font-medium text-blue-200 hover:text-white hover:bg-white/10 transition-all">ニュース</a>
          <a href="/stocks" className="px-4 py-2 rounded-full text-sm font-bold bg-blue-500 text-white hover:bg-blue-400 transition-all">📈 株価</a>
        </nav>
        <button className="sm:hidden text-white text-xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "X" : "="}
        </button>
      </div>
      {menuOpen && (
        <div className="sm:hidden mt-4 flex flex-col gap-2 pb-2">
          <a href="/glossary" className="text-blue-200 hover:text-white px-4 py-2 text-sm">用語解説</a>
          <a href="/compare" className="text-blue-200 hover:text-white px-4 py-2 text-sm">証券会社比較</a>
          <a href="/simulator" className="text-blue-200 hover:text-white px-4 py-2 text-sm">シミュレーター</a>
          <a href="/news" className="text-blue-200 hover:text-white px-4 py-2 text-sm">ニュース</a>
          <a href="/stocks" className="text-white font-bold px-4 py-2 text-sm bg-blue-500 rounded-full w-fit">📈 株価</a>
        </div>
      )}
    </header>
  );
}
