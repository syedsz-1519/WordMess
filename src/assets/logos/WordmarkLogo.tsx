import React from 'react';

export const WordmarkLogo = () => (
  <div className="flex items-center gap-3">
    <div className="bg-[#0f0f0f]/80 p-1.5 rounded-[10px] grid grid-cols-2 grid-rows-2 gap-[4px] w-10 h-10 shrink-0 shadow-lg border border-white/10">
      <div className="bg-[#4ade80] rounded-[3px]"></div>
      <div className="bg-[#fb923c] rounded-[3px]"></div>
      <div className="bg-[#444444] rounded-[3px]"></div>
      <div className="bg-[#4ade80] rounded-[3px]"></div>
    </div>
    <div className="flex items-center justify-center font-extrabold tracking-wider text-2xl">
      <span className="text-white">WORD</span>
      <span className="text-[#4ade80]">MESS</span>
    </div>
  </div>
);

export const FaviconIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#4ade80" />
    <text x="50" y="65" fontFamily="Outfit, Inter, sans-serif" fontWeight="900" fontSize="45" fill="#121213" textAnchor="middle">WM</text>
  </svg>
);
