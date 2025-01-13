import React, { useState, Suspense, useEffect } from 'react';
import { Scene } from './components/Scene';
import { CustomCursor } from './components/CustomCursor';
import { Loader } from './components/Loader';
import { SoundToggle } from './components/SoundToggle';
import { ExploreSection } from './components/ExploreSection';
import { StorySection } from './components/StorySection';
import { Play, Sword, Map, Book } from 'lucide-react';
import { useSound } from './hooks/useSound';
import './styles/globals.css';

const GameModal = React.lazy(() => 
  import('./components/GameModal').then(module => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(module);
      }, 500);
    });
  })
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showGame, setShowGame] = useState(false);
  const { play, fadeIn, fadeOut } = useSound();
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    fadeIn('bgMusic', 0.2, 2000);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      if (scrollPosition < windowHeight * 0.5) {
        setActiveSection('hero');
      } else if (scrollPosition < windowHeight * 1.5) {
        setActiveSection('features');
      } else if (scrollPosition < windowHeight * 2.5) {
        setActiveSection('explore');
      } else {
        setActiveSection('story');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      fadeOut('bgMusic');
    };
  }, [fadeIn, fadeOut]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handlePlayClick = () => {
    play('click');
    setShowGame(true);
  };

  const handleFeatureHover = (feature) => {
    play('hover');
  };

  return (
    <>
      {isLoading && <Loader onLoadingComplete={handleLoadingComplete} />}
      <CustomCursor />
      <SoundToggle />
      
      <main className="relative">
        <div className="fixed inset-0">
          <Scene activeSection={activeSection} />
        </div>

        <div className="relative z-10">
          <nav className="fixed top-0 w-full p-6 backdrop-blur-sm z-50">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center gap-2 group">
                <Sword className="w-8 h-8 text-accent group-hover:rotate-12 transition-transform" />
                <h1 className="text-2xl font-bold">EPIC QUEST</h1>
              </div>
              <button 
                onClick={handlePlayClick}
                className="px-8 py-3 bg-accent rounded-full hover:bg-accent/80 transition-all hover:scale-105 font-bold shadow-lg relative overflow-hidden group"
              >
                <span className="relative z-10">Play Now</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
              </button>
            </div>
          </nav>

          <section className="min-h-screen flex items-center">
            <div className="container mx-auto px-6">
              <div className="max-w-2xl">
                <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent animate-gradient">
                  Begin Your Legend
                </h2>
                <p className="text-xl mb-8 text-secondary/90 leading-relaxed">
                  Embark on an epic journey through mysterious realms. Face 
                  challenging quests, discover ancient artifacts, and become 
                  the hero you were destined to be.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={handlePlayClick}
                    className="group flex items-center gap-2 px-8 py-4 bg-accent rounded-full hover:bg-accent/80 transition-all hover:scale-105 shadow-lg"
                  >
                    <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    <span>Play Now</span>
                  </button>
                  <button 
                    onClick={() => play('click')}
                    className="px-8 py-4 border-2 border-secondary/20 rounded-full hover:bg-white/5 transition-all relative group overflow-hidden"
                  >
                    <span className="relative z-10">Learn More</span>
                    <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="min-h-screen py-32">
            <div className="container mx-auto px-6">
              <h3 className="text-4xl font-bold mb-16 text-center">
                Game Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: 'Combat', icon: Sword, description: 'Master strategic combat with unique abilities and powerful combinations.', color: 'from-red-500 to-orange-500' },
                  { title: 'Exploration', icon: Map, description: 'Discover vast landscapes filled with secrets and hidden treasures.', color: 'from-blue-500 to-cyan-500' },
                  { title: 'Story', icon: Book, description: 'Immerse yourself in an epic tale of adventure and discovery.', color: 'from-green-500 to-emerald-500' }
                ].map(({ title, icon: Icon, description, color }) => (
                  <div
                    key={title}
                    className="p-8 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all hover:scale-105 cursor-pointer group relative overflow-hidden"
                    onMouseEnter={() => handleFeatureHover(title.toLowerCase())}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    <div className="relative z-10">
                      <Icon className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
                      <h4 className="text-2xl font-bold mb-4">{title}</h4>
                      <p className="text-secondary/80">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <ExploreSection />
          <StorySection />
        </div>
      </main>

      {showGame && (
        <Suspense fallback={
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-xl font-semibold">Loading Game...</p>
            </div>
          </div>
        }>
          <GameModal onClose={() => setShowGame(false)} />
        </Suspense>
      )}
    </>
  );
}

export default App;