import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { MainMenu } from "./components/MainMenu";
import { UnityCanvas } from "./components/UnityCanvas";
import { MoveHistory } from "./components/MoveHistory";
import { PieceGuide } from "./components/PieceGuide";
import { useUnityBridge } from "./hooks/useUnityBridge";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState({ name: "Misafir", loggedIn: false });
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Unity integration state and hooks
  const {
    isUnityActive,
    gameMode,
    moveHistory,
    isLoaded,
    loadingProgression,
    unityProvider,
    isDemoMode,
    startGame,
    exitGame,
    resetGame,
    simulateMove,
  } = useUnityBridge();

  // Toast Notification handler
  const showNotification = (message, type = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3800);
  };

  const handleStartGame = (mode) => {
    startGame(mode);
    setIsGuideOpen(false);
    showNotification(
      mode === "bot" 
        ? "Yapay zeka (Bot) ile karşılaşma yükleniyor..." 
        : mode === "online" 
          ? "Oyuncu eşleştirme lobisine bağlanılıyor..." 
          : "Yerel iki kişilik oyun modu başlatılıyor...", 
      "info"
    );
  };

  const handleExitGame = () => {
    exitGame();
    setIsGuideOpen(false);
    showNotification("Ana menüye geri dönüldü.", "info");
  };

  return (
    <div className="app-container min-h-screen w-full relative flex text-white font-primary overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== "home") {
            const labels = {
              shop: "Mağaza",
              tournaments: "Turnuvalar",
              profile: "Profil",
              settings: "Ayarlar",
              help: "Yardım"
            };
            showNotification(`${labels[tab]} sayfası henüz yapım aşamasındadır.`, "info");
          }
        }}
        isUnityActive={isUnityActive}
        exitGame={handleExitGame}
        resetGame={resetGame}
        toggleGuide={() => setIsGuideOpen((prev) => !prev)}
        isGuideOpen={isGuideOpen}
      />

      {/* DYNAMIC INTERFACE LAYERS */}
      {isUnityActive ? (
        // Game active state (Canvas in background + Overlay GUI layers on top)
        <>
          {/* Background Unity Canvas */}
          <UnityCanvas
            unityProvider={unityProvider}
            isLoaded={isLoaded}
            loadingProgression={loadingProgression}
            isDemoMode={isDemoMode}
            simulateMove={() => {
              const move = simulateMove();
              if (move) {
                showNotification(`Hamle gönderildi: ${move}`, "success");
              } else {
                showNotification("Tüm simülasyon hamleleri tamamlandı.", "info");
              }
            }}
          />

          {/* Foreground UI Overlay Layer */}
          {isLoaded && (
            <div className="ui-overlay-layer fixed inset-0 w-full h-full pointer-events-none">
              
              {/* Top Status Header */}
              <div className="absolute top-6 left-36 right-[336px] flex justify-between items-center bg-black/45 border border-white/5 py-3 px-6 rounded-2xl backdrop-blur-md interactive-overlay">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-accent-cyan font-bold tracking-widest uppercase bg-accent-cyan/10 px-2.5 py-1 rounded-md border border-accent-cyan/10">
                    CANLI
                  </span>
                  <h2 className="font-serif text-sm font-semibold text-white tracking-wide">
                    {gameMode === "bot" 
                      ? "Zahir Yapay Zeka Karşılaşması" 
                      : gameMode === "online" 
                        ? "Dereceli Çevrimiçi Maç" 
                        : "Yerel Ekranda Çekişme"}
                  </h2>
                </div>
                
                {isDemoMode && (
                  <div className="text-[10px] text-amber-500 font-semibold bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/10">
                    Sanal Önizleme Aktif
                  </div>
                )}
              </div>

              {/* Right Side Move History Panel */}
              <MoveHistory
                moveHistory={moveHistory}
                simulateMove={() => {
                  const move = simulateMove();
                  if (move) {
                    showNotification(`Hamle gönderildi: ${move}`, "success");
                  }
                }}
                isDemoMode={isDemoMode}
                gameMode={gameMode}
              />

              {/* Left Side Sliding Piece Guide */}
              <PieceGuide
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
              />
            </div>
          )}
        </>
      ) : (
        // Out-of-game Dashboard States
        <>
          {activeTab === "home" ? (
            <MainMenu
              startGame={handleStartGame}
              user={user}
              setUser={setUser}
              showNotification={showNotification}
            />
          ) : activeTab === "about" ? (
            // Hakkında Sayfası
            <div className="flex-1 ml-[120px] flex flex-col items-start justify-start p-10 lg:p-16 select-none overflow-y-auto custom-scrollbar">
              <div className="max-w-3xl w-full">
                {/* Header */}
                <div className="mb-10">
                  <span className="text-[10px] text-accent-cyan font-bold tracking-widest uppercase block mb-3">
                    PROJE HAKKINDA
                  </span>
                  <h1 className="font-serif text-5xl font-extrabold text-white mb-4 leading-tight">
                    Timur Satrancı
                  </h1>
                  <p className="text-text-secondary text-base leading-relaxed max-w-xl">
                    14. yüzyılda Büyük İmparator Emir Timur'un sarayında oynanan efsanevi satranç varyasyonu,
                    modern teknoloji ile dijital dünyaya taşınıyor.
                  </p>
                </div>

                {/* Mission Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                    <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-accent-cyan">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white mb-2">Kültürel Miras</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      Tarihin derinliklerinde kalmış bu entelektüel mirasın dijital ortamda yaşatılması
                      ve gelecek nesillere aktarılması temel misyonumuzdur.
                    </p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-emerald-400">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.364l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white mb-2">Yapay Zeka Entegrasyonu</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      Unity WebGL motorunun gücüyle geliştirilmiş bot sistemi, her seviyeden oyuncuya
                      meydan okuyabilecek kapasitede tasarlanmıştır.
                    </p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-amber-400">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white mb-2">Eğitim Teknolojisi</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      Interaktif taş rehberi ve tarihsel bilgi ekranları ile oyunu öğrenmek
                      artık çok daha kolay ve eğlenceli bir deneyime dönüşüyor.
                    </p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-sky-400">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white mb-2">Küresel Erişim</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      WebGL teknolojisi sayesinde herhangi bir kurulum gerektirmeksizin,
                      dünyanın her yerinden tarayıcı üzerinden erişilebilir.
                    </p>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="bg-white/[0.015] border border-white/5 rounded-2xl p-6 mb-8">
                  <h3 className="text-[10px] text-accent-cyan font-bold tracking-widest uppercase mb-4">TEKNOLOJİK ALTYAPI</h3>
                  <div className="flex flex-wrap gap-3">
                    {["React 19", "Vite 8", "Unity WebGL", "Tailwind CSS v4", "react-unity-webgl"].map(tech => (
                      <span key={tech} className="bg-accent-cyan/5 border border-accent-cyan/10 text-accent-cyan text-xs font-semibold px-3 py-1.5 rounded-lg">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Back Button */}
                <button
                  onClick={() => setActiveTab("home")}
                  className="flex items-center gap-2 text-text-secondary hover:text-white text-sm font-semibold transition-colors cursor-pointer group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Ana Sayfaya Dön
                </button>
              </div>
            </div>
          ) : (
            // Generic placeholder for other tabs
            <div className="flex-1 ml-[120px] flex flex-col items-center justify-center text-center p-8 select-none">
              <div className="w-16 h-16 mb-4 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-accent-cyan">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-2">Yapım Aşamasında</h3>
              <p className="text-text-secondary text-sm max-w-sm mb-6 leading-relaxed">
                Bu modül şu anda geliştirilmektedir. Timur Satrancı deneyimine başlamak için sol menüden Ana Sayfa'ya dönebilir ve Oyna diyebilirsiniz.
              </p>
              <button
                onClick={() => setActiveTab("home")}
                className="bg-accent-cyan hover:bg-accent-cyan-hover text-[#030d09] font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-lg transition-all"
              >
                Geri Dön
              </button>
            </div>
          )}
        </>
      )}

      {/* DYNAMIC TOAST NOTIFICATIONS */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 max-w-sm w-full select-none pointer-events-none">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 flex items-start gap-3 bg-[#0a2218]/95 animate-fade-in-up ${
              notif.type === "success"
                ? "border-emerald-500/20 border-l-4 border-l-emerald-500 text-white"
                : notif.type === "error"
                  ? "border-red-500/20 border-l-4 border-l-red-500 text-white"
                  : "border-accent-cyan/20 border-l-4 border-l-accent-cyan text-white"
            }`}
          >
            {/* Notification Icon */}
            {notif.type === "success" ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-400 shrink-0">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : notif.type === "error" ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-400 shrink-0">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-accent-cyan shrink-0">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            )}
            <p className="text-xs font-medium leading-normal">{notif.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
