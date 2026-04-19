export default function Footer() {
  return (
    <footer className="bg-[#0f2044] px-8 py-12 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
          <div>
            <p className="text-white text-xl font-bold tracking-widest mb-2">Investep</p>
            <p className="text-blue-300 text-sm">学生から社会人まで。投資の一歩をここから。</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-blue-300">
            <a href="/glossary" className="hover:text-white transition-colors">用語解説</a>
            <a href="/compare" className="hover:text-white transition-colors">証券会社比較</a>
            <a href="/simulator" className="hover:text-white transition-colors">シミュレーター</a>
            <a href="/news" className="hover:text-white transition-colors">ニュース</a>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-6 text-sm text-blue-400">
            <a href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</a>
            <a href="/contact" className="hover:text-white transition-colors">お問い合わせ</a>
          </div>
          <p className="text-blue-400 text-xs">© 2026 Investep. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}