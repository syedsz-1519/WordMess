import React from 'react';

export const WordmarkLogo = () => (
  <div className="flex items-center gap-2">
    <div className="grid grid-cols-2 grid-rows-2 gap-[2px] w-6 h-6 shrink-0">
      <div className="bg-[#3B6D11] rounded-[1px]"></div>
      <div className="bg-[#854F0B] rounded-[1px]"></div>
      <div className="bg-[#444441] rounded-[1px]"></div>
      <div className="bg-[#3B6D11] rounded-[1px]"></div>
    </div>
    <div className="flex items-center justify-center font-black tracking-widest text-xl">
      <span className="text-white">WORDLE</span>
      <span className="text-[#3B6D11] ml-1">MESS</span>
    </div>
  </div>
);

export const FaviconIcon = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#3B6D11" />
    <text x="50" y="65" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="45" fill="white" textAnchor="middle">WM</text>
  </svg>
);
