export interface StageData {
  id: number;
  photoNumber: number;
  title: string;
  subtitle: string;
  theme: string;
  location: string;
  gameType:
    | 'luggage_pack'
    | 'heart_rhythm'
    | 'bubble_pop'
    | 'mirror_wipe'
    | 'trivia_kiss'
    | 'constellation'
    | 'focus_meter'
    | 'bangle_sequence'
    | 'golden_light'
    | 'card_match'
    | 'boba_recipe'
    | 'mood_slider'
    | 'polaroid_shake'
    | 'location_quiz'
    | 'sobolo_straw'
    | 'word_scramble'
    | 'car_drive'
    | 'sliding_puzzle';
  memoryCaption: string;
  loveNote: string;
  trivia?: {
    question: string;
    options: string[];
    correctIndex: number;
    hint: string;
    explanation: string;
  };
  visualPrompt: {
    title: string;
    tagline: string;
    vibe: string;
    colors: string[];
  };
}

export interface CustomSettings {
  herName: string;
  hisName: string;
  apologyLetter: string;
  customQuestions: Record<number, string>;
  customNotes: Record<number, string>;
}
