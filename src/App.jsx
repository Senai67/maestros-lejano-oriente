import React, { useState } from 'react';
import MainLayout from './components/Layout/MainLayout';
import HeroSection from './components/Hero/HeroSection';
import BookGrid from './components/Library/BookGrid';
import ManuscriptView from './components/Manuscript/ManuscriptView';
import MasterChat from './components/MasterChat/MasterChat';

function App() {
  const [selectedVolume, setSelectedVolume] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [jumpToParagraph, setJumpToParagraph] = useState(null);

  const handleBookClick = (volume, paragraphId = null) => {
    setSelectedVolume(volume);
    if (paragraphId !== null) {
        setJumpToParagraph(paragraphId);
        setIsChatOpen(false); // Close search when jumping to a book
    } else {
        setJumpToParagraph(null);
    }
    // Smooth scroll to top when switching views
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedVolume(null);
    setJumpToParagraph(null);
  };

  return (
    <MainLayout>
      {selectedVolume ? (
        <ManuscriptView 
            volume={selectedVolume} 
            onBack={handleBack} 
            jumpToParagraph={jumpToParagraph}
        />
      ) : (
        <>
          <HeroSection />
          <BookGrid onBookSelect={handleBookClick} />
        </>
      )}

      {/* Access to the Master */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 z-40 bg-parchment shadow-mystic border-2 border-gold/40 p-4 rounded-full hover:scale-110 active:scale-95 transition-all group overflow-hidden"
        title="Pregunta al Maestro"
      >
        <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      <MasterChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        onNavigateToBook={handleBookClick}
      />
    </MainLayout>
  );
}

export default App;
