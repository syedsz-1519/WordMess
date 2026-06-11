import React from 'react';
import { motion } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-[var(--wm-surface)] p-6 rounded-[12px] w-full max-w-sm border border-[var(--wm-border)] flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--wm-border)]">
          <h2 className="text-xl font-bold uppercase tracking-wider">{title}</h2>
          <button 
            onClick={onClose}
            className="text-[var(--wm-text-muted)] hover:text-[var(--wm-text)] font-bold p-1 bg-slate-100 hover:bg-slate-200/80 rounded-full w-7 h-7 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
