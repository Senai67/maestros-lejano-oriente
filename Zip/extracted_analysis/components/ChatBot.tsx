
import React, { useState, useRef, useEffect } from 'react';
import { chatWithMaster } from '../services/geminiService';
import { Message } from '../types';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Saludos, buscador de la verdad. ¿Qué anhelas saber sobre los senderos sagrados del Himalaya?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const response = await chatWithMaster(userMessage, history);
      setMessages(prev => [...prev, { role: 'model', text: response || 'El silencio es mi respuesta.' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Las vibraciones están turbias. Intenta preguntar de nuevo.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto h-[700px] flex flex-col bg-[#F5F5DC] border-4 border-[#704214] shadow-2xl rounded-lg overflow-hidden relative">
      <div className="p-6 bg-[#704214] text-[#F5F5DC] flex items-center justify-between">
        <h2 className="text-2xl font-bold italic">Diálogo con el Maestro</h2>
        <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
      </div>

      <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-4 scroll-custom bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-lg shadow-md border ${
              m.role === 'user' 
                ? 'bg-[#A67B5B] text-white border-[#704214]' 
                : 'bg-white text-[#1a1a1a] border-[#A67B5B]'
            }`}>
              <p className="text-lg leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-lg shadow-md border border-[#A67B5B] flex gap-2">
              <span className="w-2 h-2 bg-[#704214] rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-[#704214] rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-[#704214] rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-[#A67B5B]/30 flex gap-4">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Pregunta al Maestro sobre la Uni-mente..."
          className="flex-grow p-4 border-2 border-[#A67B5B] rounded-lg focus:outline-none focus:border-[#704214] text-lg"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-[#704214] text-[#F5F5DC] px-8 rounded-lg font-bold hover:bg-[#A67B5B] transition-colors disabled:opacity-50"
        >
          Enviar
        </button>
      </div>
    </section>
  );
};

export default ChatBot;
