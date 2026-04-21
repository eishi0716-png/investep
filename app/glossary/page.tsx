import Header from "../components/Header";
import Footer from "../components/Footer";

const terms = [
  { id: "per", title: "PER（株価収益率）", category: "株式", summary: "株価が1株あたり利益の何倍かを示す指標。", body: "PER（Price Earnings Ratio）は、株価をEPS（1株あたり純利益）で割った値です。PERが低いほど割安、高いほど割高とされますが、業種や成長性によって適正値は異なります。一般的に15〜20倍が目安とされています。" },
  { id: "compound", title: "複利", category: "基礎知識", summary: "利息にも利息がつく仕組み。長期投資の強力な武器。", body: "複利とは、元本だけでなく利息にも利息がつく仕組みです。単利と比べて長期間運用するほど差が大きくなります。早く始めるほど効果が高まります。" },
  { id: "nisa", title: "NISA（少額投資非課税制度）", category: "制度", summary: "投資の利益が非課税になる国の制度。", body: "NISAは、株や投資信託の売却益・配当金が非課税になる制度です。2024年からは新NISAとなり、年間360万円まで投資可能で、非課税期間が無期限になりました。" },
  { id: "index", title: "インデックス投資", category: "投資手法", summary: "市場全体に連動する投資信託に投資する方法。", body: "インデックス投資とは、日経平均やS&P500などの指数に連動する投資信託に投資する手法です。分散投資が自動的にでき、コストが低いのが特徴です。" },
  { id: "etf", title: "ETF（上場投資信託）", category: "商品", summary: "株式市場に上場している投資信託。", body: "ETF（Exchange Traded Fund）は、株式市場に上場しており、株と同様にリアルタイムで売買できる投資信託です。コストが低く、流動性が高いのが特徴です。" },
  { id: "diversification", title: "分散投資", category: "基礎知識", summary: "複数の資産に投資してリスクを下げる考え方。", body: "分散投資とは、株・債券・不動産など異なる資産クラスや、国内・海外など異なる地域に投資を分散させることでリスクを低減する考え方です。" },
  { id: "pbr", title: "PBR（株価純資産倍率）", category: "株式", summary: "株価が1株あたり純資産の何倍かを示す指標。", body: "PBR（Price Book-value Ratio）は、株価を1株あたり純資産で割った値です。PBRが1倍を下回ると、理論上は解散価値より安く買えることを意味します。" },
  { id: "roe", title: "ROE（自己資本利益率）", category: "株式", summary: "株主の資本をどれだけ効率的に使って利益を上げているかを示す指標。", body: "ROE（Return On Equity）は、純利益を自己資本で割った値をパーセントで表したものです。一般的に10%以上が優良企業の目安とされています。" },
  { id: "dollar-cost", title: "ドルコスト平均法", category: "投資手法", summary: "定期的に一定金額を投資することでリスクを下げる手法。", body: "ドルコスト平均法とは、価格に関係なく毎月一定金額を購入し続ける投資手法です。平均購入単価を下げる効果があります。" },
  { id: "rebalancing", title: "リバランス", category: "投資手法", summary: "資産配分を定期的に見直して元の比率に戻すこと。", body: "リバランスとは、崩れてきた資産配分を元の目標比率に戻す作業のことです。半年〜1年に1回が目安です。" },
  { id: "sp500", title: "S&P500", category: "指数", summary: "米国を代表する500社の株価指数。", body: "S&P500とは、米国の主要500社の株式で構成される株価指数です。長期的に年平均7〜10%のリターンがあるとされ、インデックス投資の定番です。" },
  { id: "nikkei225", title: "日経平均株価", category: "指数", summary: "日本を代表する225社の株価指数。", body: "日経平均株価（日経225）は、東京証券取引所に上場する225社の株価をもとに算出される指数です。日本経済の景況感を示す代表的な指標です。" },
  { id: "bond", title: "債券", category: "商品", summary: "国や企業にお金を貸して利息を受け取る投資商品。", body: "債券とは、国や企業が資金調達のために発行する証券です。定期的に利息を受け取り、満期になると元本が返ってきます。" },
  { id: "reit", title: "REIT（不動産投資信託）", category: "商品", summary: "不動産に少額から投資できる投資信託。", body: "REITは、不動産を購入・運営し、賃料収入や売却益を分配する投資信託です。少額から不動産投資ができ、流動性が高いのが特徴です。" },
  { id: "ideco", title: "iDeCo（個人型確定拠出年金）", category: "制度", summary: "老後資産形成のための節税効果が高い制度。", body: "iDeCoは、掛け金が全額所得控除になる老後資産形成の制度です。20〜60歳が加入でき、大きな節税効果があります。" },
  { id: "leverage", title: "レバレッジ", category: "基礎知識", summary: "少ない資金で大きな取引をする仕組み。リスクも拡大する。", body: "レバレッジとは、証拠金を担保に元手の数倍の取引を行う仕組みです。利益も損失も拡大するため初心者は注意が必要です。" },
  { id: "dividend", title: "配当金", category: "株式", summary: "企業が利益の一部を株主に分配するお金。", body: "配当金とは、企業が利益の一部を株主に支払うお金です。配当利回りが高い株を高配当株といい、安定収入を求める投資家に人気です。" },
  { id: "eps", title: "EPS（1株あたり利益）", category: "株式", summary: "1株に対してどれだけ利益を生み出しているかを示す指標。", body: "EPS（Earnings Per Share）は、純利益を発行済み株式数で割った値です。PERの計算にも使われる重要な指標です。" },
  { id: "portfolio", title: "ポートフォリオ", category: "基礎知識", summary: "保有している資産の組み合わせ・構成のこと。", body: "ポートフォリオとは、保有している株式・債券・不動産などの資産の組み合わせのことです。リスクとリターンのバランスを考えることが重要です。" },
  { id: "volatility", title: "ボラティリティ", category: "基礎知識", summary: "価格の変動の大きさを示す指標。", body: "ボラティリティとは、資産価格の変動の激しさを示す指標です。仮想通貨は高ボラティリティ、国債は低ボラティリティの代表例です。" },
  { id: "market-cap", title: "時価総額", category: "株式", summary: "企業の株式の市場価値の合計。企業規模を示す指標。", body: "時価総額とは、株価に発行済み株式数を掛けた値で、企業全体の市場価値を表します。" },
  { id: "stop-loss", title: "損切り（ストップロス）", category: "投資手法", summary: "損失が一定以上になったら売却して損失を確定させること。", body: "損切りとは、値下がりした際に損失が拡大する前に売却することです。損切りルールを決めておくことはリスク管理の基本です。" },
  { id: "asset-allocation", title: "アセットアロケーション", category: "投資手法", summary: "資産をどの種類にどれだけ配分するかを決めること。", body: "アセットアロケーションとは、株式・債券・不動産・現金などへの配分比率を決めることです。投資成果の大部分はこれで決まるといわれています。" },
  { id: "growth-stock", title: "グロース株・バリュー株", category: "株式", summary: "成長期待が高い株と割安な株の2種類の投資スタイル。", body: "グロース株は高い成長率が期待される企業の株、バリュー株は本来の価値より安く評価されている割安な株です。" },
];

export default function GlossaryPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">投資用語解説</h1>
        <p className="text-gray-500 mb-4">初心者でもわかる言葉で、投資の基本用語を解説します。</p>
        <p className="text-sm text-blue-600 mb-10">全{terms.length}記事</p>
        <div className="grid grid-cols-1 gap-4">
          {terms.map((term) => (
            <div key={term.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{term.category}</span>
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
