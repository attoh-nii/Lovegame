import React, { useState } from 'react';
import { savePhoto, clearAllPhotos, readFileAsDataUrl, smartAssignFiles } from '../utils/photoStorage';
import { playSuccess, playClick, playPop } from '../utils/audio';
import { UploadCloud, Check, X, Trash2, Sparkles, AlertCircle, Heart } from 'lucide-react';
import { STAGES } from '../data/stagesData';

interface PhotoImporterProps {
  photos: Record<number, string>;
  onPhotosUpdated: (newPhotos: Record<number, string>) => void;
  onClose: () => void;
}

export const PhotoImporter: React.FC<PhotoImporterProps> = ({
  photos,
  onPhotosUpdated,
  onClose,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const { updatedMap, assignedCount } = await smartAssignFiles(files, photos);

    if (assignedCount > 0) {
      playSuccess();
      onPhotosUpdated(updatedMap);
      setStatusMessage(`✨ Successfully loaded ${assignedCount} photo(s)!`);
      setTimeout(() => setStatusMessage(null), 4000);
    } else {
      setStatusMessage('⚠️ Could not process files. Please select image files (e.g. 1.JPG, 2.jpg).');
    }
  };

  const handleSingleSlotUpload = async (stageNum: number, file: File) => {
    try {
      const dataUrl = await readFileAsDataUrl(file);
      await savePhoto(stageNum, dataUrl);
      const updatedMap = { ...photos, [stageNum]: dataUrl };
      playPop();
      onPhotosUpdated(updatedMap);
      setStatusMessage(`✨ Photo #${stageNum} updated!`);
      setTimeout(() => setStatusMessage(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClear = async () => {
    if (window.confirm('Clear all stored photos? You can re-upload them anytime.')) {
      playClick();
      await clearAllPhotos();
      onPhotosUpdated({});
      setStatusMessage('Photos cleared.');
    }
  };

  const loadedCount = Object.keys(photos).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-stone-900 border-2 border-rose-500/40 rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-rose-500/20 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 border border-rose-400/30 flex items-center justify-center text-white shadow-lg">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-serif-romance text-lg sm:text-xl font-bold text-rose-100">
                Lerato & Precious Egg Memories Vault
              </h3>
              <p className="text-xs text-rose-300/80">
                {loadedCount} of 18 photos loaded & ready
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-rose-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alert */}
        {statusMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-400/40 text-rose-200 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) {
              handleFiles(e.dataTransfer.files);
            }
          }}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
            isDragging
              ? 'border-rose-400 bg-rose-950/50 scale-101'
              : 'border-rose-500/30 hover:border-rose-400/60 bg-stone-950/50'
          }`}
        >
          <UploadCloud className="w-10 h-10 mx-auto text-rose-400 mb-2 animate-bounce" />
          <h4 className="text-base font-bold text-rose-100 font-serif-romance">
            Select or Drop Your 18 Photos Here (1.JPG - 18.JPG)
          </h4>
          <p className="text-xs text-rose-300/80 mt-1 max-w-md mx-auto">
            Select all 18 photos at once from your phone or laptop! The app will automatically match &ldquo;1.JPG&rdquo; through &ldquo;18.JPG&rdquo; to each stage reward.
          </p>

          <label className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm cursor-pointer shadow-xl active:scale-95 transition-all">
            <UploadCloud className="w-5 h-5" />
            <span>Choose 18 Photos from Device</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
          </label>
        </div>

        {/* 18 Slots Grid Preview */}
        <div className="mt-5 overflow-y-auto flex-1 pr-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-200">
              18 Stage Photo Slots:
            </span>
            {loadedCount > 0 && (
              <button
                onClick={handleClear}
                className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 underline"
              >
                <Trash2 className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {STAGES.map((s) => {
              const hasPhoto = Boolean(photos[s.photoNumber]);
              return (
                <label
                  key={s.id}
                  className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center p-1 cursor-pointer transition-all ${
                    hasPhoto
                      ? 'border-emerald-500/50 bg-stone-900 overflow-hidden ring-1 ring-emerald-500/30'
                      : 'border-rose-500/20 bg-stone-950/60 hover:bg-stone-900'
                  }`}
                  title={`Slot ${s.photoNumber}: ${s.subtitle} - Tap to select/replace`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleSingleSlotUpload(s.photoNumber, e.target.files[0]);
                      }
                    }}
                  />

                  {hasPhoto ? (
                    <>
                      <img
                        src={photos[s.photoNumber]}
                        alt={`Memory ${s.photoNumber}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute top-1 left-1 bg-black/70 rounded px-1 text-[9px] font-bold text-white backdrop-blur-xs">
                        #{s.photoNumber}
                      </div>
                      <div className="absolute bottom-1 right-1 bg-emerald-600 rounded-full p-0.5 text-white shadow">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-1 flex flex-col items-center justify-center">
                      <span className="text-xs font-bold text-rose-300">#{s.photoNumber}</span>
                      <p className="text-[9px] text-rose-400/70 leading-tight truncate max-w-[65px] mt-0.5">
                        {s.theme}
                      </p>
                      <span className="text-[8px] text-amber-300 mt-1 font-semibold">+ Add</span>
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-rose-500/20 flex justify-between items-center">
          <span className="text-[11px] text-rose-300/70">
            Photos stay saved in your device&apos;s browser database
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow transition-all"
          >
            Ready to Play!
          </button>
        </div>
      </div>
    </div>
  );
};
