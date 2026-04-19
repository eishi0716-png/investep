import Header from "../components/Header";
import Footer from "../components/Footer";

const brokers = [
  {
    name: "SBI証券",
    logo: "SBI",
    fee: "無料",
    nisa: "対応",
    app: "★★★★☆",
    beginner: "★★★★★",
    campaign: "口座開設で最大5,000円相当プレゼント",
    features: ["国内最大手", "投資信託2,600本以上", "米国株も充実"],
    recommend: true,
  },
  {
    name: "楽天証券",
    logo: "楽天",
    fee: "無料",
    nisa: "対応",
    app: "★★★★★",
    beginner: "★★★★☆",
    campaign: "楽天ポイントで投資できる",
    features: ["楽天ポイント投資", "アプリが使いやすい", "楽天経済圏と相性◎"],
    recommend: false,
  },
  {
    name: "松井証券",
    logo: "松井",
    fee: "無料",
    nisa: "対応",
    app: "★★★☆☆",
    beginner: "★★★★☆",
    campaign: "サポートが充実",
    features: ["老舗の信頼感", "サポート充実", "初心者向けコンテンツ豊富"],
    recommend: false,
  },
  {
    name: "マネックス証券",
    logo: "MNX",
    fee: "無料",
    nisa: "対応",
    app: "★★★★☆",
    beginner: "★★★☆☆",
    campaign: "米国株の取扱銘柄数No.1",
    features: ["米国株に強い", "分析ツールが充実", "IPO実績豊富"],
    recommend: false,
  },
];

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="max-w-5xl mx-auto px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">証券会社比較</h1>
        <p className="text-gray-500 mb-10">主要証券会社を手数料・機能・キャンペーンで比較しました。</p>
        <div className="grid grid-cols-1 gap-6">
          {brokers.map((broker) => (
            <div key={broker.name} className={`bg-white rounded-2xl p-8 shadow-sm border hover:shadow-md transition-all duration-200 ${broker.recommend ? "border-blue-400 ring-2 ring-blue-100" : "border-gray-100"}`}>
              {broker.recommend && (
                <span className="inline-block bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full mb-4">おすすめ No.1</span>
              )}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm bg-blue-50 text-blue-600">
                    {broker.logo}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{broker.name}</h2>
                </div>
                <a href="#" className="bg-[#0f2044] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-800 transition-colors">
                  口座開設
                </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">取引手数料</p>
                  <p className="font-semibold text-gray-900">{broker.fee}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">NISA</p>
                  <p className="font-semibold text-gray-900">{broker.nisa}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">アプリ評価</p>
                  <p className="font-semibold text-gray-900 text-sm">{broker.app}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">初心者向け</p>
                  <p className="font-semibold text-gray-900 text-sm">{broker.beginner}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {broker.features.map((f) => (
                  <span key={f} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">{f}</span>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">キャンペーン：</span>{broker.campaign}
              </p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-8 text-center">
          ※情報は随時更新しています。口座開設前に各社の公式サイトをご確認ください。
        </p>
      </div>
      <Footer />
    </div>
  );
}
