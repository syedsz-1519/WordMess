import { create } from 'zustand';
import { WORDY_QUOTES, MESSY_TAUNTS } from '../constants/characterQuotes';

export type WordyEmotion = 'idle' | 'happy' | 'cheer' | 'sad';
export type MessyEmotion = 'idle' | 'laugh' | 'mock' | 'facepalm' | 'highfive';

export interface CharacterState {
  wordyEmotion: WordyEmotion;
  messyEmotion: MessyEmotion;
  wordyBubble: string | null;
  messyBubble: string | null;
  triggerWordy: (emotion: WordyEmotion, speech?: string | null) => void;
  triggerMessy: (emotion: MessyEmotion, speech?: string | null) => void;
  triggerWin: () => void;
  triggerLoss: () => void;
  resetMascots: () => void;
}

let wordyTimeoutId: any = null;
let messyTimeoutId: any = null;

export const useCharacterStore = create<CharacterState>((set) => ({
  wordyEmotion: 'idle',
  messyEmotion: 'idle',
  wordyBubble: null,
  messyBubble: null,

  triggerWordy: (emotion, speech = null) => {
    if (wordyTimeoutId) clearTimeout(wordyTimeoutId);
    
    // Choose random speech if speech is true/default request
    let bubbleText = speech;
    if (speech === 'random') {
      bubbleText = WORDY_QUOTES[Math.floor(Math.random() * WORDY_QUOTES.length)];
    }

    set({ wordyEmotion: emotion, wordyBubble: bubbleText });

    wordyTimeoutId = setTimeout(() => {
      set({ wordyEmotion: 'idle', wordyBubble: null });
    }, 2000);
  },

  triggerMessy: (emotion, speech = null) => {
    if (messyTimeoutId) clearTimeout(messyTimeoutId);

    let bubbleText = speech;
    if (speech === 'random') {
      bubbleText = MESSY_TAUNTS[Math.floor(Math.random() * MESSY_TAUNTS.length)];
    }

    set({ messyEmotion: emotion, messyBubble: bubbleText });

    messyTimeoutId = setTimeout(() => {
      set({ messyEmotion: 'idle', messyBubble: null });
    }, 2000);
  },

  triggerWin: () => {
    if (wordyTimeoutId) clearTimeout(wordyTimeoutId);
    if (messyTimeoutId) clearTimeout(messyTimeoutId);

    set({
      wordyEmotion: 'cheer',
      messyEmotion: 'highfive',
      wordyBubble: "Victory! We did it! 🎉",
      messyBubble: "High five! Not bad! 🖐️"
    });

    const resetTimer = setTimeout(() => {
      set({
        wordyEmotion: 'idle',
        messyEmotion: 'idle',
        wordyBubble: null,
        messyBubble: null
      });
    }, 3000);

    wordyTimeoutId = resetTimer;
    messyTimeoutId = resetTimer;
  },

  triggerLoss: () => {
    if (wordyTimeoutId) clearTimeout(wordyTimeoutId);
    if (messyTimeoutId) clearTimeout(messyTimeoutId);

    set({
      wordyEmotion: 'sad',
      messyEmotion: 'laugh',
      wordyBubble: "Oh no... next time! 😭",
      messyBubble: "Haha! Told you! 😈"
    });

    const resetTimer = setTimeout(() => {
      set({
        wordyEmotion: 'idle',
        messyEmotion: 'idle',
        wordyBubble: null,
        messyBubble: null
      });
    }, 3000);

    wordyTimeoutId = resetTimer;
    messyTimeoutId = resetTimer;
  },

  resetMascots: () => {
    if (wordyTimeoutId) clearTimeout(wordyTimeoutId);
    if (messyTimeoutId) clearTimeout(messyTimeoutId);
    set({
      wordyEmotion: 'idle',
      messyEmotion: 'idle',
      wordyBubble: null,
      messyBubble: null
    });
  }
}));
export default useCharacterStore;
