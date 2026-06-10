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
    <div className="fixed inset-0 bg-[#f5f4ef] z-[9999] flex flex-col items-center justify-center dark:bg-[#121213]">
      <div className="bg-[#0f0f0f] p-4 rounded-[24px] grid grid-cols-2 grid-rows-2 gap-3 mb-8 shadow-2xl">
        {[
          { color: '#417415', delay: 0 },
          { color: '#834f0c', delay: 0.15 },
          { color: '#4a4a4a', delay: 0.3 },
          { color: '#417415', delay: 0.45 },
        ].map((tile, i) => (
          <motion.div
            key={i}
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: tile.delay }}
            className="w-16 h-16 rounded-[10px]"
            style={{ backgroundColor: tile.color }}
          />
        ))}
      </div>
      
      {showLogo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center font-black tracking-widest text-4xl"
        >
          <span className="text-[#121213] dark:text-white">WORDLE</span>
          <span className="text-[#417415] ml-3">MESS</span>
        </motion.div>
      )}
    </div>
  );
};
