import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLogo(true), 600);
    const timer2 = setTimeout(() => onComplete(), 2000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#121213] z-[9999] flex flex-col items-center justify-center">
      <div className="grid grid-cols-2 grid-rows-2 gap-2 mb-6">
        {[
          { color: '#3B6D11', delay: 0 },
          { color: '#854F0B', delay: 0.15 },
          { color: '#444441', delay: 0.3 },
          { color: '#3B6D11', delay: 0.45 },
        ].map((tile, i) => (
          <motion.div
            key={i}
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: tile.delay }}
            className="w-16 h-16 rounded-md"
            style={{ backgroundColor: tile.color }}
          />
        ))}
      </div>
      
      {showLogo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center font-black tracking-widest text-3xl"
        >
          <span className="text-white">WORDLE</span>
          <span className="text-[#3B6D11] ml-2">MESS</span>
        </motion.div>
      )}
    </div>
  );
};
