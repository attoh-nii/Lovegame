import React, { useState } from 'react';
import { StageData } from '../types';
import { PhotoDisplay } from './PhotoDisplay';
import { Heart, X, Sparkles, MapPin, Play, Lock, CheckCircle2 } from 'lucide-react';
import { playClick } from '../utils/audio';

interface ScrapbookViewProps {
  stages: StageData[];
  photos: Record<number, string>;
  unlockedStages: number[];
  onSelectStage: (stageId: number) => void;
  onClose: () => void;
  onPhotosUpdated?: (newPhotos: Record<number, string>) => void;
}

export const ScrapbookView: React.FC<ScrapbookViewProps> = ({
  stages,
  photos,
  unlockedStages,
  onSelectStage,
  onClose,
  onPhotosUpdated,
}) => {
  const [selectedStage, setSelectedStage] = useState<StageData | null>(null);

  const handleCardClick = (stage: StageData) => {
    playClick();
    setSelectedStage(stage);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex flex-col items-center justify-start overflow-y-auto p-4 sm:p-6 animate-fadeIn">
      {/* Top Header */}
      <div className="w-full max-w-5xl flex items-center justify-between pb-4 border-b border-rose-500/20 mb-6">
        <div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200 font-serif-romance flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            Our 18-Photo Love Scrapbook
          </h2>
          <p className="text-xs sm:text-sm text-rose-300/80 mt-0.5">
            {unlockedStages.length} of 18 memories discovered
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-rose-200 border border-rose-500/30 transition-colors"
          title="Close scrapbook"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Grid of 18 Photos */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pb-12">
        {stages.map((stage) => {
          const isUnlocked = unlockedStages.includes(stage.id);
          const photoUrl = photos[stage.photoNumber] || null;

          return (
            <div
              key={stage.id}
              onClick={() => (isUnlocked ? handleCardClick(stage) : onSelectStage(stage.id))}
              className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border ${
                isUnlocked
                  ? 'border-rose-500/30 hover:border-rose-400 hover:scale-102 hover:shadow-xl shadow-rose-950/50'
                  : 'border-stone-800 bg-stone-950/60 opacity-60 hover:opacity-80'
              }`}
            >
              {isUnlocked ? (
                <div className="p-3 bg-stone-900/80 flex flex-col h-full">
                  <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden mb-3 bg-stone-950 border border-white/10">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={stage.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
                        style={{
                          background: `linear-gradient(135deg, ${stage.visualPrompt.colors[0]}33, ${stage.visualPrompt.colors[1]}55, #0a0a0a)`,
                        }}
                      >
                        <span className="text-3xl mb-1">📸</span>
                        <span className="text-xs font-bold text-white font-serif-romance">
                          {stage.visualPrompt.title}
                        </span>
                        <span className="text-[10px] text-rose-200/80">
                          {stage.location}
                        </span>
                      </div>
                    )}

                    <div className="absolute top-2 left-2 bg-rose-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur shadow flex items-center gap-1">
                      <Heart className="w-2.5 h-2.5 fill-white" />
                      #{stage.photoNumber}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-rose-100 font-serif-romance truncate">
                    {stage.subtitle}
                  </h4>
                  <p className="text-[11px] text-rose-300/80 line-clamp-2 mt-1">
                    {stage.memoryCaption}
                  </p>

                  <div className="mt-auto pt-2 flex items-center justify-between text-[11px] text-rose-400">
                    <span className="truncate max-w-[150px]">{stage.location}</span>
                    <span className="text-amber-300 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Unlocked
                    </span>
                  </div>
                </div>
              ) : (
                /* Locked Placeholder Card */
                <div className="aspect-4/3 p-4 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center mb-2">
                    <Lock className="w-5 h-5 text-stone-500" />
                  </div>
                  <span className="text-xs font-bold text-stone-400">
                    Memory #{stage.photoNumber}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-1">
                    Play Stage {stage.id} to unlock
                  </span>
                  <button className="mt-3 px-3 py-1 rounded-full bg-rose-950/60 text-rose-300 text-[10px] font-bold border border-rose-500/30 flex items-center gap-1 hover:bg-rose-900">
                    <Play className="w-2.5 h-2.5" /> Play Now
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail Modal for Selected Photo */}
      {selectedStage && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-rose-500/30 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedStage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-rose-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <PhotoDisplay
              stage={selectedStage}
              photoUrl={photos[selectedStage.photoNumber]}
              isUnlocked={true}
              showCaption={true}
              onPhotoUploaded={(photoNum, dataUrl) => {
                if (onPhotosUpdated) {
                  onPhotosUpdated({ ...photos, [photoNum]: dataUrl });
                }
              }}
            />

            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs text-rose-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {selectedStage.location}
              </span>

              <button
                onClick={() => {
                  onSelectStage(selectedStage.id);
                  setSelectedStage(null);
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Play className="w-3.5 h-3.5" />
                Replay Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
