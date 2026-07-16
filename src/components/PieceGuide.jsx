import { useState } from "react";

const PIECES_DATA = [
  {
    name: "Zürafa (Giraffe)",
    symbol: "🦒",
    color: "border-[#ffb300]",
    accent: "text-[#ffb300]",
    bg: "bg-[#ffb300]/10",
    movement: "Çapraz 1 adım, ardından dikey/yatay en az 3 adım.",
    desc: "Uzun menzilli, son derece stratejik bir taştır. Tahtanın uzak noktalarındaki hedeflere beklenmedik saldırılar düzenlemek için kullanılır."
  },
  {
    name: "Deve (Camel)",
    symbol: "🐪",
    color: "border-[#81c784]",
    accent: "text-[#81c784]",
    bg: "bg-[#81c784]/10",
    movement: "3 dikey, 1 yatay (Uzun L sıçrayışı).",
    desc: "At gibi taşların üzerinden atlayabilir. Ancak hareket menzili 3x1 boyutlarında olduğu için klasik satranç atına göre daha uzak kareleri kontrol eder."
  },
  {
    name: "Fil (Elephant)",
    symbol: "🐘",
    color: "border-[#64b5f6]",
    accent: "text-[#64b5f6]",
    bg: "bg-[#64b5f6]/10",
    movement: "Çapraz tam 2 kare atlar.",
    desc: "Önündeki taşlar engel teşkil etmez (atlama yeteneği vardır). Sadece tahtadaki belirli karelere erişebilir, bu yüzden savunma odaklı konumlandırılır."
  },
  {
    name: "Mancınık (Siege Engine)",
    symbol: "🏹",
    color: "border-[#e0e0e0]",
    accent: "text-[#e0e0e0]",
    bg: "bg-[#e0e0e0]/10",
    movement: "Dikey veya yatay tam 2 kare atlar.",
    desc: "Dabbaba olarak da bilinir. Tıpkı fil gibi taşların üzerinden atlayabilir ancak çapraz yerine dikey/yatay hatları kontrol eder."
  },
  {
    name: "Vezir (Vizier)",
    symbol: "📜",
    color: "border-[#ba68c8]",
    accent: "text-[#ba68c8]",
    bg: "bg-[#ba68c8]/10",
    movement: "Dikey veya yatay sadece 1 kare.",
    desc: "Modern satrançtaki güçlü vezirin aksine, Timur Satrancı'nda vezir oldukça kısıtlı hareket eder ve Şah'ın hemen yanındaki ana koruma hattıdır."
  },
  {
    name: "Şah (King)",
    symbol: "👑",
    color: "border-[#e57373]",
    accent: "text-[#e57373]",
    bg: "bg-[#e57373]/10",
    movement: "Her yöne 1 kare.",
    desc: "Oyunun en önemli taşıdır. Rakip Şah mat edildiğinde oyun biter. Ayrıca Timur Satrancı'nda sıkışan Şah'ın 'Husn' kalesine sığınma hakkı bulunur."
  }
];

export function PieceGuide({ isOpen, onClose }) {
  const [selectedPiece, setSelectedPiece] = useState(PIECES_DATA[0]);

  if (!isOpen) return null;

  return (
    <div className="w-[340px] fixed top-6 left-[136px] bottom-6 z-30 glass-panel rounded-3xl p-6 shadow-2xl flex flex-col justify-between select-none pointer-events-auto transition-all duration-500 animate-fade-in-left">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
          <div>
            <span className="text-[10px] text-accent-cyan font-bold tracking-widest uppercase block mb-1">
              ANSİKLOPEDİ
            </span>
            <h3 className="font-serif text-lg font-bold text-white leading-tight">
              Taş Kılavuzu
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-secondary hover:text-white transition-all cursor-pointer"
            aria-label="Kapat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Short historical intro */}
        <p className="text-[11px] text-text-secondary leading-relaxed mb-4">
          Timur Satrancı, 11 farklı taş çeşidi ile klasik satrançtan ayrılır. Aşağıdan taş seçerek yeteneklerini inceleyebilirsiniz:
        </p>

        {/* Piece Selection Row */}
        <div className="grid grid-cols-6 gap-2 mb-4">
          {PIECES_DATA.map((piece) => (
            <button
              key={piece.name}
              onClick={() => setSelectedPiece(piece)}
              className={`h-11 rounded-xl flex items-center justify-center text-xl transition-all duration-300 border cursor-pointer ${
                selectedPiece.name === piece.name
                  ? `${piece.bg} ${piece.color} scale-105 shadow-md`
                  : "bg-white/[0.01] border-white/5 hover:bg-white/5 hover:border-white/10"
              }`}
              title={piece.name}
            >
              {piece.symbol}
            </button>
          ))}
        </div>

        {/* Active Piece Description Box */}
        <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-5 overflow-y-auto custom-scrollbar flex flex-col justify-start">
          <div className="flex items-center gap-3 mb-4">
            <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${selectedPiece.bg} ${selectedPiece.color}`}>
              {selectedPiece.symbol}
            </span>
            <div>
              <h4 className={`font-serif text-md font-bold ${selectedPiece.accent}`}>
                {selectedPiece.name}
              </h4>
              <span className="text-[9px] text-text-secondary/60 uppercase tracking-widest font-semibold">
                Timur Dönemi Varyasyonu
              </span>
            </div>
          </div>

          <div className="mb-4">
            <span className="text-[9px] text-accent-cyan font-bold tracking-wider uppercase block mb-1.5">
              HAREKET YETENEĞİ:
            </span>
            <p className="text-xs text-white bg-black/35 py-2 px-3 rounded-lg border border-white/5 font-semibold">
              {selectedPiece.movement}
            </p>
          </div>

          <div>
            <span className="text-[9px] text-accent-cyan font-bold tracking-wider uppercase block mb-1.5">
              TAKTIK VE STRATEJI:
            </span>
            <p className="text-xs text-text-secondary leading-relaxed">
              {selectedPiece.desc}
            </p>
          </div>
        </div>
        
        <div className="text-[9px] text-text-secondary/40 text-center mt-3">
          Tamerlane Chess (Timur Satrancı) Kültürel Miras Serisi
        </div>
      </div>
    </div>
  );
}
