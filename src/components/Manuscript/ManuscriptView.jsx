import React from 'react';

const ManuscriptView = ({ volume, onBack }) => {
    if (!volume) return null;

    return (
        <section className="min-h-screen py-24 px-6 md:px-12 bg-parchment relative animate-fade-in">
            <div className="max-w-6xl mx-auto">
                {/* Navigation */}
                <button
                    onClick={onBack}
                    className="mb-12 flex items-center text-ink-light hover:text-gold transition-colors group"
                >
                    <svg className="w-6 h-6 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="font-display tracking-widest text-sm uppercase">Volver a la Biblioteca</span>
                </button>

                {/* Content Header */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
                    <div className="lg:col-span-4 perspective-1000">
                        {/* Large Book Cover Representation */}
                        <div className="w-full aspect-[2/3] rounded-sm bg-[#5D4037] relative shadow-2xl transform rotate-y-12">
                            <div className="absolute inset-4 border border-gold/30"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-gold-bright font-display text-4xl text-center p-8">
                                {volume.title}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-8">
                        <h1 className="font-display text-5xl md:text-6xl text-ink leading-tight">
                            {volume.title}
                        </h1>
                        <div className="h-px w-24 bg-gold"></div>
                        <p className="font-serif text-xl md:text-2xl text-ink-light leading-relaxed">
                            {volume.summary}
                        </p>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <button className="px-8 py-3 bg-gold text-parchment font-display tracking-widest hover:bg-gold-dim transition-colors shadow-lg">
                                Escuchar Sabiduría
                            </button>
                            <button className="px-8 py-3 border border-ink/20 text-ink font-display tracking-widest hover:border-gold hover:text-gold transition-colors">
                                Descargar Manuscrito
                            </button>
                        </div>
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
