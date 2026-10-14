import React, { useState } from 'react';
import { StageData } from '../types';
import { Heart, Sparkles, MapPin, Camera, Maximize2, X } from 'lucide-react';
import { savePhoto, readFileAsDataUrl } from '../utils/photoStorage';
import { playPop, playSuccess } from '../utils/audio';

interface PhotoDisplayProps {
  stage: StageData;
  photoUrl?: string | null;
  className?: string;
  isUnlocked?: boolean;
  showCaption?: boolean;
  onPhotoUploaded?: (photoNumber: number, dataUrl: string) => void;
}

export const PhotoDisplay: React.FC<PhotoDisplayProps> = ({
  stage,
  photoUrl,
  className = '',
  isUnlocked = true,
  showCaption = true,
  onPhotoUploaded,
}) => {
  const [localPhotoUrl, setLocalPhotoUrl] = useState<string | null>(photoUrl || null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Keep in sync with parent prop
  React.useEffect(() => {
    if (photoUrl) {
      setLocalPhotoUrl(photoUrl);
    }
  }, [photoUrl]);

  const activePhoto = localPhotoUrl || photoUrl;

  const handleDirectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const url = await readFileAsDataUrl(file);
        await savePhoto(stage.photoNumber, url);
        setLocalPhotoUrl(url);
        playSuccess();
        if (onPhotoUploaded) {
          onPhotoUploaded(stage.photoNumber, url);
        }
      } catch (err) {
        console.error('Error loading photo:', err);
      }
    }
  };

  return (
    <>
      <div
        className={`relative bg-stone-900/90 rounded-2xl p-3 sm:p-4 shadow-2xl border border-rose-500/20 text-rose-50 overflow-hidden flex flex-col ${className}`}
      >
        {/* Photo Frame Container */}
        <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-gradient-to-br from-stone-950 via-rose-950/40 to-stone-900 border border-white/10 flex items-center justify-center group shadow-inner">
          {activePhoto ? (
            <div className="relative w-full h-full">
              <img
                src={activePhoto}
                alt={stage.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Tap to Zoom Overlay Button */}
              <button
                onClick={() => setIsZoomed(true)}
                className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-rose-200 backdrop-blur-sm border border-white/20 transition-all opacity-80 hover:opacity-100"
                title="View full resolution photo"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Bespoke stylized illustration representation based on the real uploaded photo */
            <div
              className="w-full h-full p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${stage.visualPrompt.colors[0]}25, ${stage.visualPrompt.colors[1]}45, #0c0a09)`,
              }}
            >
              {/* Ambient decorative glowing shapes */}
              <div
                className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl opacity-40 pointer-events-none"
                style={{ backgroundColor: stage.visualPrompt.colors[0] }}
              />
              <div
                className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ backgroundColor: stage.visualPrompt.colors[1] }}
              />

              {/* Top Badge */}
              <div className="flex items-center justify-between z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-200 border border-rose-400/30 backdrop-blur-md">
                  <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                  Memory #{stage.photoNumber}
                </span>
                <span className="text-xs text-rose-300/80 font-medium tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  {stage.theme}
                </span>
              </div>

              {/* Center Scene Motif */}
              <div className="z-10 text-center my-auto py-2">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner mb-3 transform group-hover:rotate-3 transition-transform duration-300">
                  <StageIcon stageNumber={stage.photoNumber} />
                </div>
                <h4 className="text-base sm:text-lg font-bold font-serif-romance text-white drop-shadow-md">
                  {stage.visualPrompt.title}
                </h4>
                <p className="text-xs text-rose-200/90 font-medium max-w-xs mx-auto mt-1 line-clamp-2">
                  {stage.visualPrompt.tagline}
                </p>
              </div>

              {/* Bottom tag with direct photo selector */}
              <div className="z-10 flex items-center justify-between text-[11px] text-rose-300/80 border-t border-white/10 pt-2 gap-2">
                <span className="flex items-center gap-1 truncate max-w-[130px]">
                  <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                  {stage.location}
                </span>

                <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-amber-200 hover:text-white bg-gradient-to-r from-amber-600/80 to-rose-600/80 hover:from-amber-500 hover:to-rose-500 px-3 py-1.5 rounded-full border border-amber-300/40 shadow-lg transition-all active:scale-95">
                  <Camera className="w-3.5 h-3.5 text-amber-200" />
                  <span>Reveal Photo {stage.photoNumber}.JPG</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleDirectFile}
                  />
                </label>
              </div>
            </div>
          )}

          {/* Unlocked status ribbon */}
          {isUnlocked && (
            <div className="absolute top-3 right-3 bg-rose-600/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-lg flex items-center gap-1 border border-rose-400/40 z-20">
              <Heart className="w-3 h-3 fill-white" />
              Unlocked
            </div>
          )}
        </div>

        {/* Caption & Love Note */}
        {showCaption && (
          <div className="mt-3 px-1">
            <p className="text-xs sm:text-sm text-stone-200 font-medium leading-relaxed">
              {stage.memoryCaption}
            </p>
            <div className="mt-2.5 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs sm:text-sm font-handwriting italic flex items-start gap-2">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400 shrink-0 mt-0.5" />
              <span>&ldquo;{stage.loveNote}&rdquo;</span>
            </div>
          </div>
        )}
      </div>

      {/* Full-screen Zoom Modal */}
      {isZoomed && activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-3 sm:p-6"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center">
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute -top-10 right-0 p-2 text-rose-200 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activePhoto}
              alt={stage.title}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/20"
            />
            <p className="text-sm font-serif-romance text-rose-200 mt-3 text-center">
              {stage.title} &bull; {stage.location}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

// Stage specific decorative icons reflecting the scenes from photos 1 to 18
const StageIcon: React.FC<{ stageNumber: number }> = ({ stageNumber }) => {
  switch (stageNumber) {
    case 1:
      return <span className="text-3xl">🧳</span>; // Luggage / Elevator
    case 2:
      return <span className="text-3xl">💋</span>; // Lift kiss
    case 3:
      return <span className="text-3xl">🏊‍♀️</span>; // Pool splash
    case 4:
      return <span className="text-3xl">💃</span>; // Red dress
    case 5:
      return <span className="text-3xl">🌍</span>; // Africa earrings
    case 6:
      return <span className="text-3xl">✨</span>; // Twilight stars
    case 7:
      return <span className="text-3xl">🕶️</span>; // Amber sunglasses
    case 8:
      return <span className="text-3xl">🏛️</span>; // Kwame Nkrumah Memorial Park & History
    case 9:
      return <span className="text-3xl">🌅</span>; // Golden hour car ride
    case 10:
      return <span className="text-3xl">📱</span>; // Buka Restaurant & FaceTime call
    case 11:
      return <span className="text-3xl">🧋</span>; // Pink tea boba
    case 12:
      return <span className="text-3xl">😜</span>; // Cheeky playful glance
    case 13:
      return <span className="text-3xl">📸</span>; // Twin Polaroids
    case 14:
      return <span className="text-3xl">🇬🇭</span>; // Accra Heritage & Nkrumah Wall
    case 15:
      return <span className="text-3xl">🍕</span>; // Pizzaman Run
    case 16:
      return <span className="text-3xl">🍹</span>; // Shots & Piña Coladas
    case 17:
      return <span className="text-3xl">🚗</span>; // Ride home together
    case 18:
      return <span className="text-3xl">👑</span>; // Golden braids & royalty
    default:
      return <span className="text-3xl">❤️</span>;
  }
};
