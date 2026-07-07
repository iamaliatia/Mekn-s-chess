import { useState, useEffect } from "react";
import { Chess, Square } from "chess.js";
import { BookOpen, AlertCircle, Award, Compass, RefreshCw, BarChart2, MessageSquare, Info } from "lucide-react";

interface OpeningDetails {
  nameAr: string;
  nameEn: string;
  moves: string;
  descriptionAr: string;
  descriptionEn: string;
  ideasAr: string[];
  ideasEn: string[];
  difficulty: string;
  elo: string;
}

const OPENINGS_DATABASE: Record<string, OpeningDetails> = {
  italian: {
    nameAr: "الافتتاح الإيطالي (Italian Game)",
    nameEn: "The Italian Game",
    moves: "1. e4 e5  2. Nf3 Nc6  3. Bc4 Bc5",
    descriptionAr: "من أقدم الافتتاحيات الكلاسيكية وأكثرها احتراماً. يركز على التطوير السريع للقطع والسيطرة على الوسط وتأمين الملك عن طريق التبييت، مع توجيه هجوم مباشر مبكر على نقطة الضعف f7 للأسود.",
    descriptionEn: "One of the oldest and most respected classical chess openings. It focuses on rapid development, central control, early king safety through castling, and targeting Black's vulnerable f7 square.",
    ideasAr: [
      "دفع c3 الممهد لدفع d4 للسيطرة الكاملة على الوسط ببيادق متراصة.",
      "تطوير الحصان إلى f3 والفيل إلى c4 بأسرع وقت.",
      "تجنب الهجوم المبكر العشوائي مثل (Ng5) إلا لو دعت الضرورة التكتيكية.",
      "الاستعداد للردود المتناظرة مثل (3... Bc5) أو تفريع حصاني الأسود (3... Nf6)."
    ],
    ideasEn: [
      "Pushing c3 to support a subsequent d4 push for total central control.",
      "Developing the knight to f3 and bishop to c4 as fast as possible.",
      "Avoiding premature attacks like Ng5 unless tactically justified.",
      "Preparing for symmetrical responses like 3... Bc5 or the Two Knights Defense 3... Nf6."
    ],
    difficulty: "مبتدئ إلى متوسط",
    elo: "1000 - 1500 ELO"
  },
  sicilian: {
    nameAr: "الدفاع الصقلي (Sicilian Defense)",
    nameEn: "The Sicilian Defense",
    moves: "1. e4 c5",
    descriptionAr: "الدفاع الأكثر شعبية وقوة لمواجهة e4. يهدف الأسود إلى خلق قتال غير متناظر ومحاربة الأبيض للسيطرة على مربعات d4 عن طريق جناح الملك، وهو مليء بالتفريعات الحادة والخطيرة جداً.",
    descriptionEn: "The most popular and combative response to e4. Black fights asymmetry and contests d4 squares using wing pawns, leading to incredibly sharp and tactical positions.",
    ideasAr: [
      "استغلال العمود c المفتوح لشن هجوم مضاد سريع للأسود بجناح الوزير.",
      "الامتناع عن دفع d5 مبكراً والانتظار لفرص تكتيكية مناسبة.",
      "الحذر الشديد من تفرعات هجوم يوغسلافي وهجوم كيريس العنيفة من الأبيض.",
      "يتطلب حفظ تفريعات حادة جداً مثل تفريع التنين (Dragon) أو نادورف (Najdorf)."
    ],
    ideasEn: [
      "Contesting the open c-file to launch counter-attacks on White's queenside.",
      "Holding back on d5 pawn push until the tactical timing is absolute.",
      "Extreme caution against White's Yugoslav or Keres aggressive attacks.",
      "Requires high memory for sharp lines such as the Dragon or Najdorf variations."
    ],
    difficulty: "محترف",
    elo: "1400 - 2200+ ELO"
  },
  smithmorra: {
    nameAr: "غامبيت سميث-مورا (Smith-Morra Gambit)",
    nameEn: "Smith-Morra Gambit",
    moves: "1. e4 c5  2. d4 cxd4  3. c3 dxc3  4. Nxc3",
    descriptionAr: "تضحية هجومية عبقرية من الأبيض ضد دفاع الصقلي. يضحي الأبيض ببيدق مبكر في c3 ليحصل بالمقابل على تنمية قطع صاروخية، وممرات مفتوحة ومجال هجوم مذهل ومربك للخصم.",
    descriptionEn: "An aggressive opening gambit by White against the Sicilian Defense. White sacrifices a pawn early on c3 to gain rapid development, open files, and a devastating initiative.",
    ideasAr: [
      "تطوير حصان الملك إلى c3 والرخ إلى d1 وc1 بأسرع ما يمكن لتطويق الأسود.",
      "الضغط الهجومي العنيف على المربع f7 والمربع e6 بالتضحيات الشهيرة.",
      "استغلال تأخر الأسود في التنمية وتشتيته بمناورات الوزير الهجومية.",
      "الخصوم غير المحضرين لغامبيت سميث-مورا عادة ما يقعون في شباك كش مات في أقل من 15 نقلة!"
    ],
    ideasEn: [
      "Developing the knight to c3 and placing rooks on d1 & c1 immediately.",
      "Pressuring f7 and e6 with sacrifice motifs (as talked by Mouad in the chat).",
      "Exploiting Black's delayed development with quick Queen maneuvers.",
      "Unprepared black opponents usually fall into checkmate traps in under 15 moves!"
    ],
    difficulty: "متوسط إلى محترف",
    elo: "1200 - 1800 ELO"
  }
};

export default function AIPositionAnalyzer() {
  const [selectedOpening, setSelectedOpening] = useState<string>("italian");
  const [customFen, setCustomFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [fenError, setFenError] = useState("");
  const [fenReport, setFenReport] = useState<{
    whitePoints: number;
    blackPoints: number;
    balance: number;
    piecesCount: Record<string, number>;
    advice: string;
  } | null>(null);

  useEffect(() => {
    parseCurrentFen(customFen);
  }, [customFen]);

  const parseCurrentFen = (fenToParse: string) => {
    try {
      setFenError("");
      const chess = new Chess(fenToParse);
      
      const values: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
      let whitePoints = 0;
      let blackPoints = 0;
      const piecesCount: Record<string, number> = {
        P: 0, N: 0, B: 0, R: 0, Q: 0, K: 0,
        p: 0, n: 0, b: 0, r: 0, q: 0, k: 0
      };

      // Traverse all ranks and files to count pieces
      const board = chess.board();
      for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
          const square = board[r][f];
          if (square) {
            const char = square.color === "w" ? square.type.toUpperCase() : square.type.toLowerCase();
            piecesCount[char] = (piecesCount[char] || 0) + 1;
            
            const pVal = values[square.type] || 0;
            if (square.color === "w") {
              whitePoints += pVal;
            } else {
              blackPoints += pVal;
            }
          }
        }
      }

      const balance = whitePoints - blackPoints;
      
      // Formulate educational chess advice based on the parsed state
      let advice = "";
      if (chess.isGameOver()) {
        if (chess.isCheckmate()) {
          advice = "اللعبة انتهت بالكش المات! تم فحص الوضعية بالكامل.";
        } else {
          advice = "اللعبة انتهت بالتعادل (خنقة أو اتفاق). لا توجد حركات تكتيكية إضافية.";
        }
      } else if (chess.inCheck()) {
        advice = "🚨 الملك في خطر كش مباشر! الأولوية القصوى هي تحريك الملك، التغطية بقطعة أخرى، أو أسر القطعة المهاجمة فوراً.";
      } else {
        if (balance > 4) {
          advice = "الأبيض يمتلك تفوقاً مادياً كبيراً (+4 نقاط أو أكثر). أفضل استراتيجية هي تصفية القطع وتبسيط الوضعيات للوصول لنهاية مريحة وفوز مضمون.";
        } else if (balance < -4) {
          advice = "الأسود يمتلك تفوقاً عتادياً ساحقاً. يجب على الأبيض تعقيد الوضعية، خلق فخاخ تكتيكية غامضة، وتجنب تبادل القطع لزيادة فرص الخطأ لدى الأسود.";
        } else if (Math.abs(balance) <= 1) {
          advice = "الوضعية متعادلة عتادياً. ركز على التمركز الاستراتيجي، السيطرة على خطوط الوسط المفتوحة، وتجنب إضعاف جدار بيادق ملكك أو خلق بيادق معزولة.";
        } else if (balance > 0) {
          advice = "الأبيض يملك أفضلية طفيفة. استثمر ذلك في تفعيل رخاخك وضغط الخصم في جناحه الضعيف.";
        } else {
          advice = "الأسود متفوق قليلاً بالعتاد. احذر من التضحيات المسرعة وحاول تأمين خط الدفاع الأول.";
        }
      }

      setFenReport({
        whitePoints,
        blackPoints,
        balance,
        piecesCount,
        advice
      });
    } catch (e) {
      setFenError("صيغة FEN غير صحيحة، يرجى التحقق منها وإعادة الكتابة.");
      setFenReport(null);
    }
  };

  const currentOpening = OPENINGS_DATABASE[selectedOpening];

  return (
    <div id="meknes_openings_tactics_module" className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-7xl mx-auto p-4">
      {/* Column 1: Opening Database & Advisory (6/12 grid) */}
      <div className="xl:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold mb-4 text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
            <BookOpen className="w-5 h-5 text-emerald-400" /> مستشار الافتتاحيات التفاعلي
          </h3>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            تعلم تكتيكات وحيل الافتتاحيات الأكثر جدلاً ونقاشاً بين شطرنجيي مكناس. اختر افتتاحاً للاطلاع على قواعد اللعب والأخطاء الشائعة!
          </p>

          {/* Buttons Selector */}
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            {Object.keys(OPENINGS_DATABASE).map((key) => {
              const active = key === selectedOpening;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedOpening(key)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition text-center border ${
                    active
                      ? "bg-emerald-950 border-emerald-500 text-white"
                      : "bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {OPENINGS_DATABASE[key].nameAr.split(" (")[0]}
                </button>
              );
            })}
          </div>

          {/* Active Opening Display */}
          {currentOpening && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-wrap justify-between items-center bg-slate-950/40 p-3 rounded-xl border border-slate-850 gap-2">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{currentOpening.nameAr}</h4>
                  <span className="font-mono text-[10px] text-slate-500 block mt-0.5">{currentOpening.nameEn}</span>
                </div>
                <div className="text-left">
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold block mb-1">
                    {currentOpening.difficulty}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block">{currentOpening.elo}</span>
                </div>
              </div>

              {/* Moves Line */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 font-mono text-xs text-emerald-400 text-left">
                <strong>النقلات الرئيسية:</strong> {currentOpening.moves}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/20 p-4 rounded-xl border border-slate-850">
                {currentOpening.descriptionAr}
              </p>

              {/* Strategic ideas */}
              <div className="space-y-2">
                <span className="text-xs text-slate-500 font-bold block mb-2">أبرز الأفكار والتكتيكات:</span>
                {currentOpening.ideasAr.map((idea, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                    <Compass className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{idea}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Fun Quote Footer */}
        <div className="mt-6 border-t border-slate-800 pt-4 text-[11px] text-slate-500 italic">
          💡 "مبتدأ الشطرنج يحفظ الحركات، بينما الأستاذ يفهم الخطط ويبحث عن المربعات الضعيفة." — يوسف لطارق في شات مكناس.
        </div>
      </div>

      {/* Column 2: FEN Position Parser & Evaluator (6/12 grid) */}
      <div className="xl:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold mb-4 text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2">
            <BarChart2 className="w-5 h-5 text-emerald-400" /> محلل ومقيم الوضعيات الفوري (FEN Parser)
          </h3>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            انسخ أي وضعية بصيغة FEN من محركات الشطرنج أو الشات، والصقها هنا للحصول على تقييم مادي فوري للأوراق وتقرير نصائح تكتيكية مبسط باللغة العربية!
          </p>

          {/* FEN Input Area */}
          <div className="space-y-2 mb-6">
            <label className="text-xs font-semibold text-slate-400 block">الصق كود FEN هنا (FEN String):</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customFen}
                onChange={(e) => setCustomFen(e.target.value)}
                placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500 text-left placeholder-slate-700"
              />
              <button
                onClick={() => setCustomFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")}
                className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 transition"
                title="إعادة تعيين للوضعية الابتدائية"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            {fenError && (
              <p className="text-[11px] text-red-400 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {fenError}
              </p>
            )}
          </div>

          {/* Parse Report Display */}
          {fenReport && (
            <div className="space-y-5 animate-fade-in">
              {/* Material Balance Visual Slider */}
              <div>
                <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5 font-bold">
                  <span>تفوق الأسود (Black up)</span>
                  <span className="font-mono text-emerald-400">
                    {fenReport.balance === 0 ? "متكافئ (Even)" : fenReport.balance > 0 ? `+${fenReport.balance} للأبيض` : `${fenReport.balance} للأسود`}
                  </span>
                  <span>تفوق الأبيض (White up)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-neutral-800 h-full transition-all duration-300"
                    style={{ width: `${Math.max(10, Math.min(90, 50 - (fenReport.balance * 4)))}%` }}
                  />
                  <div className="w-1 bg-emerald-500 h-full" />
                  <div 
                    className="bg-slate-200 h-full transition-all duration-300"
                    style={{ width: `${Math.max(10, Math.min(90, 50 + (fenReport.balance * 4)))}%` }}
                  />
                </div>
              </div>

              {/* Counts of pieces per side */}
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 space-y-3">
                <span className="text-[11px] text-slate-500 font-bold block">تعداد القطع المتبقية بالرقعة:</span>
                <div className="grid grid-cols-2 gap-4">
                  {/* White counts */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-200 block">⚪ قطع الأبيض ({fenReport.whitePoints} نقطة):</span>
                    <div className="flex gap-2 text-xs font-mono text-slate-400">
                      <span>♟ {fenReport.piecesCount.P || 0}</span>
                      <span>♞ {fenReport.piecesCount.N || 0}</span>
                      <span>♝ {fenReport.piecesCount.B || 0}</span>
                      <span>♜ {fenReport.piecesCount.R || 0}</span>
                      <span>♛ {fenReport.piecesCount.Q || 0}</span>
                    </div>
                  </div>

                  {/* Black counts */}
                  <div className="space-y-1.5 border-r border-slate-800 pr-4">
                    <span className="text-[11px] font-bold text-slate-200 block">⚫ قطع الأسود ({fenReport.blackPoints} نقطة):</span>
                    <div className="flex gap-2 text-xs font-mono text-slate-400">
                      <span>♟ {fenReport.piecesCount.p || 0}</span>
                      <span>♞ {fenReport.piecesCount.n || 0}</span>
                      <span>♝ {fenReport.piecesCount.b || 0}</span>
                      <span>♜ {fenReport.piecesCount.r || 0}</span>
                      <span>♛ {fenReport.piecesCount.q || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arabic Tactical Advice Box */}
              <div className="p-4 bg-emerald-950/30 border-r-4 border-emerald-500 rounded-r-xl rounded-l-md flex items-start gap-3">
                <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold mb-0.5">النصيحة التكتيكية للوضعية الحالية:</span>
                  <p className="text-xs text-emerald-300 font-bold leading-relaxed">{fenReport.advice}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Advisory Tips disclaimer */}
        <div className="mt-6 border-t border-slate-800 pt-4 text-[10px] text-slate-500 text-center leading-normal">
          * يتم الحساب والتقييم محلياً بالمتصفح وفق نظام الماديات القياسي المعترف به دولياً في الشطرنج.
        </div>
      </div>
    </div>
  );
}
