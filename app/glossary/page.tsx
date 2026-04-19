import Header from "../components/Header";
import Footer from "../components/Footer";

const terms = [
  {
    id: "per",
    title: "PER（株価収益率）",
    category: "株式",
    summary: "株価が1株あたり利益の何倍かを示す指標。",
    body: "PER（Price Earnings Ratio）は、株価をEPS（1株あたり純利益）で割った値です。PERが低いほど割安、高いほど割高とされますが、業種や成長性によって適正値は異なります。一般的に15〜20倍が目安とされています。",
  },
  {
    id: "compound",
    title: "複利",
    category: "基礎知識",
    summary: "利息にも利息がつく仕組み。長期投資の強力な武器。",
    body: "複利とは、元本だけでなく利息にも利息がつく仕組みです。単利と比べて長期間運用するほど差が大きくなります。早く始めるほど効果が高まります。",
  },
  {
    id: "nisa",
    title: "NISA（少額投資非課税制度）",
    category: "制度",
    summary: "投資の利益が非課税になる国の制度。",
    body: "NISAは、株や投資信託の売却益・配当金が非課税になる制度です。2024年からは新NISAとなり、年間360万円まで投資可能で、非課税期間が無期限になりました。",
  },
  {
    id: "index",
    title: "インデックス投資",
    category: "投資手法",
    summary: "市場全体に連動する投資信託に投資する方法。",
    body: "インデックス投資とは、日経平均やS&P500などの指数に連動する投資信託に投資する手法です。分散投資が自動的にでき、コストが低いのが特徴です。",
  },
  {
    id: "etf",
    title: "ETF（上場投資信託）",
    category: "商品",
    summary: "株式市場に上場している投資信託。",
    body: "ETF（Exchange Traded Fund）は、株式市場に上場しており、株と同様にリアルタイムで売買できる投資信託です。コストが低く、流動性が高いのが特徴です。",
  },
  {
    id: "diversification",
    title: "分散投資",
    category: "基礎知識",
    summary: "複数の資産に投資してリスクを下げる考え方。",
    body: "分散投資とは、株・債券・不動産など異なる資産クラスや、国内・海外など異なる地域に投資を分散させることでリスクを低減する考え方です。",
  },
];

export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">投資用語解説</h1>
        <p className="text-gray-500 mb-10">初心者でもわかる言葉で、投資の基本用語を解説します。</p>
        <div className="grid grid-cols-1 gap-4">
          {terms.map((term) => (
            <div key={term.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                  {term.category}
                </span>
                <h2 className="text-lg font-semibold text-gray-900">{term.title}</h2>
              </div>
              <p className="text-sm text-gray-500 mb-3">{term.summary}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{term.body}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
