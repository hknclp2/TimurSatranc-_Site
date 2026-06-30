import { useState, useEffect, useCallback } from "react";
import { useUnityContext } from "react-unity-webgl";

// Authentic Timur Chess moves list for demo simulation
const MOCK_TIMUR_MOVES = [
  "1. P-Piyade e3-e4 (Piyon Hamlesi)",
  "1. P-Piyade g8-g6 (Kanat Savunması)",
  "2. Z-Zürafa (Giraffe) c3-f6 (Zürafa Çapraz Hücum)",
  "2. D-Deve (Camel) h1-g4 (Deve L-Sıçrayışı)",
  "3. F-Fil (Elephant) c1-e3 (Fil Çapraz Atlama)",
  "3. M-Mancınık (Siege Engine) a1-c3 (Mancınık Konumlanması)",
  "4. Ş-Şah (King) f1-f2 (Şah Güvenliği)",
  "4. V-Vezir (Vizier) d8-d7 (Merkez Kontrolü)",
  "5. P-Piyade a3-a4 (Vezir Kanadı Sürüşü)",
  "5. F-Fil (Elephant) i11-g9 (Karşı Fil Hamlesi)",
  "6. Z-Zürafa (Giraffe) f6-h9 (Şah Kanadı Tehdidi)",
  "6. Ş-Şah (King) e10-f10 (Şah Kaçış)"
];

export function useUnityBridge() {
  const [isUnityActive, setIsUnityActive] = useState(false);
  const [gameMode, setGameMode] = useState(null); // 'bot', 'online', 'screen'
  const [moveHistory, setMoveHistory] = useState([]);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [demoLoaded, setDemoLoaded] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);

  // Initialize react-unity-webgl context.
  // Note: Paths point to public/unity/ folder where real builds would live
  const unityContext = useUnityContext({
    loaderUrl: "/unity/Build.loader.js",
    dataUrl: "/unity/Build.data",
    frameworkUrl: "/unity/Build.framework.js",
    codeUrl: "/unity/Build.wasm",
  });

  const {
    unityProvider,
    sendMessage,
    addEventListener,
    removeEventListener,
    loadingProgression,
    isLoaded
  } = unityContext;

  // Detect if we can load the real Unity build (usually in window.createUnityInstance or check if loader is available)
  // For the sake of safety and previewing, we default to Demo mode if files are not loaded or if loading fails
  useEffect(() => {
    // Check if loaderUrl is reachable, if not, we stick to demo simulation.
    fetch("/unity/Build.loader.js", { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          setIsDemoMode(false);
        } else {
          setIsDemoMode(true);
        }
      })
      .catch(() => {
        setIsDemoMode(true);
      });
  }, []);

  // Demo progress simulation
  useEffect(() => {
    if (isUnityActive && isDemoMode && !demoLoaded) {
      setDemoProgress(0);
      const interval = setInterval(() => {
        setDemoProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setDemoLoaded(true);
            return 100;
          }
          return prev + Math.floor(Math.random() * 15) + 5;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isUnityActive, isDemoMode, demoLoaded]);

  // Handle movements from Unity WebGL
  const handleUnityMove = useCallback((moveData) => {
    // moveData can be a JSON string from Unity: e.g., '{"move": "e3-e4", "piece": "Pawn"}'
    try {
      const parsed = JSON.parse(moveData);
      setMoveHistory((prev) => [...prev, `${prev.length + 1}. ${parsed.piece} ${parsed.move}`]);
    } catch {
      setMoveHistory((prev) => [...prev, moveData]);
    }
  }, []);

  // Bind Unity event listeners
  useEffect(() => {
    if (!isDemoMode && isLoaded) {
      addEventListener("OnMoveMade", handleUnityMove);
      return () => {
        removeEventListener("OnMoveMade", handleUnityMove);
      };
    }
  }, [isDemoMode, isLoaded, addEventListener, removeEventListener, handleUnityMove]);

  // Actions
  const startGame = useCallback((mode) => {
    setGameMode(mode);
    setIsUnityActive(true);
    setMoveHistory([]);
    setDemoLoaded(false);
    setDemoProgress(0);

    if (!isDemoMode && isLoaded) {
      sendMessage("GameManager", "StartNewGame", mode);
    }
  }, [isDemoMode, isLoaded, sendMessage]);

  const exitGame = useCallback(() => {
    setIsUnityActive(false);
    setGameMode(null);
    setMoveHistory([]);
    setDemoLoaded(false);
    setDemoProgress(0);

    if (!isDemoMode && isLoaded) {
      sendMessage("GameManager", "ExitGame");
    }
  }, [isDemoMode, isLoaded, sendMessage]);

  const resetGame = useCallback(() => {
    setMoveHistory([]);
    setDemoLoaded(true);
    if (!isDemoMode && isLoaded) {
      sendMessage("GameManager", "ResetGame");
    }
  }, [isDemoMode, isLoaded, sendMessage]);

  // Demo mode move simulator (simulates Unity making moves)
  const simulateMove = useCallback(() => {
    if (moveHistory.length < MOCK_TIMUR_MOVES.length) {
      const nextMove = MOCK_TIMUR_MOVES[moveHistory.length];
      setMoveHistory((prev) => [...prev, nextMove]);

      // If we were real, we'd sync this.
      return nextMove;
    }
    return null;
  }, [moveHistory]);

  return {
    isUnityActive,
    gameMode,
    moveHistory,
    isLoaded: isDemoMode ? demoLoaded : isLoaded,
    loadingProgression: isDemoMode ? demoProgress : Math.round(loadingProgression * 100),
    unityProvider,
    isDemoMode,
    startGame,
    exitGame,
    resetGame,
    simulateMove,
  };
}
