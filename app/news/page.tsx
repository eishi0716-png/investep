"use client";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
};

const mockNews: NewsItem[] = [
  { title: "日銀、政策金利を据え置き　次回会合に注目集まる", link: "#", pubDate: "2026-04-20", source: "Reuters" },
  { title: "米国株、ナスダックが反発　AI関連銘柄が牽引", link: "#", pubDate: "2026-04-20", source: "Reuters" },
  { title: "円相場、1ドル148円台で推移　介入警戒続く", link: "#", pubDate: "2026-04-19", source: "Reuters" },
  { title: "新NISA、口座開設数が1000万件を突破", link: "#", pubDate: "2026-04-19", source: "日経" },
  { title: "トヨタ、通期業績予想を上方修正　円安が追い風", link: "#", pubDate: "2026-04-18", source: "日経" },
  { title: "S&P500、史上最高値を更新　利下げ期待が再燃", link: "#", pubDate: "2026-04-18", source: "Reuters" },
  { title: "インデックス投資信託、純資産残高が過去最高に", link: "#", pubDate: "2026-04-17", source: "日経" },
  { title: "原油価格が上昇、中東情勢の緊張を背景に", link: "#", pubDate: "2026-04-17", source: "Reuters" },
];

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNews(mockNews);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">投資ニュース</h1>
        <p className="text-gray-500 mb-10">最新の金融・投資ニュースをお届けします。</p>
        {loading ? (
          <div className="flex flex-col gap-4">
            {[0,1,2,3,4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-100 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {news.map((item, i) => (
              <a key={i} href={item.link} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 block">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{item.source}</span>
                  <span className="text-xs text-gray-400">{item.pubDate}</span>
                </div>
                <p className="text-gray-900 font-medium leading-relaxed">{item.title}</p>
                <p className="text-xs text-blue-500 mt-2">元記事を読む →</p>
              </a>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-8 text-center">
          ※ニュースは各社の公式サイトへリンクしています。投資判断はご自身の責任で行ってください。
        </p>
      </div>
      <Footer />
    </div>
  );
}
