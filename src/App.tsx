/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { STAGES } from './data/stagesData';
import { StageData } from './types';
import { getAllPhotos } from './utils/photoStorage';
import { startBgm, stopBgm, getIsBgmPlaying, playClick } from './utils/audio';
import { StageController } from './components/StageController';
import { RewardModal } from './components/RewardModal';
import { ScrapbookView } from './components/ScrapbookView';
import { PhotoImporter } from './components/PhotoImporter';
import { MemoryCustomizer } from './components/MemoryCustomizer';
import { GrandFinale } from './components/GrandFinale';
import {
  Heart,
  Music,
  VolumeX,
  BookOpen,
  UploadCloud,
  Edit2,
  Sparkles,
  MapPin,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

export default function App() {
  const [stages, setStages] = useState<StageData[]>(() => {
    const saved = localStorage.getItem('custom_stages_data_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return STAGES;
      }
    }
    return STAGES;
  });

  const [currentStageIndex, setCurrentStageIndex] = useState<number>(() => {
    const saved = localStorage.getItem('current_stage_idx');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [unlockedStages, setUnlockedStages] = useState<number[]>(() => {
    const saved = localStorage.getItem('unlocked_stages');
    return saved !== null ? JSON.parse(saved) : [];
  });

  const [photos, setPhotos] = useState<Record<number, string>>({});
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showScrapbook, setShowScrapbook] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [isBgmOn, setIsBgmOn] = useState(false);
  const [showFinale, setShowFinale] = useState(false);

  // Load photos from IndexedDB
  useEffect(() => {
    getAllPhotos().then((loaded) => {
      setPhotos(loaded);
    });
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem('current_stage_idx', currentStageIndex.toString());
    localStorage.setItem('unlocked_stages', JSON.stringify(unlockedStages));
  }, [currentStageIndex, unlockedStages]);

  const currentStage = stages[currentStageIndex] || stages[0];
  const isAllComplete = unlockedStages.length === stages.length;

  const handleStageComplete = () => {
    // Defer state update to next microtask/tick to completely avoid render-phase collisions
    setTimeout(() => {
      setUnlockedStages((prev) => {
        if (!prev.includes(currentStage.id)) {
          return [...prev, currentStage.id];
        }
        return prev;
      });
      setShowRewardModal(true);
    }, 10);
  };

  const handleNextStage = () => {
    setShowRewardModal(false);
    if (currentStageIndex === stages.length - 1) {
      setShowFinale(true);
    } else {
      setCurrentStageIndex((prev) => Math.min(stages.length - 1, prev + 1));
    }
  };

  const handleToggleBgm = () => {
    if (isBgmOn) {
      stopBgm();
      setIsBgmOn(false);
    } else {
      startBgm();
      setIsBgmOn(true);
    }
  };

  const handleRestartJourney = () => {
    if (window.confirm('Restart the journey from Stage 1? (Your unlocked photos in the Scrapbook will remain saved!)')) {
      playClick();
      setCurrentStageIndex(0);
      setShowFinale(false);
    }
  };

  const loadedPhotosCount = Object.keys(photos).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-950 via-rose-950 to-stone-950 text-rose-50 flex flex-col font-sans selection:bg-rose-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient background glow stars & hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-rose-600/10 blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/2 right-5 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 rounded-full bg-pink-600/10 blur-3xl animate-pulse-glow" />
      </div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-md border-b border-rose-500/20 px-3 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          {/* Brand & Title */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => setShowFinale(false)}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-950/80">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold font-serif-romance text-white leading-tight">
                Our Journey
              </h1>
              <p className="text-[10px] sm:text-xs text-rose-300/80 flex items-center gap-1">
                <span>18 Steps to You</span>
                <span className="text-rose-400">&bull;</span>
                <span className="font-semibold text-amber-300">
                  {unlockedStages.length}/18 Unlocked
                </span>
              </p>
            </div>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Music Toggle */}
            <button
              onClick={handleToggleBgm}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all border ${
                isBgmOn
                  ? 'bg-rose-500/30 text-rose-200 border-rose-400/40 shadow'
                  : 'bg-stone-900/80 text-rose-300/70 border-rose-500/20 hover:text-rose-200'
              }`}
              title={isBgmOn ? 'Mute romantic ambient music' : 'Play romantic ambient music'}
            >
              {isBgmOn ? <Music className="w-4 h-4 text-rose-300 animate-spin" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden md:inline">{isBgmOn ? 'Music On' : 'Music Off'}</span>
            </button>

            {/* Scrapbook Button */}
            <button
              onClick={() => {
                playClick();
                setShowScrapbook(true);
              }}
              className="px-2.5 sm:px-3 py-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-rose-200 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
              title="View unlocked scrapbook"
            >
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Scrapbook</span>
              <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded-full border border-rose-400/30">
                {unlockedStages.length}
              </span>
            </button>

            {/* Photo Importer Button */}
            <button
              onClick={() => {
                playClick();
                setShowImporter(true);
              }}
              className="px-2.5 sm:px-3 py-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-rose-200 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
              title="Import your 18 real photos"
            >
              <UploadCloud className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Photos Vault</span>
              <span className="text-[10px] bg-amber-950/80 text-amber-300 px-1.5 py-0.5 rounded-full border border-amber-400/30">
                {loadedPhotosCount}/18
              </span>
            </button>

            {/* Customize Button */}
            <button
              onClick={() => {
                playClick();
                setShowCustomizer(true);
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-rose-200 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
              title="Customize questions & notes"
            >
              <Edit2 className="w-4 h-4 text-rose-300" />
              <span className="hidden md:inline">Customize</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 z-10 flex flex-col items-center">
        {showFinale ? (
          /* Grand Finale & Apology Screen */
          <GrandFinale
            stages={stages}
            photos={photos}
            onOpenScrapbook={() => setShowScrapbook(true)}
            onRestart={handleRestartJourney}
          />
        ) : (
          /* Stage Gameplay Mode */
          <div className="w-full flex flex-col items-center">
            {/* Stage Progress Timeline Bar (1 to 18) */}
            <div className="w-full bg-stone-900/60 border border-rose-500/20 rounded-2xl p-3 sm:p-4 mb-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between text-xs font-bold text-rose-200 mb-2.5">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Stage {currentStage.id} of {stages.length}
                </span>
                <span className="text-amber-200/90 font-serif-romance">
                  {Math.round((unlockedStages.length / stages.length) * 100)}% Journey Completed
                </span>
              </div>

              {/* Step dots row */}
              <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
                {stages.map((st, idx) => {
                  const isCurrent = idx === currentStageIndex;
                  const isDone = unlockedStages.includes(st.id);
                  return (
                    <button
                      key={st.id}
                      onClick={() => {
                        playClick();
                        setCurrentStageIndex(idx);
                      }}
                      className={`h-7 w-7 sm:h-8 sm:w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-600/50 scale-110 ring-2 ring-amber-300'
                          : isDone
                          ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-400/50 hover:bg-emerald-800/80'
                          : 'bg-stone-900 text-rose-300/60 border border-rose-500/20 hover:bg-stone-800'
                      }`}
                      title={`Stage ${st.id}: ${st.subtitle}`}
                    >
                      {isDone ? '✓' : st.id}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Stage Card Container */}
            <div className="w-full bg-stone-900/80 border-2 border-rose-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden flex flex-col items-center">
              {/* Stage Sub-header */}
              <div className="text-center mb-6 max-w-lg">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 text-xs font-semibold border border-rose-400/30 mb-2">
                  <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
                  <span>{currentStage.theme}</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-pink-100 to-amber-100 font-serif-romance">
                  {currentStage.title}
                </h2>
                <p className="text-xs sm:text-sm text-rose-300/80 mt-1 flex items-center justify-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{currentStage.location}</span>
                </p>
              </div>

              {/* Interactive Game Arena */}
              <div className="w-full">
                <StageController
                  stage={currentStage}
                  onComplete={handleStageComplete}
                />
              </div>

              {/* Bottom stage jumper navigation */}
              <div className="w-full mt-6 pt-4 border-t border-rose-500/10 flex items-center justify-between text-xs text-rose-300/80">
                <button
                  onClick={() => {
                    playClick();
                    setCurrentStageIndex((p) => Math.max(0, p - 1));
                  }}
                  disabled={currentStageIndex === 0}
                  className="p-2 rounded-xl hover:bg-rose-950/40 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <span className="text-[11px] text-rose-400 font-serif-romance italic">
                  Memory #{currentStage.photoNumber}
                </span>

                <button
                  onClick={() => {
                    playClick();
                    setCurrentStageIndex((p) => Math.min(stages.length - 1, p + 1));
                  }}
                  disabled={currentStageIndex === stages.length - 1}
                  className="p-2 rounded-xl hover:bg-rose-950/40 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Helper Banner if user hasn't loaded real photos yet */}
            {/* Quick Helper Banner if user hasn't loaded real photos yet */}
            {loadedPhotosCount < 18 && (
              <div className="w-full mt-5 p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-stone-900 to-rose-950/60 border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-200 shadow-lg">
                <div className="flex items-center gap-2.5 text-center sm:text-left">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-400/40">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <p className="font-bold text-amber-100">
                      {loadedPhotosCount === 0
                        ? 'Load your 18 photos to see them revealed at every stage!'
                        : `${loadedPhotosCount}/18 Photos Loaded! Add the rest anytime.`}
                    </p>
                    <p className="text-[11px] text-amber-300/80">
                      Pick &ldquo;1.JPG&rdquo; through &ldquo;18.JPG&rdquo; from your device — they will appear as your stage rewards!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowImporter(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-stone-950 font-extrabold text-xs shadow-md shrink-0 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <UploadCloud className="w-4 h-4 text-stone-950" />
                  <span>{loadedPhotosCount === 0 ? 'Load 18 Photos (1-18)' : 'Manage Photo Vault'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {/* 1. Stage Reward Photo Modal */}
      {showRewardModal && (
        <RewardModal
          stage={currentStage}
          photoUrl={photos[currentStage.photoNumber]}
          isLastStage={currentStageIndex === stages.length - 1}
          onNextStage={handleNextStage}
          allPhotos={photos}
          onPhotosUpdated={(newPhotos) => setPhotos(newPhotos)}
          onOpenScrapbook={() => {
            setShowRewardModal(false);
            setShowScrapbook(true);
          }}
        />
      )}

      {/* 2. Scrapbook Gallery Modal */}
      {showScrapbook && (
        <ScrapbookView
          stages={stages}
          photos={photos}
          unlockedStages={unlockedStages}
          onPhotosUpdated={(newPhotos) => setPhotos(newPhotos)}
          onSelectStage={(stageId) => {
            const idx = stages.findIndex((s) => s.id === stageId);
            if (idx !== -1) {
              setCurrentStageIndex(idx);
              setShowFinale(false);
              setShowScrapbook(false);
            }
          }}
          onClose={() => setShowScrapbook(false)}
        />
      )}

      {/* 3. Photo Vault & Importer Modal */}
      {showImporter && (
        <PhotoImporter
          photos={photos}
          onPhotosUpdated={(newPhotos) => setPhotos(newPhotos)}
          onClose={() => setShowImporter(false)}
        />
      )}

      {/* 4. Memory & Trivia Customizer Modal */}
      {showCustomizer && (
        <MemoryCustomizer
          stages={stages}
          onUpdateStages={(newStages) => setStages(newStages)}
          onClose={() => setShowCustomizer(false)}
        />
      )}
    </div>
  );
}
