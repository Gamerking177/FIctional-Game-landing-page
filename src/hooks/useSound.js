import { Howl } from 'howler';
import create from 'zustand';

const useStore = create((set) => ({
  isSoundEnabled: true,
  toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
}));

// Using copyright-free sounds from Pixabay
const sounds = {
  hover: new Howl({
    src: ['https://cdn.pixabay.com/download/audio/2022/03/24/audio_2c0d5e3716.mp3?filename=hover.mp3'],
    volume: 0.2,
  }),
  click: new Howl({
    src: ['https://cdn.pixabay.com/download/audio/2022/03/25/audio_c8c8f3a1c2.mp3?filename=click.mp3'],
    volume: 0.3,
  }),
  combat: new Howl({
    src: ['https://cdn.pixabay.com/download/audio/2022/03/19/audio_c738d5079d.mp3?filename=sword.mp3'],
    volume: 0.4,
  }),
  explore: new Howl({
    src: ['https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6435fe9.mp3?filename=discover.mp3'],
    volume: 0.4,
  }),
  story: new Howl({
    src: ['https://cdn.pixabay.com/download/audio/2022/04/27/audio_c4a3825a06.mp3?filename=story.mp3'],
    volume: 0.4,
  }),
  bgMusic: new Howl({
    src: ['https://cdn.pixabay.com/download/audio/2022/01/26/audio_c4d2b6c539.mp3?filename=epic-background.mp3'],
    volume: 0.2,
    loop: true,
  }),
  pageFlip: new Howl({
    src: ['https://cdn.pixabay.com/download/audio/2022/03/22/audio_c8c0d57d4a.mp3?filename=page-flip.mp3'],
    volume: 0.3,
  }),
  achievement: new Howl({
    src: ['https://cdn.pixabay.com/download/audio/2022/03/25/audio_c0c8f3a1c2.mp3?filename=achievement.mp3'],
    volume: 0.4,
  })
};

export const useSound = () => {
  const { isSoundEnabled, toggleSound } = useStore();

  const play = (soundName) => {
    if (isSoundEnabled && sounds[soundName]) {
      sounds[soundName].play();
    }
  };

  const stop = (soundName) => {
    if (sounds[soundName]) {
      sounds[soundName].stop();
    }
  };

  const fadeOut = (soundName, duration = 1000) => {
    if (sounds[soundName]) {
      const sound = sounds[soundName];
      const currentVolume = sound.volume();
      sound.fade(currentVolume, 0, duration);
      setTimeout(() => sound.stop(), duration);
    }
  };

  const fadeIn = (soundName, targetVolume = 0.5, duration = 1000) => {
    if (sounds[soundName]) {
      const sound = sounds[soundName];
      sound.volume(0);
      sound.play();
      sound.fade(0, targetVolume, duration);
    }
  };

  return {
    isSoundEnabled,
    toggleSound,
    play,
    stop,
    fadeIn,
    fadeOut,
  };
};