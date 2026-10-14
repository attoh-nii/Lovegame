import React, { useState, useEffect, useRef } from 'react';
import { StageData } from '../../types';
import { playClick, playPop, playKiss, playSuccess } from '../../utils/audio';
import {
  Heart,
  Sparkles,
  Check,
  RefreshCw,
  HelpCircle,
  Eye,
  Gift,
  Sun,
  Flame,
  Music,
  MapPin,
  Coffee,
  Smile,
  Compass,
} from 'lucide-react';

interface StageGameProps {
  stage: StageData;
  onComplete: () => void;
}

// -------------------------------------------------------------
// STAGE 1: Luggage Packing Game
// -------------------------------------------------------------
export const Stage1Luggage: React.FC<StageGameProps> = ({ onComplete }) => {
  const items = [
    { id: 'suit', name: 'Matching Outfits', icon: '👗', packed: false },
    { id: 'flowers', name: 'Fresh Roses', icon: '🌹', packed: false },
    { id: 'gift', name: 'Gift Bag', icon: '🎁', packed: false },
    { id: 'tickets', name: 'Boarding Passes', icon: '🎫', packed: false },
    { id: 'snacks', name: 'Sweet Snacks', icon: '🍫', packed: false },
    { id: 'phone', name: 'Leopard Phone', icon: '📱', packed: false },
  ];

  const [packedItems, setPackedItems] = useState<string[]>([]);
  const isCompletedRef = useRef(false);

  const handlePack = (id: string) => {
    if (packedItems.includes(id) || isCompletedRef.current) return;
    playPop();
    const updated = [...packedItems, id];
    setPackedItems(updated);
    if (updated.length === items.length && !isCompletedRef.current) {
      isCompletedRef.current = true;
      setTimeout(() => {
        playSuccess();
        onComplete();
      }, 600);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto text-center">
      <div className="mb-4">
        <span className="text-3xl">🧳</span>
        <h3 className="text-lg font-bold text-rose-100 mt-2 font-serif-romance">
          Pack the Blue Suitcase!
        </h3>
        <p className="text-xs text-rose-300">
          Tap every essential item to pack it before the elevator reaches the ground floor! ({packedItems.length}/6)
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full mb-6">
        {items.map((item) => {
          const isPacked = packedItems.includes(item.id);
          return (
            <button
              key={item.id}
              onClick={() => handlePack(item.id)}
              disabled={isPacked}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border ${
                isPacked
                  ? 'bg-rose-950/40 border-rose-500/20 text-rose-400 opacity-40 scale-95'
                  : 'bg-rose-900/40 hover:bg-rose-800/60 border-rose-400/40 text-rose-100 hover:scale-105 shadow-lg active:scale-95'
              }`}
            >
              <span className="text-3xl mb-1">{item.icon}</span>
              <span className="text-[11px] font-semibold">{item.name}</span>
              {isPacked && <Check className="w-4 h-4 text-emerald-400 mt-1" />}
            </button>
          );
        })}
      </div>

      {/* Blue Suitcase Visual */}
      <div className="w-full bg-sky-950/60 border-2 border-sky-400/40 rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center text-2xl border border-sky-400/30">
            🧳
          </div>
          <div className="text-left">
            <h4 className="text-sm font-bold text-sky-200">Light Blue Suitcase</h4>
            <p className="text-xs text-sky-300/80">
              {packedItems.length === 6 ? 'Ready to roll! Zipping up...' : 'Waiting for essentials...'}
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-sky-300 bg-sky-900/60 px-3 py-1.5 rounded-full border border-sky-400/30">
          {Math.round((packedItems.length / 6) * 100)}%
        </span>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// STAGE 2: Stealing a Kiss Rhythm
// -------------------------------------------------------------
export const Stage2HeartRhythm: React.FC<StageGameProps> = ({ onComplete }) => {
  const [kisses, setKisses] = useState(0);
  const [scale, setScale] = useState(1);
  const [feedback, setFeedback] = useState<string>('Tap "Steal a Kiss" when the heart is in the ring!');
  const isCompletedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => (prev >= 1.6 ? 0.8 : prev + 0.1));
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const handleKiss = () => {
    if (isCompletedRef.current) return;
    // Sweet spot between 1.1 and 1.5
    if (scale >= 1.1 && scale <= 1.5) {
      playKiss();
      const next = kisses + 1;
      setKisses(next);
      setFeedback('Perfect timing! Mwah! 💋');
      if (next >= 3 && !isCompletedRef.current) {
        isCompletedRef.current = true;
        setTimeout(() => {
          playSuccess();
          onComplete();
        }, 500);
      }
    } else {
      playClick();
      setFeedback('Almost! Wait for the sweet spot!');
    }
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto text-center py-2">
      <h3 className="text-lg font-bold text-rose-100 font-serif-romance">
        Steal a Kiss Before Doors Open!
      </h3>
      <p className="text-xs text-rose-300 mt-1 mb-6">
        Land 3 tender kisses while the elevator travels between floors.
      </p>

      {/* Target Ring */}
      <div className="relative w-44 h-44 rounded-full border-4 border-dashed border-rose-400/50 flex items-center justify-center mb-6 bg-rose-950/20 backdrop-blur-sm">
        {/* Pulsing Sweet Spot Ring */}
        <div className="w-28 h-28 rounded-full border-2 border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.3)] pointer-events-none" />

        {/* Dynamic Heart */}
        <div
          className="absolute text-5xl transition-transform duration-100 select-none"
          style={{ transform: `scale(${scale})` }}
        >
          ❤️
        </div>
      </div>

      <p className="text-xs font-semibold text-rose-200 mb-4 h-5">{feedback}</p>

      <button
        onClick={handleKiss}
        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-rose-900/40 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <Heart className="w-4 h-4 fill-white" />
        Steal a Kiss! ({kisses}/3)
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// STAGE 3: Poolside Splash Bubble Pop
// -------------------------------------------------------------
export const Stage3BubblePop: React.FC<StageGameProps> = ({ onComplete }) => {
  const letters = ['S', 'P', 'L', 'A', 'S', 'H', '❤️'];
  const [popped, setPopped] = useState<number[]>([]);
  const isCompletedRef = useRef(false);

  const handlePop = (index: number) => {
    if (popped.includes(index) || isCompletedRef.current) return;
    playPop();
    const updated = [...popped, index];
    setPopped(updated);
    if (updated.length === letters.length && !isCompletedRef.current) {
      isCompletedRef.current = true;
      setTimeout(() => {
        playSuccess();
        onComplete();
      }, 500);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto text-center py-2">
      <span className="text-3xl">🏊‍♂️</span>
      <h3 className="text-lg font-bold text-cyan-200 font-serif-romance mt-2">
        Poolside Water Ripples
      </h3>
      <p className="text-xs text-cyan-300/80 mt-1 mb-6">
        Pop all the sunlit pool bubbles floating above the turquoise water!
      </p>

      <div className="relative w-full h-56 rounded-2xl bg-gradient-to-b from-cyan-900/40 via-cyan-950/60 to-cyan-900/80 border border-cyan-400/30 overflow-hidden p-4 shadow-inner flex flex-wrap items-center justify-center gap-3">
        {/* Water wave decoration */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:16px_16px]" />

        {letters.map((char, idx) => {
          const isPopped = popped.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handlePop(idx)}
              disabled={isPopped}
              className={`w-13 h-13 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 shadow-lg ${
                isPopped
                  ? 'scale-0 opacity-0'
                  : 'bg-cyan-400/20 hover:bg-cyan-400/40 text-cyan-100 border-2 border-cyan-300/60 backdrop-blur-md animate-bounce hover:scale-110 active:scale-95'
              }`}
              style={{ animationDelay: `${idx * 0.15}s`, animationDuration: '2s' }}
            >
              {char}
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-cyan-200 font-semibold">
        {popped.length === letters.length ? 'Splash complete!' : `Bubbles remaining: ${letters.length - popped.length}`}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// STAGE 4: Steamy Mirror Wipe
// -------------------------------------------------------------
export const Stage4MirrorWipe: React.FC<StageGameProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [wipedPercent, setWipedPercent] = useState(0);
  const isDrawing = useRef(false);
  const isCompletedRef = useRef(false);
  const wipedCountRef = useRef(0);

  useEffect(() => {
    isCompletedRef.current = false;
    wipedCountRef.current = 0;
    setWipedPercent(0);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw frosted steam
    ctx.fillStyle = 'rgba(230, 230, 235, 0.94)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle water streaks on mirror
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(30 + i * 40, 10);
      ctx.lineTo(30 + i * 40 + (i % 2 === 0 ? 10 : -10), 180);
      ctx.stroke();
    }
  }, []);

  const clearSpot = (clientX: number, clientY: number) => {
    if (isCompletedRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    wipedCountRef.current += 3;
    const currentPercent = Math.min(100, wipedCountRef.current);
    setWipedPercent(currentPercent);

    if (currentPercent >= 65 && !isCompletedRef.current) {
      isCompletedRef.current = true;
      setTimeout(() => {
        playSuccess();
        onComplete();
      }, 400);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    clearSpot(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    clearSpot(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto text-center py-2">
      <span className="text-3xl">🪞</span>
      <h3 className="text-lg font-bold text-rose-100 font-serif-romance mt-2">
        Clear the Steamy Mirror
      </h3>
      <p className="text-xs text-rose-300/80 mt-1 mb-4">
        Wipe away the steam with your finger or mouse to reveal the stunning red dress!
      </p>

      {/* Frame */}
      <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-4 border-amber-300/50 shadow-2xl bg-gradient-to-br from-rose-950 to-stone-900 flex items-center justify-center">
        {/* Hidden reflection underneath */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-6xl mb-2">💃</span>
          <h4 className="text-sm font-bold text-rose-200">The Lady in Red!</h4>
          <p className="text-[11px] text-rose-300/80">Breath-taking elegance</p>
        </div>

        {/* Steam Canvas */}
        <canvas
          ref={canvasRef}
          width={256}
          height={256}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-rose-200">
        <Sparkles className="w-4 h-4 text-amber-300" />
        Mirror Cleared: {Math.round(wipedPercent)}%
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// STAGE 5: Africa Earrings & Kiss Trivia
// -------------------------------------------------------------
export const Stage5TriviaKiss: React.FC<StageGameProps> = ({ stage, onComplete }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const trivia = stage.trivia || {
    question: 'What iconic accessory were you rocking in this sunlit garden photo?',
    options: [
      'Wooden carved Africa-shaped earrings',
      'A sparkling diamond tiara',
      'Oversized vintage headphones',
      'A matching silk scarf',
    ],
    correctIndex: 0,
    hint: 'Look closely near your beautiful locs!',
    explanation: 'You wore those fabulous Africa earrings!',
  };

  const handleSelect = (idx: number) => {
    setSelected(idx);
    setIsAnswered(true);
    if (idx === trivia.correctIndex) {
      playSuccess();
      setTimeout(onComplete, 1200);
    } else {
      playClick();
    }
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto text-center py-2">
      <span className="text-3xl">🌍</span>
      <h3 className="text-base sm:text-lg font-bold text-rose-100 font-serif-romance mt-2">
        {trivia.question}
      </h3>

      <div className="flex flex-col gap-2.5 w-full mt-5 mb-4">
        {trivia.options.map((option, idx) => {
          let btnStyle = 'bg-rose-950/40 hover:bg-rose-900/60 border-rose-400/30 text-rose-100';
          if (isAnswered) {
            if (idx === trivia.correctIndex) {
              btnStyle = 'bg-emerald-900/60 border-emerald-400 text-emerald-100 scale-102';
            } else if (idx === selected) {
              btnStyle = 'bg-rose-950 border-rose-500/60 text-rose-300 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-between ${btnStyle}`}
            >
              <span>{option}</span>
              {isAnswered && idx === trivia.correctIndex && (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {!isAnswered && (
        <button
          onClick={() => setShowHint(true)}
          className="text-xs text-amber-300/80 hover:text-amber-200 flex items-center gap-1 mt-1 underline"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Need a hint?
        </button>
      )}

      {showHint && !isAnswered && (
        <p className="text-xs text-amber-200 bg-amber-950/40 border border-amber-400/30 rounded-xl p-2 mt-2">
          💡 {trivia.hint}
        </p>
      )}

      {isAnswered && selected === trivia.correctIndex && (
        <p className="text-xs text-emerald-300 font-medium bg-emerald-950/40 border border-emerald-400/30 rounded-xl p-2 mt-2">
          ✨ {trivia.explanation}
        </p>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// STAGE 6: Twilight Constellation
// -------------------------------------------------------------
export const Stage6Constellation: React.FC<StageGameProps> = ({ onComplete }) => {
  const points = [
    { id: 1, x: 50, y: 35 },
    { id: 2, x: 75, y: 15 },
    { id: 3, x: 90, y: 40 },
    { id: 4, x: 50, y: 85 },
    { id: 5, x: 10, y: 40 },
    { id: 6, x: 25, y: 15 },
  ];

  const [connected, setConnected] = useState<number[]>([1]);

  const handlePointClick = (id: number) => {
    const nextExpected = connected.length + 1;
    if (id === nextExpected) {
      playClick();
      const updated = [...connected, id];
      setConnected(updated);
      if (updated.length === points.length) {
        playSuccess();
        setTimeout(onComplete, 800);
      }
    } else {
      playClick();
    }
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto text-center py-2">
      <span className="text-3xl">✨</span>
      <h3 className="text-lg font-bold text-rose-100 font-serif-romance mt-2">
        Twilight Heart Constellation
      </h3>
      <p className="text-xs text-rose-300/80 mt-1 mb-4">
        Connect the twilight stars in order (1 to 6) to form our dusk heart!
      </p>

      <div className="relative w-64 h-64 rounded-2xl bg-gradient-to-b from-stone-950 via-indigo-950/60 to-rose-950/60 border border-indigo-400/30 shadow-2xl overflow-hidden">
        {/* Constellation SVG Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connected.length > 1 &&
            connected.slice(1).map((pointId, idx) => {
              const pPrev = points.find((p) => p.id === connected[idx]);
              const pCurr = points.find((p) => p.id === pointId);
              if (!pPrev || !pCurr) return null;
              return (
                <line
                  key={idx}
                  x1={`${pPrev.x}%`}
                  y1={`${pPrev.y}%`}
                  x2={`${pCurr.x}%`}
                  y2={`${pCurr.y}%`}
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                />
              );
            })}
          {connected.length === points.length && (
            <line
              x1={`${points[5].x}%`}
              y1={`${points[5].y}%`}
              x2={`${points[0].x}%`}
              y2={`${points[0].y}%`}
              stroke="#fbbf24"
              strokeWidth="2.5"
            />
          )}
        </svg>

        {/* Stars */}
        {points.map((pt) => {
          const isDone = connected.includes(pt.id);
          const isNext = connected.length + 1 === pt.id;
          return (
            <button
              key={pt.id}
              onClick={() => handlePointClick(pt.id)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isDone
                  ? 'bg-amber-400 text-stone-900 shadow-[0_0_15px_#fbbf24] scale-110'
                  : isNext
                  ? 'bg-rose-500 text-white animate-pulse border-2 border-white'
                  : 'bg-indigo-900/60 text-indigo-200 border border-indigo-400/40 hover:bg-indigo-800'
              }`}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
            >
              {pt.id}
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-amber-200 font-semibold">
        {connected.length === points.length ? 'Heart aligned in the stars!' : `Next star: #${connected.length + 1}`}
      </div>
    </div>
  );
};
