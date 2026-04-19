"use client";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="max-w-2xl mx-auto px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">お問い合わせ</h1>
        <p className="text-gray-500 mb-10">ご質問・ご意見はこちらからお送りください。</p>
        {sent ? (
          <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-2xl">✓</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">送信完了しました</h2>
            <p className="text-sm text-gray-500 mb-6">お問い合わせありがとうございます。内容を確認の上、ご返信いたします。</p>
            <a href="/" className="inline-block bg-[#0f2044] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-blue-800 transition-colors">
              トップに戻る
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">お名前</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="山田 太郎" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">お問い合わせ内容</label>
                <textarea required value={message} onChange={(e) => setMessage(e.target.value)} placeholder="お問い合わせ内容をご記入ください。" rows={6} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
              </div>
              <button type="submit" className="bg-[#0f2044] text-white px-8 py-3 rounded-full font-medium hover:bg-blue-800 transition-colors">
                送信する
              </button>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
