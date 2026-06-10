import React from 'react';
import { Modal } from '../UI/Modal';
import { Tile } from '../Board/Tile';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal = ({ isOpen, onClose }: HowToPlayModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How To Play">
      <div className="flex flex-col gap-4 text-sm text-gray-300">
        <p>
          Guess the Word in 6 tries.
        </p>
        <p>
          Each guess must be a valid 5-letter word. Hit the enter button to submit.
        </p>
        <p>
          After each guess, the color of the tiles will change to show how close your guess was to the word.
        </p>

        <div className="border-t border-[var(--wm-border)] pt-4 mt-2">
          <strong className="text-white mb-2 block">Examples</strong>
          
          <div className="flex gap-1 mb-2">
            <Tile letter="W" state="correct" />
            <Tile letter="E" />
            <Tile letter="A" />
            <Tile letter="R" />
            <Tile letter="Y" />
          </div>
          <p className="mb-4">The letter <strong>W</strong> is in the word and in the correct spot.</p>

          <div className="flex gap-1 mb-2">
            <Tile letter="P" />
            <Tile letter="I" state="present" />
            <Tile letter="L" />
            <Tile letter="L" />
            <Tile letter="S" />
          </div>
          <p className="mb-4">The letter <strong>I</strong> is in the word but in the wrong spot.</p>

          <div className="flex gap-1 mb-2">
            <Tile letter="V" />
            <Tile letter="A" />
            <Tile letter="G" />
            <Tile letter="U" state="absent" />
            <Tile letter="E" />
          </div>
          <p>The letter <strong>U</strong> is not in the word in any spot.</p>
        </div>
      </div>
    </Modal>
  );
};
