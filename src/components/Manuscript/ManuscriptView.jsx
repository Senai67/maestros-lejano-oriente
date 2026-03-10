import React, { useState, useEffect, useMemo, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { LIBROS } from '../../data/libros';

const ManuscriptView = ({ volume, onBack, jumpToParagraph }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentParagraph, setCurrentParagraph] = useState(0);
    const [isReadingMode, setIsReadingMode] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState('');

    const isPlayingRef = useRef(false);
    const activeParagraphRef = useRef(null);
    const textContainerRef = useRef(null);

    // Initialize voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                // Filter for Spanish voices as preference, but expose all just in case
                const esVoices = availableVoices.filter(v => v.lang.startsWith('es'));
                const finalVoices = esVoices.length > 0 ? esVoices : availableVoices;

                setVoices(finalVoices);

                // Select a default voice 
                const defaultVoiceURI = localStorage.getItem('selected_voice_uri');
                if (defaultVoiceURI && finalVoices.some(v => v.voiceURI === defaultVoiceURI)) {
                    setSelectedVoiceURI(defaultVoiceURI);
                } else {
                    setSelectedVoiceURI(finalVoices[0]?.voiceURI || '');
                }
            }
        };

        loadVoices();
        // Important: in some browsers voices are loaded asynchronously
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    // Stop speaking when user unmounts or leaves the view
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
            isPlayingRef.current = false;
            setIsPlaying(false);
        };
    }, []);

    const allParagraphs = useMemo(() => {
        if (!volume) return [];
        const bookKey = `Vida y Enseñanzas de los Maestros ${volume.id}`;
        const chapters = LIBROS[bookKey];
        if (!chapters) return [];

        let paragraphs = [];
        chapters.forEach(ch => {
            paragraphs.push({ type: 'title', text: ch.title });
            const contentParas = ch.content.split('\n').filter(p => p.trim() !== '');
            contentParas.forEach(p => paragraphs.push({ type: 'content', text: p }));
        });
        return paragraphs;
    }, [volume]);

    // Recover progress from local storage
    useEffect(() => {
        if (!volume) return;
        const savedIdx = localStorage.getItem(`audio_progress_vol_${volume.id}`);
        if (savedIdx && jumpToParagraph === null) {
            setCurrentParagraph(parseInt(savedIdx, 10));
        } else if (jumpToParagraph === null) {
            setCurrentParagraph(0);
        }
    }, [volume, jumpToParagraph]);

    // Handle jumping to a specific paragraph from search
    useEffect(() => {
        if (jumpToParagraph !== null && jumpToParagraph !== undefined) {
            setIsReadingMode(true);
            setCurrentParagraph(jumpToParagraph);
            // Small delay to ensure the reading view is rendered before scrolling
            setTimeout(() => {
                if (activeParagraphRef.current) {
                    activeParagraphRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }, 100);
        }
    }, [jumpToParagraph, isReadingMode]);

    // Scroll to active paragraph when it changes in reading mode
    useEffect(() => {
        if (isReadingMode && activeParagraphRef.current) {
            activeParagraphRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [currentParagraph, isReadingMode]);

    const playNext = (index) => {
        if (!isPlayingRef.current) return;
        if (index >= allParagraphs.length) {
            isPlayingRef.current = false;
            setIsPlaying(false);
            return;
        }

        setCurrentParagraph(index);
        localStorage.setItem(`audio_progress_vol_${volume.id}`, index.toString());

        const utterance = new SpeechSynthesisUtterance(allParagraphs[index].text);
        utterance.lang = 'es-ES';
        utterance.rate = 0.95; // Slightly slower for better reading

        // Apply selected voice
        if (selectedVoiceURI) {
            const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
            if (voice) {
                utterance.voice = voice;
            }
        }

        utterance.onend = () => {
            playNext(index + 1);
        };

        utterance.onerror = (e) => {
            console.error("Speech Synthesis Error:", e);
            isPlayingRef.current = false;
            setIsPlaying(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    const handleListenToggle = () => {
        if (!window.speechSynthesis) return alert("Tu navegador no soporta lectura por voz.");

        if (isPlayingRef.current) {
            window.speechSynthesis.cancel();
            isPlayingRef.current = false;
            setIsPlaying(false);
        } else {
            setIsReadingMode(true);
            isPlayingRef.current = true;
            setIsPlaying(true);
            playNext(currentParagraph);
        }
    };

    const handleVoiceChange = (e) => {
        const uri = e.target.value;
        setSelectedVoiceURI(uri);
        localStorage.setItem('selected_voice_uri', uri);

        // If it's playing, we need to restart the utterance with the new voice
        if (isPlayingRef.current) {
            window.speechSynthesis.cancel();
            setTimeout(() => {
                playNext(currentParagraph);
            }, 100);
        }
    };

    const handleParagraphClick = (index) => {
        if (!isReadingMode) return;
        setCurrentParagraph(index);
        localStorage.setItem(`audio_progress_vol_${volume.id}`, index.toString());
        if (isPlayingRef.current) {
            window.speechSynthesis.cancel();
            setTimeout(() => {
                playNext(index);
            }, 100);
        }
    };

    const handleResetAudio = () => {
        window.speechSynthesis.cancel();
        isPlayingRef.current = false;
        setIsPlaying(false);
        setCurrentParagraph(0);
        localStorage.setItem(`audio_progress_vol_${volume.id}`, '0');
    };

    const handleDownloadPDF = () => {
        const bookKey = `Vida y Enseñanzas de los Maestros ${volume.id}`;
        const chapters = LIBROS[bookKey];

        if (!chapters || chapters.length === 0) {
            alert("No hay contenido disponible para este volumen aún.");
            return;
        }

        const doc = new jsPDF();
        let currentY = 20;
        const pageHeight = 280;

        doc.setFont("times", "normal");

        // Título del Libro
        doc.setFontSize(22);
        doc.text(volume.title, 20, currentY);
        currentY += 15;

        chapters.forEach((chapter) => {
            if (currentY > pageHeight - 20) {
                doc.addPage();
                currentY = 20;
            }

            doc.setFontSize(16);
            doc.setFont("times", "bold");

            const chapterTitleLines = doc.splitTextToSize(chapter.title, 170);
            chapterTitleLines.forEach(line => {
                if (currentY > pageHeight - 10) { doc.addPage(); currentY = 20; }
                doc.text(line, 20, currentY);
                currentY += 10;
            });

            doc.setFontSize(12);
            doc.setFont("times", "normal");

            const contentLines = doc.splitTextToSize(chapter.content, 170);
            contentLines.forEach(line => {
                if (currentY > pageHeight - 10) {
                    doc.addPage();
                    currentY = 20;
                }
                doc.text(line, 20, currentY);
                currentY += 6;
            });

            currentY += 10; // Extra space after a chapter
        });

        doc.save(`${volume.title.replace(/[: ]+/g, '_')}.pdf`);
    };

    if (!volume) return null;

    if (isReadingMode) {
        return (
            <section className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-parchment animate-fade-in flex flex-col items-center">
                <div className="w-full max-w-4xl bg-parchment-light shadow-mystic border border-gold/20 rounded-lg overflow-hidden flex flex-col h-[85vh]">

                    {/* Toolbar */}
                    <div className="bg-parchment-dark/80 p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gold/30 shrink-0">
                        <button
                            onClick={() => setIsReadingMode(false)}
                            className="flex items-center text-ink-light hover:text-gold transition-colors font-display tracking-widest text-sm uppercase"
                        >
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver
                        </button>

                        <div className="flex items-center gap-4 flex-wrap justify-center">
                            <select
                                value={selectedVoiceURI}
                                onChange={handleVoiceChange}
                                className="bg-parchment border border-gold/30 text-ink-light font-serif text-sm px-3 py-1.5 rounded outline-none focus:border-gold max-w-[200px] truncate"
                            >
                                {voices.map(v => (
                                    <option key={v.voiceURI} value={v.voiceURI}>
                                        {v.name}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={handleListenToggle}
                                className={`px-4 py-1.5 font-display tracking-widest transition-colors flex items-center gap-2 rounded text-sm ${isPlaying
                                    ? 'bg-red-800 text-parchment hover:bg-red-900 border border-transparent'
                                    : 'bg-gold text-parchment hover:bg-gold-dim border border-transparent'
                                    }`}
                            >
                                {isPlaying ? "Pausar" : "Reanudar"}
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-ink/5 shrink-0">
                        <div
                            className="h-full bg-gold transition-all duration-300 ease-out"
                            style={{ width: `${allParagraphs.length > 0 ? (currentParagraph / (allParagraphs.length - 1)) * 100 : 0}%` }}
                        ></div>
                    </div>

                    {/* Text Container */}
                    <div
                        ref={textContainerRef}
                        className="p-6 md:p-12 overflow-y-auto grow space-y-6 md:space-y-8 scroll-smooth"
                    >
                        {allParagraphs.map((para, idx) => {
                            const isActive = idx === currentParagraph;
                            return (
                                <div
                                    key={idx}
                                    ref={isActive ? activeParagraphRef : null}
                                    onClick={() => handleParagraphClick(idx)}
                                    className={`transition-colors duration-300 p-4 rounded cursor-pointer ${isActive
                                        ? 'bg-gold/15 border-l-4 border-gold shadow-sm'
                                        : 'hover:bg-ink/5 border-l-4 border-transparent'
                                        }`}
                                >
                                    {para.type === 'title' ? (
                                        <h2 className={`font-display text-2xl md:text-3xl text-ink ${isActive ? 'text-gold-dim' : ''}`}>
                                            {para.text}
                                        </h2>
                                    ) : (
                                        <p className={`font-serif text-lg md:text-xl leading-relaxed ${isActive ? 'text-ink' : 'text-ink-light'}`}>
                                            {para.text}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen pt-8 pb-24 lg:py-24 px-6 md:px-12 bg-parchment relative animate-fade-in">
            <div className="max-w-6xl mx-auto">
                {/* Navigation */}
                <button
                    onClick={onBack}
                    className="mb-8 lg:mb-12 flex items-center text-ink-light hover:text-gold transition-colors group"
                >
                    <svg className="w-6 h-6 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="font-display tracking-widest text-sm uppercase">Volver a la Biblioteca</span>
                </button>

                {/* Content Header */}
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 mb-16">
                    <div className="lg:col-span-4 perspective-1000 order-2 lg:order-none mt-4 lg:mt-0 flex justify-center">
                        {/* Large Book Cover Representation */}
                        <div className="w-full max-w-[200px] lg:max-w-none aspect-[2/3] rounded-sm bg-[#5D4037] relative shadow-2xl transform rotate-y-12">
                            <div className="absolute inset-4 border border-gold/30"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-gold-bright font-display text-2xl lg:text-4xl text-center p-8">
                                {volume.title}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-8 order-1 lg:order-none">
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-ink leading-tight">
                            {volume.title}
                        </h1>
                        <div className="h-px w-24 bg-gold"></div>
                        <p className="font-serif text-xl md:text-2xl text-ink-light leading-relaxed">
                            {volume.summary}
                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleListenToggle}
                                    className={`px-8 py-3 font-display tracking-widest transition-colors shadow-lg flex items-center gap-2 ${isPlaying
                                        ? 'bg-red-800 text-parchment hover:bg-red-900'
                                        : 'bg-gold text-parchment hover:bg-gold-dim'
                                        }`}
                                >
                                    {isPlaying ? (
                                        <>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                            Leer Manuscrito
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                            Leer Manuscrito
                                        </>
                                    )}
                                </button>
                                {currentParagraph > 0 && (
                                    <button
                                        onClick={handleResetAudio}
                                        title="Reiniciar lectura desde el principio"
                                        className="p-3 border border-ink/20 text-ink/60 hover:text-ink hover:border-gold transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={handleDownloadPDF}
                                className="px-8 py-3 border border-ink/20 text-ink font-display tracking-widest hover:border-gold hover:text-gold transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Descargar Manuscrito
                            </button>
                        </div>

                        {(currentParagraph > 0 || isPlaying) && (
                            <div className="mt-4 text-sm font-serif text-ink/60 italic">
                                {/* Visual cue of progress */}
                                {allParagraphs.length > 0 && `Progreso de lectura: ${Math.round((currentParagraph / allParagraphs.length) * 100)}%`}
                            </div>
                        )}
                    </div>
                </div>

                {/* Milestones / Hitos */}
                <div className="mb-24">
                    <h2 className="font-display text-3xl text-ink mb-12 text-center">Hitos del Viaje</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {volume.milestones && volume.milestones.map((milestone, idx) => (
                            <div key={idx} className="bg-parchment-light p-8 border border-gold/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 text-6xl font-display text-gold/10 group-hover:text-gold/20 transition-colors">
                                    {idx + 1}
                                </div>
                                <h3 className="font-display text-xl text-gold-dim mb-4 relative z-10">{milestone.title}</h3>
                                <p className="font-serif text-ink-light relative z-10">{milestone.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ManuscriptView;
