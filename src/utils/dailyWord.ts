import { WORDS } from './wordList';

export const getDailyWord = (): string => {
  const launchDate = new Date('2024-01-01T00:00:00+05:30');
  
  // Convert current time to IST
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const istTime = new Date(utc + istOffset);
  
  const diffDays = Math.floor((istTime.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24));
  return WORDS[Math.max(0, diffDays) % WORDS.length].toUpperCase();
};

export const getDailyDateString = (): string => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const istTime = new Date(utc + istOffset);
  
  return istTime.toISOString().split('T')[0];
};

export const getMsUntilNextWord = (): number => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const istTime = new Date(utc + istOffset);
  
  const nextMidnight = new Date(istTime);
  nextMidnight.setHours(24, 0, 0, 0);
  
  return nextMidnight.getTime() - istTime.getTime();
};
