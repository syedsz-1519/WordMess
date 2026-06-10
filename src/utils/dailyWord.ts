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

export const getDailyNumber = (): string => {
  return NUMBERS[getDailyWordIndex() % NUMBERS.length];
};

export const getRandomWord = (): string => {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
};
