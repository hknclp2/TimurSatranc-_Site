import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, List } from "lucide-react";
import logoImg from "../assets/logo.png";
import hourglassIcon from "../assets/hourglass.png";

/* ════════════════════════════════════════════════════════
   TAŞ GÖRSELLER HARİTASI
════════════════════════════════════════════════════════ */
import wSah from "../assets/pieces/b_sah.png";
import wVezir from "../assets/pieces/b_vezir.png";
import wFers from "../assets/pieces/b_general.png";
import wFil from "../assets/pieces/b_fil.png";
import wDeve from "../assets/pieces/b_deve.png";
import wMancinik from "../assets/pieces/b_mancinik.png";
import wKale from "../assets/pieces/b_kale.png";
import wAt from "../assets/pieces/b_at.png";
import wZurafa from "../assets/pieces/b_zurafa.png";
import wPiyon from "../assets/pieces/b_piyon.png";

import bSah from "../assets/pieces/s_sah.png";
import bVezir from "../assets/pieces/s_vezir.png";
import bFers from "../assets/pieces/s_general.png";
import bFil from "../assets/pieces/s_fil.png";
import bDeve from "../assets/pieces/s_deve.png";
import bMancinik from "../assets/pieces/s_mancinik.png";
import bKale from "../assets/pieces/s_kale.png";
import bAt from "../assets/pieces/s_at.png";
import bZurafa from "../assets/pieces/s_zurafa.png";
import bPiyon from "../assets/pieces/s_piyon.png";

/* ════════════════════════════════════════════════════════
   TAŞ GÖRSELLER HARİTASI
════════════════════════════════════════════════════════ */
const PIECE_IMAGES = {
  white: {
    SAH: wSah,
    VEZIR: wVezir,
    FERS: wFers,
    FIL: wFil,
    DEVE: wDeve,
    MANCINIK: wMancinik,
    KALE: wKale,
    AT: wAt,
    ZURAFA: wZurafa,
    PIYON: wPiyon,
  },
  black: {
    SAH: bSah,
    VEZIR: bVezir,
    FERS: bFers,
    FIL: bFil,
    DEVE: bDeve,
    MANCINIK: bMancinik,
    KALE: bKale,
    AT: bAt,
    ZURAFA: bZurafa,
    PIYON: bPiyon,
  },
};

/* iç tip → PIECE_IMAGES key */
const TYPE_TO_KEY = {
  Ş: "SAH", V: "VEZIR", Fe: "FERS",
  F: "FIL", D: "DEVE", M: "MANCINIK",
  K: "KALE", A: "AT", Z: "ZURAFA", P: "PIYON",
};

const PIECE_ABBR = {
  Ş: "Şh", V: "Vz", Fe: "Fe", F: "Fl",
  D: "Dv", M: "Mc", K: "Kl", A: "At", Z: "Zr", P: "P",
};

/* ════════════════════════════════════════════════════════
   BAŞLANGIÇ TAHTA
════════════════════════════════════════════════════════ */
function buildInitialBoard() {
  const E = null;
  const b = (t, n) => ({ type: t, name: n, isWhite: false });
  const w = (t, n) => ({ type: t, name: n, isWhite: true });
  return [
    [b("F", "Fil"), E, b("D", "Deve"), E, b("M", "Mancınık"), E, b("M", "Mancınık"), E, b("D", "Deve"), E, b("F", "Fil")],
    [b("K", "Kale"), b("A", "At"), b("F", "Fil"), b("Z", "Zürafa"), b("V", "Vezir"), b("Ş", "Şah"), b("Fe", "Fers"), b("Z", "Zürafa"), b("F", "Fil"), b("A", "At"), b("K", "Kale")],
    [b("P", "P"), b("P", "P"), b("P", "P"), b("P", "P"), b("P", "P"), b("P", "P"), b("P", "P"), b("P", "P"), b("P", "P"), b("P", "P"), b("P", "P")],
    [E, E, E, E, E, E, E, E, E, E, E],
    [E, E, E, E, E, E, E, E, E, E, E],
    [E, E, E, E, E, E, E, E, E, E, E],
    [E, E, E, E, E, E, E, E, E, E, E],
    [w("P", "P"), w("P", "P"), w("P", "P"), w("P", "P"), w("P", "P"), w("P", "P"), w("P", "P"), w("P", "P"), w("P", "P"), w("P", "P"), w("P", "P")],
    [w("K", "Kale"), w("A", "At"), w("F", "Fil"), w("Z", "Zürafa"), w("V", "Vezir"), w("Ş", "Şah"), w("Fe", "Fers"), w("Z", "Zürafa"), w("F", "Fil"), w("A", "At"), w("K", "Kale")],
    [w("F", "Fil"), E, w("D", "Deve"), E, w("M", "Mancınık"), E, w("M", "Mancınık"), E, w("D", "Deve"), E, w("F", "Fil")],
  ];
}

/* ════════════════════════════════════════════════════════
   HAREKET MOTORU
════════════════════════════════════════════════════════ */
const inB = (r, c) => r >= 0 && r < 10 && c >= 0 && c < 11;

function slideMoves(board, row, col, dirs) {
  const p = board[row][col], moves = [];
  for (const [dr, dc] of dirs) {
    let r = row + dr, c = col + dc;
    while (inB(r, c)) {
      const t = board[r][c];
      if (!t) moves.push([r, c]);
      else { if (t.isWhite !== p.isWhite) moves.push([r, c]); break; }
      r += dr; c += dc;
    }
  }
  return moves;
}

function jumpMoves(board, row, col, offsets) {
  const p = board[row][col], moves = [];
  for (const [dr, dc] of offsets) {
    const r = row + dr, c = col + dc;
    if (!inB(r, c)) continue;
    const t = board[r][c];
    if (!t || t.isWhite !== p.isWhite) moves.push([r, c]);
  }
  return moves;
}

function getValidMoves(board, row, col) {
  const p = board[row][col];
  if (!p) return [];
  const { type, isWhite } = p;
  switch (type) {
    case "Ş": return jumpMoves(board, row, col, [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]);
    case "V":
    case "Fe": return jumpMoves(board, row, col, [[-1, -1], [-1, 1], [1, -1], [1, 1]]);
    case "K": return slideMoves(board, row, col, [[-1, 0], [1, 0], [0, -1], [0, 1]]);
    case "A": return jumpMoves(board, row, col, [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]);
    case "F": return jumpMoves(board, row, col, [[-2, -2], [-2, 2], [2, -2], [2, 2]]);
    case "D": return jumpMoves(board, row, col, [[-3, -1], [-3, 1], [3, -1], [3, 1], [-1, -3], [-1, 3], [1, -3], [1, 3]]);
    case "M": return jumpMoves(board, row, col, [[-2, 0], [2, 0], [0, -2], [0, 2]]);
    case "Z": {
      const moves = [];
      for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
        const sr = row + dr, sc = col + dc;
        if (!inB(sr, sc)) continue;
        for (let n = 3; n <= 9; n++) { const nr = sr + (dr < 0 ? -n : n), nc = sc; if (!inB(nr, nc)) break; const t = board[nr][nc]; if (!t || t.isWhite !== isWhite) moves.push([nr, nc]); if (t) break; }
        for (let n = 3; n <= 9; n++) { const nr = sr, nc = sc + (dc < 0 ? -n : n); if (!inB(nr, nc)) break; const t = board[nr][nc]; if (!t || t.isWhite !== isWhite) moves.push([nr, nc]); if (t) break; }
      }
      return moves;
    }
    case "P": {
      const dir = isWhite ? -1 : 1, moves = [], nr = row + dir;
      if (inB(nr, col) && !board[nr][col]) moves.push([nr, col]);
      for (const dc of [-1, 1]) { const nc = col + dc; if (inB(nr, nc) && board[nr][nc] && board[nr][nc].isWhite !== isWhite) moves.push([nr, nc]); }
      return moves;
    }
    default: return [];
  }
}

/* ════════════════════════════════════════════════════════
   ZAMANLAYICI
════════════════════════════════════════════════════════ */
function useChessClock(initialSec, isActive, onTimeout) {
  const [remaining, setRemaining] = useState(initialSec);
  const ivRef = useRef(null);
  const cbRef = useRef(onTimeout);
  const prevInitialRef = useRef(initialSec);

  // Update the callback ref in an effect to avoid updating a ref during render
  useEffect(() => { cbRef.current = onTimeout; }, [onTimeout]);

  useEffect(() => {
    // If initialSec changed (e.g. game reset from outside), reset remaining.
    // We do it inside the timer effect to avoid a separate setState-in-effect.
    if (prevInitialRef.current !== initialSec) {
      prevInitialRef.current = initialSec;
      setRemaining(initialSec);
    }

    if (isActive) {
      ivRef.current = setInterval(() => {
        setRemaining(p => {
          if (p <= 1) { clearInterval(ivRef.current); setTimeout(() => cbRef.current(), 0); return 0; }
          return p - 1;
        });
      }, 1000);
    } else clearInterval(ivRef.current);
    return () => clearInterval(ivRef.current);
  }, [isActive, initialSec]);
  return remaining;
}

const fmt = s => {
  if (s === null) return "∞";
  const m = Math.floor(s / 60), sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

/* ════════════════════════════════════════════════════════
   TAŞI RENDER ET — PNG varsa göster, yoksa SVG fallback
════════════════════════════════════════════════════════ */
const SVG_PIECES = {
  SAH: (fill, stroke) => `<svg viewBox="0 0 45 45"><path d="M9 36L36 36L33 21L28 27L22.5 15L17 27L12 21Z" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/><path d="M22.5 9L22.5 15M19.5 12L25.5 12" stroke="${stroke}" stroke-width="1.8" fill="none"/></svg>`,
  VEZIR: (fill, stroke) => `<svg viewBox="0 0 45 45"><path d="M12 36L33 36L30 21L25 26L22.5 15L20 26L15 21Z" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/></svg>`,
  FERS: (fill, stroke) => `<svg viewBox="0 0 45 45"><path d="M15 36L30 36L27 24L22.5 18L18 24Z" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/><circle cx="22.5" cy="13" r="3" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/></svg>`,
  KALE: (fill, stroke) => `<svg viewBox="0 0 45 45"><path d="M9 39L36 39L36 33L33 30L33 18L36 15L36 9L31 9L31 13L26 13L26 9L19 9L19 13L14 13L14 9L9 9L9 15L12 18L12 30L9 33Z" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/></svg>`,
  AT: (fill, stroke) => `<svg viewBox="0 0 45 45"><path d="M33 28.5C33 28.5 36 25.5 34.5 19.5C33 13.5 27 10.5 24 10.5C21 10.5 15 13.5 15 19.5C15 22.5 16.5 24 16.5 24C16.5 24 13.5 25.5 13.5 30C13.5 34.5 19.5 37.5 22.5 37.5C25.5 37.5 31.5 36 33 28.5Z" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/><circle cx="25.5" cy="16.5" r="1.5" fill="${stroke}"/></svg>`,
  FIL: (fill, stroke) => `<svg viewBox="0 0 45 45"><path d="M12 33C12 21 16 15 22.5 15C29 15 33 21 33 33C33 36 29 39 22.5 39C16 39 12 36 12 33Z" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/><path d="M16 27C12 27 9 29 9 33C9 36 12 38 15 38" fill="none" stroke="${stroke}" stroke-width="1.8"/><circle cx="21" cy="21" r="2.5" fill="${stroke}"/></svg>`,
  DEVE: (fill, stroke) => `<svg viewBox="0 0 45 45"><path d="M12 30C12 21 16 18 19 21C22 24 25 18 29 21C33 24 33 30 33 33L12 33Z" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/><path d="M29 24L34 16L38 18" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  MANCINIK: (fill, stroke) => `<svg viewBox="0 0 45 45"><path d="M10 33L35 33L32 24L13 24Z" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/><circle cx="16" cy="35" r="4" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/><circle cx="29" cy="35" r="4" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/><path d="M22 27L33 13" fill="none" stroke="${stroke}" stroke-width="1.8"/></svg>`,
  ZURAFA: (fill, stroke) => `<svg viewBox="0 0 45 45"><path d="M15 30L27 30L27 36L15 36Z" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/><path d="M24 30L24 12C24 12 25 9 28 9" fill="none" stroke="${stroke}" stroke-width="1.8" stroke-linecap="round"/><circle cx="27" cy="13" r="1.5" fill="${stroke}"/></svg>`,
  PIYON: (fill, stroke) => `<svg viewBox="0 0 45 45"><path d="M22.5 9C16 9 12 13 12 18c0 3 1 5 3 6v3c0 2 2 4 4 5l1 6h5l1-6c2-1 4-3 4-5v-3c2-1 3-3 3-6 0-5-4-9-10.5-9Z" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/><circle cx="28" cy="27" r="6" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/></svg>`,
};

function PieceImg({ piece }) {
  const color = piece.isWhite ? "white" : "black";
  const key = TYPE_TO_KEY[piece.type];
  const src = PIECE_IMAGES[color]?.[key];
  const [imgFailed, setImgFailed] = React.useState(false);

  // PNG varsa göster
  if (src && !imgFailed) {
    return (
      <img
        src={src}
        alt={piece.name}
        className="w-full h-full object-contain select-none pointer-events-none"
        draggable={false}
        onError={() => setImgFailed(true)}
      />
    );
  }

  // SVG fallback
  const wFill = piece.isWhite ? "#ffffff" : "#1a0a00";
  const wStroke = piece.isWhite ? "#2d1200" : "#f5e8d0";
  const svgFn = SVG_PIECES[key];
  if (!svgFn) return null;
  return (
    <div
      className="w-full h-full select-none pointer-events-none"
      dangerouslySetInnerHTML={{ __html: svgFn(wFill, wStroke) }}
    />
  );
}

function CapturedPieceImg({ type, isWhite }) {
  const color = isWhite ? "white" : "black";
  const key = TYPE_TO_KEY[type];
  const src = PIECE_IMAGES[color]?.[key];

  if (src) {
    return (
      <img
        src={src}
        alt={type}
        className="w-3.5 h-3.5 object-contain opacity-80 select-none pointer-events-none inline-block"
        draggable={false}
      />
    );
  }
  return <span className="text-[10px] text-white/50">{type}</span>;
}


/* ════════════════════════════════════════════════════════
   KURULUM EKRANI
════════════════════════════════════════════════════════ */
const TIME_OPTIONS = [
  { label: "5 Dakika", value: 300 },
  { label: "10 Dakika", value: 600 },
  { label: "20 Dakika", value: 1200 },
  { label: "Sınırsız", value: null },
];

function SetupScreen({ onStart, onBack, defaultTime }) {
  const [whiteName, setWhiteName] = useState("Emir Timur");
  const [blackName, setBlackName] = useState("Yıldırım Bayezid");
  const [timeValue, setTimeValue] = useState(defaultTime ?? 600);

  return (
    <div className="mobile-screen flex flex-col bg-[#0d1f14] relative overflow-hidden">
      {/* Geri butonu (MobileMenu'dan geliyorsa) */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute left-4 top-4 z-20 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white active:scale-90 transition-all"
          aria-label="Geri"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </button>
      )}

      {/* ── İçerik ── */}
      <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto custom-scrollbar px-6 py-8 relative z-10 gap-6">

        {/* Logo + Başlık */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <img
              src={logoImg}
              alt="Timur Satrancı"
              className="w-24 h-24 object-contain relative z-10"
            />
          </div>
          <div className="text-center">
            <h1 className="font-batangas text-3xl font-bold tracking-widest text-[#d4af37] leading-none">
              TİMUR SATRANCI
            </h1>
            <p className="text-[10px] font-bold tracking-[0.3em] text-[#8ba898] uppercase mt-1">
              Sefer Hazırlığı
            </p>
          </div>
        </div>

        {/* Dekoratif çizgi */}
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 h-px bg-[#d4af37]/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/30" />
          <div className="flex-1 h-px bg-[#d4af37]/20" />
        </div>

        {/* Oyuncu İsimleri */}
        <div className="w-full flex flex-col gap-4">
          {/* Beyaz Oyuncu */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#d4af37] uppercase">
              <span className="w-4 h-4 rounded-sm bg-[#f5eedc] border border-[#d4af37]/30 flex items-center justify-center text-[8px] text-[#1a0a00] font-black">♔</span>
              Ak Ordu Komutanı (Beyaz)
            </label>
            <div className="relative">
              <input
                type="text"
                value={whiteName}
                onChange={e => setWhiteName(e.target.value)}
                className="w-full bg-[#0a1a0e] border border-white/20 text-white font-semibold text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-white/55 transition-all placeholder:text-white/30"
                placeholder="Komutanın adı..."
              />
            </div>
          </div>

          {/* Siyah Oyuncu */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#8ba898] uppercase">
              <span className="w-4 h-4 rounded-sm bg-[#1a0a00] border border-[#8ba898]/30 flex items-center justify-center text-[8px] text-[#f5eedc] font-black">♚</span>
              Kara Ordu Komutanı (Siyah)
            </label>
            <div className="relative">
              <input
                type="text"
                value={blackName}
                onChange={e => setBlackName(e.target.value)}
                className="w-full bg-[#0a1a0e] border border-white/20 text-white font-semibold text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-white/55 transition-all placeholder:text-white/30"
                placeholder="Komutanın adı..."
              />
            </div>
          </div>
        </div>

        {/* Dekoratif çizgi */}
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 h-px bg-[#d4af37]/10" />
          <span className="text-[9px] text-[#4a6a54] font-bold tracking-widest uppercase">Zaman Kontrolü</span>
          <div className="flex-1 h-px bg-[#d4af37]/10" />
        </div>

        {/* Zaman Seçimi */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {TIME_OPTIONS.map(opt => {
            const active = timeValue === opt.value;
            return (
              <button
                key={opt.label}
                onClick={() => setTimeValue(opt.value)}
                className={`py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 ${active
                    ? "bg-[#d4af37] text-[#0d1f14]"
                    : "bg-[#0a1a0e] border border-white/20 text-[#8ba898]"
                  }`}
              >
                <span className="font-batangas text-base">
                  {opt.value ? `⏱ ${opt.label}` : `∞ ${opt.label}`}
                </span>
              </button>
            );
          })}
        </div>

        {/* Oyun Modu Bilgisi */}
        <div className="w-full bg-[#0a1a0e]/80 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-lg shrink-0">⚔️</div>
          <div>
            <p className="text-xs font-bold text-white leading-none">Ekranda Arkadaşınla Oyna</p>
            <p className="text-[10px] text-[#8ba898] mt-0.5">Yerel — Aynı ekranda sıra ile oynayın</p>
          </div>
        </div>

        {/* Başlat Butonu */}
        <button
          onClick={() => onStart({ whiteName: whiteName || "Beyaz", blackName: blackName || "Siyah", timeSeconds: timeValue })}
          className="w-full py-5 rounded-2xl font-batangas text-xl font-bold text-[#0d1f14] transition-all active:scale-95"
          style={{ backgroundColor: "#d4af37" }}
        >
          <span className="relative z-10 tracking-widest">
            ⚔ CENGE BAŞLA ⚔
          </span>
        </button>

        <p className="text-[9px] text-[#2a4a34] text-center tracking-wider pb-2">
          Timur Satrancı • 11×10 • Tarihi Varyasyon
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   OYUN EKRANI
════════════════════════════════════════════════════════ */
function GameScreen({ config, onBack, showNotification, vsBot }) {
  const { whiteName, blackName, timeSeconds } = config;

  const [boardHistory, setBoardHistory] = useState(() => [buildInitialBoard()]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameOver, setGameOver] = useState(null);
  const [showHistPanel, setShowHistPanel] = useState(false);

  const histRef = useRef(null);

  const board = boardHistory[currentStep];
  const isLive = currentStep === boardHistory.length - 1;

  /* saatler */
  const wTimeout = useCallback(() => setGameOver({ winner: "black", reason: "zaman" }), []);
  const bTimeout = useCallback(() => setGameOver({ winner: "white", reason: "zaman" }), []);
  const whiteTime = useChessClock(timeSeconds ?? 99999, isLive && !gameOver && isWhiteTurn, wTimeout);
  const blackTime = useChessClock(timeSeconds ?? 99999, isLive && !gameOver && !isWhiteTurn, bTimeout);

  useEffect(() => { if (histRef.current) histRef.current.scrollTop = histRef.current.scrollHeight; }, [moveHistory]);

  /* tıklama */
  function handleClick(row, col) {
    if (gameOver) return;
    if (!isLive) {
      showNotification && showNotification("Geçmiş hamleleri incelerken yeni hamle yapamazsınız. Canlı oyuna dönmek için 'İleri' butonunu kullanın.", "info");
      return;
    }
    const clicked = board[row][col];

    if (selected) {
      const [sr, sc] = selected;
      const valid = validMoves.some(([r, c]) => r === row && c === col);
      if (valid) { applyMove(sr, sc, row, col); return; }
      if (clicked && clicked.isWhite === isWhiteTurn) {
        setSelected([row, col]); setValidMoves(getValidMoves(board, row, col)); return;
      }
      setSelected(null); setValidMoves([]); return;
    }
    if (clicked && clicked.isWhite === isWhiteTurn) {
      setSelected([row, col]); setValidMoves(getValidMoves(board, row, col));
    }
  }

  const applyMove = useCallback((fr, fc, tr, tc) => {
    const currentBoard = boardHistory[currentStep];
    const nb = currentBoard.map(r => [...r]);
    const piece = nb[fr][fc], cap = nb[tr][tc];
    nb[tr][tc] = piece; nb[fr][fc] = null;

    let notation;
    const fcLetter = String.fromCharCode(97 + fc);
    const tcLetter = String.fromCharCode(97 + tc);
    const trNum = 10 - tr;
    if (piece.type === "P") {
      if (cap) {
        notation = `${fcLetter}x${tcLetter}${trNum}`;
      } else {
        notation = `${tcLetter}${trNum}`;
      }
    } else {
      const abbr = PIECE_ABBR[piece.type] || piece.type;
      if (cap) {
        notation = `${abbr}x${tcLetter}${trNum}`;
      } else {
        notation = `${abbr}${tcLetter}${trNum}`;
      }
    }

    const hist = [
      ...moveHistory.slice(0, currentStep),
      {
        notation,
        isWhite: isWhiteTurn,
        captured: cap?.name ?? null,
        capturedPiece: cap ? { type: cap.type, isWhite: cap.isWhite } : null,
        moveNum: currentStep + 1
      }
    ];

    const nextBoardHistory = [...boardHistory.slice(0, currentStep + 1), nb];

    if (cap && cap.type === "Ş") {
      setBoardHistory(nextBoardHistory);
      setMoveHistory(hist);
      setCurrentStep(nextBoardHistory.length - 1);
      setSelected(null);
      setValidMoves([]);
      setGameOver({ winner: isWhiteTurn ? "white" : "black", reason: "mat" });
      return;
    }
    setBoardHistory(nextBoardHistory);
    setMoveHistory(hist);
    setCurrentStep(nextBoardHistory.length - 1);
    setSelected(null);
    setValidMoves([]);
    setIsWhiteTurn(p => !p);
  }, [boardHistory, currentStep, moveHistory, isWhiteTurn]);

  function reset() {
    setBoardHistory([buildInitialBoard()]);
    setCurrentStep(0);
    setSelected(null);
    setValidMoves([]);
    setIsWhiteTurn(true);
    setMoveHistory([]);
    setGameOver(null);
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < boardHistory.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const displayWhiteTurn = isLive ? isWhiteTurn : (currentStep % 2 === 0);
  const activeHistory = moveHistory.slice(0, currentStep);
  const capturedWhite = activeHistory.filter(m => m.capturedPiece && m.capturedPiece.isWhite).map(m => m.capturedPiece);
  const capturedBlack = activeHistory.filter(m => m.capturedPiece && !m.capturedPiece.isWhite).map(m => m.capturedPiece);

  const canGoBack = currentStep > 0;
  const canGoForward = currentStep < boardHistory.length - 1;

  const isValidSq = (r, c) => validMoves.some(([vr, vc]) => vr === r && vc === c);
  const isSelSq = (r, c) => selected && selected[0] === r && selected[1] === c;
  const notationStr = moveHistory.map((m, i) => {
    const prefix = m.isWhite ? `${Math.floor(i / 2) + 1}. ` : "";
    return prefix + m.notation;
  }).join(" ");

  // AI/Bot turn handler
  useEffect(() => {
    if (!vsBot || isWhiteTurn || gameOver || !isLive) return;

    const timer = setTimeout(() => {
      // Find all black pieces
      const blackPieces = [];
      board.forEach((row, ri) => {
        row.forEach((piece, ci) => {
          if (piece && !piece.isWhite) {
            blackPieces.push({ r: ri, c: ci });
          }
        });
      });

      // Find all valid moves for each black piece
      const allMoves = [];
      blackPieces.forEach(({ r, c }) => {
        const moves = getValidMoves(board, r, c);
        moves.forEach(([tr, tc]) => {
          const target = board[tr][tc];
          allMoves.push({
            from: [r, c],
            to: [tr, tc],
            yemeHamlesiMi: !!target,
            target
          });
        });
      });

      if (allMoves.length === 0) {
        setGameOver({ winner: "white", reason: "mat" });
        return;
      }

      // Filter capturing moves
      const capturingMoves = allMoves.filter(m => m.yemeHamlesiMi);

      // Choose a move (prioritize capturing)
      let selectedMove;
      if (capturingMoves.length > 0) {
        selectedMove = capturingMoves[Math.floor(Math.random() * capturingMoves.length)];
      } else {
        selectedMove = allMoves[Math.floor(Math.random() * allMoves.length)];
      }

      const [fr, fc] = selectedMove.from;
      const [tr, tc] = selectedMove.to;
      applyMove(fr, fc, tr, tc);
    }, 1200);

    return () => clearTimeout(timer);
  }, [isWhiteTurn, board, gameOver, isLive, vsBot, applyMove]);

  /* ── OYUN SONU ── */
  if (gameOver) {
    const winName = gameOver.winner === "white" ? whiteName : blackName;
    const loseName = gameOver.winner === "white" ? blackName : whiteName;
    return (
      <div className="mobile-screen flex flex-col items-center justify-center bg-[#0d1f14] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.1)_0%,_transparent_70%)] pointer-events-none" />
        <div className="flex flex-col items-center gap-5 px-8 text-center z-10 w-full max-w-xs">
          <div className="w-20 h-20 rounded-full bg-[#d4af37]/10 border-2 border-[#d4af37]/40 flex items-center justify-center text-4xl drop-shadow-[0_0_16px_rgba(212,175,55,0.4)]">
            👑
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-[#d4af37] uppercase">
              {gameOver.reason === "mat" ? "Şah Mat!" : gameOver.reason === "teslim" ? `${loseName} Teslim Oldu` : "Zaman Doldu"}
            </p>
            <h2 className="font-batangas text-4xl font-bold text-white mt-1">{winName}</h2>
            <p className="text-[#8ba898] text-sm mt-1">zafere ulaştı</p>
          </div>
          {moveHistory.length > 0 && (
            <div className="w-full bg-black/30 rounded-xl p-3 border border-[#d4af37]/10 text-left">
              <p className="text-[9px] text-[#d4af37] font-bold tracking-widest uppercase mb-2">Son 5 Hamle</p>
              {moveHistory.slice(-5).map((m, i) => (
                <span key={i} className={`text-[10px] font-mono block ${m.isWhite ? "text-white" : "text-[#8ba898]"}`}>
                  {m.isWhite ? "⬜" : "⬛"} {m.notation}
                </span>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-2.5 w-full">
            <button onClick={reset} className="w-full py-3.5 rounded-2xl font-batangas text-lg font-bold text-[#0d1f14]" style={{ background: "linear-gradient(135deg,#d4af37,#f5d060,#c8960c)" }}>
              Tekrar Oyna
            </button>
            <button onClick={onBack} className="w-full bg-[#f5eedc] hover:bg-[#e6dcc5] text-[#141f1b] font-batangas text-lg font-bold py-3.5 rounded-2xl transition-all active:scale-95">
              Ana Menüye Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── HAMİLE PANELİ ── */
  if (showHistPanel) {
    return (
      <div className="mobile-screen flex flex-col bg-[#0d1f14] relative">
        <div className="flex items-center gap-3 px-5 pt-9 pb-3 border-b border-white/10 shrink-0">
          <button onClick={() => setShowHistPanel(false)} className="mobile-back-btn">
            <ArrowLeft size={26} strokeWidth={2.5} />
          </button>
          <h1 className="font-batangas text-2xl font-bold text-white">Hamle Geçmişi</h1>
          <span className="ml-auto text-xs text-[#8ba898] font-mono">{moveHistory.length} hamle</span>
        </div>
        <div ref={histRef} className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
          {moveHistory.length === 0 ? (
            <p className="text-[#8ba898] text-sm text-center mt-10">Henüz hamle yapılmadı.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {moveHistory.map((m, i) => (
                <div key={i} className={`flex items-center gap-3 py-2.5 px-3 rounded-xl ${m.isWhite ? "bg-white/5 border border-white/10" : "bg-black/30 border border-white/5"}`}>
                  <span className="text-[10px] text-[#8ba898] font-mono w-8 text-right shrink-0">{Math.floor(i / 2) + 1}{m.isWhite ? "." : ".."}</span>
                  <span className={`text-xs font-mono font-semibold flex-1 ${m.isWhite ? "text-white" : "text-[#8ba898]"}`}>{m.notation}</span>
                  {m.captured && <span className="text-[10px] text-red-400 font-bold bg-red-900/30 px-2 py-0.5 rounded-full shrink-0">×{m.captured}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     ANA OYUN EKRANI  (Canva tasarımı birebir)
  ═══════════════════════════════════════════ */
  return (
    <div className="mobile-screen flex flex-col bg-[#1a4228] select-none overflow-hidden">

      {/* ── Üst Başlık Çubuğu ── */}
      <div
        className="flex items-center justify-center shrink-0 relative"
        style={{ background: "#111", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingTop: 10, paddingBottom: 10 }}
      >
        {/* Geri butonu */}
        <button
          onClick={onBack}
          className="absolute left-3 w-8 h-8 flex items-center justify-center text-white/50 hover:text-white active:scale-90 transition-all"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
        </button>

        {/* Başlık */}
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="Logo" className="w-5 h-5 object-contain" />
          <span className="font-serif font-bold text-white text-sm tracking-wide">Ekranda oyna</span>
        </div>
      </div>

      {/* ── Notasyon Şeridi ── */}
      <div
        className="flex items-center px-3 shrink-0"
        style={{ background: "#1e3a28", borderBottom: "1px solid rgba(255,255,255,0.05)", height: 30 }}
      >
        <span className="text-xs font-mono text-[#a8c4b0] tracking-wide truncate">
          {notationStr || "Hamle bekleniyor..."}
        </span>
      </div>

      {/* ── Siyah Oyuncu Paneli ── */}
      <div
        className="flex items-center gap-3 px-3 py-2 shrink-0"
        style={{ background: "#1e3a28", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Avatar kutusu */}
        <div
          className="w-10 h-10 rounded-md shrink-0"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
        />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-white font-semibold text-sm truncate">{blackName}</span>
          {/* Siyahın topladığı (yenilen beyaz) taşlar */}
          <div className="flex flex-wrap gap-0.5 mt-0.5 min-h-[14px]">
            {capturedWhite.map((p, idx) => (
              <CapturedPieceImg key={idx} type={p.type} isWhite={true} />
            ))}
          </div>
        </div>

        {/* Siyah saati */}
        <div className={`flex items-center gap-1 px-3 py-1 rounded-lg font-mono text-sm font-bold transition-all ${!displayWhiteTurn
            ? "bg-white/90 text-[#111] shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            : "bg-black/50 text-white/35 border border-white/10"
          }`}>
          {timeSeconds && (
            <img
              src={hourglassIcon}
              className={`w-3.5 h-3.5 object-contain mr-1 ${!displayWhiteTurn ? "" : "filter invert opacity-40"}`}
              alt="zaman"
            />
          )}
          <span>{fmt(blackTime === 99999 ? null : blackTime)}</span>
        </div>
      </div>

      {/* ════════════════════════════════
          11×10 TAHTA
      ════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-0.5" style={{ background: "#1a4228" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(11, 1fr)",
            gridTemplateRows: "repeat(10, 1fr)",
            width: "100%",
            height: "100%",
            border: "3px solid #3d2b18",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
          }}
        >
          {board.map((row, ri) =>
            row.map((piece, ci) => {
              /* Canva görseline birebir tahta renkleri */
              const isDark = (ri + ci) % 2 === 1;
              const isSel = isSelSq(ri, ci);
              const isVal = isValidSq(ri, ci);
              const isCap = isVal && piece && piece.isWhite !== isWhiteTurn;

              // Renk öncelik sırası
              let bg = isDark ? "#7c5636" : "#c19975";
              if (isSel) bg = "#d4b840";
              else if (isCap) bg = isDark ? "#993333" : "#cc6666";
              else if (isVal) bg = isDark ? "#3d7a3d" : "#5fab5f";

              return (
                <div
                  key={`${ri}-${ci}`}
                  onClick={() => handleClick(ri, ci)}
                  className="relative flex items-center justify-center cursor-pointer"
                  style={{ backgroundColor: bg }}
                >
                  {/* Seçim çerçevesi */}
                  {isSel && <div className="absolute inset-0 border-2 border-yellow-300/80 pointer-events-none z-10" />}
                  {/* Yeme çerçevesi */}
                  {isCap && <div className="absolute inset-0 border-[2px] border-red-400/80 pointer-events-none z-10" />}
                  {/* Geçerli hamle noktası */}
                  {isVal && !piece && (
                    <div className="absolute rounded-full bg-black/30 pointer-events-none z-10" style={{ width: "32%", height: "32%" }} />
                  )}
                  {/* TAŞI RENDER ET */}
                  {piece && (
                    <div className="absolute" style={{ width: "88%", height: "88%", top: "6%", left: "6%", zIndex: 5 }}>
                      <PieceImg piece={piece} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Beyaz Oyuncu Paneli ── */}
      <div
        className="flex items-center gap-3 px-3 py-2 shrink-0"
        style={{ background: "#1e3a28", borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Avatar kutusu */}
        <div
          className="w-10 h-10 rounded-md shrink-0"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
        />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-white font-semibold text-sm truncate">{whiteName}</span>
          {/* Beyazın topladığı (yenilen siyah) taşlar */}
          <div className="flex flex-wrap gap-0.5 mt-0.5 min-h-[14px]">
            {capturedBlack.map((p, idx) => (
              <CapturedPieceImg key={idx} type={p.type} isWhite={false} />
            ))}
          </div>
        </div>

        {/* Beyaz saati */}
        <div className={`flex items-center gap-1 px-3 py-1 rounded-lg font-mono text-sm font-bold transition-all ${displayWhiteTurn
            ? "bg-[#f5eedc] text-[#141f1b] shadow-[0_0_10px_rgba(245,238,220,0.3)]"
            : "bg-black/50 text-white/35 border border-white/10"
          }`}>
          {timeSeconds && (
            <img
              src={hourglassIcon}
              className={`w-3.5 h-3.5 object-contain mr-1 ${displayWhiteTurn ? "" : "filter invert opacity-40"}`}
              alt="zaman"
            />
          )}
          <span>{fmt(whiteTime === 99999 ? null : whiteTime)}</span>
        </div>
      </div>

      {/* ── Alt Aksiyon Çubuğu (Canva tasarımıyla birebir) ── */}
      <div
        className="grid grid-cols-3 pt-3 pb-6 shrink-0"
        style={{ background: "#f5eedc", borderTop: "1px solid rgba(20,31,27,0.12)", boxShadow: "0 -4px 16px rgba(0,0,0,0.18)" }}
      >
        {/* Seçenekler */}
        <button
          onClick={() => setShowHistPanel(true)}
          className="flex flex-col items-center gap-1 text-[#141f1b] hover:opacity-80 active:scale-95 transition-all cursor-pointer"
        >
          <List size={22} strokeWidth={2.5} />
          <span className="text-[10px] font-bold tracking-wide" style={{ fontFamily: "var(--font-primary)" }}>
            Seçenekler
          </span>
        </button>

        {/* Geri */}
        <button
          onClick={handlePrevStep}
          disabled={!canGoBack}
          className={`flex flex-col items-center gap-1 text-[#141f1b] active:scale-95 transition-all cursor-pointer ${canGoBack ? "hover:opacity-80" : "opacity-30 cursor-not-allowed"
            }`}
        >
          <ChevronLeft size={26} strokeWidth={2.5} />
          <span className="text-[10px] font-bold tracking-wide" style={{ fontFamily: "var(--font-primary)" }}>Geri</span>
        </button>

        {/* İleri */}
        <button
          onClick={handleNextStep}
          disabled={!canGoForward}
          className={`flex flex-col items-center gap-1 text-[#141f1b] active:scale-95 transition-all cursor-pointer ${canGoForward ? "hover:opacity-80" : "opacity-30 cursor-not-allowed"
            }`}
        >
          <ChevronRight size={26} strokeWidth={2.5} />
          <span className="text-[10px] font-bold tracking-wide" style={{ fontFamily: "var(--font-primary)" }}>İleri</span>
        </button>
      </div>

    </div>
  );
}

/* ════════════════════════════════════════════════════════
   ANA BİLEŞEN — STATE MACHINE
════════════════════════════════════════════════════════ */
export function EkrandaOyna({ onBack, showNotification, initialTimeSeconds }) {
  const [gameState, setGameState] = useState("setup"); // "setup" | "playing"
  const [config, setConfig] = useState(null);

  function handleStart(cfg) {
    setConfig(cfg);
    setGameState("playing");
  }

  if (gameState === "setup") {
    return (
      <SetupScreen
        onStart={handleStart}
        onBack={onBack}
        defaultTime={initialTimeSeconds ?? 600}
      />
    );
  }

  return (
    <GameScreen
      config={config}
      onBack={() => setGameState("setup")}
      showNotification={showNotification}
    />
  );
}
