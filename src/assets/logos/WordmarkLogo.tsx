import React from 'react';

export const WordmarkLogo = () => (
  <div className="flex items-center gap-3">
    <div className="bg-[#0f0f0f] p-1.5 rounded-[8px] grid grid-cols-2 grid-rows-2 gap-[3px] w-10 h-10 shrink-0 shadow-md">
      <div className="bg-[#417415] rounded-[3px]"></div>
      <div className="bg-[#834f0c] rounded-[3px]"></div>
      <div className="bg-[#4a4a4a] rounded-[3px]"></div>
      <div className="bg-[#417415] rounded-[3px]"></div>
    </div>
    <div className="flex items-center justify-center font-black tracking-widest text-2xl">
      <span className="text-white">WORDLE</span>
      <span className="text-[#417415] ml-2">MESS</span>
    </div>
  </div>
);

export const FaviconIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#3B6D11" />
    <text x="50" y="65" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="45" fill="white" textAnchor="middle">WM</text>
  </svg>
);
