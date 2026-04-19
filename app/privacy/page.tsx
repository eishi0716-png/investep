import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col gap-8">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. 個人情報の取得について</h2>
            <p className="text-sm text-gray-600 leading-relaxed">当サイト（Investep）は、お問い合わせフォームの利用時に氏名・メールアドレス等の個人情報を取得する場合があります。</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. 個人情報の利用目的</h2>
            <p className="text-sm text-gray-600 leading-relaxed">取得した個人情報は、お問い合わせへの返答・サービス改善の目的にのみ使用し、第三者への提供は行いません。</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. アクセス解析ツールについて</h2>
            <p className="text-sm text-gray-600 leading-relaxed">当サイトでは、Googleアナリティクス等のアクセス解析ツールを使用する場合があります。これらのツールはCookieを使用してデータを収集しますが、個人を特定する情報は含まれません。</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. 広告について</h2>
            <p className="text-sm text-gray-600 leading-relaxed">当サイトでは、Google AdSenseおよびアフィリエイト広告を掲載しています。広告配信にはCookieが使用される場合があります。</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. 免責事項</h2>
            <p className="text-sm text-gray-600 leading-relaxed">当サイトのコンテンツは情報提供を目的としており、投資を推奨するものではありません。投資に関する最終判断はご自身の責任で行ってください。</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. お問い合わせ</h2>
            <p className="text-sm text-gray-600 leading-relaxed">プライバシーポリシーに関するお問い合わせは、<a href="/contact" className="text-blue-600 hover:underline">お問い合わせページ</a>よりご連絡ください。</p>
          </section>
          <p className="text-xs text-gray-400">制定日：2026年4月20日</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
