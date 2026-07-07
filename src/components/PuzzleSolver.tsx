import { useState, useEffect } from "react";
import { Chess, Square } from "chess.js";
import { MEKNES_PUZZLES } from "../data/puzzles";
import ChessBoard from "./ChessBoard";
import { Lightbulb, CheckCircle2, XCircle, ArrowRight, HelpCircle, RefreshCcw, Sparkles } from "lucide-react";

export default function PuzzleSolver() {
  const [selectedPuzzleId, setSelectedPuzzleId] = useState(MEKNES_PUZZLES[0].id);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [hintsShown, setHintsShown] = useState<number>(0);
  const [puzzleState, setPuzzleState] = useState<"solving" | "failed" | "success">("solving");
  const [feedbackMsg, setFeedbackMsg] = useState<{ ar: string; en: string }>({ ar: "", en: "" });
  const [key, setKey] = useState(0); // For forcing board reset

  const currentPuzzle = MEKNES_PUZZLES.find(p => p.id === selectedPuzzleId) || MEKNES_PUZZLES[0];

  useEffect(() => {
    resetPuzzle();
  }, [selectedPuzzleId]);

  const resetPuzzle = () => {
    setCurrentMoveIndex(0);
    setHintsShown(0);
    setPuzzleState("solving");
    setFeedbackMsg({ ar: "حرك القطعة الصحيحة لتنفيذ الحل!", en: "Move the correct piece to solve!" });
    setKey(prev => prev + 1); // Triggers re-initialization of ChessBoard
  };

  const handleMovePlayed = (nextFen: string, moveNotation: string) => {
    if (puzzleState === "success") return;

    const expectedMove = currentPuzzle.solutionMoves[currentMoveIndex];
    
    // Normalize moves to compare (e.g., stripping check indicators or promotion flags if needed)
    const expectedClean = expectedMove.toLowerCase().replace(/[^a-z0-9]/g, "");
    const playedClean = moveNotation.toLowerCase().replace(/[^a-z0-9]/g, "");

    // Let's do a smart comparison: either exact square coords (e.g. e2e4) or standard algebraic
    if (playedClean === expectedClean || playedClean.includes(expectedClean) || expectedClean.includes(playedClean)) {
      // Success!
      const nextIndex = currentMoveIndex + 1;
      
      if (nextIndex >= currentPuzzle.solutionMoves.length) {
        setPuzzleState("success");
        setFeedbackMsg({
          ar: "تبارك الله عليك! حليت اللغز بنجاح! 🎉 مثل ما داروا أبطال مكناس.",
          en: "Amazing! You solved the puzzle successfully! 🎉 Just like the Meknes masters did."
        });
      } else {
        setCurrentMoveIndex(nextIndex);
        setFeedbackMsg({
          ar: "نقلة عبقرية وصحيحة! أكمل بقية الحركات للحل.",
          en: "Correct and brilliant move! Complete the rest of the sequence."
        });
        
        // If there's a counter move in the puzzle composition, we can simulate it or let them proceed.
        // For our hardcoded puzzles, they are mostly 1-2 moves.
      }
    } else {
      // Failed attempt
      setPuzzleState("failed");
      setFeedbackMsg({
        ar: "نقلة خاطئة، ليست هذه الحركة التي حيرت الخصوم! حاول مرة أخرى.",
        en: "Incorrect move. This is not the move that baffled the opponent! Try again."
      });
      
      // Delay reset slightly so they see the failed move on the board
      setTimeout(() => {
        setKey(prev => prev + 1);
        setPuzzleState("solving");
      }, 1200);
    }
  };

  const showNextHint = () => {
    if (hintsShown < currentPuzzle.hintsAr.length) {
      setHintsShown(prev => prev + 1);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "مبتدئ":
        return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
      case "متوسط":
        return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
      case "محترف":
        return "bg-red-500/15 text-red-400 border border-red-500/30";
      case "خيال علمي":
      default:
        return "bg-purple-500/15 text-purple-400 border border-purple-500/30 animate-pulse";
    }
  };

  return (
    <div id="meknes_puzzles_solver_module" className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-7xl mx-auto p-4">
      {/* Column 1: Sidebar Puzzle Selection List (4/12 grid) */}
      <div className="xl:col-span-4 flex flex-col gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-xl font-bold mb-4 text-emerald-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" /> ألغاز شطرنج مكناس
          </h3>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">
            اختر أحد الألغاز التي تم نشرها ومناقشتها في شات مجموعة مكناس للشطرنج. تدرج من السهل إلى الخيال العلمي!
          </p>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            {MEKNES_PUZZLES.map((puzzle) => {
              const isActive = puzzle.id === selectedPuzzleId;
              return (
                <button
                  key={puzzle.id}
                  onClick={() => setSelectedPuzzleId(puzzle.id)}
                  className={`w-full text-right p-3.5 rounded-xl border transition flex flex-col gap-2 ${
                    isActive
                      ? "bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-950/20"
                      : "bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-sm">{puzzle.titleAr}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getDifficultyColor(puzzle.difficulty)}`}>
                      {puzzle.difficulty}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 line-clamp-1 leading-normal">
                    {puzzle.descriptionAr}
                  </span>
                  <div className="flex justify-between items-center w-full text-[10px] text-slate-500 mt-1 border-t border-slate-800/60 pt-1.5">
                    <span>تاريخ الشات: {puzzle.sourceDate}</span>
                    <span className="text-emerald-500/80">بواسطة: {puzzle.author}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Puzzle Composition Fun Fact Box */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-xs text-slate-400 space-y-2 leading-relaxed">
          <p className="font-bold text-slate-200 flex items-center gap-1">
            <HelpCircle className="w-4 h-4 text-emerald-400" /> ما هي هذه الألغاز؟
          </p>
          <p>
            تجمع هذه الألغاز المواقف التكتيكية الحقيقية التي دارت حولها نقاشات حادة ومضحكة بين أعضاء الشطرنج بمكناس في المقاهي والمجموعة المشتركة.
          </p>
          <p className="text-slate-500">
            * يُنسب لغز "قطار الفرسان" (أسبوع الفرس) للماستر ميثاق الحسن الذي أثار حيرة عارمة في الشات نظراً لكمية ترقيات الفرسان المتتالية!
          </p>
        </div>
      </div>

      {/* Column 2: Board visual & Puzzle interactions (8/12 grid) */}
      <div className="xl:col-span-8 flex flex-col gap-6">
        {/* Active Puzzle Info Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              {currentPuzzle.titleAr}
            </h2>
            <div className="flex gap-2">
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${getDifficultyColor(currentPuzzle.difficulty)}`}>
                الصعوبة: {currentPuzzle.difficulty}
              </span>
              <span className="text-xs bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-slate-300">
                المشرف: {currentPuzzle.author}
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
            {currentPuzzle.descriptionAr}
          </p>
        </div>

        {/* Dynamic Feedback Banner */}
        <div className={`p-4 rounded-xl flex items-center gap-3 border shadow-md transition-all duration-300 ${
          puzzleState === "success" 
            ? "bg-emerald-950/80 border-emerald-500 text-emerald-200" 
            : puzzleState === "failed" 
            ? "bg-red-950/80 border-red-500 text-red-200 animate-bounce" 
            : "bg-slate-950/80 border-slate-800 text-slate-300"
        }`}>
          {puzzleState === "success" && <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />}
          {puzzleState === "failed" && <XCircle className="w-6 h-6 text-red-400 shrink-0" />}
          {puzzleState === "solving" && <Lightbulb className="w-6 h-6 text-amber-400 shrink-0 animate-pulse" />}
          <div>
            <p className="text-xs font-mono text-slate-400">حالة اللغز الحالي (Puzzle Status):</p>
            <p className="text-sm font-bold mt-0.5">{feedbackMsg.ar}</p>
          </div>
          <button
            onClick={resetPuzzle}
            className="mr-auto p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="إعادة المحاولة"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Custom Interactive Board Module */}
        <div key={key} className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
          <ChessBoard 
            initialFen={currentPuzzle.initialFen} 
            onMovePlayed={handleMovePlayed}
            interactive={puzzleState !== "success"} 
          />
        </div>

        {/* Hints and Solutions Drawer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="font-bold text-slate-100 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400 animate-pulse" /> تلميحات ومساعدات الحل
            </h4>
            <div className="flex gap-2">
              <button
                onClick={showNextHint}
                disabled={hintsShown >= currentPuzzle.hintsAr.length}
                className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 disabled:opacity-30 disabled:hover:bg-amber-600/20 text-amber-300 rounded-lg text-xs font-semibold transition"
              >
                طلب تلميح ({hintsShown}/{currentPuzzle.hintsAr.length})
              </button>
              <button
                onClick={() => {
                  setFeedbackMsg({
                    ar: `الحل الصحيح هو: ${currentPuzzle.solutionMoves.join(" -> ")}`,
                    en: `Correct algebraic move: ${currentPuzzle.solutionMoves.join(" -> ")}`
                  });
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
              >
                كشف الحل النهائي
              </button>
            </div>
          </div>

          {/* Render Hints */}
          <div className="space-y-2.5">
            {Array.from({ length: hintsShown }).map((_, index) => (
              <div
                key={index}
                className="p-3 bg-slate-950/80 border-r-4 border-amber-500 text-xs text-amber-200 rounded-r-xl rounded-l-md leading-relaxed animate-fade-in"
              >
                <span className="font-bold block mb-1">تلميح {index + 1}:</span>
                {currentPuzzle.hintsAr[index]}
              </div>
            ))}
            {hintsShown === 0 && (
              <p className="text-xs text-slate-500 text-center py-4">
                هل أنت عالق في الوضعية؟ اضغط على 'طلب تلميح' للحصول على اقتباسات ونصائح حقيقية من شات يوسف ومعاذ!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
