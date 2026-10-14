import React, { useState, useEffect, useRef } from 'react';
import { StageData } from '../../types';
import { playClick, playPop, playSuccess, playKiss } from '../../utils/audio';
import { Check, Sparkles, Heart, HelpCircle, MapPin, Camera, RefreshCw } from 'lucide-react';

interface StageGameProps {
  stage: StageData;
  onComplete: () => void;
}

// -------------------------------------------------------------
// STAGE 13: Instant Polaroid Film Shake
// -------------------------------------------------------------
export const Stage13PolaroidShake: React.FC<StageGameProps> = ({ onComplete }) => {
  const [shaken, setShaken] = useState(0);
  const isCompletedRef = useRef(false);

  const handleShake = () => {
    if (isCompletedRef.current) return;
    playPop();
    const next = shaken + 15;
    setShaken(next);
    if (next >= 100 && !isCompletedRef.current) {
      isCompletedRef.current = true;
      playSuccess();
      setTimeout(onComplete, 600);
    }
  };

  const opacity = Math.min(1, shaken / 100);

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto text-center py-2">
      <span className="text-3xl">📸</span>
      <h3 className="text-lg font-bold text-rose-100 font-serif-romance mt-2">
        Develop the Twin Polaroids
      </h3>
      <p className="text-xs text-rose-300/80 mt-1 mb-4">
        Tap &quot;Shake Film&quot; repeatedly to develop the instant snapshots!
      </p>

      {/* Polaroid visual */}
      <div className="w-52 bg-stone-100 p-3 pt-3 pb-8 rounded shadow-2xl border border-stone-300 transform -rotate-2 hover:rotate-0 transition-transform">
        <div className="w-full aspect-square bg-stone-900 rounded overflow-hidden flex items-center justify-center relative">
          <div
            className="w-full h-full flex flex-col items-center justify-center p-2 text-center transition-opacity duration-300 bg-gradient-to-br from-rose-900 to-amber-950"
            style={{ opacity }}
          >
            <span className="text-4xl mb-1">💑</span>
            <span className="text-xs font-bold text-white font-serif-romance">Our Polaroid Memory</span>
            <span className="text-[10px] text-rose-200">Date night smiles</span>
          </div>
        </div>
        <div className="mt-3 text-center text-xs font-handwriting text-stone-700 font-bold">
          Us, forever & always ❤️
        </div>
      </div>

      <button
        onClick={handleShake}
        className="w-full max-w-xs mt-6 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <Camera className="w-4 h-4" />
        Shake Film! ({Math.min(100, shaken)}%)
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// STAGE 14: Accra Heritage / Kwame Nkrumah Memorial Quiz
// -------------------------------------------------------------
export const Stage14LocationQuiz: React.FC<StageGameProps> = ({ stage, onComplete }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const trivia = stage.trivia || {
    question: 'Whose historic portraits stood tall behind us in this beautiful Accra photo?',
    options: [
      'Dr. Kwame Nkrumah (Kwame Nkrumah Memorial Park)',
      'Nelson Mandela',
      'Kofi Annan',
      'Yaa Asantewaa',
    ],
    correctIndex: 0,
    hint: 'Ghana’s first President and leading Pan-Africanist!',
    explanation: 'Kwame Nkrumah Memorial Park in Accra! One of our most memorable cultural walks.',
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
      <span className="text-3xl">🏛️</span>
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
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                {option}
              </span>
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
// STAGE 15: Pizzaman Run & Hungry Faces
// -------------------------------------------------------------
export const Stage15SoboloStraw: React.FC<StageGameProps> = ({ onComplete }) => {
  const [slices, setSlices] = useState(0);
  const isCompletedRef = useRef(false);

  const handleFeed = () => {
    if (isCompletedRef.current) return;
    playPop();
    const next = slices + 1;
    setSlices(next);
    if (next >= 5 && !isCompletedRef.current) {
      isCompletedRef.current = true;
      playSuccess();
      setTimeout(onComplete, 600);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto text-center py-2">
      <span className="text-3xl">🍕</span>
      <h3 className="text-lg font-bold text-amber-200 font-serif-romance mt-2">
        Pizzaman Run & Hungry Faces
      </h3>
      <p className="text-xs text-amber-300/80 mt-1 mb-4">
        I was so hungry at Pizzaman I did not even want to take a picture! Tap to feed the hungry boy 5 slices!
      </p>

      {/* Pizza Box Visual */}
      <div className="relative w-48 h-48 rounded-2xl border-2 border-amber-500/40 bg-stone-900/80 overflow-hidden flex flex-col items-center justify-center p-3 shadow-2xl mb-4">
        <div className="text-5xl mb-2 transition-transform duration-300">
          {slices === 0 ? '🤤' : slices < 3 ? '🍕' : slices < 5 ? '😋' : '🥰'}
        </div>
        <div className="text-xs font-bold text-amber-300">
          {slices === 0
            ? 'Starving at Pizzaman!'
            : slices < 3
            ? 'Eating fast...'
            : slices < 5
            ? 'Hunger subsiding...'
            : 'Full & smiling with Lerato!'}
        </div>
        <div className="flex gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <span
              key={idx}
              className={`text-sm transition-opacity ${idx < slices ? 'opacity-100 scale-110' : 'opacity-20'}`}
            >
              🍕
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={handleFeed}
        className="w-full max-w-xs py-3 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-amber-600 to-red-500 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <span>🍕</span>
        Feed a Slice to the Hungry Boy! ({slices}/5)
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// STAGE 16: Shots & Piña Coladas
// -------------------------------------------------------------
export const Stage16WordScramble: React.FC<StageGameProps> = ({ onComplete }) => {
  const targetWord = 'PINACOLADA';
  const initialTiles = ['P', 'O', 'I', 'L', 'N', 'A', 'A', 'C', 'D', 'A'];
  const [selectedLetters, setSelectedLetters] = useState<number[]>([]);
  const isCompletedRef = useRef(false);

  const handleTileClick = (index: number) => {
    if (selectedLetters.includes(index) || isCompletedRef.current) return;
    playClick();
    const updated = [...selectedLetters, index];
    setSelectedLetters(updated);

    const spelled = updated.map((i) => initialTiles[i]).join('');
    if (spelled === targetWord && !isCompletedRef.current) {
      isCompletedRef.current = true;
      playSuccess();
      setTimeout(onComplete, 600);
    }
  };

  const handleReset = () => {
    playClick();
    setSelectedLetters([]);
  };

  const currentSpelled = selectedLetters.map((i) => initialTiles[i]).join('');

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto text-center py-2">
      <span className="text-3xl">🍹</span>
      <h3 className="text-lg font-bold text-rose-100 font-serif-romance mt-2">
        Shots & Piña Coladas
      </h3>
      <p className="text-xs text-rose-300/80 mt-1 mb-4">
        Unscramble our signature drink discovered after taking shots together!
      </p>

      {/* Answer Slots */}
      <div className="flex flex-wrap gap-1 justify-center mb-5 max-w-xs">
        {targetWord.split('').map((char, idx) => {
          const filled = currentSpelled[idx];
          return (
            <div
              key={idx}
              className={`w-7 h-9 sm:w-8 sm:h-10 rounded-lg border flex items-center justify-center text-xs sm:text-sm font-bold shadow-md transition-all ${
                filled
                  ? 'bg-amber-500 text-stone-900 border-amber-300 scale-105'
                  : 'bg-stone-900/60 border-rose-500/30 text-rose-400'
              }`}
            >
              {filled || ''}
            </div>
          );
        })}
      </div>

      {/* Scrambled Available Tiles */}
      <div className="flex flex-wrap gap-1.5 justify-center max-w-xs mb-4">
        {initialTiles.map((char, idx) => {
          const isUsed = selectedLetters.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleTileClick(idx)}
              disabled={isUsed}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-bold text-xs sm:text-sm shadow transition-all ${
                isUsed
                  ? 'opacity-30 bg-stone-900 border border-stone-800'
                  : 'bg-rose-950/80 hover:bg-rose-900 border border-rose-400 text-rose-100 hover:scale-105 active:scale-95'
              }`}
            >
              {char}
            </button>
          );
        })}
      </div>

      {selectedLetters.length > 0 && currentSpelled !== targetWord && (
        <button
          onClick={handleReset}
          className="text-xs text-rose-300/80 hover:text-rose-200 underline mt-1"
        >
          Reset tiles
        </button>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// STAGE 17: Backseat Ride Home Heart Markers
// -------------------------------------------------------------
export const Stage17CarDrive: React.FC<StageGameProps> = ({ onComplete }) => {
  const [collected, setCollected] = useState(0);
  const isCompletedRef = useRef(false);

  const handleCollect = () => {
    if (isCompletedRef.current) return;
    playKiss();
    const next = collected + 1;
    setCollected(next);
    if (next >= 5 && !isCompletedRef.current) {
      isCompletedRef.current = true;
      playSuccess();
      setTimeout(onComplete, 600);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto text-center py-2">
      <span className="text-3xl">🚗</span>
      <h3 className="text-lg font-bold text-emerald-100 font-serif-romance mt-2">
        Backseat Ride Home
      </h3>
      <p className="text-xs text-emerald-300/80 mt-1 mb-4">
        Gather 5 road journey heart markers as we ride home side by side!
      </p>

      {/* Road View Visual */}
      <div className="relative w-64 h-52 rounded-2xl bg-gradient-to-b from-stone-950 via-slate-900 to-stone-900 border border-emerald-400/30 overflow-hidden p-3 flex flex-col justify-between items-center shadow-2xl">
        {/* Road center dashed line */}
        <div className="absolute top-0 bottom-0 w-1 border-r-2 border-dashed border-amber-400/30 pointer-events-none" />

        <div className="z-10 text-xs text-emerald-300 font-semibold bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-400/30">
          Highway Lights & Soft Whispers
        </div>

        <button
          onClick={handleCollect}
          className="z-10 w-16 h-16 rounded-full bg-rose-600/80 hover:bg-rose-500 border-2 border-rose-300 shadow-[0_0_20px_#f43f5e] flex items-center justify-center text-3xl animate-bounce hover:scale-110 active:scale-95 transition-all"
        >
          ❤️
        </button>

        <div className="z-10 text-xs text-slate-300">
          Leaning together in the backseat
        </div>
      </div>

      <div className="mt-4 text-xs font-semibold text-emerald-200">
        Journey Hearts Collected: {collected} / 5
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// STAGE 18: The Grand Love Mosaic (Final Sliding Heart Lock)
// -------------------------------------------------------------
export const Stage18SlidingPuzzle: React.FC<StageGameProps> = ({ onComplete }) => {
  // 3x3 grid tiles puzzle to arrange in order 1..8 with 1 empty space
  const [tiles, setTiles] = useState<number[]>([1, 2, 3, 4, 5, 0, 7, 8, 6]);
  const isCompletedRef = useRef(false);

  const handleTileClick = (index: number) => {
    if (isCompletedRef.current) return;
    const emptyIndex = tiles.indexOf(0);
    const validMoves = [
      emptyIndex - 1,
      emptyIndex + 1,
      emptyIndex - 3,
      emptyIndex + 3,
    ];

    // Check same row for horizontal moves
    const sameRow = Math.floor(index / 3) === Math.floor(emptyIndex / 3);
    const sameCol = index % 3 === emptyIndex % 3;

    if ((sameRow && Math.abs(index - emptyIndex) === 1) || (sameCol && Math.abs(index - emptyIndex) === 3)) {
      playClick();
      const newTiles = [...tiles];
      newTiles[emptyIndex] = tiles[index];
      newTiles[index] = 0;
      setTiles(newTiles);

      const checkSolved = newTiles.every((t, idx) => (idx === 8 ? t === 0 : t === idx + 1));
      if (checkSolved && !isCompletedRef.current) {
        isCompletedRef.current = true;
        playSuccess();
        setTimeout(onComplete, 800);
      }
    }
  };

  const handleQuickSolve = () => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    playSuccess();
    setTiles([1, 2, 3, 4, 5, 6, 7, 8, 0]);
    setTimeout(onComplete, 700);
  };

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto text-center py-2">
      <span className="text-3xl">👑</span>
      <h3 className="text-lg font-bold text-amber-200 font-serif-romance mt-2">
        The Grand Love Mosaic
      </h3>
      <p className="text-xs text-amber-300/80 mt-1 mb-4">
        Slide the golden mosaic tiles into place (1 to 8) to open the final heart lock!
      </p>

      {/* 3x3 Puzzle Grid */}
      <div className="grid grid-cols-3 gap-2 w-64 h-64 p-2 rounded-2xl bg-amber-950/40 border-2 border-amber-400/50 shadow-2xl">
        {tiles.map((tile, idx) => {
          if (tile === 0) {
            return (
              <div
                key={idx}
                className="w-full h-full rounded-xl bg-stone-900/40 border border-amber-900/30 flex items-center justify-center text-xs text-amber-500/20"
              >
                Key
              </div>
            );
          }
          return (
            <button
              key={idx}
              onClick={() => handleTileClick(idx)}
              className="w-full h-full rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 border border-amber-300 text-stone-900 font-extrabold text-lg shadow-md flex items-center justify-center transition-all active:scale-95"
            >
              {tile}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleQuickSolve}
          className="text-xs text-amber-300/80 hover:text-amber-200 underline flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Solve with Love Key
        </button>
      </div>
    </div>
  );
};
