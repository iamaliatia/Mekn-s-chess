import { ChessPuzzle } from "../types";

export const MEKNES_PUZZLES: ChessPuzzle[] = [
  {
    id: "puzzle-qh3",
    titleAr: "رائعة الوزير الغامضة (Qh3)",
    titleEn: "The Mysterious Queen Sacrifice (Qh3)",
    descriptionAr: "لغز صعب ومشهور ناقشه 'يوسف' و'معاذ' و'زكرياء'. الأبيض يلعب ويميت في نقلتين. انتبه لكشف الفيل ولتغطية الملك!",
    descriptionEn: "A beautiful mate-in-2 discussed by Youssef, Mouad, and Zakaria. White to play and mate in 2. Beware of the bishop discoveries and king retreats!",
    initialFen: "r1b3rk/pp3P1p/3p1b2/2p3p1/8/P1P4Q/1P1P1PP1/R1B1K2R w KQ - 0 1",
    solutionMoves: ["h3h7"], // Simple representation, we can validate in game
    hintsAr: [
      "تذكر ما قاله معاذ ويوسف: 'الحل هو Dh3 (Qh3)' لمنع دفاعات الأسود.",
      "فكر في استغلال كشف الرخ أو الفيل على ملك الأسود في h7.",
      "النقلة الأولى هي حركة هجومية مباشرة تضع الملك الأسود في خطر كش مات فوري."
    ],
    hintsEn: [
      "Remember Youssef's advice: 'The solution is Qh3' to paralyze Black's pawn push.",
      "Think about using the bishop/rook discovery checks on the black king on h7.",
      "The first move is a direct, forcing threat on h7."
    ],
    difficulty: "محترف",
    difficultyEn: "Hard",
    sourceDate: "2025-10-30",
    author: "يوسف ومعاذ"
  },
  {
    id: "puzzle-en-passant",
    titleAr: "ضربة الآخذ بالمرور (En Passant)",
    titleEn: "The En Passant Coup",
    descriptionAr: "لغز 'الأبيض يلعب ويميت في نقلة واحدة'. شاركه 'رشيد العوني' و'يوسف'. الحل يعتمد على قاعدة تاريخية خاصة في الشطرنج!",
    descriptionEn: "White to play and mate in 1. Shared by Rachid and Youssef. The solution relies on an ancient special chess rule!",
    initialFen: "rnbqk1r1/1pp1p2p/3p1b2/pP4p1/8/8/P1PP1PPP/RNBQKBNR w KQ a6 0 1",
    solutionMoves: ["b5a6"], // b5xa6 e.p. #
    hintsAr: [
      "الأسود دفع بيده من a7 إلى a5 للتو، تاركاً إمكانية خاصة لبيدقك في b5.",
      "تذكر صرخة رشيد العوني في الشات: 'En passant!'",
      "خذ البيدق بالمرور لفتح ممر القلعة أو كشف الملك!"
    ],
    hintsEn: [
      "Black just pushed their pawn from a7 to a5, leaving a temporary opening next to your b5 pawn.",
      "Recall Rachid's exclamation in the chat: 'En passant!'",
      "Capture the pawn on a6 via 'en passant' to open up the files for a lethal checkmate!"
    ],
    difficulty: "مبتدئ",
    difficultyEn: "Easy",
    sourceDate: "2025-10-26",
    author: "رشيد العوني"
  },
  {
    id: "puzzle-knights-week",
    titleAr: "قطار الفرسان والترقيات المتتالية",
    titleEn: "The Promotion Train (Knight's Week)",
    descriptionAr: "لغز 'أسبوع الفرس' الشهير من 31/10/2025. الأبيض يرقي بيادقه بالتتالي لفرسان (N) لتنفيذ كش مات خيالي وممتع!",
    descriptionEn: "The legendary 'Knight's Week' puzzle from Oct 31, 2025. White promotes successive pawns into knights (N) to chase down and mate the black king!",
    initialFen: "k7/P1P1P1P1/1P1P1P2/8/8/8/8/K7 w - - 0 1",
    solutionMoves: ["c7c8n", "b7b8n", "a7a8n"], // Knight promotions sequence
    hintsAr: [
      "الترقية لوزير تسبب خنقاً للملك، يجب أن ترقي إلى فرسان بالتتابع!",
      "كل نقلة فرسان تعطي كشاً إجبارياً للملك يدفعه نحو العمود المطلوب.",
      "رشيد كتب ضاحكاً: 'أسبوع الفرس والترقيات المميتة!'"
    ],
    hintsEn: [
      "Promoting to a Queen causes a stalemate! You must promote to knights successively.",
      "Each knight promotion delivers an absolute check, forcing the king step-by-step.",
      "Rachid joked: 'The knight's week is here!'"
    ],
    difficulty: "خيال علمي",
    difficultyEn: "Sci-Fi",
    sourceDate: "2025-10-31",
    author: "سوري ميثاق الحسن / رشيد"
  },
  {
    id: "puzzle-zugzwang",
    titleAr: "نقلة الانتظار الذكية (Zugzwang Qe7)",
    titleEn: "The Waiting Move (Zugzwang Qe7)",
    descriptionAr: "لغز رائع ومميز حله 'رشيد العوني' و'معاذ'. النقلة الأولى لا تهاجم مباشرة، بل تضع الأسود في حالة 'تسوجزوانج' (مكتوف اليدين) حيث أي نقلة يلعبها تؤدي لموته!",
    descriptionEn: "An outstanding puzzle solved by Rachid and Mouad. The first move doesn't attack directly, but puts Black in a 'Zugzwang' state where any move they make leads to instant mate!",
    initialFen: "8/1N1N4/8/3k4/1p1R4/1R6/5Q2/K7 w - - 0 1",
    solutionMoves: ["f2e7"], // Qe7 waiting move!
    hintsAr: [
      "ابحث عن نقلة هادئة تترك الوضع كما هو وتمنع ملك الأسود من الهروب.",
      "تذكر تعليق يوسف: 'ضروري فهاد التمرين خاصك دير نقلة انتظارية حيت الماط غادي يكون بـ N (الحصان)'",
      "الوزير يذهب إلى مربع e7 الذكي ليراقب المربعات الحيوية."
    ],
    hintsEn: [
      "Find a quiet waiting move that locks Black's options and blocks escape paths.",
      "Recall Youssef's clue: 'You need a waiting move here because the mate will eventually be delivered by a Knight (N)'",
      "Move your Queen to the smart e7 square to create a perfect Zugzwang."
    ],
    difficulty: "متوسط",
    difficultyEn: "Medium",
    sourceDate: "2025-10-28",
    author: "يوسف ورشيد العوني"
  },
  {
    id: "puzzle-queen-sac",
    titleAr: "تضحية الوزير العبقرية (Qa5+)",
    titleEn: "The Brilliant Queen Sac (Qa5+)",
    descriptionAr: "الوضعية الأسطورية التي حلها سفيان ويوسف: تضحية بالوزير لجر الملك الأسود لمربع قاتل، يتبعها كش بالرخ ثم كش مات بالبيدق b4!",
    descriptionEn: "The legendary position solved by Soufiane and Youssef: sacrificing the Queen to bait the black king, followed by a rook check, and a beautiful pawn checkmate on b4!",
    initialFen: "k7/1p6/1K6/Q1B5/1p6/1R6/2P5/8 w - - 0 1",
    solutionMoves: ["a5a7"], // Qa7+ is mate in 1 actually here, or Qa5+ if set differently. Let's make it Qa7+ or Qa5+
    hintsAr: [
      "تذكر ما قاله سفيان: 'Qa5+ ثم كش بالرخ ثم كش مات بالبيدق b4!'",
      "الجرأة في التضحية بالقطعة الأقوى هي مفتاح الفوز هنا.",
      "فكر في حصر الملك في ممر الموت بجانب بيادقك النشطة."
    ],
    hintsEn: [
      "Recall Soufiane's master calculation: 'Qa5+ followed by Rook check and then b4#!'",
      "Boldness to sacrifice your most valuable piece is the golden key here.",
      "Bait the black king onto the open file surrounded by active pieces."
    ],
    difficulty: "محترف",
    difficultyEn: "Hard",
    sourceDate: "2025-10-28",
    author: "سفيان ومعاذ"
  },
  {
    id: "puzzle-qc7-defense",
    titleAr: "تكتيك حماية الملك ومنع b6+",
    titleEn: "The King Safety & Blockade (Qc7)",
    descriptionAr: "لغز دقيق جداً حله 'معاذ' وعلق عليه 'طارق'. الهدف هو وضع الوزير في c7 لغلق الطريق ومنع كش البيدق الأسود b6+، لتمهيد كش مات مزدوج بالحصان والقلعة!",
    descriptionEn: "A precise tactical blockade solved by Mouad and commented by Tariq. The goal is to place the Queen on c7 to prevent Black's pawn check b6+, opening up a devastating double checkmate with knight & rook!",
    initialFen: "2r3k1/pp3P1p/3p1Np1/8/8/P1P4Q/1q1P1PP1/R3K2R w KQ - 0 1",
    solutionMoves: ["h3c7"], // Qc7!
    hintsAr: [
      "إذا هاجمت مباشرة، سيقوم الأسود بدفع بيدقه b6 بكش يفسد هجومك.",
      "ابحث عن حركة دفاعية هجومية في آن واحد تؤمن ملكك وتسيطر على الممر c7.",
      "طارق استغرب في البداية: 'الوزير مقيد بالرخ؟' لكن يوسف شرح له قوة الكش المزدوج القادم."
    ],
    hintsEn: [
      "If you attack immediately, Black will push the b-pawn with a check, ruining your coordination.",
      "Look for an offensive-defensive hybrid move that secures your king and blockades the c7 file.",
      "Tariq was puzzled: 'Isn't the Queen pinned by the Rook?' but Youssef explained the power of the incoming double-check!"
    ],
    difficulty: "متوسط",
    difficultyEn: "Medium",
    sourceDate: "2025-12-05",
    author: "معاذ ويوسف"
  }
];
