import React, { useState, Suspense } from 'react';
import { Scene } from './components/Scene';
import { CustomCursor } from './components/CustomCursor';
import { Loader } from './components/Loader';
import { Play, Sword, Map, Book } from 'lucide-react';
import './styles/globals.css';

// Lazy load the GameModal component
const GameModal = React.lazy(() => 
  import('./components/GameModal')
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showGame, setShowGame] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <Loader onLoadingComplete={handleLoadingComplete} />}
      <CustomCursor />
      
      <main className="relative">
        <div className="fixed inset-0">
          <Scene />
        </div>

        <div className="relative z-10 min-h-screen">
          <nav className="fixed top-0 w-full p-6 backdrop-blur-sm">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sword className="w-8 h-8 text-accent" />
                <h1 className="text-2xl font-bold">EPIC QUEST</h1>
              </div>
              <button 
                onClick={() => setShowGame(true)}
                className="px-8 py-3 bg-accent rounded-full hover:bg-accent/80 transition-all hover:scale-105 font-bold shadow-lg"
              >
                Play Now
              </button>
            </div>
          </nav>

          <section className="container mx-auto px-6 pt-32">
            <div className="max-w-2xl">
              <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
                Begin Your Legend
              </h2>
              <p className="text-xl mb-8 text-secondary/90 leading-relaxed">
                Embark on an epic journey through mysterious realms. Face 
                challenging quests, discover ancient artifacts, and become 
                the hero you were destined to be.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowGame(true)}
                  className="group flex items-center gap-2 px-8 py-4 bg-accent rounded-full hover:bg-accent/80 transition-all hover:scale-105 shadow-lg"
                >
                  <Play className="w-6 h-6" />
                  <span>Play Now</span>
                </button>
                <button className="px-8 py-4 border-2 border-secondary/20 rounded-full hover:bg-white/5 transition-all">
                  Learn More
                </button>
              </div>
            </div>
          </section>

          <section className="py-32">
            <div className="container mx-auto px-6">
              <h3 className="text-4xl font-bold mb-16 text-center">
                Game Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: 'Combat', icon: Sword, description: 'Master strategic combat with unique abilities and powerful combinations.' },
                  { title: 'Exploration', icon: Map, description: 'Discover vast landscapes filled with secrets and hidden treasures.' },
                  { title: 'Story', icon: Book, description: 'Immerse yourself in an epic tale of adventure and discovery.' }
                ].map(({ title, icon: Icon, description }) => (
                  <div
                    key={title}
                    className="p-8 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all hover:scale-105 cursor-pointer group"
                  >
                    <Icon className="w-8 h-8 text-accent mb-4 group-hover:text-accent/80" />
                    <h4 className="text-2xl font-bold mb-4">{title}</h4>
                    <p className="text-secondary/80">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
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