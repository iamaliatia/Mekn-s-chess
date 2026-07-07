export interface ChessPuzzle {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  initialFen: string;
  solutionMoves: string[]; // e.g. ["e2e4", "e7e5"]
  currentMoveIndex?: number;
  hintsAr: string[];
  hintsEn: string[];
  difficulty: "مبتدئ" | "متوسط" | "محترف" | "خيال علمي";
  difficultyEn: "Easy" | "Medium" | "Hard" | "Sci-Fi";
  sourceDate?: string;
  author?: string;
}

export interface ChessLocation {
  id: string;
  nameAr: string;
  nameEn: string;
  type: "مقهى" | "نادي" | "دار الشباب";
  typeEn: "Cafe" | "Club" | "Youth Center";
  addressAr: string;
  addressEn: string;
  descriptionAr: string;
  descriptionEn: string;
  timingAr: string;
  timingEn: string;
  rulesAr?: string;
  rulesEn?: string;
  coordinates?: { lat: number; lng: number };
  instagram?: string;
  facebook?: string;
  featuresAr: string[];
  featuresEn: string[];
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderPhone?: string;
  avatarColor: string;
  message: string;
  time: string;
  date: string;
  isMedia?: boolean;
  mediaDesc?: string;
  isEdited?: boolean;
  replies?: ChatMessage[];
  category?: "puzzle" | "general" | "location" | "opening";
}

export interface ForumThread {
  id: string;
  title: string;
  author: string;
  avatarColor: string;
  date: string;
  content: string;
  repliesCount: number;
  likes: number;
  tags: string[];
  replies: {
    id: string;
    author: string;
    avatarColor: string;
    content: string;
    date: string;
    likes: number;
  }[];
}
