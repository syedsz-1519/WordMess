export interface Zone {
  id: string;
  name: string;
  startLevel: number;
  endLevel: number;
  color: string;
  bgGradient: string;
}

export const CAMPAIGN_ZONES: Zone[] = [
  { id: 'jungle', name: 'Jungle Canopy', startLevel: 1, endLevel: 100, color: 'text-emerald-400', bgGradient: 'from-emerald-950 via-teal-900 to-[#0a1628]' },
  { id: 'desert', name: 'Sunken Desert', startLevel: 101, endLevel: 200, color: 'text-amber-400', bgGradient: 'from-amber-950 via-orange-900 to-[#0a1628]' },
  { id: 'ocean', name: 'Coral Depths', startLevel: 201, endLevel: 300, color: 'text-sky-400', bgGradient: 'from-sky-950 via-indigo-900 to-[#0a1628]' },
  { id: 'cave', name: 'Neon Caverns', startLevel: 301, endLevel: 400, color: 'text-purple-400', bgGradient: 'from-purple-950 via-fuchsia-900 to-[#0a1628]' },
  { id: 'mountain', name: 'Frozen Peaks', startLevel: 401, endLevel: 500, color: 'text-slate-400', bgGradient: 'from-slate-800 via-zinc-800 to-[#0a1628]' },
  { id: 'city', name: 'Word City', startLevel: 501, endLevel: 600, color: 'text-teal-400', bgGradient: 'from-teal-950 via-cyan-900 to-[#0a1628]' },
  { id: 'space', name: 'Cosmic Space', startLevel: 601, endLevel: 700, color: 'text-indigo-400', bgGradient: 'from-indigo-950 via-violet-950 to-[#0a1628]' },
  { id: 'ice', name: 'Cyan Glaciers', startLevel: 701, endLevel: 800, color: 'text-cyan-400', bgGradient: 'from-cyan-950 via-sky-900 to-[#0a1628]' },
  { id: 'volcano', name: 'Volcanic Lava', startLevel: 801, endLevel: 900, color: 'text-red-400', bgGradient: 'from-red-950 via-rose-900 to-[#0a1628]' },
  { id: 'paradise', name: 'Paradise Rainbow', startLevel: 901, endLevel: 1000, color: 'text-pink-400', bgGradient: 'from-pink-950 via-rose-900 to-indigo-950' },
];

export const getZoneForLevel = (level: number): Zone => {
  return CAMPAIGN_ZONES.find(z => level >= z.startLevel && level <= z.endLevel) || CAMPAIGN_ZONES[0];
};
