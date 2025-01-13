import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../hooks/useSound';

export const SoundToggle = () => {
  const { isSoundEnabled, toggleSound } = useSound();

  return (
    <button
      onClick={toggleSound}
      className="fixed top-6 right-24 z-50 p-3 bg-primary/80 backdrop-blur-sm rounded-full hover:bg-primary transition-colors"
      aria-label={isSoundEnabled ? 'Disable sound' : 'Enable sound'}
    >
      {isSoundEnabled ? (
        <Volume2 className="w-6 h-6 text-accent" />
      ) : (
        <VolumeX className="w-6 h-6 text-accent" />
      )}
    </button>
  );
};