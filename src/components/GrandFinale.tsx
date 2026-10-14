import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playFanfare, playSuccess, playClick } from '../utils/audio';
import { Heart, Sparkles, BookOpen, Edit3, Check, RefreshCw, Send } from 'lucide-react';
import { StageData } from '../types';

interface GrandFinaleProps {
  stages: StageData[];
  photos: Record<number, string>;
  onOpenScrapbook: () => void;
  onRestart: () => void;
}

export const GrandFinale: React.FC<GrandFinaleProps> = ({
  stages,
  photos,
  onOpenScrapbook,
  onRestart,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const defaultLetter = `Spending time with you and seeing you leave at the airport hurt a little but not so much because I knew I had met my wife and the next time I see her I will not let her leave.

I know you were hurt, but saying we needed time apart crushed me and I cannot let you go. I pray to God for blessing me with a wife, and I may have taken it for granted, but I would not make that mistake again.

I am truly, deeply sorry for the difficulty, stress, and pain I put you through these past few days. You did not deserve any of that frustration. You deserve patience, softness, peace, and a love that protects your heart at every single turn.

Looking back at every smile in these 18 photos — from our elevator laughs and sneaky kisses, to our time at Buka restaurant when you called me on FaceTime because guys were staring at you, our starving Pizzaman run when I was too hungry to take a photo, discovering our love for Piña Coladas after all those shots, and our shared love for history at Kwame Nkrumah Memorial Park — I know God made you my wife.

I love you with all my heart, Lerato.

Forever and always yours,
Precious Egg ❤️`;

  const [letterContent, setLetterContent] = useState<string>(() => {
    const saved = localStorage.getItem('custom_apology_note_v2');
    return saved || defaultLetter;
  });

  const [herName, setHerName] = useState<string>(() => {
    return localStorage.getItem('girlfriend_name') || 'Lerato';
  });

  const handleOpenEnvelope = () => {
    playFanfare();
    setIsOpen(true);

    // Launch celebratory romantic confetti
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#ec4899', '#fda4af', '#f59e0b', '#ffffff'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const handleSaveLetter = () => {
    playSuccess();
    localStorage.setItem('custom_apology_note_v2', letterContent);
    localStorage.setItem('girlfriend_name', herName);
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center p-3 sm:p-6">
      {/* Crown & Congratulatory Header */}
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/40 text-3xl shadow-[0_0_30px_rgba(251,191,36,0.3)] mb-3 animate-float-slow">
          👑
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-amber-100 font-serif-romance">
          All 18 Memories Unlocked!
        </h2>
        <p className="text-xs sm:text-sm text-rose-200/80 mt-1 max-w-md mx-auto">
          You completed every single stage of our journey. But the most important part is this final letter for you.
        </p>
      </div>

      {!isOpen ? (
        /* Sealed Envelope Interaction */
        <div className="relative w-full max-w-md bg-gradient-to-b from-stone-900 via-rose-950/70 to-stone-900 border-2 border-rose-400/40 rounded-3xl p-8 shadow-2xl overflow-hidden flex flex-col items-center">
          <div className="w-full flex justify-between items-center text-xs text-rose-300 mb-6">
            <span className="font-serif-romance tracking-wider uppercase text-[10px]">
              Special Delivery
            </span>
            <span className="flex items-center gap-1 font-handwriting text-base text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              For You, Always
            </span>
          </div>

          {/* Envelope Graphic */}
          <div className="relative w-48 h-36 bg-amber-100/90 rounded-xl shadow-xl flex items-center justify-center border border-amber-300/60 transform rotate-1">
            {/* Flap fold */}
            <div className="absolute top-0 inset-x-0 h-16 border-b-2 border-amber-300/40 clip-path-triangle bg-amber-200/80 rounded-t-xl" />

            {/* Wax Seal Stamp */}
            <button
              onClick={handleOpenEnvelope}
              className="z-10 w-16 h-16 rounded-full bg-gradient-to-br from-red-600 via-rose-700 to-red-900 shadow-2xl border-2 border-amber-300/60 flex flex-col items-center justify-center text-white font-serif-romance cursor-pointer hover:scale-110 active:scale-95 transition-all group"
            >
              <Heart className="w-6 h-6 fill-amber-200 text-amber-200 group-hover:scale-125 transition-transform" />
              <span className="text-[8px] font-bold tracking-widest uppercase text-amber-200">
                Open
              </span>
            </button>
          </div>

          <p className="mt-8 text-xs sm:text-sm text-rose-200 font-medium">
            Tap the wax heart seal to open your apology & love letter
          </p>
        </div>
      ) : (
        /* Unfolded Parchment Apology Letter */
        <div className="relative w-full bg-[#fdfbf7] text-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-amber-200/80 text-left overflow-hidden">
          {/* Subtle parchment watermark texture */}
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-rose-200/30 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-56 h-56 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />

          {/* Top Stamp & Edit Button */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">💌</span>
              <div>
                <h3 className="font-serif-romance text-base font-bold text-stone-900">
                  A Letter from My Heart
                </h3>
                <span className="text-[11px] text-stone-500 italic">
                  With all my love & sincerity
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center gap-1 border border-stone-300 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-stone-600" />
              <span>{isEditing ? 'Cancel Edit' : 'Personalize Letter'}</span>
            </button>
          </div>

          {isEditing ? (
            /* Customizer Editor Mode */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Her Name or Nickname:
                </label>
                <input
                  type="text"
                  value={herName}
                  onChange={(e) => setHerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                  placeholder="e.g. My Queen, Sweetheart, [Name]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Your Heartfelt Apology & Love Message:
                </label>
                <textarea
                  rows={8}
                  value={letterContent}
                  onChange={(e) => setLetterContent(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white font-sans leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleSaveLetter}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Check className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            /* Rendered Parchment Letter */
            <div>
              <div className="font-handwriting text-2xl sm:text-3xl text-rose-800 font-bold mb-4">
                To {herName},
              </div>

              <div className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-serif-romance">
                {letterContent}
              </div>

              {/* Decorative ending flourish */}
              <div className="mt-8 pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                <span className="flex items-center gap-1 font-serif-romance italic">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  18 Memories & Countless More to Come
                </span>
                <span className="font-handwriting text-lg text-rose-700 font-bold">
                  Always & Forever
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Post Letter Navigation Options */}
      {isOpen && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenScrapbook}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl flex items-center gap-2 active:scale-95 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Our 18-Photo Scrapbook</span>
          </button>

          <button
            onClick={onRestart}
            className="py-3 px-5 rounded-2xl bg-stone-900/80 hover:bg-stone-800 text-rose-200 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Play Journey Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
