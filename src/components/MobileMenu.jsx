import { useState, useEffect } from "react";
import { EkrandaOyna } from "./EkrandaOyna";
import {
  ShoppingCart,
  User,
  Settings,
  ArrowLeft,
} from "lucide-react";
import chessboardImg from "../assets/Board.png";
import logoImg from "../assets/logo.png";
import botImg from "../assets/bot.png";
import haritaImg from "../assets/harita.png";
import ekrandaImg from "../assets/ekrandaoyna.png";

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
            Öğren
          </h1>
        </div>

        {/* Kartlar */}
        <div className="flex flex-col gap-5 px-5 py-6 relative z-10">
          <MenuCard
            id="mobile-roadmap-btn"
            label="Yol Haritası"
            iconSrc={haritaImg}
            onClick={() => setScreen("roadmap")}
          />
          <MenuCard
            id="mobile-rules-btn"
            label="Kurallar"
            iconSrc={botImg}
            onClick={() =>
              showNotification("Kurallar bölümü yakında açılıyor!", "info")
            }
          />
          <MenuCard
            id="mobile-analysis-btn"
            label="Analiz Motoru"
            iconSrc={ekrandaImg}
            onClick={() =>
              showNotification("Analiz Motoru yakında açılıyor!", "info")
            }
          />
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
    return (
      <div className="mobile-screen flex flex-col bg-[#1a4228] justify-between relative overflow-hidden select-none">
        {/* Glow decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,229,255,0.03)_0%,_transparent_75%)] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-9 pb-3 relative z-10">
          <button
            onClick={() => setScreen("learn")}
            className="mobile-back-btn"
            aria-label="Geri"
          >
            <ArrowLeft size={28} strokeWidth={2.5} />
          </button>
          <h1 className="font-batangas text-[1.8rem] font-bold text-white tracking-wide leading-none">
            Timur'a giden yol
          </h1>
        </div>

        {/* 3D Isometric Map Area */}
        <div className="flex-1 relative flex items-center justify-center p-4">

          {/* Path connectors (dotted glowing lines behind islands) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Path connecting Island 4 to 3 */}
            <path d="M 220 180 L 150 280" stroke="rgba(0, 229, 255, 0.2)" strokeWidth="4" strokeDasharray="6 6" />
            {/* Path connecting Island 3 to 2 */}
            <path d="M 150 280 L 250 370" stroke="rgba(0, 229, 255, 0.2)" strokeWidth="4" strokeDasharray="6 6" />
            {/* Path connecting Island 2 to 1 */}
            <path d="M 250 370 L 160 480" stroke="rgba(0, 229, 255, 0.2)" strokeWidth="4" strokeDasharray="6 6" />
          </svg>

          {/* Level 4: Timur'un Sarayı (Top right) */}
          <div className="absolute top-[8%] right-[10%] flex flex-col items-center z-10 animate-float" style={{ animationDelay: "0.6s" }}>
            <svg viewBox="0 0 120 100" className="w-[105px] h-[90px] cursor-pointer" onClick={() => showNotification("Timur'un Sarayı henüz kilitli!", "info")}>
              {/* Island Shadow */}
              <path d="M 60 45 L 110 70 L 60 95 L 10 70 Z" fill="rgba(0,0,0,0.45)" filter="blur(3px)" />
              {/* 3D Island Block */}
              {/* Left face */}
              <path d="M 10 60 L 60 85 L 60 95 L 10 70 Z" fill="#2d3d34" />
              {/* Right face */}
              <path d="M 60 85 L 110 60 L 110 70 L 60 95 Z" fill="#1f2b24" />
              {/* Top face */}
              <path d="M 60 35 L 110 60 L 60 85 L 10 60 Z" fill="#4d5f54" />
              {/* Lock outline */}
              <path d="M 54 48 L 66 48 L 66 54 L 54 54 Z M 57 42 C 57 39 63 39 63 42 L 63 48 L 57 48 Z" fill="none" stroke="#2d3d34" strokeWidth="2.5" />
            </svg>
            <span className="text-[10px] text-white/50 font-bold mt-1 text-center bg-black/40 px-2 py-0.5 rounded-full border border-white/5">
              4. Saray
            </span>
          </div>

          {/* Level 3: Taktikler (Mid left) */}
          <div className="absolute top-[28%] left-[8%] flex flex-col items-center z-10 animate-float" style={{ animationDelay: "0.4s" }}>
            <svg viewBox="0 0 120 100" className="w-[105px] h-[90px] cursor-pointer" onClick={() => showNotification("Taktik adası kilitli!", "info")}>
              <path d="M 60 45 L 110 70 L 60 95 L 10 70 Z" fill="rgba(0,0,0,0.45)" filter="blur(3px)" />
              <path d="M 10 60 L 60 85 L 60 95 L 10 70 Z" fill="#2d3d34" />
              <path d="M 60 85 L 110 60 L 110 70 L 60 95 Z" fill="#1f2b24" />
              <path d="M 60 35 L 110 60 L 60 85 L 10 60 Z" fill="#4d5f54" />
            </svg>
            <span className="text-[10px] text-white/50 font-bold mt-1 text-center bg-black/40 px-2 py-0.5 rounded-full border border-white/5">
              3. Taktik
            </span>
          </div>

          {/* Level 2: Taş Hareketleri (Mid right) */}
          <div className="absolute top-[48%] right-[15%] flex flex-col items-center z-10 animate-float" style={{ animationDelay: "0.2s" }}>
            <svg viewBox="0 0 120 100" className="w-[105px] h-[90px] cursor-pointer" onClick={() => showNotification("Taş Hareketleri adası kilitli!", "info")}>
              <path d="M 60 45 L 110 70 L 60 95 L 10 70 Z" fill="rgba(0,0,0,0.45)" filter="blur(3px)" />
              <path d="M 10 60 L 60 85 L 60 95 L 10 70 Z" fill="#2d3d34" />
              <path d="M 60 85 L 110 60 L 110 70 L 60 95 Z" fill="#1f2b24" />
              <path d="M 60 35 L 110 60 L 60 85 L 10 60 Z" fill="#4d5f54" />
            </svg>
            <span className="text-[10px] text-white/50 font-bold mt-1 text-center bg-black/40 px-2 py-0.5 rounded-full border border-white/5">
              2. Hareketler
            </span>
          </div>

          {/* Level 1: Hakkında (Bottom left/center - ACTIVE cyan color) */}
          <div className="absolute top-[68%] left-[20%] flex flex-col items-center z-20 animate-float">
            <svg viewBox="0 0 120 100" className="w-[125px] h-[105px] cursor-pointer" onClick={() => showNotification("Bölüm 1: Timur Satrancı Tarihçesi", "success")}>
              <circle cx="60" cy="55" r="40" fill="rgba(0, 229, 255, 0.15)" filter="blur(8px)" />
              <path d="M 60 45 L 110 70 L 60 95 L 10 70 Z" fill="rgba(0,0,0,0.5)" filter="blur(3px)" />
              <path d="M 10 60 L 60 85 L 60 95 L 10 70 Z" fill="#00aab8" />
              <path d="M 60 85 L 110 60 L 110 70 L 60 95 Z" fill="#00838f" />
              <path d="M 60 35 L 110 60 L 60 85 L 10 60 Z" fill="url(#cyanGrad)" />
              <ellipse cx="60" cy="60" rx="10" ry="5" fill="#ffffff" opacity="0.8" className="animate-pulse" />
              <defs>
                <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00ffd2" />
                  <stop offset="100%" stopColor="#00e5ff" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-center mt-2 flex flex-col items-center">
              <span className="text-xs font-extrabold text-[#00e5ff] tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                1. timur satran
              </span>
              <span className="text-[10px] font-bold text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                hakkında
              </span>
            </div>
          </div>

          {/* Pieces logo at bottom left */}
          <div className="absolute bottom-4 left-4 z-20">
            <img
              src={logoImg}
              alt="Logo"
              className="w-20 h-20 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
            />
          </div>

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
