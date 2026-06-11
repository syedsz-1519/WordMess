import React from 'react';
import { motion } from 'framer-motion';

interface OracleOrbProps {
  state?: 'breathing' | 'thinking' | 'speaking';
  onClick?: () => void;
  size?: number;
}

export const OracleOrb = ({ state = 'breathing', onClick, size = 80 }: OracleOrbProps) => {
  const isThinking = state === 'thinking';
  const isSpeaking = state === 'speaking';

  return (
    <div 
      className="relative flex items-center justify-center cursor-pointer select-none"
      onClick={onClick}
      style={{ width: size, height: size }}
    >
      {/* Outer Glow Ring (Thinking opposite rotation, speaking flashing) */}
      <motion.div
        animate={
          isThinking
            ? { rotate: -360 }
            : isSpeaking
            ? { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }
            : { scale: [1, 1.05, 1] }
        }
        transition={
          isThinking
            ? { repeat: Infinity, duration: 1.5, ease: 'linear' }
            : isSpeaking
            ? { repeat: Infinity, duration: 0.5, ease: 'easeInOut' }
            : { repeat: Infinity, duration: 2, ease: 'easeInOut' }
        }
        className="absolute inset-0 rounded-full border-4 border-dashed border-purple-400 opacity-60"
      />

      {/* Main Glowing Breathing Orb */}
      <motion.div
        animate={
          isThinking
            ? {
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 20px 4px rgba(139,92,246,0.5)",
                  "0 0 30px 8px rgba(168,85,247,0.7)",
                  "0 0 20px 4px rgba(139,92,246,0.5)"
                ]
              }
            : isSpeaking
            ? {
                scale: [1, 1.12, 1],
                boxShadow: [
                  "0 0 30px 10px rgba(168,85,247,0.7)",
                  "0 0 45px 15px rgba(236,72,153,0.9)",
                  "0 0 30px 10px rgba(168,85,247,0.7)"
                ]
              }
            : {
                scale: [1, 1.08, 1],
                boxShadow: [
                  "0 0 20px 4px rgba(139,92,246,0.4)",
                  "0 0 40px 12px rgba(139,92,246,0.7)",
                  "0 0 20px 4px rgba(139,92,246,0.4)"
                ]
              }
        }
        transition={{
          duration: isSpeaking ? 0.5 : 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          background: 'radial-gradient(circle at 35% 35%, #c084fc, #7c3aed, #3b0764)',
          width: size - 12,
          height: size - 12
        }}
        className="rounded-full flex items-center justify-center text-3xl shadow-lg border border-purple-300 relative"
      >
        🔮
      </motion.div>
    </div>
  );
};

export default OracleOrb;
