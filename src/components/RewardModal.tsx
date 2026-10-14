import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { StageData } from '../types';
import { PhotoDisplay } from './PhotoDisplay';
import { playReveal, playSuccess } from '../utils/audio';
import { Heart, ArrowRight, Sparkles, BookOpen, UploadCloud, Check, Camera } from 'lucide-react';
import { smartAssignFiles, savePhoto, readFileAsDataUrl } from '../utils/photoStorage';

interface RewardModalProps {
  stage: StageData;
  photoUrl?: string | null;
  isLastStage: boolean;
  onNextStage: () => void;
  onOpenScrapbook: () => void;
  onPhotosUpdated?: (newPhotos: Record<number, string>) => void;
  allPhotos?: Record<number, string>;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  stage,
  photoUrl,
  isLastStage,
  onNextStage,
  onOpenScrapbook,
  onPhotosUpdated,
  allPhotos = {},
}) => {
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(photoUrl || null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    if (photoUrl) {
      setCurrentPhoto(photoUrl);
    }
  }, [photoUrl]);

  useEffect(() => {
    playReveal();

    // Trigger sweet confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#f59e0b', '#ffffff'],
    });
  }, [stage.id]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);

    if (fileArray.length === 1) {
      // Single file directly assigned to this stage
      try {
        const url = await readFileAsDataUrl(fileArray[0]);
        await savePhoto(stage.photoNumber, url);
        setCurrentPhoto(url);
        const updated = { ...allPhotos, [stage.photoNumber]: url };
        if (onPhotosUpdated) {
          onPhotosUpdated(updated);
        }
        playSuccess();
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } catch (err) {
        console.error(err);
      }
    } else {
      // Multiple files assigned smartly
      const { updatedMap, assignedCount } = await smartAssignFiles(fileArray, allPhotos);
      if (updatedMap[stage.photoNumber]) {
        setCurrentPhoto(updatedMap[stage.photoNumber]);
      }
      if (onPhotosUpdated) {
        onPhotosUpdated(updatedMap);
      }
      playSuccess();
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }
  };

  const handlePhotoUploadedFromCard = (photoNum: number, dataUrl: string) => {
    setCurrentPhoto(dataUrl);
    const updated = { ...allPhotos, [photoNum]: dataUrl };
    if (onPhotosUpdated) {
      onPhotosUpdated(updated);
    }
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-stone-900 border-2 border-rose-400/50 rounded-3xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative flex flex-col items-center text-center">
        {/* Glow halo */}
        <div className="absolute -top-12 -inset-x-0 mx-auto w-32 h-32 bg-rose-500/30 rounded-full blur-2xl pointer-events-none" />

        {/* Celebration Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-bold mb-3 shadow">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Stage #{stage.id} Complete!</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-200 to-amber-200 font-serif-romance mb-1">
          Memory #{stage.photoNumber} Revealed
        </h3>
        <p className="text-xs text-rose-300/80 mb-4">
          {stage.subtitle} &bull; {stage.location}
        </p>

        {/* Photo Display Card */}
        <div className="w-full mb-4">
          <PhotoDisplay
            stage={stage}
            photoUrl={currentPhoto}
            isUnlocked={true}
            showCaption={true}
            onPhotoUploaded={handlePhotoUploadedFromCard}
          />
        </div>

        {/* If no photo loaded yet, show easy 1-click select/drag prompt */}
        {!currentPhoto && (
          <div className="w-full mb-4 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-400/40 flex flex-col items-center gap-2">
            <span className="text-xs text-amber-200 font-semibold flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-amber-300" />
              <span>Bring this memory to life with your real photo!</span>
            </span>
            <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs cursor-pointer shadow-lg active:scale-95 transition-all flex items-center gap-2">
              <UploadCloud className="w-4 h-4" />
              <span>Select {stage.photoNumber}.JPG (or Pick All 18 Photos)</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </label>
            <span className="text-[10px] text-amber-300/80">
              Select your photo file ({stage.photoNumber}.JPG) from your phone or laptop
            </span>
          </div>
        )}

        {uploadSuccess && (
          <div className="mb-3 text-xs text-emerald-300 font-bold flex items-center gap-1 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-400/40">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            Photo revealed and saved permanently!
          </div>
        )}

        {/* Navigation Action Buttons */}
        <div className="w-full flex items-center justify-between gap-3 pt-2 border-t border-rose-500/20">
          <button
            onClick={onOpenScrapbook}
            className="px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-rose-200 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-rose-400" />
            <span>Open Scrapbook</span>
          </button>

          <button
            onClick={onNextStage}
            className="flex-1 py-2.5 px-5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span>{isLastStage ? 'Unlock Final Apology & Letter' : 'Continue to Next Stage'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
