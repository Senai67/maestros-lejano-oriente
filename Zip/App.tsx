
import React, { useState } from 'react';
import { BOOKS } from './constants';
import BookGrid from './components/BookGrid';
import BookDetail from './components/BookDetail';
import Introduction from './components/Introduction';
import ChatBot from './components/ChatBot';
import ImageAnalyzer from './components/ImageAnalyzer';
import MeditationMode from './components/MeditationMode';
import { Book } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'library' | 'chat' | 'analyzer'>('library');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isMeditating, setIsMeditating] = useState(false);

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLibrary = () => {
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen relative text-[#1a1a1a] pb-20">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 bg-[#F5F5DC]/90 backdrop-blur-sm border-b border-[#A67B5B]/30 shadow-sm px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <img 
            src="https://picsum.photos/seed/expedition/50/50" 
            className="w-10 h-10 rounded-full border-2 border-[#704214] sepia-filter"
            alt="Logo"
          />
          <h1 className="text-2xl font-bold text-[#704214] tracking-tight">Expedición 1894</h1>
        </div>
        
        <div className="flex items-center gap-6 text-lg font-semibold text-[#704214]/80">
          <button 
            onClick={() => { setActiveTab('library'); setSelectedBook(null); }}
            className={`hover:text-[#704214] transition-colors border-b-2 ${activeTab === 'library' ? 'border-[#704214] text-[#704214]' : 'border-transparent'}`}
          >
            Biblioteca
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`hover:text-[#704214] transition-colors border-b-2 ${activeTab === 'chat' ? 'border-[#704214] text-[#704214]' : 'border-transparent'}`}
          >
            El Maestro
          </button>
          <button 
            onClick={() => setActiveTab('analyzer')}
            className={`hover:text-[#704214] transition-colors border-b-2 ${activeTab === 'analyzer' ? 'border-[#704214] text-[#704214]' : 'border-transparent'}`}
          >
            Laboratorio
          </button>
        </div>

        <MeditationMode isActive={isMeditating} onToggle={() => setIsMeditating(!isMeditating)} />
      </nav>

      <main className="container mx-auto px-4">
        {activeTab === 'library' && (
          <>
            {!selectedBook ? (
              <>
                {/* Header matching the previous image */}
                <header className="py-16 text-center space-y-4">
                  <p className="text-[#A67B5B] tracking-[0.3em] text-sm font-semibold uppercase">Archivo Confidencial No. 1894</p>
                  <h1 className="text-5xl md:text-7xl font-bold text-[#332211] uppercase tracking-tight leading-none px-4">
                    Vida y Enseñanzas de los Maestros<br/>del Lejano Oriente
                  </h1>
                  <p className="text-2xl italic text-[#704214] font-serif">B.T. Spalding</p>
                  <div className="flex items-center justify-center gap-4 py-2">
                    <div className="h-[1px] w-24 bg-[#A67B5B]"></div>
                    <div className="w-2 h-2 rotate-45 bg-[#A67B5B]"></div>
                    <div className="h-[1px] w-24 bg-[#A67B5B]"></div>
                  </div>
                  <p className="text-[#704214] italic text-lg opacity-80">Expedición científica a los Himalayas</p>
                </header>

                <section className="mb-12">
                   <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-[#704214] uppercase tracking-widest border-b border-[#A67B5B]/30 inline-block pb-2">
                        La Biblioteca de los Maestros
                      </h2>
                      <p className="text-sm italic text-[#A67B5B] mt-2">Selecciona un volumen para revelar sus misterios</p>
                   </div>
                   <BookGrid books={BOOKS} onSelectBook={handleSelectBook} />
                </section>

                <Introduction />
              </>
            ) : (
              <BookDetail book={selectedBook} onBack={handleBackToLibrary} />
            )}
          </>
        )}

        {activeTab === 'chat' && <div className="mt-12"><ChatBot /></div>}
        {activeTab === 'analyzer' && <div className="mt-12"><ImageAnalyzer /></div>}
      </main>

      <footer className="mt-20 py-12 bg-[#704214] text-[#F5F5DC] text-center border-t border-[#A67B5B]/50">
        <p className="text-xl italic font-serif">"La Verdad os hará libres"</p>
        <p className="mt-4 opacity-70">Basado en la obra de Baird T. Spalding - Expedición al Himalaya 1894</p>
      </footer>
    </div>
  );
};

export default App;
