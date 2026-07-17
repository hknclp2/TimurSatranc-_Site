import { useState, useEffect, useRef } from "react";
import { EkrandaOyna } from "./EkrandaOyna";
import {
  ShoppingCart,
  User,
  Settings,
  ArrowLeft,
  BookOpen,
  Map,
  Shield,
  Cpu,
  ChevronRight,
  Lock,
  Star,
  CheckCircle,
  Play,
  Zap,
  Trophy,
  Swords,
  Info,
  X,
} from "lucide-react";
import chessboardImg from "../assets/Board.png";
import logoImg from "../assets/logo.png";
import botImg from "../assets/bot.png";
import haritaImg from "../assets/harita.png";
import ekrandaImg from "../assets/ekrandaoyna.png";
import sPiyon from "../assets/pieces/s_piyon.png";
import sKale from "../assets/pieces/s_kale.png";
import sAt from "../assets/pieces/s_at.png";
import sFil from "../assets/pieces/s_fil.png";
import sDeve from "../assets/pieces/s_deve.png";
import sZurafa from "../assets/pieces/s_zurafa.png";
import sMancinik from "../assets/pieces/s_mancinik.png";
import sSah from "../assets/pieces/s_sah.png";
import sVezir from "../assets/pieces/s_vezir.png";

/* ─── CROWN SELECTOR ─── */
function CrownSelector({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`bg-[#387e5c] text-white py-1.5 px-3 rounded-lg flex items-center justify-center gap-0.5 cursor-pointer transition-all active:scale-95 ${value === n
              ? "ring-2 ring-yellow-400 scale-105 shadow-md"
              : "opacity-55 hover:opacity-80"
            }`}
        >
          {Array.from({ length: n }).map((_, i) => (
            <span key={i} className="text-yellow-400 text-xs">
              👑
            </span>
          ))}
        </button>
      ))}
    </div>
  );
}

/* ─── BOT KARTI ─── */
function BotCard({
  label,
  icon,
  isExpanded,
  onToggle,
  time,
  onTimeToggle,
  crowns,
  onCrownChange,
  onStart,
}) {
  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${isExpanded ? "ring-2 ring-purple-400/70" : ""
        }`}
    >
      <button
        onClick={onToggle}
        className={`bg-[#f5eedc] p-5 flex justify-between items-center w-full cursor-pointer transition-all duration-200 active:scale-[0.99] ${isExpanded ? "" : "rounded-2xl"
          }`}
      >
        <span className="font-batangas text-xl font-bold text-[#141f1b]">
          {label}
        </span>
        {/* Asset ikonu — doğal boyutu korunur */}
        <img src={icon} alt={label} className="w-10 h-10 object-contain" />
      </button>

      {isExpanded && (
        <div className="bg-[#c8bfae] px-5 pt-4 pb-5 flex flex-col gap-4 text-[#141f1b] border-t border-[#141f1b]/10 animate-slide-down">
          {/* Zaman Seçenekleri */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Zaman Seçenekleri</span>
            <button
              onClick={onTimeToggle}
              className="bg-[#387e5c] hover:bg-[#2e684c] text-white font-bold py-1 px-4 rounded-lg cursor-pointer transition-all active:scale-95 shadow-sm text-sm"
            >
              {time}
            </button>
          </div>

          {/* Taç */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Taç</span>
            <CrownSelector value={crowns} onChange={onCrownChange} />
          </div>

          {/* Başlat */}
          <button
            onClick={onStart}
            className="w-full bg-[#1a442e] hover:bg-[#123020] text-white font-batangas font-bold py-3.5 rounded-xl transition-all shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 mt-1"
          >
            Oyunu Başlat
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── MENU KARTI (asset ikonu) ─── */
function MenuCard({ id, label, iconSrc, onClick }) {
  return (
    <button id={id} onClick={onClick} className="mobile-card-btn">
      <span className="font-batangas text-xl font-bold text-[#141f1b]">
        {label}
      </span>
      <img src={iconSrc} alt={label} className="w-10 h-10 object-contain" />
    </button>
  );
}

/* ─── TIMUR CHESS PIECES INITIAL LAYOUT (11 columns x 10 rows) ─── */
// Legend: 
// P: Piyade, K: Kale, A: At, F: Fil, D: Deve, Z: Zürafa, M: Mancınık, Ş: Şah, V: Vezir, Fe: Fers
const INITIAL_BOARD = [
  // Row 0 (Black back rank 1)
  [
    { type: "F", name: "Fil", isWhite: false }, null, { type: "D", name: "Deve", isWhite: false }, null,
    { type: "M", name: "Mancınık", isWhite: false }, null, { type: "M", name: "Mancınık", isWhite: false }, null,
    { type: "D", name: "Deve", isWhite: false }, null, { type: "F", name: "Fil", isWhite: false }
  ],
  // Row 1 (Black back rank 2)
  [
    { type: "K", name: "Kale", isWhite: false }, { type: "A", name: "At", isWhite: false }, { type: "F", name: "Fil", isWhite: false },
    { type: "Z", name: "Zürafa", isWhite: false }, { type: "V", name: "Vezir", isWhite: false }, { type: "Ş", name: "Şah", isWhite: false },
    { type: "Fe", name: "Fers", isWhite: false }, { type: "Z", name: "Zürafa", isWhite: false }, { type: "F", name: "Fil", isWhite: false },
    { type: "A", name: "At", isWhite: false }, { type: "K", name: "Kale", isWhite: false }
  ],
  // Row 2 (Black Pawns)
  Array(11).fill(null).map(() => ({ type: "P", name: "Piyade", isWhite: false })),
  // Row 3 (Empty)
  Array(11).fill(null),
  // Row 4 (Empty)
  Array(11).fill(null),
  // Row 5 (Empty)
  Array(11).fill(null),
  // Row 6 (Empty)
  Array(11).fill(null),
  // Row 7 (White Pawns)
  [
    { type: "P", name: "Piyade", isWhite: true }, { type: "P", name: "Piyade", isWhite: true }, { type: "P", name: "Piyade", isWhite: true },
    null, { type: "P", name: "Piyade", isWhite: true }, { type: "P", name: "Piyade", isWhite: true }, { type: "P", name: "Piyade", isWhite: true },
    { type: "P", name: "Piyade", isWhite: true }, { type: "P", name: "Piyade", isWhite: true }, { type: "P", name: "Piyade", isWhite: true },
    { type: "P", name: "Piyade", isWhite: true }
  ],
  // Row 8 (White back rank 2)
  [
    { type: "K", name: "Kale", isWhite: true }, { type: "A", name: "At", isWhite: true }, { type: "F", name: "Fil", isWhite: true },
    { type: "Z", name: "Zürafa", isWhite: true }, { type: "V", name: "Vezir", isWhite: true }, { type: "Ş", name: "Şah", isWhite: true },
    { type: "Fe", name: "Fers", isWhite: true }, { type: "Z", name: "Zürafa", isWhite: true }, { type: "F", name: "Fil", isWhite: true },
    null, { type: "K", name: "Kale", isWhite: true }
  ],
  // Row 9 (White back rank 1)
  [
    { type: "F", name: "Fil", isWhite: true }, null, { type: "D", name: "Deve", isWhite: true }, null,
    { type: "M", name: "Mancınık", isWhite: true }, null, { type: "M", name: "Mancınık", isWhite: true }, null,
    { type: "D", name: "Deve", isWhite: true }, null, { type: "F", name: "Fil", isWhite: true }
  ]
];

// Active moves configuration matching screenshot
INITIAL_BOARD[7][3] = null;
INITIAL_BOARD[6][3] = { type: "P", name: "Piyade", isWhite: true };
INITIAL_BOARD[8][9] = null;
INITIAL_BOARD[6][8] = { type: "A", name: "At", isWhite: true };



/* ══════════════════════════════════════════
   ANA BİLEŞEN
══════════════════════════════════════════ */
export function MobileMenu({ showNotification }) {
  const [screen, setScreen] = useState("splash");
  const [activeBotLabel, setActiveBotLabel] = useState("Kolay Bot");

  /* Bot state */
  const [expandedBot, setExpandedBot] = useState("kolay");
  const [kolayTime, setKolayTime] = useState("15.00");
  const [ortaTime, setOrtaTime] = useState("10.00");
  const [zorTime, setZorTime] = useState("5.00");
  const [kolayCrowns, setKolayCrowns] = useState(1);
  const [ortaCrowns, setOrtaCrowns] = useState(2);
  const [zorCrowns, setZorCrowns] = useState(3);

  /* Öğren modülü state — MUST be at component top (React Rules of Hooks) */
  const [slideIdx, setSlideIdx] = useState(0);
  const [rulesTab, setRulesTab] = useState("pieces");
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [analysisMode, setAnalysisMode] = useState("board");

  /* Splash → main otomatik geçiş */
  useEffect(() => {
    if (screen === "splash") {
      const t = setTimeout(() => setScreen("main"), 2400);
      return () => clearTimeout(t);
    }
  }, [screen]);

  /* ────────────────────────────────────────
     1. SPLASH EKRANI
  ──────────────────────────────────────── */
  if (screen === "splash") {
    return (
      <div className="mobile-screen flex flex-col items-center justify-center bg-[#1a4228]">
        <div className="absolute w-72 h-72 rounded-full bg-[rgba(0,229,255,0.04)] blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center gap-5 animate-mobile-fadein relative z-10">
          <img
            src={logoImg}
            alt="Timur Satrancı Logo"
            className="w-52 h-52 object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.6)] animate-float"
          />
          <h1 className="font-batangas text-4xl font-bold text-white tracking-widest text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            Timur&nbsp; Satrancı
          </h1>
        </div>

        {/* Yükleme noktaları */}
        <div className="absolute bottom-16 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-white/30"
              style={{
                animation: `mobilePulse 1.2s ${i * 0.2}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  /* ────────────────────────────────────────
     2. ANA MENÜ
  ──────────────────────────────────────── */
  if (screen === "main") {
    return (
      <div className="mobile-screen flex flex-col bg-[#1a4228] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_rgba(0,229,255,0.05)_0%,_transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0d2818]/80 to-transparent pointer-events-none" />

        {/* Üst satır: Mağaza & Profil */}
        <div className="flex justify-between items-center px-5 pt-8 relative z-10">
          <button
            id="mobile-shop-btn"
            onClick={() => showNotification("Mağaza yakında açılıyor!", "info")}
            className="mobile-icon-btn"
            aria-label="Mağaza"
          >
            <ShoppingCart size={24} strokeWidth={2} />
          </button>
          <button
            id="mobile-profile-btn"
            onClick={() => showNotification("Profil yakında açılıyor!", "info")}
            className="mobile-icon-btn"
            aria-label="Profil"
          >
            <User size={24} strokeWidth={2} />
          </button>
        </div>

        {/* İkinci satır: Logo + Başlık + Ayarlar */}
        <div className="flex items-center justify-between px-5 mt-4 relative z-10">
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-white/20 bg-black/20 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.4)] backdrop-blur-sm">
            <img
              src={logoImg}
              alt="Logo"
              className="w-[52px] h-[52px] object-contain"
            />
          </div>

          <h1 className="font-batangas text-4xl font-extrabold text-white text-center leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] tracking-wide">
            Timur
            <br />
            Satrancı
          </h1>

          <button
            id="mobile-settings-btn"
            onClick={() => showNotification("Ayarlar yakında açılıyor!", "info")}
            className="mobile-icon-btn"
            aria-label="Ayarlar"
          >
            <Settings size={24} strokeWidth={2} />
          </button>
        </div>

        {/* Satranç tahtası */}
        <div className="flex-1 flex items-center justify-center px-6 py-2 relative z-10">
          <div className="relative w-full max-w-[330px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(0,229,255,0.1)_0%,_transparent_70%)] blur-2xl pointer-events-none" />
            <img
              src={chessboardImg}
              alt="3D Timur Satranç Tahtası"
              className="w-full object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.65)] animate-float relative z-10"
            />
          </div>
        </div>

        {/* Oyna & Öğren */}
        <div className="flex flex-col gap-4 px-7 pb-12 relative z-10">
          <button
            id="mobile-play-btn"
            onClick={() => setScreen("play")}
            className="mobile-main-btn"
          >
            <span className="font-batangas text-2xl font-bold">Oyna</span>
          </button>
          <button
            id="mobile-learn-btn"
            onClick={() => setScreen("learn")}
            className="mobile-main-btn"
          >
            <span className="font-batangas text-2xl font-bold">Öğren</span>
          </button>
        </div>
      </div>
    );
  }

  /* ────────────────────────────────────────
     3. OYNA ALT MENÜSÜ
  ──────────────────────────────────────── */
  if (screen === "play") {
    return (
      <div className="mobile-screen flex flex-col bg-[#1a4228] relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.04)_0%,_transparent_70%)] pointer-events-none" />

        {/* Başlık */}
        <div className="flex items-center gap-3 px-5 pt-9 pb-3 relative z-10">
          <button
            onClick={() => setScreen("main")}
            className="mobile-back-btn"
            aria-label="Geri"
          >
            <ArrowLeft size={28} strokeWidth={2.5} />
          </button>
          <h1 className="font-batangas text-[2.4rem] font-bold text-white tracking-wide leading-none">
            Oyna
          </h1>
        </div>

        {/* Kartlar */}
        <div className="flex flex-col gap-5 px-5 py-6 relative z-10">
          <MenuCard
            id="mobile-online-btn"
            label="Çevrimiçi oyna"
            iconSrc={haritaImg}
            onClick={() => showNotification("Çevrimiçi oyun çok yakında!", "info")}
          />
          <MenuCard
            id="mobile-bot-btn"
            label="Bot'a karşı oyna"
            iconSrc={botImg}
            onClick={() => setScreen("bot")}
          />
          <MenuCard
            id="mobile-screen-btn"
            label="Ekranda oyna"
            iconSrc={ekrandaImg}
            onClick={() => setScreen("game-screen")}
          />
        </div>
      </div>
    );
  }

  /* ────────────────────────────────────────
     4. BOT SEÇİM EKRANI
  ──────────────────────────────────────── */
  if (screen === "bot") {
    return (
      <div className="mobile-screen flex flex-col bg-[#1a4228] relative overflow-y-auto custom-scrollbar">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,229,255,0.04)_0%,_transparent_70%)] pointer-events-none" />

        {/* Başlık */}
        <div className="flex items-center gap-3 px-5 pt-9 pb-3 relative z-10">
          <button
            onClick={() => setScreen("play")}
            className="mobile-back-btn"
            aria-label="Geri"
          >
            <ArrowLeft size={28} strokeWidth={2.5} />
          </button>
          <h1 className="font-batangas text-[2rem] font-bold text-white tracking-wide leading-none">
            Bota karşı oyna
          </h1>
        </div>

        {/* Bot Kartları */}
        <div className="flex flex-col gap-5 px-5 py-6 pb-12 relative z-10">
          {/* KOLAY */}
          <BotCard
            label="Kolay Bot"
            icon={haritaImg}
            isExpanded={expandedBot === "kolay"}
            onToggle={() =>
              setExpandedBot(expandedBot === "kolay" ? null : "kolay")
            }
            time={kolayTime}
            onTimeToggle={() =>
              setKolayTime(
                kolayTime === "15.00"
                  ? "30.00"
                  : kolayTime === "30.00"
                    ? "10.00"
                    : "15.00"
              )
            }
            crowns={kolayCrowns}
            onCrownChange={setKolayCrowns}
            onStart={() => {
              setActiveBotLabel("Kolay Bot");
              setScreen("game-bot");
            }}
          />

          {/* ORTA */}
          <BotCard
            label="Orta Bot"
            icon={botImg}
            isExpanded={expandedBot === "orta"}
            onToggle={() =>
              setExpandedBot(expandedBot === "orta" ? null : "orta")
            }
            time={ortaTime}
            onTimeToggle={() =>
              setOrtaTime(
                ortaTime === "10.00"
                  ? "15.00"
                  : ortaTime === "15.00"
                    ? "20.00"
                    : "10.00"
              )
            }
            crowns={ortaCrowns}
            onCrownChange={setOrtaCrowns}
            onStart={() => {
              setActiveBotLabel("Orta Bot");
              setScreen("game-bot");
            }}
          />

          {/* ZOR */}
          <BotCard
            label="Zor Bot"
            icon={ekrandaImg}
            isExpanded={expandedBot === "zor"}
            onToggle={() =>
              setExpandedBot(expandedBot === "zor" ? null : "zor")
            }
            time={zorTime}
            onTimeToggle={() =>
              setZorTime(
                zorTime === "5.00"
                  ? "8.00"
                  : zorTime === "8.00"
                    ? "3.00"
                    : "5.00"
              )
            }
            crowns={zorCrowns}
            onCrownChange={setZorCrowns}
            onStart={() => {
              setActiveBotLabel("Zor Bot");
              setScreen("game-bot");
            }}
          />
        </div>
      </div>
    );
  }

  /* ────────────────────────────────────────
     5. ÖĞREN ALT MENÜSÜ
  ──────────────────────────────────────── */
  if (screen === "learn") {
    const learnItems = [
      {
        id: "mobile-roadmap-btn",
        label: "Yol Haritası",
        desc: "Adım adım Timur Satrancını öğren",
        icon: <Map size={28} />,
        color: "#00d4c4",
        glow: "rgba(0, 212, 196, 0.35)",
        progress: 20,
        badge: "1/5",
        screen: "roadmap",
      },
      {
        id: "mobile-rules-btn",
        label: "Kurallar",
        desc: "Taş hareketleri ve oyun kuralları",
        icon: <Shield size={28} />,
        color: "#f59e0b",
        glow: "rgba(245, 158, 11, 0.35)",
        progress: 0,
        badge: "Yeni",
        screen: "rules",
      },
      {
        id: "mobile-analysis-btn",
        label: "Analiz Motoru",
        desc: "Hamle analizi ve strateji geliştir",
        icon: <Cpu size={28} />,
        color: "#a78bfa",
        glow: "rgba(167, 139, 250, 0.35)",
        progress: 0,
        badge: "Beta",
        screen: "analysis",
      },
    ];

    return (
      <div className="mobile-screen flex flex-col bg-[#122b1e] relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#0d2218] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0a1d14] to-transparent" />
          <div className="absolute top-20 right-[-60px] w-56 h-56 rounded-full bg-[rgba(0,212,196,0.05)] blur-3xl" />
          <div className="absolute bottom-20 left-[-40px] w-48 h-48 rounded-full bg-[rgba(167,139,250,0.05)] blur-3xl" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-10 pb-2 relative z-10">
          <button onClick={() => setScreen("main")} className="mobile-back-btn" aria-label="Geri">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
              <ArrowLeft size={20} strokeWidth={2.5} />
            </div>
          </button>
          <div>
            <h1 className="font-batangas text-[2.2rem] font-bold text-white tracking-wide leading-none">
              Öğren
            </h1>
            <p className="text-white/40 text-xs mt-0.5">Timur Satrancını keşfet</p>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="px-5 mt-3 mb-5 relative z-10">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/8 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/60 text-xs font-semibold">Genel İlerleme</span>
              <span className="text-[#00d4c4] text-xs font-bold">%20</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: "20%",
                  background: "linear-gradient(90deg, #00d4c4, #00e5ff)",
                  boxShadow: "0 0 8px rgba(0, 229, 255, 0.5)",
                }}
              />
            </div>
            <div className="flex gap-1 mt-2.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-1.5 rounded-full ${
                    s === 1 ? "bg-[#00d4c4]" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Module cards */}
        <div className="flex flex-col gap-4 px-5 pb-10 relative z-10 overflow-y-auto custom-scrollbar flex-1">
          {learnItems.map((item, idx) => (
            <button
              key={item.id}
              id={item.id}
              onClick={() => setScreen(item.screen)}
              className="w-full text-left rounded-2xl overflow-hidden border border-white/8 active:scale-[0.98] transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
                boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 0 0 ${item.glow}`,
              }}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Icon bubble */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${item.color}22, ${item.color}11)`,
                      border: `1.5px solid ${item.color}33`,
                      color: item.color,
                      boxShadow: `0 4px 16px ${item.glow}`,
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Text area */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-batangas text-xl font-bold text-white leading-tight">
                        {item.label}
                      </span>
                      <div
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          background: `${item.color}22`,
                          color: item.color,
                          border: `1px solid ${item.color}44`,
                        }}
                      >
                        {item.badge}
                      </div>
                    </div>
                    <p className="text-white/40 text-xs mt-1 leading-relaxed">{item.desc}</p>

                    {/* Progress row */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${item.progress}%`,
                            background: `linear-gradient(90deg, ${item.color}, ${item.color}cc)`,
                          }}
                        />
                      </div>
                      <span className="text-white/30 text-[10px] font-semibold flex-shrink-0">
                        %{item.progress}
                      </span>
                    </div>
                  </div>

                  <ChevronRight size={18} className="text-white/20 flex-shrink-0 mt-1" />
                </div>
              </div>
              {/* Bottom color strip */}
              <div
                className="h-0.5 w-full"
                style={{ background: `linear-gradient(90deg, ${item.color}88, transparent)` }}
              />
            </button>
          ))}

          {/* Coming soon card */}
          <div className="rounded-2xl border border-white/5 p-5 flex items-center gap-4 opacity-50">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
              <Trophy size={24} className="text-white/30" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-batangas text-lg font-bold text-white/40">Turnuva Rehberi</span>
                <Lock size={12} className="text-white/20" />
              </div>
              <p className="text-white/20 text-xs mt-0.5">Çok yakında açılıyor</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ────────────────────────────────────────
     6. OYNAMA EKRANI (BOT KISMI)
  ──────────────────────────────────────── */
  if (screen === "game-bot") {
    let limit = 600;
    if (activeBotLabel === "Kolay Bot") limit = 900;
    else if (activeBotLabel === "Zor Bot") limit = 300;
    
    return (
      <EkrandaOyna
        onBack={() => setScreen("bot")}
        showNotification={showNotification}
        vsBot={true}
        initialTimeSeconds={limit}
      />
    );
  }

  /* ────────────────────────────────────────
     7. YOL HARİTASI (ROADMAP EKRANI)
  ──────────────────────────────────────── */
  if (screen === "roadmap") {
    const levels = [
      {
        id: 5,
        title: "Timur'un Sarayı",
        sub: "Büyük Usta",
        locked: true,
        active: false,
        complete: false,
        color: "#f59e0b",
        pos: { top: "4%", right: "8%" },
        icon: "👑",
        delay: "0.8s",
      },
      {
        id: 4,
        title: "Taktikler",
        sub: "İleri Seviye",
        locked: true,
        active: false,
        complete: false,
        color: "#a78bfa",
        pos: { top: "22%", left: "6%" },
        icon: "⚔️",
        delay: "0.6s",
      },
      {
        id: 3,
        title: "Strateji",
        sub: "Orta Seviye",
        locked: true,
        active: false,
        complete: false,
        color: "#34d399",
        pos: { top: "40%", right: "10%" },
        icon: "🧠",
        delay: "0.4s",
      },
      {
        id: 2,
        title: "Taş Hareketleri",
        sub: "Başlangıç",
        locked: false,
        active: false,
        complete: false,
        color: "#60a5fa",
        pos: { top: "57%", left: "12%" },
        icon: "♟️",
        delay: "0.2s",
      },
      {
        id: 1,
        title: "Timur Satrancı Hakkında",
        sub: "Başlangıç",
        locked: false,
        active: true,
        complete: false,
        color: "#00d4c4",
        pos: { top: "72%", left: "30%" },
        icon: "📜",
        delay: "0s",
      },
    ];

    return (
      <div className="mobile-screen flex flex-col bg-[#122b1e] relative overflow-hidden select-none">
        {/* Atmospheric background */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(0,212,196,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(167,139,250,0.04) 0%, transparent 50%)",
            }}
          />
          {/* Grid dots */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-10 pb-2 relative z-10 flex-shrink-0">
          <button onClick={() => setScreen("learn")} className="mobile-back-btn" aria-label="Geri">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
              <ArrowLeft size={20} strokeWidth={2.5} />
            </div>
          </button>
          <div>
            <h1 className="font-batangas text-[1.9rem] font-bold text-white tracking-wide leading-none">
              Timur'a Giden Yol
            </h1>
            <p className="text-white/40 text-xs mt-0.5">1 / 5 bölüm tamamlandı</p>
          </div>
        </div>

        {/* Map area */}
        <div className="flex-1 relative overflow-hidden">
          {/* SVG path connectors */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Path 1→2 */}
            <path
              d="M 48% 82% Q 40% 68% 28% 67%"
              fill="none"
              stroke="rgba(0,212,196,0.35)"
              strokeWidth="3"
              strokeDasharray="8 5"
              filter="url(#glow)"
            />
            {/* Path 2→3 */}
            <path
              d="M 28% 63% Q 50% 53% 68% 50%"
              fill="none"
              stroke="rgba(96,165,250,0.25)"
              strokeWidth="3"
              strokeDasharray="8 5"
            />
            {/* Path 3→4 */}
            <path
              d="M 70% 47% Q 35% 38% 22% 30%"
              fill="none"
              stroke="rgba(52,211,153,0.2)"
              strokeWidth="3"
              strokeDasharray="8 5"
            />
            {/* Path 4→5 */}
            <path
              d="M 22% 28% Q 55% 18% 72% 12%"
              fill="none"
              stroke="rgba(167,139,250,0.2)"
              strokeWidth="3"
              strokeDasharray="8 5"
            />
          </svg>

          {/* Level nodes */}
          {levels.map((lvl) => (
            <div
              key={lvl.id}
              className="absolute flex flex-col items-center z-10 animate-float"
              style={{ ...lvl.pos, animationDelay: lvl.delay }}
            >
              {/* Island SVG */}
              <button
                onClick={() => {
                  if (lvl.locked) {
                    showNotification(`${lvl.title} henüz kilitli! 🔒`, "info");
                  } else if (lvl.id === 1) {
                    setScreen("lesson-1");
                  } else {
                    showNotification(`${lvl.title} başlatılıyor...`, "success");
                  }
                }}
                className="relative focus:outline-none"
              >
                <svg
                  viewBox="0 0 140 120"
                  className={`w-[110px] h-[96px] transition-transform active:scale-95 ${
                    lvl.active ? "drop-shadow-[0_0_16px_rgba(0,212,196,0.7)]" : ""
                  }`}
                >
                  {/* Glow for active */}
                  {lvl.active && (
                    <ellipse cx="70" cy="62" rx="48" ry="22" fill={`${lvl.color}25`} />
                  )}
                  {/* Shadow */}
                  <path
                    d="M 70 55 L 125 82 L 70 108 L 15 82 Z"
                    fill="rgba(0,0,0,0.5)"
                    style={{ filter: "blur(4px)" }}
                  />
                  {/* Left face */}
                  <path
                    d="M 15 72 L 70 98 L 70 108 L 15 82 Z"
                    fill={lvl.locked ? "#243428" : lvl.active ? "#00838f" : "#2a4a38"}
                  />
                  {/* Right face */}
                  <path
                    d="M 70 98 L 125 72 L 125 82 L 70 108 Z"
                    fill={lvl.locked ? "#1a2820" : lvl.active ? "#006470" : "#1e3628"}
                  />
                  {/* Top face */}
                  <path
                    d="M 70 42 L 125 68 L 70 94 L 15 68 Z"
                    fill={lvl.locked ? "#3a5040" : lvl.active ? `url(#grad${lvl.id})` : `${lvl.color}55`}
                  />
                  {/* Icon or lock */}
                  {lvl.locked ? (
                    <>
                      <path
                        d="M 63 56 L 77 56 L 77 65 L 63 65 Z M 66 50 C 66 46 74 46 74 50 L 74 56 L 66 56 Z"
                        fill="none"
                        stroke="#3a5040"
                        strokeWidth="2.5"
                      />
                    </>
                  ) : (
                    <text
                      x="70"
                      y="74"
                      textAnchor="middle"
                      fontSize="18"
                      dominantBaseline="middle"
                    >
                      {lvl.icon}
                    </text>
                  )}
                  {/* Gradient defs */}
                  <defs>
                    <linearGradient id={`grad${lvl.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={lvl.color} />
                      <stop offset="100%" stopColor={`${lvl.color}88`} />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Active pulse ring */}
                {lvl.active && (
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-30"
                    style={{
                      background: `radial-gradient(circle, ${lvl.color}44, transparent)`,
                      animationDuration: "2s",
                    }}
                  />
                )}
              </button>

              {/* Label */}
              <div className="mt-1.5 text-center">
                <div
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
                  style={{
                    background: lvl.locked ? "rgba(0,0,0,0.5)" : `${lvl.color}22`,
                    color: lvl.locked ? "rgba(255,255,255,0.3)" : lvl.color,
                    borderColor: lvl.locked ? "rgba(255,255,255,0.06)" : `${lvl.color}44`,
                  }}
                >
                  {lvl.id}. {lvl.title.length > 16 ? lvl.title.slice(0, 14) + "…" : lvl.title}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom info card for active lesson */}
        <div className="flex-shrink-0 px-5 pb-6 relative z-10">
          <div
            className="rounded-2xl p-4 border flex items-center gap-4"
            style={{
              background: "rgba(0,212,196,0.08)",
              borderColor: "rgba(0,212,196,0.2)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
              style={{ background: "rgba(0,212,196,0.15)", border: "1px solid rgba(0,212,196,0.3)" }}
            >
              📜
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-[#00d4c4] font-bold uppercase tracking-wider mb-0.5">
                Aktif Bölüm
              </div>
              <div className="font-batangas text-base font-bold text-white truncate">
                1. Timur Satrancı Hakkında
              </div>
              <div className="text-white/40 text-xs mt-0.5">Başlangıç Seviyesi</div>
            </div>
            <button
              onClick={() => setScreen("lesson-1")}
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
              style={{ background: "#00d4c4", boxShadow: "0 4px 14px rgba(0,212,196,0.45)" }}
            >
              <Play size={16} fill="#0d2818" color="#0d2818" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ────────────────────────────────────────
     7b. DERS 1: TIMUR SATRANCI HAKKINDA
  ──────────────────────────────────────── */
  if (screen === "lesson-1") {
    const slides = [
      {
        emoji: "👑",
        title: "Timur Satrancı Nedir?",
        body:
          "Timur Satrancı (Şatranj-ı Timuri), 14. yüzyılda Büyük Timur'un sarayında geliştirilmiş tarihin en zengin satranç varyasyonudur. Standart satrancın 8×8 tahtası yerine 10×11 büyüklüğünde bir tahta kullanılır.",
      },
      {
        emoji: "📏",
        title: "Tahta ve Taşlar",
        body:
          "Timur Satrancında standart taşlara ek olarak Deve, Zürafa, Mancınık ve Fers gibi özel taşlar bulunur. Her taşın kendine özgü hareket kuralları vardır. Bu zengin taş çeşitliliği oyunun stratejik derinliğini artırır.",
      },
      {
        emoji: "📜",
        title: "Tarihi Arka Plan",
        body:
          "Oyunun kuralları tarihçi al-Amin al-Kashani'nin 14. yüzyıl yazıtlarından derlenmiştir. Timur'un sarayında oynanan bu oyun, İpek Yolu üzerinden tüm Orta Asya'ya yayılmıştır.",
      },
      {
        emoji: "🎯",
        title: "Oyunun Amacı",
        body:
          "Amaç standart satrançta olduğu gibi rakibin Şah'ını mat etmektir. Ancak daha geniş tahta ve ek taşlar sayesinde maça giden yollar çok daha zengin ve yaratıcıdır.",
      },
    ];

    return (
      <div className="mobile-screen flex flex-col bg-[#122b1e] relative overflow-hidden">
        {/* BG */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(0,212,196,0.07) 0%, transparent 60%)",
            }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-10 pb-4 relative z-10 flex-shrink-0">
          <button onClick={() => setScreen("roadmap")} className="mobile-back-btn" aria-label="Geri">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
              <ArrowLeft size={20} strokeWidth={2.5} />
            </div>
          </button>
          <div className="text-center">
            <div className="text-[#00d4c4] text-[10px] font-bold uppercase tracking-widest">Bölüm 1</div>
            <h1 className="font-batangas text-lg font-bold text-white leading-tight">Timur Satrancı Hakkında</h1>
          </div>
          {/* Step counter */}
          <div className="text-white/30 text-xs font-semibold">{slideIdx + 1}/{slides.length}</div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 justify-center pb-4 flex-shrink-0 relative z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIdx(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === slideIdx ? "24px" : "6px",
                background: i === slideIdx ? "#00d4c4" : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>

        {/* Slide content */}
        <div className="flex-1 px-5 relative z-10 flex flex-col">
          <div
            key={slideIdx}
            className="flex-1 rounded-3xl p-6 flex flex-col border animate-zoom-in"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: "rgba(0,212,196,0.15)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="text-5xl mb-4 text-center">{slides[slideIdx].emoji}</div>
            <h2 className="font-batangas text-2xl font-bold text-white text-center mb-4 leading-tight">
              {slides[slideIdx].title}
            </h2>
            <p className="text-white/60 text-sm leading-relaxed text-center flex-1">
              {slides[slideIdx].body}
            </p>

            {/* Decorative chess piece silhouette */}
            <div className="flex justify-center mt-6 opacity-20">
              <img src={logoImg} alt="" className="w-16 h-16 object-contain" />
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="px-5 pt-4 pb-8 flex gap-3 relative z-10 flex-shrink-0">
          <button
            onClick={() => setSlideIdx((s) => Math.max(0, s - 1))}
            disabled={slideIdx === 0}
            className="flex-1 py-4 rounded-2xl border border-white/10 text-white/50 font-bold text-sm disabled:opacity-30 transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            ← Önceki
          </button>
          {slideIdx < slides.length - 1 ? (
            <button
              onClick={() => setSlideIdx((s) => s + 1)}
              className="flex-1 py-4 rounded-2xl font-bold text-sm transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #00d4c4, #00a896)",
                color: "#0d2818",
                boxShadow: "0 6px 20px rgba(0,212,196,0.4)",
              }}
            >
              Sonraki →
            </button>
          ) : (
            <button
              onClick={() => {
                showNotification("Tebrikler! Bölüm 1 tamamlandı! 🎉", "success");
                setScreen("roadmap");
              }}
              className="flex-1 py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "#1a0a00",
                boxShadow: "0 6px 20px rgba(245,158,11,0.4)",
              }}
            >
              <Trophy size={16} />
              Tamamla!
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ────────────────────────────────────────
     7c. KURALLAR EKRANI
  ──────────────────────────────────────── */
  if (screen === "rules") {
    const piecesData = [
      {
        name: "Şah",
        symbol: "Ş",
        img: sSah,
        move: "Her yönde 1 kare. Asla tehdit altına giremez.",
        value: "∞",
        color: "#f59e0b",
      },
      {
        name: "Vezir",
        symbol: "V",
        img: sVezir,
        move: "Her yönde istediği kadar kare hareket eder.",
        value: "9",
        color: "#a78bfa",
      },
      {
        name: "Kale",
        symbol: "K",
        img: sKale,
        move: "Yatay ve dikey istediği kadar kare.",
        value: "5",
        color: "#60a5fa",
      },
      {
        name: "Fil",
        symbol: "F",
        img: sFil,
        move: "Çapraz istediği kadar kare hareket eder.",
        value: "3",
        color: "#34d399",
      },
      {
        name: "At",
        symbol: "A",
        img: sAt,
        move: "L şeklinde: 2+1 kare. Taşları atlayabilir.",
        value: "3",
        color: "#00d4c4",
      },
      {
        name: "Deve",
        symbol: "D",
        img: sDeve,
        move: "Çapraz 2 kare atlayarak hareket eder.",
        value: "4",
        color: "#fb923c",
      },
      {
        name: "Zürafa",
        symbol: "Z",
        img: sZurafa,
        move: "1 kare düz + 3 kare çapraz veya tersi.",
        value: "5",
        color: "#facc15",
      },
      {
        name: "Mancınık",
        symbol: "M",
        img: sMancinik,
        move: "2 kare düz + 2 kare çapraz (L²) hareket eder.",
        value: "4",
        color: "#f87171",
      },
      {
        name: "Piyade",
        symbol: "P",
        img: sPiyon,
        move: "1 kare ileri. İlk hamlede 2 kare. Çapraz yer.",
        value: "1",
        color: "#d1d5db",
      },
    ];

    const rules = [
      {
        title: "Oyunun Amacı",
        icon: "🎯",
        desc: "Rakibin Şahını mat ederek oyunu kazanmak. Mat, Şahın kaçma yolu kalmadığı ve tehdit altında olduğu durumdur.",
      },
      {
        title: "Tahta Boyutu",
        icon: "📐",
        desc: "Timur Satrancı 10×11 büyüklüğünde bir tahta üzerinde oynanır. Bu standart satrancın 8×8 tahtasından çok daha geniştir.",
      },
      {
        title: "Sıra Takibi",
        icon: "⏱️",
        desc: "Beyaz her zaman ilk hamleyi yapar. Oyuncular sırayla birer hamle yapar. Sıranızı geçemezsiniz.",
      },
      {
        title: "Taş Yeme",
        icon: "⚔️",
        desc: "Bir taş, rakibin taşının üzerine hareket ederek onu tahtadan kaldırabilir. Kendi taşınızın üzerine gidemezsiniz.",
      },
      {
        title: "Şah ve Mat",
        icon: "👑",
        desc: "Şahınız tehdit altındaysa 'şah' durumundasınızdır ve tehdidi mutlaka gidermeniz gerekir. Bunu yapamazsanız mat olursunuz.",
      },
      {
        title: "Beraberlik",
        icon: "🤝",
        desc: "Oyun; pat durumunda, yetersiz materyal olduğunda veya her iki oyuncu anlaştığında beraberlikle sonuçlanabilir.",
      },
    ];

    return (
      <div className="mobile-screen flex flex-col bg-[#122b1e] relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.06) 0%, transparent 55%)",
          }}
        />

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-10 pb-3 relative z-10 flex-shrink-0">
          <button onClick={() => setScreen("learn")} className="mobile-back-btn" aria-label="Geri">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
              <ArrowLeft size={20} strokeWidth={2.5} />
            </div>
          </button>
          <div>
            <h1 className="font-batangas text-[2rem] font-bold text-white tracking-wide leading-none">
              Kurallar
            </h1>
            <p className="text-white/40 text-xs mt-0.5">Taşlar ve oyun kuralları</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-5 pb-3 flex-shrink-0 relative z-10">
          <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/8">
            {[
              { key: "pieces", label: "Taşlar", icon: <Swords size={14} /> },
              { key: "rules", label: "Kurallar", icon: <BookOpen size={14} /> },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setRulesTab(tab.key)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200"
                style={{
                  background: rulesTab === tab.key ? "rgba(245,158,11,0.2)" : "transparent",
                  color: rulesTab === tab.key ? "#f59e0b" : "rgba(255,255,255,0.3)",
                  border: rulesTab === tab.key ? "1px solid rgba(245,158,11,0.3)" : "1px solid transparent",
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pb-8 relative z-10">
          {rulesTab === "pieces" ? (
            <>
              {/* Piece grid */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {piecesData.map((piece) => (
                  <button
                    key={piece.name}
                    onClick={() => setSelectedPiece(selectedPiece?.name === piece.name ? null : piece)}
                    className="rounded-2xl p-3 flex flex-col items-center gap-2 border transition-all active:scale-95"
                    style={{
                      background:
                        selectedPiece?.name === piece.name
                          ? `${piece.color}18`
                          : "rgba(255,255,255,0.04)",
                      borderColor:
                        selectedPiece?.name === piece.name
                          ? `${piece.color}50`
                          : "rgba(255,255,255,0.07)",
                      boxShadow:
                        selectedPiece?.name === piece.name
                          ? `0 4px 16px ${piece.color}25`
                          : "none",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: `${piece.color}15` }}
                    >
                      <img src={piece.img} alt={piece.name} className="w-8 h-8 object-contain" />
                    </div>
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: selectedPiece?.name === piece.name ? piece.color : "rgba(255,255,255,0.6)" }}
                    >
                      {piece.name}
                    </span>
                    <span
                      className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: `${piece.color}20`,
                        color: piece.color,
                      }}
                    >
                      {piece.value === "∞" ? "♾" : `+${piece.value}`}
                    </span>
                  </button>
                ))}
              </div>

              {/* Selected piece detail */}
              {selectedPiece && (
                <div
                  className="rounded-2xl p-5 border mb-4 animate-slide-down"
                  style={{
                    background: `${selectedPiece.color}10`,
                    borderColor: `${selectedPiece.color}30`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: `${selectedPiece.color}20`, border: `1.5px solid ${selectedPiece.color}40` }}
                    >
                      <img src={selectedPiece.img} alt={selectedPiece.name} className="w-10 h-10 object-contain" />
                    </div>
                    <div>
                      <div
                        className="font-batangas text-xl font-bold"
                        style={{ color: selectedPiece.color }}
                      >
                        {selectedPiece.name}
                      </div>
                      <div className="text-white/40 text-xs">Hamle değeri: {selectedPiece.value}</div>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">{selectedPiece.move}</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-3">
              {rules.map((rule, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 border flex gap-4"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                    style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}
                  >
                    {rule.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-batangas text-base font-bold text-white mb-1">{rule.title}</div>
                    <p className="text-white/45 text-xs leading-relaxed">{rule.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ────────────────────────────────────────
     7d. ANALİZ MOTORU EKRANI
  ──────────────────────────────────────── */
  if (screen === "analysis") {
    const sampleMoves = [
      { move: "e4", eval: "+0.3", good: true },
      { move: "e5", eval: "+0.2", good: true },
      { move: "Af3", eval: "+0.5", good: true },
      { move: "Ac6", eval: "+0.4", good: true },
      { move: "Fb5", eval: "+0.8", good: true },
      { move: "a6", eval: "+0.6", good: false },
    ];

    return (
      <div className="mobile-screen flex flex-col bg-[#122b1e] relative overflow-hidden">
        {/* BG glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(167,139,250,0.07) 0%, transparent 55%)",
          }}
        />

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-10 pb-3 relative z-10 flex-shrink-0">
          <button onClick={() => setScreen("learn")} className="mobile-back-btn" aria-label="Geri">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
              <ArrowLeft size={20} strokeWidth={2.5} />
            </div>
          </button>
          <div className="flex-1">
            <h1 className="font-batangas text-[2rem] font-bold text-white tracking-wide leading-none">
              Analiz Motoru
            </h1>
            <p className="text-white/40 text-xs mt-0.5">Hamle analizi ve strateji</p>
          </div>
          <div
            className="px-2.5 py-1 rounded-full text-[10px] font-bold"
            style={{
              background: "rgba(167,139,250,0.15)",
              color: "#a78bfa",
              border: "1px solid rgba(167,139,250,0.3)",
            }}
          >
            Beta
          </div>
        </div>

        {/* Eval bar + board preview */}
        <div className="px-5 pb-3 flex-shrink-0 relative z-10">
          <div
            className="rounded-2xl p-4 border"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(167,139,250,0.15)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/60 text-xs font-semibold">Pozisyon Değerlendirmesi</span>
              <span
                className="text-lg font-bold font-batangas"
                style={{ color: "#34d399" }}
              >
                +0.6
              </span>
            </div>
            {/* Eval bar */}
            <div className="h-3 rounded-full overflow-hidden flex">
              <div
                className="h-full rounded-l-full transition-all duration-700"
                style={{ width: "58%", background: "#f5eedc" }}
              />
              <div
                className="h-full flex-1 rounded-r-full"
                style={{ background: "#1a2820" }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-white/30">Beyaz</span>
              <span className="text-[9px] text-white/30">Siyah</span>
            </div>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="px-5 pb-3 flex-shrink-0 relative z-10">
          <div className="flex gap-2">
            {[
              { key: "board", label: "Tahta", icon: "♟️" },
              { key: "moves", label: "Hamleler", icon: "📋" },
              { key: "tips", label: "İpuçları", icon: "💡" },
            ].map((m) => (
              <button
                key={m.key}
                onClick={() => setAnalysisMode(m.key)}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all"
                style={{
                  background: analysisMode === m.key ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.04)",
                  color: analysisMode === m.key ? "#a78bfa" : "rgba(255,255,255,0.3)",
                  border:
                    analysisMode === m.key
                      ? "1px solid rgba(167,139,250,0.4)"
                      : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <span>{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pb-6 relative z-10">
          {analysisMode === "board" && (
            <div className="flex flex-col gap-4">
              {/* Mini board preview */}
              <div
                className="rounded-2xl overflow-hidden border"
                style={{ borderColor: "rgba(167,139,250,0.15)" }}
              >
                <img
                  src={chessboardImg}
                  alt="Tahta"
                  className="w-full object-contain"
                  style={{ maxHeight: "200px", objectFit: "cover" }}
                />
              </div>
              <div
                className="rounded-2xl p-4 border"
                style={{
                  background: "rgba(167,139,250,0.06)",
                  borderColor: "rgba(167,139,250,0.15)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} style={{ color: "#a78bfa" }} />
                  <span className="text-white/60 text-xs font-semibold">En İyi Hamle</span>
                </div>
                <div className="font-batangas text-2xl font-bold text-white">Af3 → d4</div>
                <p className="text-white/40 text-xs mt-1">At merkezde konumlanarak pozisyon avantajı sağlar.</p>
              </div>
              <button
                onClick={() => showNotification("Analiz motoru oyun moduna bağlanıyor...", "info")}
                className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
                  color: "white",
                  boxShadow: "0 6px 20px rgba(167,139,250,0.35)",
                }}
              >
                <Play size={16} />
                Analiz ile Oyna
              </button>
            </div>
          )}

          {analysisMode === "moves" && (
            <div className="flex flex-col gap-2">
              <div className="text-white/30 text-xs font-semibold mb-1">Son 6 Hamle</div>
              {sampleMoves.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl p-3 border"
                  style={{
                    background: m.good ? "rgba(52,211,153,0.06)" : "rgba(248,113,113,0.06)",
                    borderColor: m.good ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)",
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: m.good ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)",
                      color: m.good ? "#34d399" : "#f87171",
                    }}
                  >
                    {i + 1}
                  </div>
                  <span className="font-batangas text-lg font-bold text-white flex-1">{m.move}</span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: m.good ? "#34d399" : "#f87171" }}
                  >
                    {m.eval}
                  </span>
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: m.good ? "#34d399" : "#f87171" }}
                  />
                </div>
              ))}
            </div>
          )}

          {analysisMode === "tips" && (
            <div className="flex flex-col gap-3">
              {[
                {
                  title: "Merkezi Kontrol Et",
                  tip: "Geniş Timur tahtasında merkez kareler özellikle değerlidir. At ve Deve gibi özel taşlarınızı merkeze yerleştirin.",
                  icon: "🎯",
                  color: "#00d4c4",
                },
                {
                  title: "Özel Taşları Tanı",
                  tip: "Zürafa ve Mancınık standart satrançta yoktur. Bu taşların benzersiz hareketlerini öğrenmek size büyük avantaj sağlar.",
                  icon: "📚",
                  color: "#f59e0b",
                },
                {
                  title: "Uzun Vadeli Plan Yap",
                  tip: "Büyük tahta, daha uzun oyun süreleri demektir. Erken saldırı yerine sağlam bir yapı kurmayı tercih edin.",
                  icon: "🧠",
                  color: "#a78bfa",
                },
                {
                  title: "Deve'yi Kullan",
                  tip: "Deve, çapraz 2 kare atlayarak hareket eder ve bir oyunun seyrini değiştirebilecek güçlü bir taştır.",
                  icon: "🐪",
                  color: "#fb923c",
                },
              ].map((tip, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 border flex gap-3"
                  style={{
                    background: `${tip.color}08`,
                    borderColor: `${tip.color}20`,
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                    style={{ background: `${tip.color}15`, border: `1px solid ${tip.color}25` }}
                  >
                    {tip.icon}
                  </div>
                  <div className="flex-1">
                    <div
                      className="font-batangas text-base font-bold mb-1"
                      style={{ color: tip.color }}
                    >
                      {tip.title}
                    </div>
                    <p className="text-white/45 text-xs leading-relaxed">{tip.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ────────────────────────────────────────
     8. EKRANDA OYNA (TAM OYUN MOTORU)
  ──────────────────────────────────────── */
  if (screen === "game-screen") {
    return (
      <EkrandaOyna
        onBack={() => setScreen("play")}
        showNotification={showNotification}
        initialTimeSeconds={600}
      />
    );
  }

  return null;

}


/* ══════════════════════════════════════════
   ANA BİLEŞEN
   (Yeni oyun ekranlı sürüm)
──────────────────────────────────────── */
