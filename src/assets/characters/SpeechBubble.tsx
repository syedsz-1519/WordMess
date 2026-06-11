import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpeechBubbleProps {
  text: string | null;
}

export const SpeechBubble = ({ text }: SpeechBubbleProps) => {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 5 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white text-slate-800 text-[10px] font-extrabold px-2.5 py-1.5 rounded-xl border-2 border-slate-700 shadow-md whitespace-nowrap z-50 pointer-events-none"
        >
          {/* Bubble Text */}
          {text}
          {/* Downward Arrow tail */}
          <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-white border-r-2 border-b-2 border-slate-700 rotate-45" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpeechBubble;
