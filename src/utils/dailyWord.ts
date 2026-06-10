import { WORDS } from './wordList';
import { NUMBERS } from './numberList';
import { differenceInDays } from 'date-fns';

const START_DATE = new Date('2024-01-01T00:00:00Z');

export const getDailyWordIndex = (): number => {
  const now = new Date();
  const diffDays = differenceInDays(now, START_DATE);
  return diffDays % WORDS.length;
};

export const getDailyWord = (): string => {
  return WORDS[getDailyWordIndex()];
};

// Campaign Mode: Get word for specific level (1-1000)
export const getWordForLevel = (level: number): string => {
  // If level exceeds word list, loop back around or use deterministic random
  const index = (level - 1) % WORDS.length;
  return WORDS[index];
};

export const getNumberForLevel = (level: number): string => {
  const index = (level - 1) % NUMBERS.length;
  return NUMBERS[index];
};

export const getRandomWord = (): string => {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
};
