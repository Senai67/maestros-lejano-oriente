
import React from 'react';

const Introduction: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto mb-16 p-6 border-2 border-[#A67B5B] bg-[#F5F5DC] shadow-xl relative overflow-hidden">
      {/* Decorative corners - subtle but elegant */}
      <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#704214]"></div>
      <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-[#704214]"></div>
      
      {/* Background seal effect */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 border-4 border-[#704214]/10 rounded-full flex items-center justify-center rotate-12 pointer-events-none">
        <span className="text-[#704214]/10 font-bold text-xs uppercase tracking-widest text-center">Expedición<br/>Original<br/>1894</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
        <div className="md:w-1/5 flex flex-col items-center justify-center border-r-0 md:border-r border-[#A67B5B]/30 pr-0 md:pr-8 text-center md:text-left">
          <h2 className="text-2xl font-bold text-[#704214] uppercase tracking-tighter italic leading-none">
            El Registro de la <br className="hidden md:block"/> Gran Expedición
          </h2>
          <div className="w-16 h-[2px] bg-[#704214] my-3"></div>
          <p className="text-[11px] text-[#A67B5B] font-bold uppercase tracking-[0.2em]">Crónica de los Once</p>
        </div>

        <div className="md:w-4/5 flex flex-col justify-center space-y-4">
          <div className="text-lg leading-relaxed text-justify text-[#1a1a1a] font-serif">
            <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-[#704214] first-letter:mr-3 first-letter:float-left first-letter:leading-none">
              En el invierno de 1894, once hombres de ciencia se adentraron en el Himalaya con el escepticismo como única brújula. Durante tres años y medio, su investigación puramente objetiva se transformó ante la evidencia de leyes universales en acción. Bajo la tutela de los Maestros, documentaron la superación de toda limitación material, legando a la posteridad este archivo sobre la divinidad real y tangible del ser humano.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-[1px] flex-grow bg-[#A67B5B]/30"></div>
            <p className="italic text-sm font-semibold text-[#704214] whitespace-nowrap">
              "La Verdad no se argumenta, se experimenta."
            </p>
            <div className="h-[1px] flex-grow bg-[#A67B5B]/30"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
