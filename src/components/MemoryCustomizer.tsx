import React, { useState } from 'react';
import { STAGES } from '../data/stagesData';
import { StageData } from '../types';
import { playSuccess, playClick } from '../utils/audio';
import { X, Check, Edit2, Sparkles, Heart } from 'lucide-react';

interface MemoryCustomizerProps {
  stages: StageData[];
  onUpdateStages: (newStages: StageData[]) => void;
  onClose: () => void;
}

export const MemoryCustomizer: React.FC<MemoryCustomizerProps> = ({
  stages,
  onUpdateStages,
  onClose,
}) => {
  const [selectedStageId, setSelectedStageId] = useState(1);
  const [editedStages, setEditedStages] = useState<StageData[]>([...stages]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentStage = editedStages.find((s) => s.id === selectedStageId) || editedStages[0];

  const handleFieldChange = (field: keyof StageData, value: string) => {
    const updated = editedStages.map((s) => {
      if (s.id === selectedStageId) {
        return { ...s, [field]: value };
      }
      return s;
    });
    setEditedStages(updated);
  };

  const handleTriviaChange = (field: string, value: string | number) => {
    const updated = editedStages.map((s) => {
      if (s.id === selectedStageId && s.trivia) {
        return {
          ...s,
          trivia: {
            ...s.trivia,
            [field]: value,
          },
        };
      }
      return s;
    });
    setEditedStages(updated);
  };

  const handleSave = () => {
    playSuccess();
    onUpdateStages(editedStages);
    localStorage.setItem('custom_stages_data_v2', JSON.stringify(editedStages));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all memory captions and questions to default?')) {
      playClick();
      setEditedStages(STAGES);
      onUpdateStages(STAGES);
      localStorage.removeItem('custom_stages_data_v2');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-stone-900 border border-rose-500/30 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-rose-500/20 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-romance text-lg sm:text-xl font-bold text-rose-100">
                Customize Memories & Questions
              </h3>
              <p className="text-xs text-rose-300/80">
                Personalize any note, location, or question before she plays
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

        {savedSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Memories and questions saved successfully!</span>
          </div>
        )}

        {/* Stage Selector Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-thin">
          {editedStages.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStageId(s.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedStageId === s.id
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/50 scale-105'
                  : 'bg-stone-800 hover:bg-stone-700 text-rose-300 border border-rose-500/20'
              }`}
            >
              #{s.id} {s.subtitle}
            </button>
          ))}
        </div>

        {/* Selected Stage Editor Form */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-200 mb-1">
                Stage Subtitle:
              </label>
              <input
                type="text"
                value={currentStage.subtitle}
                onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-rose-500/30 bg-stone-950 text-xs text-rose-100 focus:outline-none focus:ring-1 focus:ring-rose-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-rose-200 mb-1">
                Date Location:
              </label>
              <input
                type="text"
                value={currentStage.location}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-rose-500/30 bg-stone-950 text-xs text-rose-100 focus:outline-none focus:ring-1 focus:ring-rose-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-200 mb-1">
              Memory Caption (Revealed upon completing the mini-game):
            </label>
            <textarea
              rows={2}
              value={currentStage.memoryCaption}
              onChange={(e) => handleFieldChange('memoryCaption', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-rose-500/30 bg-stone-950 text-xs text-rose-100 focus:outline-none focus:ring-1 focus:ring-rose-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-200 mb-1">
              Love Note Quote (Heartfelt takeaway):
            </label>
            <input
              type="text"
              value={currentStage.loveNote}
              onChange={(e) => handleFieldChange('loveNote', e.target.value)}
              className="w-full p-2.5 rounded-xl border border-rose-500/30 bg-stone-950 text-xs text-rose-100 focus:outline-none focus:ring-1 focus:ring-rose-400 font-handwriting text-sm"
            />
          </div>

          {currentStage.trivia && (
            <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 space-y-3">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Trivia Question for Stage #{currentStage.id}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-rose-200 mb-1">
                  Question:
                </label>
                <input
                  type="text"
                  value={currentStage.trivia.question}
                  onChange={(e) => handleTriviaChange('question', e.target.value)}
                  className="w-full p-2 rounded-lg border border-rose-500/30 bg-stone-950 text-xs text-rose-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-rose-200 mb-1">
                  Correct Option Answer:
                </label>
                <input
                  type="text"
                  value={currentStage.trivia.options[currentStage.trivia.correctIndex]}
                  onChange={(e) => {
                    const newOpts = [...currentStage.trivia!.options];
                    newOpts[currentStage.trivia!.correctIndex] = e.target.value;
                    handleTriviaChange('options', newOpts as unknown as string);
                  }}
                  className="w-full p-2 rounded-lg border border-rose-500/30 bg-stone-950 text-xs text-rose-100"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-rose-500/20 flex justify-between items-center">
          <button
            onClick={handleResetDefaults}
            className="text-xs text-stone-400 hover:text-stone-300 underline"
          >
            Reset to Defaults
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-rose-100 font-bold text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
