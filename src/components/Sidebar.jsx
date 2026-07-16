// No React hooks needed in Sidebar — JSX transform is automatic via Vite
import logoImg from "../assets/logo.png";

export function Sidebar({ activeTab, setActiveTab, isUnityActive, exitGame, resetGame, toggleGuide, isGuideOpen }) {
  const menuItems = [
    {
      id: "home",
      label: "Ana Sayfa",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: "shop",
      label: "Mağaza",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      id: "tournaments",
      label: "Turnuvalar",
      special: true,
      icon: (
        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 flex items-center justify-center bg-white/5 transition-all duration-300">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" fill="#0d2a1d" stroke="#e0e0e0" strokeWidth="1.5" />
            <path d="M12 5V13" stroke="#ffb300" strokeWidth="2" strokeLinecap="round" />
            <path d="M10 7L12 5L14 7" stroke="#ffb300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 13H15L13.5 17H10.5L9 13Z" fill="#ffb300" />
            <circle cx="8" cy="9" r="1" fill="#ffffff" />
            <circle cx="16" cy="9" r="1" fill="#ffffff" />
          </svg>
        </div>
      )
    },
    {
      id: "profile",
      label: "Profil",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: "settings",
      label: "Ayarlar",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: "about",
      label: "Hakkında",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <aside className={`w-[120px] fixed top-0 bottom-0 left-0 z-40 flex flex-col justify-between items-center py-8 border-r transition-all duration-300 ${
      isUnityActive 
        ? "bg-black/80 border-white/5 backdrop-blur-md" 
        : "bg-sidebar-bg border-sidebar-border backdrop-blur-[20px]"
    }`}>
      {/* Brand Logo */}
      <button 
        onClick={() => {
          if (isUnityActive) {
            exitGame();
          } else {
            setActiveTab("home");
          }
        }} 
        className="flex flex-col items-center text-center no-underline cursor-pointer group pointer-events-auto"
      >
        <div className="w-20 h-20 flex items-center justify-center filter drop-shadow-[0_6px_16px_rgba(0,229,255,0.15)] transition-all duration-500 transform group-hover:scale-110">
          <img src={logoImg} className="w-[72px] h-[72px] object-contain" alt="Timur Chess Logo" />
        </div>
      </button>

      {/* Menu Options */}
      <nav className="flex flex-col gap-6 w-full px-2">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id && !isUnityActive;
          return (
            <button
              key={item.id}
              disabled={isUnityActive}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl text-[10px] font-semibold gap-1.5 transition-all duration-300 w-full relative group cursor-pointer ${
                isUnityActive 
                  ? "opacity-35 cursor-not-allowed" 
                  : isActive
                    ? "text-white bg-white/5 font-bold"
                    : "text-text-secondary hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              {/* Active Marker */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-accent-cyan rounded-r" />
              )}
              
              <div className={`transition-all duration-300 transform group-hover:scale-110 ${
                isActive ? "text-accent-cyan" : "text-text-secondary group-hover:text-accent-cyan"
              }`}>
                {item.icon}
              </div>
              <span className="text-[9px] tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Game Context Active Actions */}
      <div className="w-full px-2 flex flex-col items-center gap-4">
        {isUnityActive ? (
          <>
            {/* Guide Button */}
            <button
              onClick={toggleGuide}
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 cursor-pointer pointer-events-auto ${
                isGuideOpen 
                  ? "bg-accent-cyan border-accent-cyan text-[#030d09]" 
                  : "bg-black/50 border-white/10 text-accent-cyan hover:bg-black/80"
              }`}
              title="Taş Rehberi"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </button>

            {/* Restart Button */}
            <button
              onClick={resetGame}
              className="w-10 h-10 rounded-xl bg-black/50 hover:bg-black/80 border border-white/10 flex items-center justify-center text-amber-500 transition-all duration-300 cursor-pointer pointer-events-auto"
              title="Oyunu Sıfırla"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.2" />
              </svg>
            </button>

            {/* Exit/Back Button */}
            <button
              onClick={exitGame}
              className="w-10 h-10 rounded-xl bg-red-950/20 hover:bg-red-900/60 border border-red-500/20 flex items-center justify-center text-red-400 transition-all duration-300 cursor-pointer pointer-events-auto"
              title="Oyundan Çık"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </>
        ) : (
          <div className="w-8 h-1 bg-white/5 rounded" />
        )}
      </div>
    </aside>
  );
}
