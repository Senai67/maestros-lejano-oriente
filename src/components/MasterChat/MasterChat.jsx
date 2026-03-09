import React, { useState, useEffect, useRef } from 'react';

const MasterChat = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { role: 'master', text: 'Bienvenido, buscador de la verdad. ¿Qué inquietud trae tu corazón ante la presencia de lo Universal?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulación de respuesta basada en los volúmenes
        setTimeout(() => {
            let response = "Medita en el silencio de tu propio ser. Allí, en la Uni-Mente, encontrarás que la respuesta ya te ha sido dada por el Padre.";

            const lowerInput = input.toLowerCase();
            if (lowerInput.includes('vida')) {
                response = "La Vida es la pulsación misma de Dios en cada átomo. No hay muerte, solo cambio de forma en la eterna progresión de la luz.";
            } else if (lowerInput.includes('maestro') || lowerInput.includes('emilio')) {
                response = "El Maestro Emilio nos enseñó que no hay límites para aquel que reconoce su unidad con la Fuente Creativa.";
            } else if (lowerInput.includes('himalaya')) {
                response = "Las montañas del Himalaya son solo el escenario físico de una elevación que debe ocurrir primero en tu conciencia.";
            } else if (lowerInput.includes('cristo')) {
                response = "La Conciencia Crística es el estado natural del hombre. Reclama tu herencia como hijo de lo Divino.";
            }

            setMessages(prev => [...prev, { role: 'master', text: response }]);
            setIsTyping(false);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-lg bg-parchment shadow-mystic rounded-lg overflow-hidden flex flex-col h-[600px] border-2 border-gold/30 paper-edge">
                {/* Header */}
                <div className="bg-parchment-dark/80 px-6 py-4 flex justify-between items-center border-b border-gold/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center border border-gold/40">
                            <span className="text-gold font-display text-xl">M</span>
                        </div>
                        <div>
                            <h3 className="font-display text-gold-dim leading-none">Pregunta al Maestro</h3>
                            <span className="text-[10px] uppercase tracking-widest text-ink/50">Expedición 1894</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-ink/40 hover:text-ink transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                            <div className={`max-w-[85%] px-5 py-3 rounded-2xl ${msg.role === 'user'
                                    ? 'bg-ink text-parchment rounded-tr-none'
                                    : 'bg-gold/5 text-ink-light rounded-tl-none border border-gold/10'
                                }`}>
                                <p className={`text-sm md:text-base ${msg.role === 'master' ? 'master-response' : 'font-serif'}`}>
                                    {msg.text}
                                </p>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start animate-pulse">
                            <div className="bg-gold/5 px-4 py-2 rounded-full border border-gold/10 italic text-xs text-gold-dim">
                                El Maestro está sintonizando con lo Universal...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-parchment-light border-t border-gold/20">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Escribe tu inquietud aquí..."
                            className="w-full bg-transparent border-b-2 border-gold/10 focus:border-gold py-3 px-4 pr-12 outline-none font-serif text-ink italic placeholder:text-ink/30 transition-all"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="absolute right-2 p-2 text-gold hover:text-gold-bright disabled:text-gold/20 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9-2-9-18-9 18 9 2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-[10px] text-center mt-3 text-ink/40 uppercase tracking-tighter">
                        La sabiduría fluye desde lo invisible
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MasterChat;
