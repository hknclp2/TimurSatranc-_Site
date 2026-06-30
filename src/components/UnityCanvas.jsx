import React, { useState, useEffect } from "react";
import { Unity } from "react-unity-webgl";

const HISTORICAL_TIPS = [
  "Timur Satrancı, 11x10 boyutlarında büyük bir tahtada oynanır ve klasik satrançtan çok daha karmaşık taktikler gerektirir.",
  "Emir Timur, devlet yönetimindeki stratejik zekasını keskinleştirmek için bu oyunu sarayında sıkça oynatmıştır.",
  "Oyunda Zürafa (Giraffe), Deve (Camel), Fil (Elephant) ve Mancınık (Siege Engine) gibi kendine has hareket yeteneği olan 11 farklı taş bulunur.",
  "Her oyuncunun tahtanın sağında, Şah'ının sığınabileceği 'Husn' adı verilen özel bir kale karesi vardır.",
  "Piyonların terfisi ulaştıkları dikey hat ile ilişkilidir. Her piyon sadece temsil ettiği taşın türüne terfi edebilir."
];

export function UnityCanvas({ unityProvider, isLoaded, loadingProgression, isDemoMode, simulateMove }) {
  const [tipIndex, setTipIndex] = useState(0);

  // Rotate tips during loading
  useEffect(() => {
    if (!isLoaded) {
      const interval = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % HISTORICAL_TIPS.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isLoaded]);

  return (
    <div className="unity-container-wrapper bg-[#040e0a] overflow-hidden flex items-center justify-center">
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#061810] z-50 flex flex-col items-center justify-center p-6 text-center select-none">
          {/* Animated Glowing Orb */}
          <div className="absolute w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(0,229,255,0.06)_0%,_transparent_75%)] rounded-full blur-3xl animate-pulse pointer-events-none"></div>

          <div className="z-10 max-w-xl flex flex-col items-center">
            {/* Spinning Emblem */}
            <div className="w-24 h-24 mb-8 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-accent-cyan/10 border-t-accent-cyan animate-spin"></div>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 12 7 13.5 8 15V17H16V15C17 13.5 19 12 19 9C19 5.13 15.87 2 12 2Z" fill="#00e5ff" className="opacity-80" />
              </svg>
            </div>

            <h2 className="font-serif text-3xl font-bold tracking-wide text-white mb-2">
              Timur Satrancı Yükleniyor
            </h2>
            <p className="text-accent-cyan font-semibold text-sm uppercase tracking-widest mb-6">
              {isDemoMode ? "Simülasyon Modu Başlatılıyor..." : "Unity WebGL Context Yükleniyor..."}
            </p>

            {/* Progress Bar */}
            <div className="w-80 h-2 bg-white/5 rounded-full overflow-hidden mb-8 border border-white/5 relative">
              <div
                className="h-full bg-gradient-to-r from-accent-cyan to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgression}%` }}
              ></div>
            </div>

            {/* Rotating Historical Info */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 shadow-2xl backdrop-blur-md max-w-md min-h-[120px] flex flex-col justify-center">
              <span className="text-[10px] text-accent-cyan font-bold uppercase tracking-widest mb-2 block">
                BİLİYOR MUSUNUZ?
              </span>
              <p className="text-text-secondary text-sm leading-relaxed transition-opacity duration-500">
                {HISTORICAL_TIPS[tipIndex]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas Area */}
      {isDemoMode ? (
        // Simulated Demo Game Screen
        <div className="w-full h-full flex flex-col items-center justify-center p-6 relative select-none">
          {/* Background grid */}
          <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

          {/* Chessboard visualizer */}
          <div className="relative z-10 w-[90%] max-w-[640px] aspect-[11/10] bg-[#0c2218] border border-emerald-500/20 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between p-6">
            
            {/* Mock Player Bar Top */}
            <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold border border-emerald-500/30">
                  AI
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Yapay Zeka (Zahir)</h4>
                  <span className="text-[10px] text-emerald-400">Çevrimdışı Bot - Zorluk: Orta</span>
                </div>
              </div>
              <div className="font-mono text-sm bg-black/60 px-3 py-1 rounded border border-white/5 text-text-secondary">
                10:00
              </div>
            </div>

            {/* Interactive Grid Simulation */}
            <div className="my-6 flex-1 border border-white/5 rounded-xl bg-black/30 flex flex-col items-center justify-center p-4 text-center">
              <div className="w-20 h-20 mb-4 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center animate-pulse">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#00e5ff" strokeWidth="1.5" />
                  <path d="M12 8V12M12 16H12.01" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-semibold text-white mb-2">Unity Entegrasyon Önizlemesi</h3>
              <p className="text-xs text-text-secondary max-w-sm mb-6 leading-relaxed">
                Unity WebGL build dosyaları bulunamadığı için sistem otomatik olarak **Demo Arayüz Modu**'nda çalışmaktadır. Overlay katmanlarını test etmek için aşağıdaki butona veya sağdaki paneldeki simülasyona basarak hamle gönderebilirsiniz.
              </p>
              
              <button
                onClick={simulateMove}
                className="bg-accent-cyan hover:bg-accent-cyan-hover text-[#030d09] font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-[0_4px_15px_rgba(0,229,255,0.2)] hover:shadow-[0_6px_20px_rgba(0,229,255,0.3)] pointer-events-auto"
              >
                Hamle Simüle Et
              </button>
            </div>

            {/* Mock Player Bar Bottom */}
            <div className="flex justify-between items-center bg-black/40 px-4 py-2 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 flex items-center justify-center text-accent-cyan font-bold border border-accent-cyan/30">
                  U
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Oyuncu (Siz)</h4>
                  <span className="text-[10px] text-accent-cyan">Misafir Süvari</span>
                </div>
              </div>
              <div className="font-mono text-sm bg-black/60 px-3 py-1 rounded border border-white/5 text-text-secondary">
                10:00
              </div>
            </div>
            
          </div>
        </div>
      ) : (
        // Real Unity WebGL Component
        <Unity
          unityProvider={unityProvider}
          className="w-full h-full"
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}
