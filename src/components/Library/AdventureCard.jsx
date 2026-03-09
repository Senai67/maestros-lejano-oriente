import React from 'react';

const AdventureCard = ({ volume, onClick }) => {
    return (
        <div
            onClick={() => onClick(volume)}
            className="group relative w-full aspect-[2/3] cursor-pointer perspective-1000"
        >
            <div className="w-full h-full transition-all duration-500 transform group-hover:-translate-y-4 group-hover:shadow-2xl rounded-sm border-r-4 border-b-4 border-ink/20 bg-[#5D4037] relative overflow-hidden">
                {/* Binder texture */}
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/20 z-20"></div>

                {/* Cover Design */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#8D6E63] to-[#3E2723] p-6 flex flex-col justify-between items-center text-center border-2 border-[#A1887F]/30 m-1">
                    {/* Top Ornament */}
                    <div className="w-full h-px bg-gold/40 mb-2"></div>
                    <div className="text-gold/60 text-xs font-display tracking-widest">VOL. {volume.id}</div>

                    {/* Title */}
                    <h3 className="font-display text-gold-bright text-xl md:text-2xl leading-relaxed drop-shadow-md">
                        {volume.title.replace(`Vol. ${volume.id}: `, '')}
                    </h3>

                    {/* Center Ornament */}
                    <div className="w-12 h-12 border border-gold/30 rounded-full flex items-center justify-center">
                        <div className="w-8 h-8 border border-gold/30 rotate-45"></div>
                    </div>

                    {/* Bottom */}
                    <div className="text-gold/40 text-[10px] tracking-[0.2em] uppercase">B.T. Spalding</div>
                    <div className="w-full h-px bg-gold/40 mt-2"></div>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            </div>
        </div>
    );
};

export default AdventureCard;
