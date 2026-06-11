import { NUMBERS } from './numberList';
import { differenceInDays } from 'date-fns';

const START_DATE = new Date('2024-01-01T00:00:00Z');

export const getDailyNumberIndex = (): number => {
  const now = new Date();
  const diffDays = differenceInDays(now, START_DATE);
  return diffDays % NUMBERS.length;
};

export const getDailyNumber = (): string => {
  return NUMBERS[getDailyNumberIndex()];
};

export const getRandomNumber = (): string => {
  return NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
};
