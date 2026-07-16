import { useState, useEffect } from "react";
import chessboardImg from "../assets/Board.png";
import logoImg from "../assets/logo.png";
import botIcon from "../assets/bot.png";
import haritaIcon from "../assets/harita.png";
import ekrandaIcon from "../assets/ekrandaoyna.png";

// Animated counter hook
function useAnimatedNumber(target, suffix = "", duration = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target, 10);
    if (end === 0) return;

    const totalMiliseconds = duration;
    const stepTime = Math.max(Math.floor(totalMiliseconds / end), 15);
    const increment = Math.ceil(end / (totalMiliseconds / stepTime));

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count.toLocaleString("tr-TR") + suffix;
}

export function MainMenu({ startGame, user, setUser, showNotification }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [view, setView] = useState("main"); // 'main', 'bot-selection', 'online-soon'
  const [expandedBot, setExpandedBot] = useState("kolay"); // 'kolay', 'orta', 'zor'
  const [kolayCrowns, setKolayCrowns] = useState(1);
  const [ortaCrowns, setOrtaCrowns] = useState(2);
  const [zorCrowns, setZorCrowns] = useState(3);
  const [kolayTime, setKolayTime] = useState("15.00");
  const [ortaTime, setOrtaTime] = useState("10.00");
  const [zorTime, setZorTime] = useState("5.00");

  // Animated Stats
  const activePlayers = useAnimatedNumber(10000);
  const tournamentCount = useAnimatedNumber(1250);
  const lessonsCount = useAnimatedNumber(500);
  const winRate = useAnimatedNumber(90, "%");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (usernameInput) {
      const extractedName = usernameInput.split("@")[0];
      const formattedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
      setUser({ name: formattedName, loggedIn: true });
      setIsLoginOpen(false);
      showNotification(`Giriş başarılı! Hoş geldin, ${formattedName}.`, "success");
    }
  };

  const handleLogout = () => {
    setUser({ name: "Misafir", loggedIn: false });
    setUsernameInput("");
    setPasswordInput("");
    showNotification("Başarıyla çıkış yapıldı.", "info");
  };

  if (view === "bot-selection") {
    return (
      <div className="flex-1 ml-[120px] px-8 lg:px-12 py-8 flex flex-col min-h-screen justify-start items-center relative z-10 select-none bg-[#0c2e1f] text-[#ede4d7] w-full">
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,229,255,0.02)_0%,_transparent_70%)] pointer-events-none z-0"></div>

        <div className="w-full max-w-xl relative z-10">
          {/* Header */}
          <div className="flex items-center gap-6 mb-10 mt-4">
            <button
              onClick={() => setView("main")}
              className="w-14 h-14 bg-[#f5eedc] hover:bg-[#e6dcc5] text-[#141f1b] rounded-2xl flex items-center justify-center cursor-pointer shadow-lg transition-all transform active:scale-95 border border-[#141f1b]/10 shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="font-batangas text-3xl lg:text-4xl font-bold tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,229,255,0.15)]">
              Bota karşı oyna
            </h1>
          </div>

          {/* Cards Stack */}
          <div className="flex flex-col gap-6">

            {/* KOLAY BOT CARD */}
            <div className="flex flex-col rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
              <button
                onClick={() => setExpandedBot(expandedBot === "kolay" ? null : "kolay")}
                className={`bg-[#f5eedc] p-6 flex justify-between items-center text-left cursor-pointer transition-all duration-300 w-full ${expandedBot === "kolay" ? "" : "rounded-2xl"
                  }`}
              >
                <span className="font-batangas text-2xl font-bold text-[#141f1b]">Kolay Bot</span>
                <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 text-[#141f1b] shrink-0">
                  <path d="M6 10 L16 6 L32 10 L42 6 L42 38 L32 42 L16 38 L6 42 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
                  <path d="M16 6 L16 38" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                  <path d="M32 10 L32 42" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                  <path d="M12 34 Q 24 24, 36 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 6" />
                  <circle cx="12" cy="34" r="3" fill="currentColor" />
                  <path d="M33 11 L39 17 M39 11 L33 17" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </button>

              {expandedBot === "kolay" && (
                <div className="bg-[#c8bfae] p-6 flex flex-col gap-4 text-[#141f1b] border-t border-[#141f1b]/10 animate-slide-down">
                  {/* Zaman Seçenekleri */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Zaman Seçenekleri</span>
                    <button
                      onClick={() => setKolayTime(kolayTime === "15.00" ? "30.00" : kolayTime === "30.00" ? "10.00" : "15.00")}
                      className="bg-[#387e5c] hover:bg-[#2e684c] text-white font-bold py-1 px-4 rounded-lg cursor-pointer transition-all active:scale-95 shadow-sm"
                    >
                      {kolayTime}
                    </button>
                  </div>

                  {/* Taç */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Taç</span>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((crownNum) => (
                        <button
                          key={crownNum}
                          onClick={() => setKolayCrowns(crownNum)}
                          className={`bg-[#387e5c] text-white py-1.5 px-3 rounded-lg flex items-center justify-center gap-0.5 cursor-pointer transition-all ${kolayCrowns === crownNum ? "ring-2 ring-yellow-400 scale-105 shadow-md" : "opacity-60 hover:opacity-100"
                            }`}
                        >
                          {Array.from({ length: crownNum }).map((_, i) => (
                            <span key={i} className="text-yellow-400 text-xs">👑</span>
                          ))}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={() => {
                      showNotification(`Kolay Bot (${kolayTime} süre, ${kolayCrowns} Taç) başlatılıyor...`, "success");
                      startGame("bot");
                    }}
                    className="w-full bg-[#1a442e] hover:bg-[#123020] text-white font-batangas font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-[#1a442e]/30 mt-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 text-center"
                  >
                    Oyunu Başlat
                  </button>
                </div>
              )}
            </div>

            {/* ORTA BOT CARD */}
            <div className="flex flex-col rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
              <button
                onClick={() => setExpandedBot(expandedBot === "orta" ? null : "orta")}
                className={`bg-[#f5eedc] p-6 flex justify-between items-center text-left cursor-pointer transition-all duration-300 w-full ${expandedBot === "orta" ? "" : "rounded-2xl"
                  }`}
              >
                <span className="font-batangas text-2xl font-bold text-[#141f1b]">Orta Bot</span>
                <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 text-[#141f1b] shrink-0">
                  <circle cx="24" cy="24" r="9" stroke="currentColor" strokeWidth="3" />
                  <circle cx="24" cy="24" r="3" fill="currentColor" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
                    <rect
                      key={idx}
                      x="22"
                      y="5"
                      width="4"
                      height="7"
                      rx="1"
                      fill="currentColor"
                      transform={`rotate(${angle} 24 24)`}
                    />
                  ))}
                </svg>
              </button>

              {expandedBot === "orta" && (
                <div className="bg-[#c8bfae] p-6 flex flex-col gap-4 text-[#141f1b] border-t border-[#141f1b]/10 animate-slide-down">
                  {/* Zaman Seçenekleri */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Zaman Seçenekleri</span>
                    <button
                      onClick={() => setOrtaTime(ortaTime === "10.00" ? "15.00" : ortaTime === "15.00" ? "20.00" : "10.00")}
                      className="bg-[#387e5c] hover:bg-[#2e684c] text-white font-bold py-1 px-4 rounded-lg cursor-pointer transition-all active:scale-95 shadow-sm"
                    >
                      {ortaTime}
                    </button>
                  </div>

                  {/* Taç */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Taç</span>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((crownNum) => (
                        <button
                          key={crownNum}
                          onClick={() => setOrtaCrowns(crownNum)}
                          className={`bg-[#387e5c] text-white py-1.5 px-3 rounded-lg flex items-center justify-center gap-0.5 cursor-pointer transition-all ${ortaCrowns === crownNum ? "ring-2 ring-yellow-400 scale-105 shadow-md" : "opacity-60 hover:opacity-100"
                            }`}
                        >
                          {Array.from({ length: crownNum }).map((_, i) => (
                            <span key={i} className="text-yellow-400 text-xs">👑</span>
                          ))}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={() => {
                      showNotification(`Orta Bot (${ortaTime} süre, ${ortaCrowns} Taç) başlatılıyor...`, "success");
                      startGame("bot");
                    }}
                    className="w-full bg-[#1a442e] hover:bg-[#123020] text-white font-batangas font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-[#1a442e]/30 mt-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 text-center"
                  >
                    Oyunu Başlat
                  </button>
                </div>
              )}
            </div>

            {/* ZOR BOT CARD */}
            <div className="flex flex-col rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
              <button
                onClick={() => setExpandedBot(expandedBot === "zor" ? null : "zor")}
                className={`bg-[#f5eedc] p-6 flex justify-between items-center text-left cursor-pointer transition-all duration-300 w-full ${expandedBot === "zor" ? "" : "rounded-2xl"
                  }`}
              >
                <span className="font-batangas text-2xl font-bold text-[#141f1b]">Zor Bot</span>
                <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 text-[#141f1b] shrink-0">
                  <path d="M6 34 L10 20 L16 26 L22 14 L28 26 L34 20 L38 34 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" fill="none" />
                  <path d="M14 38 L18 24 L24 30 L30 18 L36 30 L42 24 L46 38 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" fill="currentColor" />
                </svg>
              </button>

              {expandedBot === "zor" && (
                <div className="bg-[#c8bfae] p-6 flex flex-col gap-4 text-[#141f1b] border-t border-[#141f1b]/10 animate-slide-down">
                  {/* Zaman Seçenekleri */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Zaman Seçenekleri</span>
                    <button
                      onClick={() => setZorTime(zorTime === "5.00" ? "8.00" : zorTime === "8.00" ? "3.00" : "5.00")}
                      className="bg-[#387e5c] hover:bg-[#2e684c] text-white font-bold py-1 px-4 rounded-lg cursor-pointer transition-all active:scale-95 shadow-sm"
                    >
                      {zorTime}
                    </button>
                  </div>

                  {/* Taç */}
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Taç</span>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((crownNum) => (
                        <button
                          key={crownNum}
                          onClick={() => setZorCrowns(crownNum)}
                          className={`bg-[#387e5c] text-white py-1.5 px-3 rounded-lg flex items-center justify-center gap-0.5 cursor-pointer transition-all ${zorCrowns === crownNum ? "ring-2 ring-yellow-400 scale-105 shadow-md" : "opacity-60 hover:opacity-100"
                            }`}
                        >
                          {Array.from({ length: crownNum }).map((_, i) => (
                            <span key={i} className="text-yellow-400 text-xs">👑</span>
                          ))}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={() => {
                      showNotification(`Zor Bot (${zorTime} süre, ${zorCrowns} Taç) başlatılıyor...`, "success");
                      startGame("bot");
                    }}
                    className="w-full bg-[#1a442e] hover:bg-[#123020] text-white font-batangas font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-[#1a442e]/30 mt-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 text-center"
                  >
                    Oyunu Başlat
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  if (view === "online-soon") {
    return (
      <div className="flex-1 ml-[120px] px-8 lg:px-12 py-8 flex flex-col min-h-screen justify-start items-center relative z-10 select-none bg-[#0c2e1f] text-[#ede4d7] w-full">
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,229,255,0.02)_0%,_transparent_70%)] pointer-events-none z-0"></div>

        <div className="w-full max-w-xl relative z-10 flex flex-col items-center">
          {/* Header */}
          <div className="flex items-center gap-6 mb-16 mt-4 w-full justify-start">
            <button
              onClick={() => setView("main")}
              className="w-14 h-14 bg-[#f5eedc] hover:bg-[#e6dcc5] text-[#141f1b] rounded-2xl flex items-center justify-center cursor-pointer shadow-lg transition-all transform active:scale-95 border border-[#141f1b]/10 shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="font-batangas text-3xl lg:text-4xl font-bold tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,229,255,0.15)]">
              Çevrimiçi Oyna
            </h1>
          </div>

          {/* Centered Graphic and Messages */}
          <div className="flex flex-col items-center text-center mt-10 max-w-md">
            {/* Animated SVG Castle Construction */}
            <div className="relative w-40 h-40 mb-10 flex items-center justify-center">
              {/* Outer pulsing glow */}
              <div className="absolute w-36 h-36 rounded-full bg-accent-cyan/5 border border-accent-cyan/10 animate-ping"></div>

              {/* Castle Icon */}
              <svg viewBox="0 0 64 64" fill="none" className="w-28 h-28 text-accent-cyan/80 drop-shadow-[0_0_15px_rgba(0,229,255,0.3)] relative z-10">
                <path d="M12 48 L12 28 L16 28 L16 32 L22 32 L22 28 L26 28 L26 32 L32 32 L32 24 L36 24 L36 28 L42 28 L42 24 L48 24 L48 28 L52 28 L52 48 Z" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
                <path d="M22 48 L22 38 C22 35, 42 35, 42 38 L42 48" stroke="currentColor" strokeWidth="3.5" />
                <path d="M16 40 L28 40 M36 44 L48 44 M12 44 L20 44 M44 38 L52 38" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
                <path d="M28 20 L28 12 M24 16 L32 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-bounce" />
              </svg>
            </div>

            <h2 className="font-batangas text-4xl font-extrabold tracking-widest text-accent-cyan mb-4 drop-shadow-[0_0_12px_rgba(0,229,255,0.2)] uppercase">
              Çok Yakında...
            </h2>
            <p className="font-serif text-2xl text-white font-semibold leading-relaxed mb-3">
              Kale surları inşa ediliyor...
            </p>
            <p className="text-text-secondary text-sm max-w-xs leading-relaxed opacity-80">
              Timur'un ordusu çevrimiçi savaş meydanını hazırlıyor. Kılıcını keskin tut, çok yakında küresel mücadele başlıyor!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 ml-[120px] px-8 lg:px-12 py-8 flex flex-col min-height-screen justify-between relative z-10 select-none">
      {/* BACKGROUND FLOATING DECORATIONS - subtle orb only */}
      <div className="bg-decoration pointer-events-none">
        <svg className="bg-icon top-[45%] right-[45%] w-[200px] h-[200px] opacity-[0.012]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.3" d="M9.663 17h4.673M12 3v1m6.364 1.364l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>

      {/* TOP HEADER */}
      <header className="flex justify-end items-center gap-6 w-full mb-8 relative z-20">
        <div className="flex items-center gap-3 bg-[#040f0a]/40 px-5 py-2 rounded-full border border-white/5">
          <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-text-secondary leading-tight">Hoş geldin,</span>
            <span className="text-xs font-bold text-white leading-normal">{user.name}</span>
          </div>
        </div>

        {user.loggedIn ? (
          <button
            onClick={handleLogout}
            className="border-2 border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10 font-bold text-sm px-6 py-2 rounded-full cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Çıkış Yap
          </button>
        ) : (
          <button
            onClick={() => setIsLoginOpen(true)}
            className="bg-accent-cyan hover:bg-accent-cyan-hover text-[#030d09] font-bold text-sm px-6 py-2 rounded-full cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-[0_4px_15px_rgba(0,229,255,0.25)] hover:shadow-[0_6px_20px_rgba(0,229,255,0.4)]"
          >
            Giriş Yap
          </button>
        )}
      </header>

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center my-auto w-full relative z-20">

        {/* Column 1: Title & Hero Actions */}
        <section className="flex flex-col gap-6 text-left">
          <h1 className="font-serif text-6xl xl:text-7xl font-extrabold tracking-tight leading-none bg-gradient-to-br from-white to-[#a4cfbb] bg-clip-text text-transparent filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
            Timur<br />Satrancı
          </h1>
          <p className="text-sm xl:text-base text-text-secondary leading-relaxed max-w-sm">
            Stratejini kur, bilgelikle hamle yap. Geçmişi Keşfet, Geleceği Yönet!
          </p>
          <div className="flex flex-col gap-3 max-w-[280px]">
            <button
              onClick={() => startGame("bot")}
              className="bg-accent-cyan hover:bg-accent-cyan-hover text-[#030d09] font-batangas font-bold text-lg py-3.5 px-8 rounded-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,229,255,0.4)] shadow-[0_4px_15px_rgba(0,229,255,0.2)] flex items-center justify-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Oyna
            </button>
            <button
              onClick={() => setIsRulesOpen(true)}
              className="bg-transparent hover:bg-accent-cyan/85 hover:text-[#030d09] text-accent-cyan border-2 border-accent-cyan font-extrabold text-md py-3 px-8 rounded-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,229,255,0.15)] flex items-center justify-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Öğren
            </button>
          </div>
        </section>

        {/* Column 2: 3D Isometric Board Asset */}
        <section className="relative flex items-center justify-center w-full min-h-[300px] lg:min-h-[420px]">
          <div className="absolute w-[260px] h-[260px] bg-[radial-gradient(circle,_rgba(0,229,255,0.06)_0%,_transparent_70%)] rounded-full blur-xl pointer-events-none z-0 animate-pulse"></div>
          <img
            src={chessboardImg}
            alt="3D Timur Chess Board"
            className="w-full max-w-[420px] height-auto relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.65)] animate-float"
          />
        </section>

        {/* Column 3: Game Modes Selection */}
        <section className="flex flex-col gap-4">
          {/* Bot Card */}
          <button
            onClick={() => setView("bot-selection")}
            className="bg-card-bg hover:scale-[1.02] border border-white/10 rounded-2xl p-5 flex items-center justify-between text-left cursor-pointer transition-all duration-500 shadow-xl group hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 flex items-center justify-center transition-all duration-300 overflow-hidden">
                <img src={botIcon} alt="Bot" className="w-11 h-11 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-card-text font-batangas font-bold text-md leading-tight">Bot'a karşı oyna</span>
                <span className="text-card-subtext text-xs mt-0.5">Yapay zekaya karşı kendini test et</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#091712] text-card-bg flex items-center justify-center group-hover:bg-accent-cyan group-hover:text-[#030d09] group-hover:-rotate-45 transition-all duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Online Card */}
          <button
            onClick={() => setView("online-soon")}
            className="bg-card-bg hover:scale-[1.02] border border-white/10 rounded-2xl p-5 flex items-center justify-between text-left cursor-pointer transition-all duration-500 shadow-xl group hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 flex items-center justify-center transition-all duration-300 overflow-hidden">
                <img src={haritaIcon} alt="Çevrimiçi" className="w-11 h-11 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-card-text font-batangas font-bold text-md leading-tight">Çevrimiçi oyna</span>
                <span className="text-card-subtext text-xs mt-0.5">Dünyadaki rakiplerle oyna</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#091712] text-card-bg flex items-center justify-center group-hover:bg-accent-cyan group-hover:text-[#030d09] group-hover:-rotate-45 transition-all duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Local Screen Card */}
          <button
            onClick={() => startGame("screen")}
            className="bg-card-bg hover:scale-[1.02] border border-white/10 rounded-2xl p-5 flex items-center justify-between text-left cursor-pointer transition-all duration-500 shadow-xl group hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 flex items-center justify-center transition-all duration-300 overflow-hidden">
                <img src={ekrandaIcon} alt="Ekranda Oyna" className="w-11 h-11 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-card-text font-batangas font-bold text-md leading-tight">Ekranda oyna</span>
                <span className="text-card-subtext text-xs mt-0.5">Aynı cihazda arkadaşına karşı oyna</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#091712] text-card-bg flex items-center justify-center group-hover:bg-accent-cyan group-hover:text-[#030d09] group-hover:-rotate-45 transition-all duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </section>

      </div>

      {/* STATS BAR */}
      <footer className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-stat-bg border border-stat-border rounded-2xl p-6 backdrop-blur-md mt-10 relative z-20">

        {/* Stat Item 1 */}
        <div className="flex items-center justify-center gap-4 relative md:after:content-[''] md:after:absolute md:after:right-[-12px] md:after:top-[15%] md:after:h-[70%] md:after:w-[1px] md:after:bg-white/10 last:after:content-none">
          <div className="text-emerald-400 p-2 bg-emerald-500/10 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl xl:text-2xl font-extrabold text-white leading-none">{activePlayers}</span>
            <span className="text-text-secondary text-[11px] font-semibold mt-1">Aktif Oyuncu</span>
          </div>
        </div>

        {/* Stat Item 2 */}
        <div className="flex items-center justify-center gap-4 relative md:after:content-[''] md:after:absolute md:after:right-[-12px] md:after:top-[15%] md:after:h-[70%] md:after:w-[1px] md:after:bg-white/10 last:after:content-none">
          <div className="text-amber-500 p-2 bg-amber-500/10 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15a4 4 0 004-4V5H8v6a4 4 0 004 4zm0 0v4m0 0H9m3 0h3M4 7h4m12 0h-4M4 7c0 3 2 5 4 5m12-5c0 3-2 5-4 5" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl xl:text-2xl font-extrabold text-white leading-none">{tournamentCount}</span>
            <span className="text-text-secondary text-[11px] font-semibold mt-1">Turnuva</span>
          </div>
        </div>

        {/* Stat Item 3 */}
        <div className="flex items-center justify-center gap-4 relative md:after:content-[''] md:after:absolute md:after:right-[-12px] md:after:top-[15%] md:after:h-[70%] md:after:w-[1px] md:after:bg-white/10 last:after:content-none">
          <div className="text-sky-400 p-2 bg-sky-500/10 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl xl:text-2xl font-extrabold text-white leading-none">{lessonsCount}</span>
            <span className="text-text-secondary text-[11px] font-semibold mt-1">Eğitim İçeriği</span>
          </div>
        </div>

        {/* Stat Item 4 */}
        <div className="flex items-center justify-center gap-4">
          <div className="text-accent-cyan p-2 bg-accent-cyan/10 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl xl:text-2xl font-extrabold text-white leading-none">{winRate}</span>
            <span className="text-text-secondary text-[11px] font-semibold mt-1">Kazanma Oranı</span>
          </div>
        </div>

      </footer>
      <div className="text-[11px] text-text-secondary/40 text-center md:text-right mt-3 mr-2 select-none font-medium">
        *temsilidir
      </div>

      {/* LOGIN MODAL */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#0b2218] border border-white/10 rounded-3xl w-full max-w-[420px] p-8 shadow-2xl relative select-none animate-zoom-in">
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-5 right-5 bg-transparent border-none text-text-secondary hover:text-white cursor-pointer p-1.5 rounded-full hover:bg-white/5 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-6">
              <img src={logoImg} className="w-10 h-10 object-contain" alt="Logo" />
              <div>
                <h2 className="font-serif text-2xl font-bold text-white leading-tight">Giriş Yap</h2>
                <span className="text-[9px] text-accent-cyan tracking-widest font-semibold uppercase block">Timur Satrancı Portal</span>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary" htmlFor="username">E-posta veya Kullanıcı Adı</label>
                <input
                  type="text"
                  id="username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="bg-black/30 border border-white/10 text-white font-primary text-sm p-3 rounded-xl focus:outline-none focus:border-accent-cyan transition-all"
                  placeholder="ornek@domain.com"
                  required
                  autoComplete="username"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary" htmlFor="password">Şifre</label>
                <input
                  type="password"
                  id="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="bg-black/30 border border-white/10 text-white font-primary text-sm p-3 rounded-xl focus:outline-none focus:border-accent-cyan transition-all"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="flex justify-between items-center text-xs my-1">
                <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
                  <input type="checkbox" id="rememberMe" className="accent-accent-cyan" />
                  <span>Beni Hatırla</span>
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); showNotification("Şifre sıfırlama e-postası gönderildi (Demo)."); }} className="text-accent-cyan hover:underline font-semibold">Şifremi Unuttum</a>
              </div>

              <button
                type="submit"
                className="bg-accent-cyan hover:bg-accent-cyan-hover text-[#030d09] font-bold text-sm py-3 rounded-xl cursor-pointer shadow-[0_4px_15px_rgba(0,229,255,0.25)] transition-all duration-300"
              >
                Giriş Yap
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-text-secondary">
              Hesabın yok mu? <a href="#" onClick={(e) => { e.preventDefault(); showNotification("Kayıt ekranı yapım aşamasındadır."); }} className="text-accent-cyan font-bold hover:underline">Kayıt Ol</a>
            </div>
          </div>
        </div>
      )}

      {/* RULES MODAL */}
      {isRulesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#0b2218] border border-white/10 rounded-3xl w-full max-w-[600px] p-8 shadow-2xl relative select-none animate-zoom-in">
            <button
              onClick={() => setIsRulesOpen(false)}
              className="absolute top-5 right-5 bg-transparent border-none text-text-secondary hover:text-white cursor-pointer p-1.5 rounded-full hover:bg-white/5 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
              <img src={logoImg} className="w-10 h-10 object-contain" alt="Logo" />
              <div>
                <h2 className="font-serif text-2xl font-bold text-white leading-tight">Timur Satrancı Kuralları</h2>
                <span className="text-[9px] text-accent-cyan tracking-widest font-semibold uppercase block">Kültürel Miras Kılavuzu</span>
              </div>
            </div>

            <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar text-left text-sm text-text-secondary leading-relaxed flex flex-col gap-4">
              <p className="text-white font-medium text-xs leading-normal">
                Büyük İmparator Emir Timur döneminde yaygın olarak oynanan bu satranç varyasyonu, standart satrancın 11x10 boyutlarında daha büyük bir tahtada oynanan tarihi ve zenginleştirilmiş bir modelidir.
              </p>

              <div>
                <h4 className="text-accent-cyan font-bold mb-2">Önemli Taşlar ve Hareketleri:</h4>
                <ul className="flex flex-col gap-2.5">
                  <li className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    <strong>🦒 Zürafa (Giraffe):</strong> Önce çapraz 1 adım, sonra dikey veya yatay olarak en az 3 adım gider.
                  </li>
                  <li className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    <strong>🐪 Deve (Camel):</strong> 3 dikey ve 1 yatay kare atlar (L hareketinin uzun versiyonu).
                  </li>
                  <li className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    <strong>🐘 Fil (Elephant):</strong> Çapraz olarak tam 2 kare atlar. Aradaki taşların üzerinden atlayabilir.
                  </li>
                  <li className="bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    <strong>🏹 Mancınık (Siege Engine):</strong> Dikey veya yatay olarak tam 2 kare atlar, taşların üzerinden geçer.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-accent-cyan font-bold mb-1">Oyunun Amacı:</h4>
                <p className="text-xs">
                  Klasik satrançta olduğu gibi rakip Şah'ı mat etmektir. Ancak tahta daha büyük olduğundan oyun süresi uzundur ve taktiksel kombinasyonlar çok daha zengindir. Şah tehlikeye düştüğünde tahtada yer alan 'Husn' kalesine sığınabilir.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsRulesOpen(false)}
              className="mt-6 w-full bg-accent-cyan hover:bg-accent-cyan-hover text-[#030d09] font-bold text-sm py-3 rounded-xl cursor-pointer transition-all duration-300"
            >
              Anladım
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
