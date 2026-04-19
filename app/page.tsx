import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <section className="bg-[#0f2044] px-8 py-32 text-center">
        <p className="text-blue-300 text-sm font-medium mb-4 tracking-widest uppercase">学生から社会人まで</p>
        <h2 className="text-5xl font-bold text-white leading-tight mb-6">
          投資の一歩を、<br />ここから始めよう。
        </h2>
        <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
          用語解説・証券会社比較・仮想投資シミュレーターで、投資をわかりやすく学べるプラットフォーム。
        </p>
        <a href="/simulator" className="inline-block bg-blue-500 hover:bg-blue-400 text-white px-10 py-3 rounded-full font-medium transition-colors">
          無料で始める
        </a>
      </section>
      <section className="max-w-5xl mx-auto px-8 py-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
            <span className="text-blue-600 font-bold text-lg">語</span>
          </div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2">投資用語解説</h3>
          <p className="text-sm text-gray-500 leading-relaxed">PER・複利・NISAなど、初心者でもわかる言葉で丁寧に解説。</p>
          <a href="/glossary" className="inline-block mt-4 text-sm text-blue-600 font-medium hover:underline">記事を読む →</a>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
            <span className="text-blue-600 font-bold text-lg">比</span>
          </div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2">証券会社比較</h3>
          <p className="text-sm text-gray-500 leading-relaxed">SBI・楽天・松井など主要証券会社を手数料・機能・キャンペーンで比較。</p>
          <a href="/compare" className="inline-block mt-4 text-sm text-blue-600 font-medium hover:underline">比較する →</a>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
            <span className="text-blue-600 font-bold text-lg">試</span>
          </div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2">投資シミュレーター</h3>
          <p className="text-sm text-gray-500 leading-relaxed">仮想のお金で株や投資信託を体験。ランキングで他のユーザーと競おう。</p>
          <a href="/simulator" className="inline-block mt-4 text-sm text-blue-600 font-medium hover:underline">試してみる →</a>
        </div>
      </section>
      <section className="bg-[#0f2044] py-20 px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">まずはシミュレーターを試してみよう</h2>
        <p className="text-blue-200 mb-8">仮想資金100万円で、リスクなく投資を体験できます。</p>
        <a href="/simulator" className="inline-block bg-white text-[#0f2044] px-10 py-3 rounded-full font-medium hover:bg-blue-100 transition-colors">
          シミュレーターへ
        </a>
      </section>
      <Footer />
    </div>
  );
}
