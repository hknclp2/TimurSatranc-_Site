import { useEffect, useRef } from "react";

export function MoveHistory({ moveHistory, simulateMove, isDemoMode, gameMode }) {
  const containerRef = useRef(null);

  // Automatically scroll to the bottom when a move is added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [moveHistory]);

  const modeLabels = {
    bot: "Yapay Zekaya Karşı",
    online: "Çevrimiçi Oyuncu",
    screen: "Yerel Ekranda Oyuncu"
  };

  return (
    <div className="w-[300px] fixed top-6 right-6 bottom-6 z-30 glass-panel rounded-3xl p-6 shadow-2xl flex flex-col justify-between select-none pointer-events-auto">
      {/* Header Info */}
      <div className="border-b border-white/5 pb-4">
        <span className="text-[10px] text-accent-cyan font-bold tracking-widest uppercase block mb-1">
          OYUN DURUMU
        </span>
        <h3 className="font-serif text-lg font-bold text-white leading-tight">
          {modeLabels[gameMode] || "Aktif Karşılaşma"}
        </h3>
        <div className="flex items-center gap-2 mt-3 bg-white/[0.02] border border-white/5 rounded-lg py-2 px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
          <span className="text-xs text-text-secondary font-semibold">Hamle Sırası: Beyaz (Siz)</span>
        </div>
      </div>

      {/* Move History Logger */}
      <div className="flex-1 my-6 overflow-y-auto pr-1 custom-scrollbar" ref={containerRef}>
        {moveHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-xs text-text-secondary/60 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 mb-2 opacity-30 text-accent-cyan">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span>Henüz bir hamle yapılmadı. Oyunu başlatmak veya tahta hareketini görmek için hamle yapın.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {moveHistory.map((move, index) => {
              const isPlayer = index % 2 === 0;
              return (
                <div 
                  key={index}
                  className={`py-2 px-3 rounded-xl border text-xs flex justify-between items-center transition-all duration-300 ${
                    isPlayer 
                      ? "bg-accent-cyan/[0.03] border-accent-cyan/10 text-accent-cyan" 
                      : "bg-white/[0.01] border-white/5 text-text-secondary"
                  }`}
                >
                  <span className="font-semibold">{move}</span>
                  <span className="text-[10px] opacity-60 font-mono">
                    {isPlayer ? "Beyaz" : "Siyah"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Controls (For simulation validation) */}
      <div className="border-t border-white/5 pt-4">
        {isDemoMode && (
          <button
            onClick={simulateMove}
            className="w-full bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl border border-white/10 transition-all duration-300 hover:border-accent-cyan/40 hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2 cursor-pointer shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 text-accent-cyan">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Hamle Simüle Et
          </button>
        )}
        <div className="text-[9px] text-text-secondary/50 text-center mt-3 leading-relaxed">
          Timur Satrancı v1.0.0 WebGL Köprüsü Aktiftir.
        </div>
      </div>
    </div>
  );
}
