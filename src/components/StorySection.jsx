import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSound } from '../hooks/useSound';
import { Book } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const StoryPage = ({ title, content, image, index }) => {
  const pageRef = useRef(null);
  const { play } = useSound();

  useEffect(() => {
    if (!pageRef.current) return;

    gsap.fromTo(
      pageRef.current,
      { 
        opacity: 0,
        x: index % 2 === 0 ? -100 : 100
      },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: pageRef.current,
          start: 'top center+=100',
          end: 'bottom center',
          toggleActions: 'play none none reverse',
          onEnter: () => play('pageFlip')
        }
      }
    );
  }, [index, play]);

  return (
    <div 
      ref={pageRef}
      className="flex flex-col md:flex-row items-center gap-8 mb-16"
    >
      <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
        <img 
          src={image} 
          alt={title}
          className="rounded-lg shadow-xl w-full h-64 object-cover"
          loading="lazy"
        />
      </div>
      <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
        <h3 className="text-3xl font-bold mb-4 text-accent">{title}</h3>
        <p className="text-lg text-secondary/80 leading-relaxed">{content}</p>
      </div>
    </div>
  );
};

export const StorySection = () => {
  const sectionRef = useRef(null);
  const { play } = useSound();

  const storyPages = [
    {
      title: "The Ancient Prophecy",
      content: "In the realm of Eldara, an ancient prophecy speaks of a hero who will rise to face the growing darkness. As shadows lengthen and hope dims, the time for action draws near.",
      image: "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=800&q=80"
    },
    {
      title: "The Awakening",
      content: "Deep within the Mystic Forest, ancient guardians stir from their millennia-long slumber. The very earth trembles as forgotten powers reawaken to aid in the coming battle.",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80"
    },
    {
      title: "The Journey Begins",
      content: "Armed with courage and guided by destiny, you step forth into a world of wonder and danger. Every choice you make will shape the fate of Eldara and its people.",
      image: "https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?w=800&q=80"
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
          play('story');
          gsap.to('.story-header', {
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
    <section ref={sectionRef} className="py-32 bg-gradient-to-b from-primary to-primary/50">
      <div className="container mx-auto px-6">
        <div className="story-header opacity-0 translate-y-10 mb-16 text-center">
          <Book className="w-16 h-16 text-accent mx-auto mb-6" />
          <h2 className="text-5xl font-bold mb-6">Epic Tale Unfolds</h2>
          <p className="text-xl text-secondary/80 max-w-2xl mx-auto">
            Embark on a journey through time and legend. Your story awaits in the 
            ancient realm of Eldara.
          </p>
        </div>

        <div className="mt-16">
          {storyPages.map((page, index) => (
            <StoryPage key={page.title} {...page} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};