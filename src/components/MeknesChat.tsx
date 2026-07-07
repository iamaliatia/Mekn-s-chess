import React, { useState, useEffect, useRef } from "react";
import { MEKNES_CHAT_HISTORY } from "../data/chatHistory";
import { ChatMessage, ForumThread } from "../types";
import { Send, Search, MessageSquare, Shield, Clock, Users, ThumbsUp, ChevronDown, Award, Sparkles, Filter } from "lucide-react";

const INITIAL_THREADS: ForumThread[] = [
  {
    id: "thread-theology",
    title: "نقاش تربوي وديني هادف: هل الشطرنج يلهي عن ذكر الله والصلاة؟",
    author: "رشيد العوني",
    avatarColor: "from-slate-700 to-slate-900",
    date: "2025-11-25",
    content: "السلام عليكم الإخوان ورحمة الله. كتبت هذا الموضوع لأشارككم تساؤلاً هاماً جداً يخص ديننا وتربية أبنائنا. يوم السبت الماضي كنت ضيفاً بنادي شطرنج وحين أذّن الظهر لم ينهض أحد للصلاة وبقوا منشغلين باللعب رغماً أن 3 مساجد كانت تحيط بالموقع! هذا جعلني أعرض عن إدخال رقعة شطرنج لبيتي. أود السماع لآرائكم حول وجوب تزاوج اللعب مع القيم والأخلاق والدين.",
    repliesCount: 4,
    likes: 24,
    tags: ["أخلاقيات", "دين وتربية", "مكناس المحافظة"],
    replies: [
      {
        id: "rep-1",
        author: "يوسف (الشطرنجي المحترف)",
        avatarColor: "from-red-500 to-rose-500",
        content: "وعليكم السلام أخي رشيد. موضوع هام جداً جزاك الله خيراً. الفقهاء اختلفوا في حكم الشطرنج، والإمام الشافعي أباحه بشروط صارمة: ألا يلهي عن الصلاة، وألا يؤدي للشجار، وألا يتخذ كعادة مستهلكة للوقت بالكامل. نعم، الرياضة يجب أن تغرس التربية. في مقهى مقتصدية التعليم بمكناس يتم توقيف جميع الطاولات فور الأذان احترماً للصلاة وتأديباً لنفوس اللاعبين، وهذا هو النموذج الذي يجب تعميمه.",
        date: "2025-11-25",
        likes: 18
      },
      {
        id: "rep-2",
        author: "بلال",
        avatarColor: "from-violet-500 to-fuchsia-500",
        content: "أتفق معكما تماماً. اللعب بدون ضوابط أخلاقية يتحول إلى إدمان مذموم. يجب على المكاتب المسيرة والجمعيات المحلية بمكناس وضع لافتات تذكر بأوقات الصلاة وفرض توقيف اللعب خلالها.",
        date: "2025-11-26",
        likes: 9
      }
    ]
  },
  {
    id: "thread-openings",
    title: "تحليل تكتيكي: الافتتاح الإيطالي (Italian Game) مقابل دفاع الصقلي (Sicilian)",
    author: "يوسف (الشطرنجي المحترف)",
    avatarColor: "from-red-500 to-rose-500",
    date: "2025-10-08",
    content: "لكل اللاعبين ذوي التقييمات بين 1300 و1400 ELO بمكناس، ألاحظ تسرعاً في اختيار دفاع الصقلي (1... c5) لمواجهة e4. دفاع الصقلي من أقوى الدفاعات النظرية ولكنه معقد جداً ويحتوي على آلاف التفريعات والخطوط التي تتطلب حفظاً وفهماً عميقين، وأي خطأ صغير فيه قد يؤدي لانهيار سريع. أنصح الهواة بالالتزام بالافتتاح الإيطالي الكلاسيكي (e4 e5 Cf3 Cc6 Fc4) لأنه يعلم السيطرة على الوسط، التنمية السريعة، وتأمين الملك مبكراً قبل الانتقال للتعقيدات.",
    repliesCount: 3,
    likes: 31,
    tags: ["افتتاحيات", "تحليل تكتيكي", "تطوير المستوى"],
    replies: [
      {
        id: "rep-3",
        author: "طارق",
        avatarColor: "from-cyan-500 to-blue-500",
        content: "تحليل ممتاز أستاذ يوسف. أنا فعلاً كنت ألعب الصقلي وأخسر كثيراً بسبب تفرعات هجوم يوغسلافي وهجوم الشص وغيرها. سألتزم بالافتتاح الإيطالي وأدرسه بعمق كما نصحت.",
        date: "2025-10-08",
        likes: 12
      },
      {
        id: "rep-4",
        author: "معاذ",
        avatarColor: "from-pink-500 to-rose-500",
        content: "لا تنسوا تفرع الدفاع الثنائي للفرسان (Two Knights Defense) في الإيطالي، فهو حماسي جداً وفيه تضحيات رائعة في f7 تستحق الدراسة والتحليل!",
        date: "2025-10-09",
        likes: 15
      }
    ]
  },
  {
    id: "thread-bouchiba",
    title: "تأبين وتذكير: قيدوم شطرنجيي مكناس الأستاذ لحسن بوشيبة في ذمة الله",
    author: "بلال",
    avatarColor: "from-violet-500 to-fuchsia-500",
    date: "2025-12-11",
    content: "بقلوب مؤمنة بقضاء الله وقدره، ننعى الأستاذ الكبير لحسن بوشيبة، قيدوم ومعلم أجيال الشطرنج بمكناس. لقد كان الفقيد مثالاً للأخلاق والروح الرياضية العالية، وقدم الكثير من وقته وصحته لتدريب الناشئة وتأسيس اللبنات الأولى للشطرنج بالمدينة الإسماعيلية. نسأل الله أن يرحمه ويسكنه فسيح جناته ويلهم ذويه الصبر والسلوان.",
    repliesCount: 5,
    likes: 45,
    tags: ["تأبين", "شخصيات مكناسية", "أخبار محلية"],
    replies: [
      {
        id: "rep-5",
        author: "يوسف (الشطرنجي المحترف)",
        avatarColor: "from-red-500 to-rose-500",
        content: "إنا لله وإنا إليه راجعون. فقدنا جبلاً شامخاً ومعلماً كبيراً. تعلمت منه الكثير في بداياتي بمقهى مقتصدية التعليم. نسأل الله له الرحمة والمغفرة.",
        date: "2025-12-11",
        likes: 22
      },
      {
        id: "rep-6",
        author: "رشيد العوني",
        avatarColor: "from-slate-700 to-slate-900",
        content: "رحمه الله وغفر له وأسكنه الفردوس الأعلى. كان قمة في التواضع وحب الخير للجميع. تعازينا الحارة لجميع عائلته وللأسرة الشطرنجية بمكناس.",
        date: "2025-12-11",
        likes: 17
      }
    ]
  }
];

export default function MeknesChat() {
  const [activeTab, setActiveTab] = useState<"whatsapp" | "forum">("whatsapp");
  const [chatList, setChatList] = useState<ChatMessage[]>(MEKNES_CHAT_HISTORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "puzzle" | "opening" | "location" | "general">("all");
  const [userMsg, setUserMsg] = useState("");
  const [forumThreads, setForumThreads] = useState<ForumThread[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [forumReply, setForumReply] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll chat to bottom when loaded or updated
    if (activeTab === "whatsapp" && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatList, activeTab]);

  // Keyword auto-replies generator for interactive gameplay
  const triggerAIMessage = (input: string) => {
    const text = input.toLowerCase();
    let replyText = "";
    let sender = "يوسف (الشطرنجي المحترف)";
    let avatar = "from-red-500 to-rose-500";
    let category: "puzzle" | "opening" | "location" | "general" = "general";

    if (text.includes("e4") || text.includes("إيطالي") || text.includes("صقلي") || text.includes("افتتاح")) {
      replyText = "الافتتاح الإيطالي (Italian Game) هو الأضمن لتأسيس أساس صلب، بينما الصقلي يتطلب دراسة تفريعات معقدة مثل تفريع نادورف أو التنين. نصيحتي للمبتدئين: افهم الأفكار ولا تحفظ الحركات!";
      sender = "يوسف (الشطرنجي المحترف)";
      avatar = "from-red-500 to-rose-500";
      category = "opening";
    } else if (text.includes("دينامو") || text.includes("مبروك") || text.includes("قهوة") || text.includes("لقاء") || text.includes("نلعب")) {
      replyText = "أنا جاهز لبعض الأدوار السريعة اليوم في مقهى ديامو فير (Dynamo Vert) في المساء! من سيلتحق بنا بعد السادسة؟";
      sender = "معاذ";
      avatar = "from-pink-500 to-rose-500";
      category = "location";
    } else if (text.includes("لغز") || text.includes("حل") || text.includes("تمرين") || text.includes("مات")) {
      replyText = "هادشي بسيط بزاف! 🤣 ألغاز مكناس دائماً ما تدمج بين الحساب العالي والخيال العلمي مثل ترقيات الفرسان المتتالية!";
      sender = "معاذ";
      avatar = "from-pink-500 to-rose-500";
      category = "puzzle";
    } else if (text.includes("صلاة") || text.includes("أذان") || text.includes("حرام") || text.includes("تربية")) {
      replyText = "الأخلاق هي الأهم. اللعبة وسيلة للتدريب الذهني والتربية وليست للمشاكسة أو تأخير الفرائض الدينية. الصلاة أولاً ودائماً!";
      sender = "رشيد العوني";
      avatar = "from-slate-700 to-slate-900";
      category = "general";
    } else if (text.includes("بوشيبة") || text.includes("وفاة") || text.includes("رحم")) {
      replyText = "رحمه الله وغفر له، لقد كان الأستاذ بوشيبة مدرسة بأكملها للتحليل الرياضي وحسن الخلق في مكناس وبقية المغرب.";
      sender = "بلال";
      avatar = "from-violet-500 to-fuchsia-500";
      category = "general";
    } else {
      replyText = "مرحباً بك معنا في فضاء شطرنج مكناس الإسماعيلية! شاركنا تساؤلاتك حول الافتتاحيات أو الألغاز، أو اقترح موعداً للعب في المقاهي.";
      sender = "يوسف (الشطرنجي المحترف)";
      avatar = "from-red-500 to-rose-500";
      category = "general";
    }

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toTimeString().substring(0, 5);
      const newMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        senderName: sender,
        avatarColor: avatar,
        message: replyText,
        time: timeStr,
        date: "07-07-2026",
        category
      };
      setChatList(prev => [...prev, newMsg]);
    }, 1500);
  };

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userMsg.trim()) return;

    const now = new Date();
    const timeStr = now.toTimeString().substring(0, 5);
    const newMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      senderName: "أنت (You)",
      avatarColor: "from-emerald-600 to-teal-700",
      message: userMsg,
      time: timeStr,
      date: "07-07-2026",
      category: "general"
    };

    setChatList(prev => [...prev, newMsg]);
    const promptInput = userMsg;
    setUserMsg("");
    
    triggerAIMessage(promptInput);
  };

  const handleSendPreset = (presetText: string) => {
    setUserMsg(presetText);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toTimeString().substring(0, 5);
      const newMsg: ChatMessage = {
        id: `msg-user-preset-${Date.now()}`,
        senderName: "أنت (You)",
        avatarColor: "from-emerald-600 to-teal-700",
        message: presetText,
        time: timeStr,
        date: "07-07-2026",
        category: "general"
      };
      setChatList(prev => [...prev, newMsg]);
      triggerAIMessage(presetText);
    }, 100);
  };

  const handleLikeThread = (threadId: string) => {
    setForumThreads(prev => prev.map(t => t.id === threadId ? { ...t, likes: t.likes + 1 } : t));
  };

  const handleSendForumReply = (threadId: string) => {
    if (!forumReply.trim()) return;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    setForumThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          repliesCount: t.repliesCount + 1,
          replies: [
            ...t.replies,
            {
              id: `rep-user-${Date.now()}`,
              author: "أنت (العضو المكناسي الجديد)",
              avatarColor: "from-emerald-600 to-teal-700",
              content: forumReply,
              date: dateStr,
              likes: 0
            }
          ]
        };
      }
      return t;
    }));
    setForumReply("");
  };

  // Chat Filter & Search Logic
  const filteredChats = chatList.filter(msg => {
    const matchesSearch = msg.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          msg.senderName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (categoryFilter === "all") return matchesSearch;
    return msg.category === categoryFilter && matchesSearch;
  });

  const activeThread = forumThreads.find(t => t.id === activeThreadId);

  return (
    <div id="meknes_community_chat_and_forum_module" className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Visual Navigation Tabs */}
      <div className="lg:col-span-12 flex justify-center gap-3 border-b border-slate-800 pb-4">
        <button
          onClick={() => { setActiveTab("whatsapp"); setActiveThreadId(null); }}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
            activeTab === "whatsapp" 
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
              : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" /> محادثات مجموعة واتساب (Meknes Chess Group)
        </button>
        <button
          onClick={() => setActiveTab("forum")}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
            activeTab === "forum" 
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
              : "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> منتدى النقاش المفتوح (Chess Forum)
        </button>
      </div>

      {/* WHATSAPP GROUP CHAT SIMULATOR */}
      {activeTab === "whatsapp" && (
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          {/* Left Panel: Search & Presets (5/12 grid) */}
          <div className="md:col-span-4 border-l border-slate-800/80 p-5 flex flex-col justify-between h-[650px] bg-slate-900/40">
            <div>
              <h4 className="font-bold text-emerald-400 mb-3 flex items-center gap-1.5 text-sm">
                <Search className="w-4 h-4" /> بحث وتصفية المحادثات
              </h4>
              
              {/* Search Bar */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="ابحث عن كلمة (مثلا: الإيطالي، صلاة)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500 text-right"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              </div>

              {/* Categorization Filters */}
              <span className="text-xs text-slate-500 font-semibold block mb-2">تصنيف المواضيع (Filter Topic):</span>
              <div className="flex flex-col gap-1.5 mb-6">
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold text-right transition flex items-center justify-between ${
                    categoryFilter === "all" ? "bg-emerald-950/80 border border-emerald-500 text-white" : "bg-slate-950 border border-transparent text-slate-400 hover:bg-slate-800/50"
                  }`}
                >
                  <span>عرض الكل</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">{chatList.length}</span>
                </button>
                <button
                  onClick={() => setCategoryFilter("puzzle")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold text-right transition flex items-center justify-between ${
                    categoryFilter === "puzzle" ? "bg-emerald-950/80 border border-emerald-500 text-white" : "bg-slate-950 border border-transparent text-slate-400 hover:bg-slate-800/50"
                  }`}
                >
                  <span>الألغاز والحلول</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                    {chatList.filter(c => c.category === "puzzle").length}
                  </span>
                </button>
                <button
                  onClick={() => setCategoryFilter("opening")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold text-right transition flex items-center justify-between ${
                    categoryFilter === "opening" ? "bg-emerald-950/80 border border-emerald-500 text-white" : "bg-slate-950 border border-transparent text-slate-400 hover:bg-slate-800/50"
                  }`}
                >
                  <span>تحليل الافتتاحيات</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                    {chatList.filter(c => c.category === "opening").length}
                  </span>
                </button>
                <button
                  onClick={() => setCategoryFilter("location")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold text-right transition flex items-center justify-between ${
                    categoryFilter === "location" ? "bg-emerald-950/80 border border-emerald-500 text-white" : "bg-slate-950 border border-transparent text-slate-400 hover:bg-slate-800/50"
                  }`}
                >
                  <span>اللقاءات والمقاهي بمكناس</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                    {chatList.filter(c => c.category === "location").length}
                  </span>
                </button>
                <button
                  onClick={() => setCategoryFilter("general")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold text-right transition flex items-center justify-between ${
                    categoryFilter === "general" ? "bg-emerald-950/80 border border-emerald-500 text-white" : "bg-slate-950 border border-transparent text-slate-400 hover:bg-slate-800/50"
                  }`}
                >
                  <span>نقاشات عامة وأخبار</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                    {chatList.filter(c => c.category === "general").length}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Presets Sender (Immersive dialogue) */}
            <div className="border-t border-slate-800 pt-4 mt-4">
              <span className="text-xs text-slate-400 font-bold block mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> حوارات سريعة جاهزة لإرسالها:
              </span>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleSendPreset("ما هي نصائحكم لتجاوز تقييم 1300 ELO؟")}
                  className="p-2 text-right rounded bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800/50 hover:border-slate-700 transition"
                >
                  💬 ما هي نصائحكم لتجاوز تقييم 1300 ELO؟
                </button>
                <button
                  onClick={() => handleSendPreset("من سيلعب معي اليوم في مقهى ديامو فير؟")}
                  className="p-2 text-right rounded bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800/50 hover:border-slate-700 transition"
                >
                  💬 من سيلعب معي اليوم في مقهى ديامو فير؟
                </button>
                <button
                  onClick={() => handleSendPreset("هل هناك لغز شطرنجي بمستوى 3000 elo؟ 🤣")}
                  className="p-2 text-right rounded bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800/50 hover:border-slate-700 transition"
                >
                  💬 هل هناك لغز بمستوى 3000 ELO؟
                </button>
                <button
                  onClick={() => handleSendPreset("رحم الله الفقيد الأستاذ لحسن بوشيبة قيدوم مكناس")}
                  className="p-2 text-right rounded bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800/50 hover:border-slate-700 transition"
                >
                  💬 رحم الله الفقيد الأستاذ لحسن بوشيبة.
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: WhatsApp Chat visual (8/12 grid) */}
          <div className="md:col-span-8 flex flex-col h-[650px] justify-between bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-opacity-5">
            {/* WhatsApp Header */}
            <div className="bg-emerald-900/90 text-white p-4 flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-sm border border-emerald-700 shadow shrink-0">
                  ♟MC
                </div>
                <div>
                  <h3 className="font-bold text-sm">Meknes Chess • شطرنج مكناس</h3>
                  <span className="text-[10px] text-emerald-200/90 block">
                    يوسف، معاذ، رشيد العوني، بلال، سفيان، زكرياء، طارق...
                  </span>
                </div>
              </div>
              <span className="text-xs bg-emerald-950 px-2.5 py-1 rounded-full text-emerald-300 flex items-center gap-1 font-semibold">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> 07-07-2026
              </span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-900/90 scrollbar-thin scrollbar-thumb-slate-800">
              {filteredChats.map((msg) => {
                const isUser = msg.senderName === "أنت (You)" || msg.senderName.startsWith("أنت");
                const isSystem = msg.senderName === "Adil";

                if (isSystem) {
                  return (
                    <div key={msg.id} className="w-full flex justify-center">
                      <span className="bg-slate-950/60 text-slate-400 text-[10px] px-3 py-1 rounded-lg border border-slate-800 font-mono">
                        {msg.message}
                      </span>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className={`w-full flex ${isUser ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[80%] rounded-2xl p-3 shadow-md relative ${
                      isUser 
                        ? "bg-emerald-950/90 text-emerald-100 rounded-tl-none border border-emerald-800/80" 
                        : "bg-slate-950/95 text-slate-100 rounded-tr-none border border-slate-800"
                    }`}>
                      {/* Sender Name */}
                      {!isUser && (
                        <span className={`text-[11px] font-bold block mb-1 bg-gradient-to-r ${msg.avatarColor} bg-clip-text text-transparent`}>
                          {msg.senderName}
                        </span>
                      )}
                      
                      {/* Content */}
                      <p className="text-xs whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </p>

                      {/* Info Row */}
                      <div className="flex items-center justify-end gap-1.5 mt-2 text-[9px] text-slate-500">
                        {msg.isEdited && <span>تم تعديلها • Edited</span>}
                        <span>{msg.time}</span>
                        {isUser && <span className="text-emerald-400 font-bold">✓✓</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredChats.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-20">
                  <Clock className="w-10 h-10 text-slate-600 mb-2 animate-spin" />
                  <p className="text-xs">لا توجد رسائل تطابق بحثك الحالي.</p>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChat} className="bg-slate-950 p-3.5 border-t border-slate-800/80 flex gap-2">
              <input
                type="text"
                placeholder="اكتب رسالتك وناقش الشطرنج مع المجموعة..."
                value={userMsg}
                onChange={(e) => setUserMsg(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 text-right placeholder-slate-500"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/20 transition flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DISCUSSION FORUM BOARD */}
      {activeTab === "forum" && (
        <div className="lg:col-span-12 flex flex-col gap-6">
          {/* Thread Detail View */}
          {activeThreadId && activeThread ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-5 animate-fade-in">
              <button
                onClick={() => setActiveThreadId(null)}
                className="text-emerald-400 font-bold text-xs hover:underline flex items-center gap-1 w-fit mb-2 self-start"
              >
                ← العودة إلى منتدى النقاشات
              </button>

              {/* The Thread Header */}
              <div className="border-b border-slate-800 pb-4">
                <div className="flex gap-2.5 mb-3 flex-wrap">
                  {activeThread.tags.map((t, idx) => (
                    <span key={idx} className="bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-md font-semibold">
                      #{t}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl font-bold text-slate-100 mb-2 leading-snug">
                  {activeThread.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${activeThread.avatarColor} flex items-center justify-center text-[10px] font-bold text-white`}>
                    {activeThread.author.substring(0, 1)}
                  </div>
                  <span>بواسطة: <strong className="text-slate-300">{activeThread.author}</strong></span>
                  <span>•</span>
                  <span>{activeThread.date}</span>
                </div>
              </div>

              {/* Thread Content */}
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap bg-slate-950/40 p-5 rounded-xl border border-slate-850">
                {activeThread.content}
              </p>

              {/* Thread Actions */}
              <div className="flex gap-4 border-b border-slate-800 pb-4 text-xs text-slate-400">
                <button
                  onClick={() => handleLikeThread(activeThread.id)}
                  className="flex items-center gap-1.5 hover:text-emerald-400 transition bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800"
                >
                  <ThumbsUp className="w-4 h-4" /> أعجبني ({activeThread.likes})
                </button>
                <span className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <MessageSquare className="w-4 h-4" /> الردود والتعليقات ({activeThread.repliesCount})
                </span>
              </div>

              {/* Replies Log */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-slate-400 mb-2">أبرز الردود المحلية (Replies):</h4>
                {activeThread.replies.map((rep) => (
                  <div key={rep.id} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/60 flex flex-col gap-2">
                    <div className="flex items-center justify-between w-full text-xs border-b border-slate-900 pb-1.5 mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${rep.avatarColor} flex items-center justify-center text-[9px] font-bold text-white`}>
                          {rep.author.substring(0, 1)}
                        </div>
                        <span className="font-bold text-slate-200">{rep.author}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{rep.date}</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
                      {rep.content}
                    </p>
                    <div className="flex justify-end mt-1">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        ❤️ أعجب به {rep.likes} لاعبين
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Reply Form */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 mt-2">
                <h4 className="font-bold text-xs text-slate-400 mb-3 block">اكتب ردك وملاحظتك التكتيكية:</h4>
                <textarea
                  placeholder="شارك رأيك أو استفسارك حول هذا النقاش الشطرنجي..."
                  value={forumReply}
                  onChange={(e) => setForumReply(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 text-right placeholder-slate-500 mb-3 leading-relaxed"
                />
                <div className="flex justify-start">
                  <button
                    onClick={() => handleSendForumReply(activeThread.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold text-white shadow-md shadow-emerald-950/20 transition flex items-center gap-1.5"
                  >
                    إرسال الرد المكتوب
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Threads Index List */
            <div className="grid grid-cols-1 gap-4">
              {forumThreads.map((thread) => (
                <div
                  key={thread.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 p-5 rounded-2xl shadow-xl transition flex flex-col gap-3 group"
                >
                  {/* Category Tags */}
                  <div className="flex gap-2 flex-wrap">
                    {thread.tags.map((t, idx) => (
                      <span key={idx} className="bg-slate-950 text-slate-400 text-[9px] px-2.5 py-0.5 rounded border border-slate-800 font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Thread Title */}
                  <h3
                    onClick={() => setActiveThreadId(thread.id)}
                    className="text-lg font-bold text-slate-100 hover:text-emerald-400 cursor-pointer transition leading-snug"
                  >
                    {thread.title}
                  </h3>

                  {/* Thread Preview Snippet */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {thread.content}
                  </p>

                  {/* Thread Metadata */}
                  <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-[11px] text-slate-500 mt-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${thread.avatarColor} flex items-center justify-center text-[9px] font-bold text-white`}>
                        {thread.author.substring(0, 1)}
                      </div>
                      <span>المشرف: <strong className="text-slate-400">{thread.author}</strong></span>
                      <span>•</span>
                      <span>تاريخ النشر: {thread.date}</span>
                    </div>

                    <div className="flex gap-4 items-center">
                      <span className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded border border-slate-800/80">
                        👍 {thread.likes}
                      </span>
                      <button
                        onClick={() => setActiveThreadId(thread.id)}
                        className="text-emerald-500 font-bold hover:underline flex items-center gap-0.5"
                      >
                        عرض الردود ({thread.repliesCount}) <ChevronDown className="w-3.5 h-3.5 rotate-270" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
