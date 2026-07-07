import { useState } from "react";
import { MEKNES_LOCATIONS } from "../data/locations";
import { ChessLocation } from "../types";
import { MapPin, Clock, Coffee, ShieldCheck, CheckCircle, Navigation, Instagram, Users, Sparkles } from "lucide-react";

export default function LocationFinder() {
  const [locations, setLocations] = useState<ChessLocation[]>(MEKNES_LOCATIONS);
  // Track check-ins to make it interactive and gamified
  const [checkIns, setCheckIns] = useState<Record<string, { count: number; checked: boolean }>>({
    "cafe-dynamo-vert": { count: 14, checked: false },
    "new-club-camelia": { count: 22, checked: false },
    "cafe-mabrouka": { count: 8, checked: false },
    "cafe-taeris": { count: 18, checked: false },
    "cafe-mouktasadiya": { count: 11, checked: false },
    "dar-chabab-club": { count: 16, checked: false }
  });
  const [selectedType, setSelectedType] = useState<"all" | "مقهى" | "نادي" | "دار الشباب">("all");

  const handleCheckIn = (id: string) => {
    setCheckIns(prev => {
      const isChecked = prev[id].checked;
      return {
        ...prev,
        [id]: {
          count: isChecked ? prev[id].count - 1 : prev[id].count + 1,
          checked: !isChecked
        }
      };
    });
  };

  const filteredLocations = locations.filter(loc => {
    if (selectedType === "all") return true;
    return loc.type === selectedType;
  });

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "مقهى":
        return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
      case "نادي":
        return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
      case "دار الشباب":
      default:
        return "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30";
    }
  };

  return (
    <div id="meknes_locations_directory_module" className="max-w-7xl mx-auto p-4 flex flex-col gap-8">
      {/* Introduction and filter controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Coffee className="w-6 h-6 text-emerald-400" /> خريطة ودليل الشطرنج بمكناس
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            اكتشف المقاهي والأندية الحقيقية التي يلتقي فيها الشطرنجيون بمكناس لممارسة اللعبة والتدريب، بما في ذلك المواعيد والمواقع الجغرافية الدقيقة.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
              selectedType === "all"
                ? "bg-emerald-600 border-emerald-500 text-white"
                : "bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            الكل ({locations.length})
          </button>
          <button
            onClick={() => setSelectedType("مقهى")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
              selectedType === "مقهى"
                ? "bg-amber-600 border-amber-500 text-white"
                : "bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            المقاهي الشطرنجية ({locations.filter(l => l.type === "مقهى").length})
          </button>
          <button
            onClick={() => setSelectedType("نادي")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
              selectedType === "نادي"
                ? "bg-emerald-600 border-emerald-500 text-white"
                : "bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            الأندية الرسمية ({locations.filter(l => l.type === "نادي").length})
          </button>
          <button
            onClick={() => setSelectedType("دار الشباب")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
              selectedType === "دار الشباب"
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            دور الشباب ومراكز التدريب ({locations.filter(l => l.type === "دار الشباب").length})
          </button>
        </div>
      </div>

      {/* Grid of Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLocations.map((loc) => {
          const checkInfo = checkIns[loc.id] || { count: 0, checked: false };
          return (
            <div
              key={loc.id}
              className="bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition group"
            >
              {/* Card Banner with Venue Type */}
              <div className="p-5 border-b border-slate-800/60 bg-slate-950/20 flex items-center justify-between">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${getBadgeColor(loc.type)}`}>
                  {loc.type}
                </span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" /> مكناس، المغرب
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 space-y-4">
                {/* Name */}
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition leading-snug">
                  {loc.nameAr}
                </h3>
                
                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">
                  {loc.descriptionAr}
                </p>

                {/* Info Metadata Block */}
                <div className="space-y-2 bg-slate-950/40 p-3.5 rounded-xl border border-slate-850">
                  <div className="flex items-start gap-2 text-xs text-slate-300">
                    <Navigation className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[10px] text-slate-500 block mb-0.5">العنوان بالتفصيل:</span>
                      <span className="leading-relaxed">{loc.addressAr}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-300 border-t border-slate-800/60 pt-2 mt-2">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[10px] text-slate-500 block mb-0.5">المواعيد المفضلة للعب:</span>
                      <span>{loc.timingAr}</span>
                    </div>
                  </div>
                </div>

                {/* Key Features Checkboxes */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 font-bold block mb-1">مميزات المقر:</span>
                  {loc.featuresAr.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 leading-relaxed">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Check-ins and actions */}
              <div className="p-5 border-t border-slate-850 bg-slate-950/40 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Users className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
                  <span className="font-mono text-slate-300">
                    <strong className="text-emerald-400 font-bold">{checkInfo.count}</strong> لاعباً {loc.type === "مقهى" ? "هناك الليلة" : "مسجلين"}
                  </span>
                </div>

                {loc.instagram ? (
                  <a
                    href={loc.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-gradient-to-tr from-pink-600 via-purple-600 to-orange-500 text-white rounded-lg hover:opacity-90 transition flex items-center gap-1 text-[11px] font-bold shadow"
                  >
                    <Instagram className="w-3.5 h-3.5" /> إنستغرام لطلب التسجيل
                  </a>
                ) : (
                  <button
                    onClick={() => handleCheckIn(loc.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 border ${
                      checkInfo.checked
                        ? "bg-emerald-950 border-emerald-500 text-emerald-300 shadow shadow-emerald-950/20"
                        : "bg-slate-800 hover:bg-slate-700 border-transparent text-slate-200"
                    }`}
                  >
                    <CheckCircle className={`w-3.5 h-3.5 ${checkInfo.checked ? "text-emerald-400" : "text-slate-400"}`} />
                    {checkInfo.checked ? "سأذهب للعب! (مؤكد)" : "سأذهب هناك للعب الليلة!"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Meknes neighborhood schematic asset mockup */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" /> مخطط توزيع مواقع الشطرنج بمكناس (Schematic View)
          </h4>
          <span className="text-[10px] text-slate-500">محدثة حسب تنقلات اللاعبين بمكناس</span>
        </div>
        
        {/* Visual Map Layout using absolute positioned CSS points */}
        <div className="relative w-full h-44 bg-slate-950 rounded-xl overflow-hidden border border-slate-850 flex items-center justify-center">
          {/* Compass grid lines */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/15 via-transparent to-transparent opacity-60" />
          <div className="absolute w-full h-[1px] bg-slate-900" />
          <div className="absolute h-full w-[1px] bg-slate-900" />
          <div className="absolute w-2/3 h-2/3 rounded-full border border-slate-900/50" />
          <div className="absolute w-1/3 h-1/3 rounded-full border border-slate-900/70" />

          {/* Location 1: Hamria/Taeris */}
          <div className="absolute top-10 left-[25%] flex flex-col items-center">
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-ping absolute" />
            <div className="w-3 h-3 bg-pink-500 rounded-full border-2 border-white relative" />
            <span className="text-[9px] font-bold text-pink-400 mt-1">حمرية (تايريس)</span>
          </div>

          {/* Location 2: Camelia Club */}
          <div className="absolute top-24 right-[20%] flex flex-col items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute" />
            <div className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white relative" />
            <span className="text-[9px] font-bold text-emerald-400 mt-1">كاميليا (النادي الجديد)</span>
          </div>

          {/* Location 3: Bir Anzarane */}
          <div className="absolute bottom-12 left-[40%] flex flex-col items-center">
            <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping absolute" />
            <div className="w-3 h-3 bg-amber-500 rounded-full border-2 border-white relative" />
            <span className="text-[9px] font-bold text-amber-400 mt-1">بئر انزران (دينامو فير)</span>
          </div>

          {/* Location 4: Mabrouka */}
          <div className="absolute top-12 right-[45%] flex flex-col items-center">
            <div className="w-2 h-2 bg-indigo-500 rounded-full border border-white" />
            <span className="text-[9px] text-slate-400 mt-1">حي مبروكة (مقهى مبروك)</span>
          </div>

          {/* Location 5: Dar Chabab City Center */}
          <div className="absolute bottom-6 right-[30%] flex flex-col items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full border border-white" />
            <span className="text-[9px] text-slate-400 mt-1">قرب سينما ريجان (دار الشباب)</span>
          </div>

          {/* Overlay Coordinates */}
          <span className="absolute bottom-2 right-2 font-mono text-[9px] text-slate-600">33.8965° N, 5.5473° W</span>
          <span className="absolute top-2 left-2 font-mono text-[9px] text-slate-600">MEKNES ESMAÏLIA REGION MAP</span>
        </div>
      </div>
    </div>
  );
}
