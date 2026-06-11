import { ParticleType } from '../engine/particles';

export interface ThemeConfig {
  start: string;
  mid: string;
  end: string;
  particleType: ParticleType;
}

export const THEME_CONFIGS: Record<string, ThemeConfig> = {
  classic: {
    start: '#0a1628',
    mid: '#1a3a5c',
    end: '#2d6a4f',
    particleType: 'classic', // green leaf specks
  },
  speed: {
    start: '#1a0500',
    mid: '#7c1d05',
    end: '#dc2626',
    particleType: 'speed', // embers flying up
  },
  ai: {
    start: '#0c0515',
    mid: '#1e0b4b',
    end: '#3b0764',
    particleType: 'ai', // cosmic dust
  },
  duel: {
    start: '#1a0010',
    mid: '#7c0025',
    end: '#dc2626',
    particleType: 'duel', // blue vs red split
  },
  campaign: {
    start: '#0a1628',
    mid: '#065f46',
    end: '#0891b2',
    particleType: 'campaign', // bubbles
  },
  double: {
    start: '#0f172a',
    mid: '#1e3a5f',
    end: '#1e4d40',
    particleType: 'double',
  },
  number: {
    start: '#0f0a1e',
    mid: '#1e1060',
    end: '#312e81',
    particleType: 'number', // binary numbers
  },
  reverse: {
    start: '#1a1a1a',
    mid: '#262626',
    end: '#404040',
    particleType: 'reverse', // grey dust
  },
  hub: {
    start: '#0a1628',
    mid: '#1a3a5c',
    end: '#0f172a', // beach night
    particleType: 'hub', // twinkling stars
  },
} as const;
