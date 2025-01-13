import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LoaderProps {
  onLoadingComplete: () => void;
}

export const Loader = ({ onLoadingComplete }: LoaderProps) => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (!loaderRef.current) return;
        
        gsap.to(loaderRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: "power4.inOut",
          onComplete: onLoadingComplete
        });
      }
    });

    tl.to(".loader-text", {
      duration: 1.5,
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      ease: "power4.inOut",
      stagger: 0.25
    });

    tl.to(".loader-progress", {
      width: "100%",
      duration: 1,
      ease: "power2.inOut"
    });
  }, [onLoadingComplete]);

  return (
    <div ref={loaderRef} className="fixed inset-0 z-50 flex items-center justify-center bg-primary">
      <div className="text-center">
        <div className="space-y-4">
          <h1 className="loader-text text-4xl font-bold text-accent" style={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}>
            EPIC QUEST
          </h1>
          <p className="loader-text text-xl text-secondary" style={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}>
            Loading Experience
          </p>
        </div>
        <div className="mt-8 w-64 h-1 bg-secondary/20">
          <div className="loader-progress h-full w-0 bg-accent" />
        </div>
      </div>
    </div>
  );
};

export default Loader;