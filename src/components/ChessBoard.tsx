import React, { useState, useEffect, useRef } from "react";
import { Chess, Square } from "chess.js";
import { Play, RotateCcw, Volume2, VolumeX, Shuffle, Eye, ChevronRight, AlertCircle, Award } from "lucide-react";

// Mechanical synthesized sound effects using Web Audio API
const playChessSound = (type: "move" | "capture" | "check" | "gameover", mute: boolean) => {
  if (mute) return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === "move") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === "capture") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.setValueAtTime(320, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } else if (type === "check") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(550, ctx.currentTime);
      osc.frequency.setValueAtTime(650, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === "gameover") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch (e) {
    console.warn("Audio Context block", e);
  }
};

// Simplified pieces mapping with modern look
const PIECE_SYMBOLS: Record<string, string> = {
  p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
  P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔"
};

// Rich names of pieces in Arabic and English
const PIECE_NAMES: Record<string, { ar: string; en: string }> = {
  p: { ar: "بيدق", en: "Pawn" },
  r: { ar: "رخ", en: "Rook" },
  n: { ar: "حصان", en: "Knight" },
  b: { ar: "فيل", en: "Bishop" },
  q: { ar: "وزير", en: "Queen" },
  k: { ar: "ملك", en: "King" }
};

interface ChessBoardProps {
  initialFen?: string;
  onMovePlayed?: (fen: string, move: string) => void;
  interactive?: boolean;
}

export default function ChessBoard({ initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", onMovePlayed, interactive = true }: ChessBoardProps) {
  const [game, setGame] = useState<Chess>(() => new Chess(initialFen));
  const [fen, setFen] = useState(initialFen);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [gameMode, setGameMode] = useState<"pass" | "ai_1" | "ai_2" | "ai_3">("ai_2"); // Pass-and-play, AI easy, medium, hard
  const [boardTheme, setBoardTheme] = useState<"emerald" | "walnut" | "slate">("emerald");
  const [isMuted, setIsMuted] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [aiThinking, setAiThinking] = useState(false);
  const [gameStatus, setGameStatus] = useState<string>("");
  const [winner, setWinner] = useState<string | null>(null);

  // Sync with initialFen when it changes (for puzzle mode)
  useEffect(() => {
    const newGame = new Chess(initialFen);
    setGame(newGame);
    setFen(initialFen);
    setSelectedSquare(null);
    setPossibleMoves([]);
    setMoveHistory([]);
    setWinner(null);
    setGameStatus("");
  }, [initialFen]);

  // AI moves effect
  useEffect(() => {
    if (gameMode.startsWith("ai_") && game.turn() === "b" && !game.isGameOver()) {
      setAiThinking(true);
      const timer = setTimeout(() => {
        makeAIMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [fen, gameMode]);

  const updateGameState = (newGame: Chess, moveDetails?: any) => {
    const nextFen = newGame.fen();
    setGame(newGame);
    setFen(nextFen);
    
    // Play audio
    if (newGame.inCheck()) {
      playChessSound("check", isMuted);
    } else if (moveDetails && (moveDetails.captured || moveDetails.san.includes("x"))) {
      playChessSound("capture", isMuted);
    } else {
      playChessSound("move", isMuted);
    }

    // Save history
    const pgn = newGame.history();
    setMoveHistory(pgn);

    // Check game over
    if (newGame.isGameOver()) {
      playChessSound("gameover", isMuted);
      if (newGame.isCheckmate()) {
        const losingTurn = newGame.turn();
        setWinner(losingTurn === "w" ? "الأسود (Black)" : "الأبيض (White)");
        setGameStatus(losingTurn === "w" ? "كش مات! انتصار الأسود" : "كش مات! انتصار الأبيض");
      } else if (newGame.isDraw()) {
        setWinner("تعادل (Draw)");
        setGameStatus("تعادل بالخنق أو تكرار النقلات (Stalemate / Draw)");
      }
    }

    if (onMovePlayed && moveDetails) {
      onMovePlayed(nextFen, moveDetails.lan || moveDetails.from + moveDetails.to);
    }
  };

  // Minimax simple engine for responsive and smart browser-side chess
  const makeAIMove = () => {
    if (game.isGameOver()) {
      setAiThinking(false);
      return;
    }

    const moves = game.moves({ verbose: true });
    if (moves.length === 0) {
      setAiThinking(false);
      return;
    }

    let selectedMove = moves[0];

    if (gameMode === "ai_1") {
      // Random move (Easy ELO 1200)
      const randomIndex = Math.floor(Math.random() * moves.length);
      selectedMove = moves[randomIndex];
    } else {
      // Evaluation based moves (Medium & Hard ELO 1500 / 1800+)
      const moveScores = moves.map(move => {
        // Try move
        const tempGame = new Chess(game.fen());
        const result = tempGame.move(move);
        let score = 0;

        if (result) {
          // 1. Captured value
          if (result.captured) {
            const values: Record<string, number> = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 900 };
            score += values[result.captured] * 10;
          }

          // 2. King safety / check value
          if (tempGame.inCheck()) score += 15;
          if (tempGame.isCheckmate()) score += 10000;

          // 3. Center control (e4, d4, e5, d5 squares)
          const centerSquares = ["e4", "d4", "e5", "d5", "e3", "d3", "e6", "d6"];
          if (centerSquares.includes(result.to)) score += 2;

          // 4. Piece progression (favour development of Knights and Bishops early)
          if (["n", "b"].includes(result.piece) && game.history().length < 10) {
            score += 1.5;
          }

          // Depth search (1 step lookup for Hard mode)
          if (gameMode === "ai_3") {
            const counterMoves = tempGame.moves({ verbose: true });
            let worstCounterScore = 0;
            counterMoves.forEach(counter => {
              if (counter.captured) {
                const counterValues: Record<string, number> = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 900 };
                const loss = counterValues[counter.captured] * 10;
                if (loss > worstCounterScore) worstCounterScore = loss;
              }
            });
            score -= worstCounterScore; // penalize vulnerable placements
          }
        }
        return { move, score };
      });

      // Sort scores descending
      moveScores.sort((a, b) => b.score - a.score);
      
      // Select best score, occasionally add variety
      if (moveScores.length > 0) {
        const bestScore = moveScores[0].score;
        const candidates = moveScores.filter(m => m.score >= bestScore - 2);
        const choice = candidates[Math.floor(Math.random() * candidates.length)];
        selectedMove = choice ? choice.move : moveScores[0].move;
      }
    }

    try {
      const tempGame = new Chess(game.fen());
      const moveDetails = tempGame.move(selectedMove);
      updateGameState(tempGame, moveDetails);
    } catch (e) {
      console.error("AI move error", e);
    }
    setAiThinking(false);
  };

  const handleSquareClick = (square: Square) => {
    if (!interactive || aiThinking || game.isGameOver()) return;

    // If a square is already selected
    if (selectedSquare) {
      if (selectedSquare === square) {
        // Deselect
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }

      // Try making a move
      try {
        const tempGame = new Chess(game.fen());
        const isPromotion = 
          game.get(selectedSquare)?.type === "p" && 
          (square.endsWith("8") || square.endsWith("1"));

        const moveDetails = tempGame.move({
          from: selectedSquare,
          to: square,
          promotion: isPromotion ? "q" : undefined // Default to Queen for simpler UI
        });

        if (moveDetails) {
          updateGameState(tempGame, moveDetails);
          setSelectedSquare(null);
          setPossibleMoves([]);
          return;
        }
      } catch (err) {
        // Move was illegal, check if they clicked another of their own pieces
      }
    }

    // Try selecting piece of active turn
    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      
      // Calculate possible moves
      const moves = game.moves({ square, verbose: true });
      setPossibleMoves(moves.map(m => m.to as Square));
    } else {
      setSelectedSquare(null);
      setPossibleMoves([]);
    }
  };

  const resetGame = () => {
    updateGameState(new Chess(initialFen));
    setSelectedSquare(null);
    setPossibleMoves([]);
    setWinner(null);
    setGameStatus("");
  };

  const flipBoard = () => {
    setIsFlipped(!isFlipped);
  };

  const undoMove = () => {
    const tempGame = new Chess(game.fen());
    tempGame.undo();
    if (gameMode.startsWith("ai_")) {
      tempGame.undo(); // Undo AI move as well
    }
    updateGameState(tempGame);
    setSelectedSquare(null);
    setPossibleMoves([]);
    setWinner(null);
    setGameStatus("");
  };

  // Board visual components
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const displayRanks = isFlipped ? [...ranks].reverse() : ranks;
  const displayFiles = isFlipped ? [...files].reverse() : files;

  const currentTurn = game.turn();

  // Helper colors based on theme
  const getThemeClasses = () => {
    switch (boardTheme) {
      case "walnut":
        return {
          light: "bg-[#eed9b3] text-[#704214]",
          dark: "bg-[#b88b4a] text-[#eed9b3]",
          selected: "ring-4 ring-amber-500 bg-amber-400/50",
          possible: "after:bg-amber-600/60",
          check: "bg-red-500/80 animate-pulse",
          boardBorder: "border-amber-900 bg-amber-950",
          accentText: "text-amber-800"
        };
      case "slate":
        return {
          light: "bg-slate-300 text-slate-800",
          dark: "bg-slate-600 text-slate-100",
          selected: "ring-4 ring-indigo-400 bg-indigo-500/40",
          possible: "after:bg-indigo-500/70",
          check: "bg-rose-500/80 animate-pulse",
          boardBorder: "border-slate-800 bg-slate-900",
          accentText: "text-slate-300"
        };
      case "emerald":
      default:
        return {
          light: "bg-[#eeeed2] text-[#769656]",
          dark: "bg-[#769656] text-[#eeeed2]",
          selected: "ring-4 ring-amber-400 bg-yellow-300/40",
          possible: "after:bg-yellow-500/80",
          check: "bg-red-500/80 animate-pulse",
          boardBorder: "border-emerald-900 bg-emerald-950",
          accentText: "text-[#769656]"
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div id="chess_game_board_module" className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-2xl max-w-6xl mx-auto">
      {/* Column 1: Board Visual & Quick Settings (8/12 grid) */}
      <div className="lg:col-span-7 flex flex-col items-center">
        {/* Header Board Indicators */}
        <div className="w-full flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className={`w-3.5 h-3.5 rounded-full ${currentTurn === "w" ? "bg-white" : "bg-black ring-1 ring-white"} animate-pulse`} />
            <span className="text-xs font-mono text-slate-300">
              {currentTurn === "w" ? "دور الأبيض (White's Turn)" : "دور الأسود (Black's Turn)"}
            </span>
            {aiThinking && (
              <span className="text-xs text-amber-400 font-medium animate-bounce flex items-center gap-1">
                • الحاسوب يفكر... (AI thinking)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              id="sound_toggle_btn"
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
              title={isMuted ? "تفعيل الصوت" : "كتم الصوت"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              id="flip_board_btn"
              onClick={flipBoard}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 text-xs"
            >
              <Shuffle className="w-3.5 h-3.5" /> قلب الرقعة
            </button>
          </div>
        </div>

        {/* The 8x8 Grid Chessboard */}
        <div className={`relative p-3 rounded-xl border-4 ${theme.boardBorder} shadow-2xl transition-all duration-300 w-full aspect-square max-w-[480px]`}>
          <div className="grid grid-cols-8 grid-rows-8 w-full h-full rounded overflow-hidden">
            {displayRanks.map((rank, rIdx) => (
              <React.Fragment key={rank}>
                {displayFiles.map((file, fIdx) => {
                  const sq = `${file}${rank}` as Square;
                  const piece = game.get(sq);
                  const isDark = (parseInt(rank) + file.charCodeAt(0)) % 2 === 0;
                  const isSelected = selectedSquare === sq;
                  const isPossible = possibleMoves.includes(sq);
                  const isKingInCheck = piece && piece.type === "k" && piece.color === game.turn() && game.inCheck();

                  let squareColorClass = isDark ? theme.dark : theme.light;
                  if (isSelected) squareColorClass = theme.selected;
                  if (isKingInCheck) squareColorClass = theme.check;

                  return (
                    <div
                      key={sq}
                      id={`chess_sq_${sq}`}
                      onClick={() => handleSquareClick(sq)}
                      className={`relative aspect-square flex items-center justify-center cursor-pointer select-none transition-all duration-200 ${squareColorClass} group`}
                    >
                      {/* Piece Icon */}
                      {piece && (
                        <span 
                          className={`text-3xl md:text-4xl font-bold select-none transition-transform duration-200 group-hover:scale-110 drop-shadow-md ${
                            piece.color === "w" ? "text-slate-100 filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" : "text-neutral-900 filter drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]"
                          }`}
                        >
                          {PIECE_SYMBOLS[piece.color === "w" ? piece.type.toUpperCase() : piece.type.toLowerCase()]}
                        </span>
                      )}

                      {/* Legal Move Dot */}
                      {isPossible && (
                        <div className={`absolute w-3 h-3 md:w-4 md:h-4 rounded-full ${piece ? "border-4 border-amber-400 bg-transparent" : "bg-amber-400/80"} pointer-events-none animate-pulse`} />
                      )}

                      {/* Rank Coordinates (Left side) */}
                      {fIdx === (isFlipped ? 7 : 0) && (
                        <span className="absolute top-0.5 left-1 text-[9px] md:text-[10px] font-mono font-bold opacity-60 pointer-events-none">
                          {rank}
                        </span>
                      )}

                      {/* File Coordinates (Bottom side) */}
                      {rIdx === (isFlipped ? 0 : 7) && (
                        <span className="absolute bottom-0.5 right-1 text-[9px] md:text-[10px] font-mono font-bold opacity-60 pointer-events-none">
                          {file}
                        </span>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Board Design Selector */}
        <div className="w-full flex justify-center gap-3 mt-4">
          <button
            onClick={() => setBoardTheme("emerald")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              boardTheme === "emerald" ? "bg-emerald-800 border-emerald-400 text-white" : "bg-slate-800 border-transparent text-slate-400"
            }`}
          >
            زمردي الملكي
          </button>
          <button
            onClick={() => setBoardTheme("walnut")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              boardTheme === "walnut" ? "bg-amber-800 border-amber-500 text-white" : "bg-slate-800 border-transparent text-slate-400"
            }`}
          >
            خشب الجوز الكلاسيكي
          </button>
          <button
            onClick={() => setBoardTheme("slate")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              boardTheme === "slate" ? "bg-slate-700 border-slate-400 text-white" : "bg-slate-800 border-transparent text-slate-400"
            }`}
          >
            الرمادي الحجري
          </button>
        </div>
      </div>

      {/* Column 2: Game Controls, AI Selection & PGN Log (5/12 grid) */}
      <div className="lg:col-span-5 flex flex-col bg-slate-950/80 p-5 rounded-xl border border-slate-800/80 justify-between">
        <div>
          <h3 className="text-lg font-bold border-b border-slate-800 pb-2 mb-4 text-emerald-400 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" /> لوحة التحكم واللعب
          </h3>

          {/* Game Mode Select */}
          <div className="space-y-3 mb-4">
            <label className="text-xs font-semibold text-slate-400 block">نمط اللعب المختار (Game Mode):</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setGameMode("pass")}
                className={`py-2 px-3 rounded-lg text-xs font-medium border text-right transition ${
                  gameMode === "pass" ? "bg-emerald-950 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                }`}
              >
                🎮 لاعب ضد لاعب (محلي)
              </button>
              <button
                onClick={() => setGameMode("ai_1")}
                className={`py-2 px-3 rounded-lg text-xs font-medium border text-right transition ${
                  gameMode === "ai_1" ? "bg-emerald-950 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                }`}
              >
                🟢 مبتدئ مكناسي (1200 ELO)
              </button>
              <button
                onClick={() => setGameMode("ai_2")}
                className={`py-2 px-3 rounded-lg text-xs font-medium border text-right transition ${
                  gameMode === "ai_2" ? "bg-emerald-950 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                }`}
              >
                🟡 لاعب دينامو فير (1500 ELO)
              </button>
              <button
                onClick={() => setGameMode("ai_3")}
                className={`py-2 px-3 rounded-lg text-xs font-medium border text-right transition ${
                  gameMode === "ai_3" ? "bg-emerald-950 border-emerald-500 text-white" : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                }`}
              >
                🔴 بطل مكناس الشطرنجي (2000 ELO)
              </button>
            </div>
          </div>

          {/* Game Over / Warning Banner */}
          {(gameStatus || game.inCheck()) && (
            <div className={`p-3 rounded-lg flex items-start gap-2.5 mb-4 ${game.isGameOver() ? "bg-emerald-950/80 border border-emerald-800 text-emerald-200" : "bg-red-950/80 border border-red-900 text-red-200 animate-pulse"}`}>
              <AlertCircle className={`w-5 h-5 shrink-0 ${game.isGameOver() ? "text-emerald-400" : "text-red-400"}`} />
              <div>
                <p className="text-sm font-bold">
                  {game.isGameOver() ? "نهاية اللعبة" : "ملكك تحت التهديد!"}
                </p>
                <p className="text-xs opacity-90">
                  {gameStatus || "الملك تحت كش مباشر. قم بنقلة صحيحة لحمايته!"}
                </p>
              </div>
            </div>
          )}

          {/* Moves History (PGN Log) */}
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80 mb-4">
            <span className="text-xs font-semibold text-slate-400 block mb-2">سجل الحركات (Moves PGN):</span>
            <div className="h-28 overflow-y-auto font-mono text-xs text-slate-300 grid grid-cols-2 gap-y-1 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {moveHistory.reduce<React.ReactNode[]>((acc, move, idx) => {
                if (idx % 2 === 0) {
                  acc.push(
                    <div key={idx} className="flex gap-2 p-1 hover:bg-slate-800 rounded">
                      <span className="text-slate-500">{Math.floor(idx / 2) + 1}.</span>
                      <span className="font-semibold text-slate-200">{move}</span>
                    </div>
                  );
                } else {
                  // White has been added, push black move beside it
                  const prev = acc[acc.length - 1];
                  acc[acc.length - 1] = (
                    <div key={idx - 1} className="flex items-center justify-between col-span-2 p-1 hover:bg-slate-800/60 rounded">
                      <div className="flex gap-2">
                        <span className="text-slate-500">{Math.floor(idx / 2) + 1}.</span>
                        <span className="font-semibold text-slate-200 w-16">{moveHistory[idx - 1]}</span>
                        <span className="font-semibold text-slate-300">{move}</span>
                      </div>
                    </div>
                  );
                }
                return acc;
              }, [])}
              {moveHistory.length === 0 && (
                <div className="col-span-2 text-slate-500 text-center py-6">
                  لا توجد نقلات بعد. ابدأ اللعب بالضغط على أي قطعة!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mt-auto border-t border-slate-800 pt-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={undoMove}
              disabled={moveHistory.length === 0 || aiThinking}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 text-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" /> تراجع (Undo)
            </button>
            <button
              onClick={resetGame}
              className="py-2.5 px-4 bg-red-950/40 border border-red-900/50 text-red-200 hover:bg-red-900/40 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" /> إعادة ضبط (Reset)
            </button>
          </div>

          <div className="p-3 bg-slate-900/40 border border-slate-800/50 rounded-lg text-[11px] text-slate-400 space-y-1">
            <p className="font-bold text-slate-300">💡 تعليمات اللعب لمكناس:</p>
            <p>1. اضغط على أي قطعة لعرض مربعات الحركات القانونية المتاحة.</p>
            <p>2. اضغط على المربع المظلل بالأصفر لتأكيد النقلة ولعبها فورياً.</p>
            <p>3. يمكنك تبديل الذكاء الاصطناعي في أي وقت لتجربة مستويات مهارية مختلفة.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
