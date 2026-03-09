
import React, { useState, useRef } from 'react';
import { Book } from '../types';
import { generateMasterSpeech } from '../services/geminiService';

interface BookDetailProps {
  book: Book;
  onBack: () => void;
}

const BookDetail: React.FC<BookDetailProps> = ({ book, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<AudioBufferSourceNode | null>(null);

  const handlePlaySpeech = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.stop();
        audioRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const audioBuffer = await generateMasterSpeech(book.summary);
    if (audioBuffer) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
      audioRef.current = source;
    } else {
      setIsPlaying(false);
      alert("La vibración de la voz del Maestro no pudo materializarse.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-[#704214] font-bold uppercase tracking-[0.2em] hover:translate-x-[-4px] transition-transform border-b border-[#704214]/30 pb-1 text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Regresar al Archivo
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-[#F5F5DC] p-8 md:p-12 border-4 border-[#704214] shadow-2xl relative overflow-hidden">
        {/* Paper Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] opacity-40 pointer-events-none"></div>
        
        {/* Left: Allegorical B/W Image */}
        <div className="relative z-10 flex flex-col gap-6">
          <div className="border-8 border-white shadow-2xl rotate-[-1deg] overflow-hidden group">
            <img 
              src={`https://picsum.photos/seed/${book.id + 999}/800/1000`} 
              alt={book.imageAlt}
              className="w-full h-auto grayscale contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-1000"
            />
            {/* Grit/Dust Overlay Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-30"></div>
          </div>
          <p className="text-[#A67B5B] text-center italic text-sm tracking-widest uppercase">Fotografía de Placa de Vidrio - Expedición 1894</p>
        </div>

        {/* Right: Info & Summary */}
        <div className="relative z-10 flex flex-col justify-center">
          <div className="mb-6">
             <span className="text-[#A67B5B] font-bold tracking-[0.4em] uppercase text-xs mb-2 block border-b border-[#A67B5B]/20 pb-2">{book.volume}</span>
             <h2 className="text-4xl md:text-5xl font-bold text-[#3d2b1f] mb-6 leading-tight font-serif italic">
               {book.title}
             </h2>
          </div>

          <div className="space-y-6 text-xl leading-relaxed text-justify text-[#2a1a0a] font-serif mb-10">
            <p className="first-letter:text-5xl first-letter:font-bold first-letter:mr-2 first-letter:float-left">
              {book.summary}
            </p>
            <p className="italic opacity-80 text-lg">
              Este volumen contiene las claves para la expansión de la consciencia y el reconocimiento de la divinidad intrínseca en el ser humano, tal como fue documentado por Spalding en su diario de campo.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-auto">
            <button 
              onClick={handlePlaySpeech}
              className={`flex-1 min-w-[200px] flex items-center justify-center gap-3 py-4 px-6 rounded-sm border-2 transition-all font-bold tracking-[0.1em] text-sm ${
                isPlaying 
                  ? 'bg-[#704214] text-[#F5F5DC] border-[#704214]' 
                  : 'border-[#704214] text-[#704214] hover:bg-[#704214] hover:text-[#F5F5DC] shadow-md'
              }`}
            >
              {isPlaying ? (
                <>
                  <svg className="animate-pulse" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  Detener Voz del Maestro
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  Escuchar Enseñanza
                </>
              )}
            </button>
            
            <a 
              href={book.pdfUrl}
              className="flex-1 min-w-[200px] flex items-center justify-center gap-3 py-4 px-6 bg-[#3d2b1f] text-[#F5F5DC] rounded-sm shadow-xl hover:bg-[#1a1a1a] transition-all font-bold tracking-[0.1em] text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Descargar Manuscrito (PDF)
            </a>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 text-[#704214]/20 font-bold text-6xl opacity-20 pointer-events-none">
          {book.id}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
