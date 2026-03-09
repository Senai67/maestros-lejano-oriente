
import React, { useState } from 'react';
import { analyzeArtifact } from '../services/geminiService';

const ImageAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setSelectedImage(reader.result as string);
        runAnalysis(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async (base64: string) => {
    setLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeArtifact(base64);
      setAnalysis(result || "El artefacto guarda sus secretos por ahora.");
    } catch (error) {
      setAnalysis("Error al analizar el objeto. Las fuerzas no están alineadas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto p-8 bg-[#F5F5DC] border-4 border-[#704214] shadow-2xl rounded-lg text-center">
      <h2 className="text-3xl font-bold text-[#704214] mb-4 italic">Laboratorio Arqueológico de la Expedición</h2>
      <p className="text-xl mb-8 opacity-80">Sube una fotografía de un artefacto, paisaje o reliquia para descubrir su esencia espiritual según las crónicas de 1894.</p>

      <div className="mb-12">
        <label className="cursor-pointer inline-flex items-center gap-3 bg-[#704214] text-[#F5F5DC] py-4 px-8 rounded-full font-bold hover:bg-[#A67B5B] transition-all shadow-xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Someter Hallazgo a Estudio
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {selectedImage && (
          <div className="border-4 border-[#704214]/30 p-2 bg-white shadow-lg">
            <img src={selectedImage} alt="Preview" className="w-full h-auto sepia-filter" />
          </div>
        )}
        
        {analysis && (
          <div className="bg-white p-6 border-l-8 border-[#704214] text-left shadow-lg">
            <h3 className="text-xl font-bold text-[#704214] mb-3 uppercase tracking-tighter">Diario de Expedición:</h3>
            <p className="text-lg leading-relaxed italic">{analysis}</p>
          </div>
        )}

        {loading && (
          <div className="col-span-1 md:col-span-2 py-12 flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-[#704214] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl font-bold animate-pulse text-[#704214]">Analizando resonancia espiritual...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageAnalyzer;
