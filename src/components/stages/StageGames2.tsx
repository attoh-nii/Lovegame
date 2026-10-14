import React, { useState, useEffect, useRef } from 'react';
import { StageData } from '../../types';
import { playClick, playPop, playSuccess } from '../../utils/audio';
import { Check, Sparkles, Heart, Sun, Coffee, Eye, Shuffle } from 'lucide-react';

interface StageGameProps {
  stage: StageData;
  onComplete: () => void;
}

// -------------------------------------------------------------
// STAGE 7: Focus Meter Tuning (Amber Sunglasses)
// -------------------------------------------------------------
export const Stage7FocusMeter: React.FC<StageGameProps> = ({ onComplete }) => {
  const [value, setValue] = useState(20);
  const target = 100;
  const isCompletedRef = useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCompletedRef.current) return;
    const val = Number(e.target.value);
    setValue(val);
    if (val >= 98 && !isCompletedRef.current) {
      isCompletedRef.current = true;
      playSuccess();
      setTimeout(onComplete, 600);
    } else {
      playClick();
    }
  };

  const blurAmount = Math.max(0, (100 - value) / 8);

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto text-center py-2">
      <span className="text-3xl">🕶️</span>
      <h3 className="text-lg font-bold text-amber-100 font-serif-romance mt-2">
        Through Amber Lenses
      </h3>
      <p className="text-xs text-amber-300/80 mt-1 mb-4">
        Slide the lens focus dial to 100% to sharpen our golden sunlight portrait!
      </p>

      {/* Portrait Preview with Dynamic Blur */}
      <div className="relative w-64 h-52 rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-xl bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 flex items-center justify-center p-4">
        <div
          className="text-center transition-all duration-100"
          style={{ filter: `blur(${blurAmount}px)` }}
        >
          <div className="text-5xl mb-2">🕶️👫</div>
          <h4 className="text-sm font-bold text-amber-200">Crystal Clear Love</h4>
          <p className="text-xs text-amber-100/80">Looking at forever with you</p>
        </div>
      </div>

      <div className="w-full mt-6 px-2">
        <div className="flex justify-between text-xs text-amber-300 font-semibold mb-2">
          <span>Hazy Glimpse</span>
          <span>100% Focus</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={handleChange}
          className="w-full h-2.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />
        <div className="mt-3 text-xs font-bold text-amber-200 flex items-center justify-center gap-1">
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          Lens Calibration: {value}%
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// STAGE 8: Rooftop Bangles Color Sequence
// -------------------------------------------------------------
export const Stage8BangleSequence: React.FC<StageGameProps> = ({ onComplete }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const question = 'Where were we walking hand-in-hand, celebrating our shared passion for culture and our love for history?';
  const options = [
    'Kwame Nkrumah Memorial Park, Accra',
    'Cape Coast Castle',
    'Independence Square (Black Star Arch)',
    'National Theatre of Ghana',
  ];
  const correctIndex = 0;
  const hint = 'A historic park in downtown Accra dedicated to Ghana’s first president!';
  const explanation = 'Kwame Nkrumah Memorial Park! Exploring our shared love for history with you by my side was pure magic.';

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelected(idx);
    setIsAnswered(true);
    if (idx === correctIndex) {
      playSuccess();
      setTimeout(onComplete, 1100);
    } else {
      playClick();
    }
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto text-center py-2">
      <span className="text-3xl">🏛️</span>
      <h3 className="text-base sm:text-lg font-bold text-amber-100 font-serif-romance mt-2">
        {question}
      </h3>
      <p className="text-xs text-amber-300/80 mt-1 mb-4">
        Our love for history & our time together at this special Accra landmark
      </p>

      <div className="flex flex-col gap-2.5 w-full mb-4">
        {options.map((option, idx) => {
          let btnStyle = 'bg-stone-900/60 hover:bg-stone-800/80 border-amber-500/30 text-rose-100';
          if (isAnswered) {
            if (idx === correctIndex) {
              btnStyle = 'bg-emerald-900/70 border-emerald-400 text-emerald-100 scale-102 ring-2 ring-emerald-400/50';
            } else if (idx === selected) {
              btnStyle = 'bg-rose-950/80 border-rose-500/60 text-rose-300 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-between ${btnStyle}`}
            >
              <span>{option}</span>
              {isAnswered && idx === correctIndex && (
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
          💡 Need a hint?
        </button>
      )}

      {showHint && !isAnswered && (
        <p className="text-xs text-amber-200 bg-amber-950/40 border border-amber-400/30 rounded-xl p-2.5 mt-2">
          {hint}
        </p>
      )}

      {isAnswered && selected === correctIndex && (
        <p className="text-xs text-emerald-300 font-medium bg-emerald-950/50 border border-emerald-400/40 rounded-xl p-2.5 mt-2">
          ✨ {explanation}
        </p>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// STAGE 9: Golden Hour Car Ride Light Catcher
// -------------------------------------------------------------
export const Stage9GoldenLight: React.FC<StageGameProps> = ({ onComplete }) => {
  const [caught, setCaught] = useState(0);

  const handleCatch = () => {
    playPop();
    const next = caught + 1;
    setCaught(next);
    if (next >= 6) {
      playSuccess();
      setTimeout(onComplete, 600);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto text-center py-2">
      <span className="text-3xl">🌅</span>
      <h3 className="text-lg font-bold text-amber-100 font-serif-romance mt-2">
        Catch the Sunset Sunbeams
      </h3>
      <p className="text-xs text-amber-300/80 mt-1 mb-4">
        Tap 6 golden sunlight rays streaming across the car window!
      </p>

      <div className="relative w-64 h-56 rounded-2xl bg-gradient-to-tr from-stone-950 via-rose-950 to-amber-900/60 border border-amber-400/40 shadow-2xl overflow-hidden p-3 flex flex-wrap items-center justify-around">
        {Array.from({ length: 6 }).map((_, idx) => {
          const isCaught = idx < caught;
          return (
            <button
              key={idx}
              onClick={handleCatch}
              disabled={isCaught}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
                isCaught
                  ? 'opacity-20 scale-50'
                  : 'bg-amber-400/30 hover:bg-amber-400/60 border-2 border-amber-300 shadow-[0_0_15px_#f59e0b] animate-pulse hover:scale-110 active:scale-95'
              }`}
            >
              ☀️
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-xs font-semibold text-amber-200">
        Sunbeams Collected: {caught} / 6
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// STAGE 10: Buka Restaurant & The FaceTime Rescue
// -------------------------------------------------------------
export const Stage10CardMatch: React.FC<StageGameProps> = ({ onComplete }) => {
  const cardsData = [
    { id: 1, pairId: 'dress', icon: '👗', name: 'Stunning Green Dress' },
    { id: 2, pairId: 'call', icon: '📱', name: 'FaceTime in Washroom' },
    { id: 3, pairId: 'buka', icon: '🍽️', name: 'Buka Restaurant Osu' },
    { id: 4, pairId: 'dress', icon: '👗', name: 'Stunning Green Dress' },
    { id: 5, pairId: 'call', icon: '📱', name: 'FaceTime in Washroom' },
    { id: 6, pairId: 'buka', icon: '🍽️', name: 'Buka Restaurant Osu' },
  ];

  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const isCompletedRef = useRef(false);

  const handleCardClick = (id: number, pairId: string) => {
    if (flipped.includes(id) || matched.includes(pairId) || isCompletedRef.current) return;
    playClick();

    if (flipped.length === 0) {
      setFlipped([id]);
    } else if (flipped.length === 1) {
      const firstCard = cardsData.find((c) => c.id === flipped[0]);
      setFlipped([flipped[0], id]);

      if (firstCard && firstCard.pairId === pairId) {
        // Matched!
        playPop();
        const newMatched = [...matched, pairId];
        setMatched(newMatched);
        setFlipped([]);
        if (newMatched.length === 3 && !isCompletedRef.current) {
          isCompletedRef.current = true;
          playSuccess();
          setTimeout(onComplete, 700);
        }
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto text-center py-2">
      <span className="text-3xl">🍽️</span>
      <h3 className="text-lg font-bold text-emerald-100 font-serif-romance mt-2">
        Buka Restaurant & The FaceTime Rescue
      </h3>
      <p className="text-xs text-emerald-300/80 mt-1 mb-4">
        Match the memories from our Buka date when guys were staring at you in that green dress!
      </p>

      <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs">
        {cardsData.map((c) => {
          const isFlipped = flipped.includes(c.id) || matched.includes(c.pairId);
          return (
            <button
              key={c.id}
              onClick={() => handleCardClick(c.id, c.pairId)}
              className={`h-22 rounded-xl border flex flex-col items-center justify-center p-2 transition-all duration-300 shadow-md ${
                isFlipped
                  ? 'bg-emerald-900/60 border-emerald-400 text-emerald-100 scale-102'
                  : 'bg-stone-900/80 hover:bg-stone-800 border-emerald-500/30 text-emerald-400/60'
              }`}
            >
              {isFlipped ? (
                <>
                  <span className="text-2xl mb-1">{c.icon}</span>
                  <span className="text-[10px] font-bold text-emerald-200 leading-tight">
                    {c.name}
                  </span>
                </>
              ) : (
                <span className="text-xl">🍃</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-xs font-semibold text-emerald-200">
        Pairs Matched: {matched.length} / 3
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// STAGE 11: Pink Tea Boba Crafter
// -------------------------------------------------------------
export const Stage11BobaRecipe: React.FC<StageGameProps> = ({ onComplete }) => {
  const steps = [
    { id: 'tea', label: '1. Jasmine Milk Tea', icon: '🧋' },
    { id: 'tapioca', label: '2. Chewy Tapioca Pearls', icon: '⚫' },
    { id: 'sweet', label: '3. Brown Sugar Sweetness', icon: '🍯' },
    { id: 'love', label: '4. 100% Love & Extra Hugs', icon: '💖' },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const handleAdd = () => {
    playPop();
    const next = currentStep + 1;
    setCurrentStep(next);
    if (next >= steps.length) {
      playSuccess();
      setTimeout(onComplete, 700);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto text-center py-2">
      <span className="text-3xl">🧋</span>
      <h3 className="text-lg font-bold text-pink-100 font-serif-romance mt-2">
        Pink Tea Boba Mixology
      </h3>
      <p className="text-xs text-pink-300/80 mt-1 mb-4">
        Craft our custom sweet boba drink step-by-step!
      </p>

      {/* Cup Visual */}
      <div className="relative w-36 h-48 rounded-b-3xl rounded-t-lg bg-pink-950/40 border-2 border-pink-400/40 shadow-xl overflow-hidden flex flex-col justify-end p-2 mb-4">
        {/* Boba straw */}
        <div className="absolute top-0 right-8 w-4 h-24 bg-pink-500/80 -rotate-12 rounded-full border border-pink-300" />

        {/* Filling layers */}
        {currentStep >= 1 && <div className="w-full h-8 bg-amber-700/60 rounded-t-lg mb-1" />}
        {currentStep >= 2 && (
          <div className="flex justify-around mb-1">
            <span className="text-xs">⚫</span>
            <span className="text-xs">⚫</span>
            <span className="text-xs">⚫</span>
          </div>
        )}
        {currentStep >= 3 && <div className="w-full h-10 bg-amber-500/40 rounded-t-lg mb-1" />}
        {currentStep >= 4 && (
          <div className="text-center text-xs font-bold text-pink-200 animate-pulse">
            💖 100% Brewed with Love!
          </div>
        )}
      </div>

      {currentStep < steps.length ? (
        <button
          onClick={handleAdd}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>{steps[currentStep].icon}</span>
          <span>Add {steps[currentStep].label}</span>
        </button>
      ) : (
        <div className="text-xs font-bold text-emerald-300">Drink perfected! Enjoying together...</div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// STAGE 12: Cheeky Silliness Slider
// -------------------------------------------------------------
export const Stage12MoodSlider: React.FC<StageGameProps> = ({ onComplete }) => {
  const [val, setVal] = useState(10);
  const isCompletedRef = useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCompletedRef.current) return;
    const v = Number(e.target.value);
    setVal(v);
    if (v >= 95 && !isCompletedRef.current) {
      isCompletedRef.current = true;
      playSuccess();
      setTimeout(onComplete, 600);
    } else {
      playClick();
    }
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto text-center py-2">
      <span className="text-3xl">😜</span>
      <h3 className="text-lg font-bold text-rose-100 font-serif-romance mt-2">
        The Goofy & Cheeky Side
      </h3>
      <p className="text-xs text-rose-300/80 mt-1 mb-5">
        Slide the mood meter to 100% to capture our inside-joke laugh!
      </p>

      <div className="w-48 h-48 rounded-full border-4 border-rose-400/40 bg-gradient-to-br from-rose-950 via-stone-900 to-rose-900 flex items-center justify-center shadow-2xl mb-4">
        <div className="text-center">
          <div className="text-6xl mb-2 transition-transform" style={{ transform: `scale(${0.8 + val * 0.005})` }}>
            {val < 40 ? '🙂' : val < 80 ? '😏' : '🤪'}
          </div>
          <span className="text-xs font-bold text-rose-200">
            {val < 40 ? 'Serious Date Mode' : val < 80 ? 'Playful Smirk' : 'Maximum Goofiness!'}
          </span>
        </div>
      </div>

      <div className="w-full px-2">
        <input
          type="range"
          min="0"
          max="100"
          value={val}
          onChange={handleChange}
          className="w-full h-2.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
        />
        <div className="mt-2 text-xs font-bold text-rose-300">{val}% Silliness</div>
      </div>
    </div>
  );
};
