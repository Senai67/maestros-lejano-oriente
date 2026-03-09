
import React, { useRef, useEffect } from 'react';

interface MeditationModeProps {
  isActive: boolean;
  onToggle: () => void;
}

const MeditationMode: React.FC<MeditationModeProps> = ({ isActive, onToggle }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isActive) {
        audioRef.current.play().catch(e => console.log("Audio play blocked"));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isActive]);

  return (
    <div className="flex items-center gap-3">
      <audio 
        ref={audioRef} 
        loop 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Placeholder for atmospheric sound
      />
      <span className="hidden sm:inline text-[#704214] font-bold text-sm uppercase tracking-widest">Modo Meditación</span>
      <button 
        onClick={onToggle}
        className={`w-14 h-8 rounded-full relative transition-all duration-500 border-2 border-[#704214] ${isActive ? 'bg-[#704214]' : 'bg-transparent'}`}
      >
        <div className={`absolute top-1 w-5 h-5 rounded-full bg-[#704214] transition-all duration-500 ${isActive ? 'left-7 bg-[#F5F5DC]' : 'left-1'}`}></div>
      </button>
      {isActive && (
        <div className="absolute top-full left-0 w-full h-screen pointer-events-none z-0">
            <div className="w-full h-full bg-[#704214]/5 mix-blend-multiply transition-opacity duration-1000"></div>
        </div>
      )}
    </div>
  );
};

export default MeditationMode;
