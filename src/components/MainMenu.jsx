import React, { useState, useEffect } from "react";
import chessboardImg from "../assets/Board.png";
import logoImg from "../assets/logo.png";

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
              className="bg-accent-cyan hover:bg-accent-cyan-hover text-[#030d09] font-extrabold text-md py-3.5 px-8 rounded-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,229,255,0.4)] shadow-[0_4px_15px_rgba(0,229,255,0.2)] flex items-center justify-center gap-3"
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
            onClick={() => startGame("bot")}
            className="bg-card-bg hover:scale-[1.02] border border-white/10 rounded-2xl p-5 flex items-center justify-between text-left cursor-pointer transition-all duration-500 shadow-xl group hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#091712] rounded-xl flex items-center justify-center text-card-bg transition-all duration-300 group-hover:bg-accent-cyan group-hover:text-[#030d09]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.364l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-card-text font-bold text-md leading-tight">Bot'a karşı oyna</span>
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
            onClick={() => startGame("online")}
            className="bg-card-bg hover:scale-[1.02] border border-white/10 rounded-2xl p-5 flex items-center justify-between text-left cursor-pointer transition-all duration-500 shadow-xl group hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#091712] rounded-xl flex items-center justify-center text-card-bg transition-all duration-300 group-hover:bg-accent-cyan group-hover:text-[#030d09]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-card-text font-bold text-md leading-tight">Çevrimiçi oyna</span>
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
              <div className="w-12 h-12 bg-[#091712] rounded-xl flex items-center justify-center text-card-bg transition-all duration-300 group-hover:bg-accent-cyan group-hover:text-[#030d09]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-card-text font-bold text-md leading-tight">Ekranda oyna</span>
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
