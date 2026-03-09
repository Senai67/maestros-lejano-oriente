import React from 'react';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-parchment text-ink font-sans relative overflow-x-hidden">
            {/* Background Texture Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-40 bg-paper-texture z-0"></div>

            {/* Content */}
            <main className="relative z-10 flex flex-col min-h-screen">
                {children}

                {/* Footer */}
                <footer className="mt-auto py-12 text-center border-t border-gold/30 bg-parchment-dark/50 backdrop-blur-sm">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="flex justify-center mb-6">
                            <svg className="w-8 h-8 text-gold" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                            </svg>
                        </div>
                        <p className="font-serif text-lg md:text-xl italic text-ink-light">
                            "SIENTAN en toda situación. Sientan y no quieran razonarlo todo."
                        </p>
                        <div className="mt-4 text-sm text-gold-dim font-display tracking-widest uppercase">
                            Archivos de la Expedición de 1894
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default MainLayout;
