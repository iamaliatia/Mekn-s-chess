import { useState } from "react";
import ChessBoard from "./components/ChessBoard";
import PuzzleSolver from "./components/PuzzleSolver";
import MeknesChat from "./components/MeknesChat";
import LocationFinder from "./components/LocationFinder";
import AIPositionAnalyzer from "./components/AIPositionAnalyzer";
import { Award, BookOpen, Coffee, MessageSquare, Play, Sparkles, MapPin, Users, HelpCircle, Trophy } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"play" | "puzzles" | "chat" | "cafes" | "openings">("play");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-600 selection:text-white pb-12">
      {/* Top Subtle Moroccan Geometric Line Accent */}
      <div className="h-1.5 bg-gradient-to-r from-emerald-600 via-amber-500 to-emerald-600 w-full" />

      {/* Main Premium Header Branding */}
      <header className="bg-slate-900/60 border-b border-slate-900 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-serif text-2xl font-bold text-white shadow-lg shadow-emerald-950/40 border border-emerald-500/30">
            ♟
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-l from-slate-100 to-slate-300 bg-clip-text text-transparent">
                ملتقى مكناس للشطرنج
              </h1>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                Meknes Chess Hub
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              بوابة تفاعلية للعب، حل الألغاز، ومناقشة التكتيكات لمجتمع العاصمة الإسماعيلية
            </p>
          </div>
        </div>

        {/* Local Fast Stats Row */}
        <div className="flex items-center gap-6 text-xs text-slate-400 font-semibold bg-slate-950/60 p-2.5 px-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>نشطون: <strong className="text-slate-200">84+ لاعباً</strong></span>
          </div>
          <div className="w-[1px] h-4 bg-slate-800" />
          <div className="flex items-center gap-1.5">
            <Coffee className="w-4 h-4 text-amber-400" />
            <span>مقاهي ونوادي: <strong className="text-slate-200">6 مقرات</strong></span>
          </div>
          <div className="w-[1px] h-4 bg-slate-800" />
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>دوري قادم: <strong className="text-emerald-400">بطولة كاميليا</strong></span>
          </div>
        </div>
      </header>

      {/* Main Visual Sub-Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-l from-emerald-950/40 via-slate-900 to-slate-950 p-6 md:p-8 border border-slate-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800/30 w-fit block">
              شطرنج مكناس الإسماعيلية • Meknes Esmaïlia
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100">
              "الشطرنج أسلوب حياة وتدريب عميق للعقل"
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              تأسست هذه المنصة خصيصاً للشطرنجيين المكناسيين لتوثيق وحل الألغاز المستخلصة مباشرة من نقاشات مجموعة الواتساب، وتسهيل لقاءات اللعب الحية في مقهى <strong className="text-slate-300">دينامو فير</strong>، مقهى <strong className="text-slate-300">تايريس</strong>، ونادي <strong className="text-slate-300">إقامة سجلماسة بكاميليا</strong>.
            </p>
          </div>
          <div className="shrink-0 flex md:flex-col items-center gap-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-850">
            <span className="text-[10px] text-slate-500 font-bold block">مخصصة لتكريم روح الراحل:</span>
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
              🎖 الأستاذ لحسن بوشيبة
            </span>
            <span className="text-[10px] text-emerald-500/90 italic font-medium">قيدوم شطرنجيي مكناس</span>
          </div>
        </div>
      </div>

      {/* Modern Dashboard Navigation Tabs bar */}
      <nav className="max-w-7xl mx-auto px-4 mt-6">
        <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl grid grid-cols-2 sm:grid-cols-5 gap-2 shadow-lg">
          <button
            id="tab-play"
            onClick={() => setActiveTab("play")}
            className={`py-3 px-4 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-2 ${
              activeTab === "play"
                ? "bg-emerald-600 text-white shadow shadow-emerald-600/30"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Play className="w-4 h-4" />
            <span>لعب الشطرنج (Play)</span>
          </button>

          <button
            id="tab-puzzles"
            onClick={() => setActiveTab("puzzles")}
            className={`py-3 px-4 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-2 ${
              activeTab === "puzzles"
                ? "bg-emerald-600 text-white shadow shadow-emerald-600/30"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>حل الألغاز (Puzzles)</span>
          </button>

          <button
            id="tab-chat"
            onClick={() => setActiveTab("chat")}
            className={`py-3 px-4 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-2 ${
              activeTab === "chat"
                ? "bg-emerald-600 text-white shadow shadow-emerald-600/30"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>النقاش والشات (Forum)</span>
          </button>

          <button
            id="tab-cafes"
            onClick={() => setActiveTab("cafes")}
            className={`py-3 px-4 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-2 ${
              activeTab === "cafes"
                ? "bg-emerald-600 text-white shadow shadow-emerald-600/30"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>مقاهي ونوادي مكناس</span>
          </button>

          <button
            id="tab-openings"
            onClick={() => setActiveTab("openings")}
            className={`col-span-2 sm:col-span-1 py-3 px-4 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-2 ${
              activeTab === "openings"
                ? "bg-emerald-600 text-white shadow shadow-emerald-600/30"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>الافتتاحيات والتكتيك</span>
          </button>
        </div>
      </nav>

      {/* Main Dynamic Viewport Mount */}
      <main className="max-w-7xl mx-auto px-4 mt-6">
        <div className="transition-all duration-300">
          {activeTab === "play" && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-4 text-center md:text-right">
                <h2 className="text-2xl font-extrabold text-slate-100 flex items-center justify-center md:justify-start gap-2">
                  <Play className="w-6 h-6 text-emerald-400" /> خض جولة شطرنجية فورية!
                </h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  العب الشطرنج محلياً مع صديقك بنمط (Pass & Play) أو اختبر مستواك ضد الذكاء الاصطناعي بمستويات محاكاة مستوحاة من تقييمات لاعبي مجموعة مكناس!
                </p>
              </div>
              <ChessBoard />
            </div>
          )}

          {activeTab === "puzzles" && (
            <div className="animate-fade-in">
              <PuzzleSolver />
            </div>
          )}

          {activeTab === "chat" && (
            <div className="animate-fade-in">
              <MeknesChat />
            </div>
          )}

          {activeTab === "cafes" && (
            <div className="animate-fade-in">
              <LocationFinder />
            </div>
          )}

          {activeTab === "openings" && (
            <div className="animate-fade-in">
              <AIPositionAnalyzer />
            </div>
          )}
        </div>
      </main>

      {/* Footer Branding Credit */}
      <footer className="max-w-7xl mx-auto px-4 mt-12 border-t border-slate-900 pt-6 text-center text-xs text-slate-500 space-y-2">
        <p>جميع الحقوق محفوظة © {new Date().getFullYear()} • ملتقى شطرنج مكناس الإسماعيلية</p>
        <p className="text-slate-600 font-mono text-[10px]">
          Designed with Premium Moroccan Emerald Slates, responsive touchgrids, and synthetic audio contexts.
        </p>
      </footer>
    </div>
  );
}
