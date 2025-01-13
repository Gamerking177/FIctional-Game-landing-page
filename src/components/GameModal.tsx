import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';

interface GameModalProps {
  onClose: () => void;
}

export const GameModal = ({ onClose }: GameModalProps) => {
  const [gameStarted, setGameStarted] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    if (!gameStarted) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (!playerRef.current) return;

      switch (e.key) {
        case 'ArrowRight':
          movePlayer('right');
          break;
        case 'ArrowLeft':
          movePlayer('left');
          break;
        case ' ':
        case 'ArrowUp':
          if (!isJumping) jump();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, isJumping]);

  const movePlayer = (direction: 'left' | 'right') => {
    if (!playerRef.current || !gameAreaRef.current) return;

    const currentX = playerPosition.x;
    const movement = direction === 'right' ? 50 : -50;
    const newX = Math.max(0, Math.min(currentX + movement, gameAreaRef.current.clientWidth - 50));

    gsap.to(playerRef.current, {
      x: newX,
      duration: 0.3,
      ease: "power2.out",
      onUpdate: () => {
        setPlayerPosition(prev => ({ ...prev, x: newX }));
        checkCollisions();
      }
    });
  };

  const jump = () => {
    if (!playerRef.current || isJumping) return;

    setIsJumping(true);
    gsap.to(playerRef.current, {
      y: -100,
      duration: 0.5,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        setIsJumping(false);
        checkCollisions();
      }
    });
  };

  const checkCollisions = () => {
    // Implement collision detection with collectibles or obstacles
    const collectibles = document.querySelectorAll('.collectible');
    const playerBounds = playerRef.current?.getBoundingClientRect();

    collectibles.forEach((collectible: Element) => {
      const collectibleBounds = collectible.getBoundingClientRect();
      
      if (playerBounds && isColliding(playerBounds, collectibleBounds)) {
        collectItem(collectible as HTMLElement);
      }
    });
  };

  const isColliding = (rect1: DOMRect, rect2: DOMRect) => {
    return !(rect1.right < rect2.left || 
            rect1.left > rect2.right || 
            rect1.bottom < rect2.top || 
            rect1.top > rect2.bottom);
  };

  const collectItem = (item: HTMLElement) => {
    gsap.to(item, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: "back.in",
      onComplete: () => {
        item.remove();
        setScore(prev => prev + 100);
        revealMessage();
      }
    });
  };

  const revealMessage = () => {
    const message = document.createElement('div');
    message.className = 'absolute text-xl font-bold text-accent';
    message.style.left = `${playerPosition.x}px`;
    message.style.top = `${playerPosition.y - 50}px`;
    message.textContent = '+100';
    
    gameAreaRef.current?.appendChild(message);

    gsap.to(message, {
      y: '-=50',
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      onComplete: () => message.remove()
    });
  };

  const startGame = () => {
    setGameStarted(true);
    gsap.to('.game-intro', {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        spawnCollectibles();
      }
    });
  };

  const spawnCollectibles = () => {
    if (!gameAreaRef.current) return;

    const gameArea = gameAreaRef.current;
    const positions = [200, 400, 600];

    positions.forEach((x, i) => {
      const collectible = document.createElement('div');
      collectible.className = 'collectible absolute w-8 h-8 bg-accent rounded-full';
      collectible.style.left = `${x}px`;
      collectible.style.top = '200px';
      gameArea.appendChild(collectible);

      gsap.from(collectible, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        delay: i * 0.2,
        ease: "back.out"
      });
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-primary p-4 rounded-lg shadow-xl w-[800px] h-[600px] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div ref={gameAreaRef} className="w-full h-full relative overflow-hidden bg-gradient-to-b from-primary to-[#2a2a2a]">
          {!gameStarted ? (
            <div className="game-intro absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-4xl font-bold mb-8 text-accent">Epic Quest</h2>
              <div className="space-y-4 text-center">
                <p className="text-xl text-secondary/80">
                  Use arrow keys to move and space to jump
                </p>
                <p className="text-secondary/60">
                  Collect all the orbs to reveal hidden messages
                </p>
                <button 
                  onClick={startGame}
                  className="px-8 py-3 bg-accent rounded-full hover:bg-accent/80 transition-all hover:scale-105 font-bold shadow-lg"
                >
                  Start Game
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="absolute top-4 left-4 text-xl font-bold">
                Score: {score}
              </div>
              <div 
                ref={playerRef}
                className="absolute bottom-8 left-8 w-12 h-12 bg-accent rounded-lg shadow-lg"
                style={{ transform: 'translate3d(0,0,0)' }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameModal;