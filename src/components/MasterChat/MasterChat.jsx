import React, { useState, useEffect, useRef } from 'react';
import { librarySearch } from '../../lib/search';
import { volumes } from '../../data/volumes';

const MasterChat = ({ isOpen, onClose, onNavigateToBook }) => {
    const [messages, setMessages] = useState([
        { role: 'master', text: 'Bienvenido, buscador de la verdad. Escribe cualquier palabra o frase y buscaré su rastro en los manuscritos de los Maestros.' }
    ]);
    const [input, setInput] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const messagesEndRef = useRef(null);

    // Initialize search on first open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => librarySearch.init(), 0);
        }
    }, [isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isSearching]);

    const handleJumpToResult = (result) => {
        const volumeData = volumes.find(v => v.id === parseInt(result.volumeId));
        if (volumeData && onNavigateToBook) {
            // Pass the paragraph index within the volume, not the global search ID
            onNavigateToBook(volumeData, result.paragraphIndex);
        }
    };

    const handleClearSearch = () => {
        setMessages([
            { role: 'master', text: 'Bienvenido, buscador de la verdad. Escribe cualquier palabra o frase y buscaré su rastro en los manuscritos de los Maestros.' }
        ]);
        setInput('');
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const query = input;
        const userMsg = { role: 'user', text: query };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsSearching(true);

        try {
            const results = librarySearch.search(query);

            if (results.length === 0) {
                setMessages(prev => [...prev, {
                    role: 'master',
                    text: 'El silencio reina. No he encontrado registros exactos de esas palabras en los manuscritos. Intenta buscar con términos más sencillos o raíces de palabras.'
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'master',
                    text: `He hallado ecos de tu búsqueda en ${results.length} fragmento${results.length > 1 ? 's' : ''}.`,
                    results: results
                }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                role: 'master',
                text: 'Ha ocurrido una perturbación al ojear los registros. Inténtalo de nuevo.'
            }]);
        } finally {
            setIsSearching(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-2xl bg-parchment shadow-mystic rounded-lg overflow-hidden flex flex-col h-[80vh] border-2 border-gold/30 paper-edge">
                {/* Header */}
                <div className="bg-parchment-dark/80 px-6 py-4 flex justify-between items-center border-b border-gold/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center border border-gold/40">
                            <span className="text-gold font-display text-xl">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                        </div>
                        <div>
                            <h3 className="font-display text-gold-dim leading-none">Buscador de Manuscritos</h3>
                            <span className="text-[10px] uppercase tracking-widest text-ink/50">Expedición 1894</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleClearSearch}
                            className="text-ink/40 hover:text-gold transition-colors p-2"
                            title="Limpiar búsqueda"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                        <button
                            onClick={onClose}
                            className="text-ink/40 hover:text-ink transition-colors p-2"
                            title="Cerrar"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Messages & Results */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up w-full`}>
                            {msg.role === 'user' ? (
                                <div className="max-w-[85%] px-5 py-3 rounded-2xl bg-ink text-parchment rounded-tr-none">
                                    <p className="font-serif text-sm md:text-base">{msg.text}</p>
                                </div>
                            ) : (
                                <div className="w-full max-w-full md:max-w-[90%]">
                                    <div className="px-5 py-3 rounded-2xl bg-gold/5 text-ink-light rounded-tl-none border border-gold/10 inline-block">
                                        <p className="master-response text-sm md:text-base">{msg.text}</p>
                                    </div>

                                    {/* Render Search Results */}
                                    {msg.results && msg.results.length > 0 && (
                                        <div className="mt-4 space-y-3 pl-2 md:pl-6">
                                            {msg.results.map((res, resIdx) => (
                                                <button
                                                    key={resIdx}
                                                    onClick={() => handleJumpToResult(res)}
                                                    className="w-full text-left bg-parchment-light border border-gold/20 p-4 rounded shadow-sm relative group hover:border-gold/50 transition-colors"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-xs font-display tracking-widest uppercase text-gold-dim">
                                                            Tomo {res.volumeId} • {res.chapterTitle}
                                                        </span>
                                                        <span
                                                            className="text-xs text-ink/40 group-hover:text-gold flex items-center gap-1 transition-colors"
                                                            title="Ver libro"
                                                        >
                                                            <span>(Ir al texto)</span>
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                        </span>
                                                    </div>
                                                    <p className="font-serif text-ink italic text-sm md:text-base leading-relaxed">
                                                        "...{res.preview}..."
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {isSearching && (
                        <div className="flex justify-start animate-pulse">
                            <div className="bg-gold/5 px-4 py-2 rounded-full border border-gold/10 italic text-xs text-gold-dim">
                                Ojeando los registros polvorientos...
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
                            placeholder="Busca personajes, pueblos, enseñanzas..."
                            className="w-full bg-transparent border-b-2 border-gold/10 focus:border-gold py-3 px-4 pr-12 outline-none font-serif text-ink italic placeholder:text-ink/30 transition-all"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isSearching}
                            className="absolute right-2 p-2 text-gold hover:text-gold-bright disabled:text-gold/20 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MasterChat;
