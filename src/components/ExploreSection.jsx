import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSound } from '../hooks/useSound';
import { Map as MapIcon, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const LocationModal = ({ location, onClose }) => {
  const modalRef = useRef(null);
  const { play } = useSound();

  useEffect(() => {
    if (!modalRef.current) return;

    play('explore');
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
    );
  }, [play]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={modalRef}
        className="relative bg-primary p-6 rounded-lg shadow-xl max-w-2xl w-full"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <img
          src={location.image}
          alt={location.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        
        <h3 className="text-2xl font-bold mb-2 text-accent">{location.title}</h3>
        <p className="text-secondary/80 leading-relaxed mb-4">{location.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-white/5 rounded-lg">
            <h4 className="font-semibold mb-1">Difficulty</h4>
            <p className="text-secondary/60">{location.difficulty}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <h4 className="font-semibold mb-1">Rewards</h4>
            <p className="text-secondary/60">{location.rewards}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MapLocation = ({ location, onClick }) => {
  const markerRef = useRef(null);
  const { play } = useSound();

  useEffect(() => {
    if (!markerRef.current) return;

    gsap.fromTo(
      markerRef.current,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out',
        scrollTrigger: {
          trigger: markerRef.current,
          start: 'top center+=100',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  return (
    <button
      ref={markerRef}
      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
      style={{ left: `${location.x}%`, top: `${location.y}%` }}
      onClick={() => {
        play('click');
        onClick(location);
      }}
      onMouseEnter={() => play('hover')}
    >
      <div className="w-4 h-4 bg-accent rounded-full relative">
        <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-75" />
      </div>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/90 px-3 py-1 rounded-full text-sm whitespace-nowrap">
        {location.title}
      </div>
    </button>
  );
};

export const ExploreSection = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const sectionRef = useRef(null);
  const { play } = useSound();

  const locations = [
    {
      title: "Crystal Caverns",
      description: "A vast network of crystalline caves where ancient magic still resonates. The walls pulse with ethereal light, and the air itself seems to whisper secrets of forgotten power.",
      image: "https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?w=800&q=80",
      x: 30,
      y: 40,
      difficulty: "Challenging",
      rewards: "Rare Magic Crystals"
    },
    {
      title: "Skyreach Peak",
      description: "The highest mountain in Eldara, where the clouds part to reveal an ancient temple. Those who brave its heights may find enlightenment—or face the wrath of its winged guardians.",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      x: 70,
      y: 20,
      difficulty: "Expert",
      rewards: "Legendary Weapons"
    },
    {
      title: "Whispering Woods",
      description: "An enchanted forest where reality shifts like morning mist. The trees themselves are said to be ancient beings, guarding powerful secrets for those worthy to hear them.",
      image: "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80",
      x: 50,
      y: 60,
      difficulty: "Moderate",
      rewards: "Ancient Knowledge"
    }
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          play('explore');
          gsap.to('.explore-header', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out'
          });
        }
      }
    });

    return () => tl.kill();
  }, [play]);

  return (
    <section ref={sectionRef} className="py-32 bg-gradient-to-b from-primary/50 to-primary">
      <div className="container mx-auto px-6">
        <div className="explore-header opacity-0 translate-y-10 mb-16 text-center">
          <MapIcon className="w-16 h-16 text-accent mx-auto mb-6" />
          <h2 className="text-5xl font-bold mb-6">Explore Eldara</h2>
          <p className="text-xl text-secondary/80 max-w-2xl mx-auto">
            Discover mysterious locations across the realm. Each destination holds 
            its own challenges and rewards.
          </p>
        </div>

        <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1524813686514-a57563d77965?w=1600&q=80"
            alt="Map of Eldara"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/50" />
          
          {locations.map((location) => (
            <MapLocation
              key={location.title}
              location={location}
              onClick={setSelectedLocation}
            />
          ))}
        </div>
      </div>

      {selectedLocation && (
        <LocationModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </section>
  );
};