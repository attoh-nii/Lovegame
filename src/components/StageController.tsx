import React from 'react';
import { StageData } from '../types';
import {
  Stage1Luggage,
  Stage2HeartRhythm,
  Stage3BubblePop,
  Stage4MirrorWipe,
  Stage5TriviaKiss,
  Stage6Constellation,
} from './stages/StageGames';
import {
  Stage7FocusMeter,
  Stage8BangleSequence,
  Stage9GoldenLight,
  Stage10CardMatch,
  Stage11BobaRecipe,
  Stage12MoodSlider,
} from './stages/StageGames2';
import {
  Stage13PolaroidShake,
  Stage14LocationQuiz,
  Stage15SoboloStraw,
  Stage16WordScramble,
  Stage17CarDrive,
  Stage18SlidingPuzzle,
} from './stages/StageGames3';
import { FastForward } from 'lucide-react';
import { playSuccess } from '../utils/audio';

interface StageControllerProps {
  stage: StageData;
  onComplete: () => void;
}

export const StageController: React.FC<StageControllerProps> = ({ stage, onComplete }) => {
  const handleSkip = () => {
    playSuccess();
    setTimeout(onComplete, 50);
  };

  const renderGame = () => {
    switch (stage.gameType) {
      case 'luggage_pack':
        return <Stage1Luggage key={stage.id} stage={stage} onComplete={onComplete} />;
      case 'heart_rhythm':
        return <Stage2HeartRhythm key={stage.id} stage={stage} onComplete={onComplete} />;
      case 'bubble_pop':
        return <Stage3BubblePop key={stage.id} stage={stage} onComplete={onComplete} />;
      case 'mirror_wipe':
        return <Stage4MirrorWipe key={stage.id} stage={stage} onComplete={onComplete} />;
      case 'trivia_kiss':
        return <Stage5TriviaKiss key={stage.id} stage={stage} onComplete={onComplete} />;
      case 'constellation':
        return <Stage6Constellation key={stage.id} stage={stage} onComplete={onComplete} />;
      case 'focus_meter':
        return <Stage7FocusMeter key={stage.id} stage={stage} onComplete={onComplete} />;
      case 'bangle_sequence':
        return <Stage8BangleSequence key={stage.id} stage={stage} onComplete={onComplete} />;
      case 'golden_light':
        return <Stage9GoldenLight key={stage.id} stage={stage} onComplete={onComplete} />;
      case 'card_match':
        return <Stage10CardMatch key={stage.id} stage={stage} onComplete={onComplete} />;
      case 'boba_recipe':
        return <Stage11BobaRecipe key={stage.id} stage={stage} onComplete={onComplete} />;
      case 'mood_slider':
        return <Stage12MoodSlider key={stage.id} stage={stage} onComplete={onComplete} />;
      case 'polaroid_shake':
        return <Stage13PolaroidShake key={stage.id} stage={stage} onComplete={onComplete} />;
      case 'location_quiz':
        return <Stage14LocationQuiz key={stage.id} stage={stage} onComplete={onComplete} />;
      case 'sobolo_straw':
        return <Stage15SoboloStraw key={stage.id} stage={stage} onComplete={onComplete} />;
      case 'word_scramble':
        return <Stage16WordScramble key={stage.id} stage={stage} onComplete={onComplete} />;
      case 'car_drive':
        return <Stage17CarDrive key={stage.id} stage={stage} onComplete={onComplete} />;
      case 'sliding_puzzle':
        return <Stage18SlidingPuzzle key={stage.id} stage={stage} onComplete={onComplete} />;
      default:
        return <Stage1Luggage key={stage.id} stage={stage} onComplete={onComplete} />;
    }
  };

  return (
    <div key={stage.id} className="w-full flex flex-col items-center">
      {renderGame()}

      {/* Gentle skip/advance helper */}
      <div className="mt-6 pt-4 border-t border-rose-500/10 w-full flex justify-end">
        <button
          onClick={handleSkip}
          className="text-[11px] text-rose-300/60 hover:text-rose-200 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg hover:bg-rose-950/40"
          title="Instant Reveal Memory"
        >
          <span>Reveal Memory</span>
          <FastForward className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
