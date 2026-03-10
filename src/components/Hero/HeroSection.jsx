import React, { useState, useEffect } from 'react';

const HeroSection = () => {
    const images = [
        "/img/Gemini_Generated_Image_kghqdpkghqdpkghq.png",
        "/img/Gemini_Generated_Image_ga5tbrga5tbrga5t.png",
        "/img/Gemini_Generated_Image_jygizfjygizfjygi.png"
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // 5 seconds

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <section className="relative min-h-[50vh] flex flex-col items-center justify-center p-8 text-center overflow-hidden">
            {/* Map Background */}
            <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] mix-blend-multiply"></div>

            {/* Decorative Border - Adjusted for smaller height */}
            <div className="absolute inset-x-4 top-4 bottom-0 border-t border-x border-gold/20 z-10 pointer-events-none rounded-t-lg"></div>
            <div className="absolute inset-x-6 top-6 bottom-0 border-t border-x border-gold/10 z-10 pointer-events-none rounded-t-lg"></div>

            {/* Background Carousel */}
            <div className="absolute inset-0 z-0 flex items-end justify-center overflow-hidden">
                {images.map((image, index) => {
                    const positions = {
                        "/img/Gemini_Generated_Image_kghqdpkghqdpkghq.png": "object-[center_25%]",
                        "/img/Gemini_Generated_Image_ga5tbrga5tbrga5t.png": "object-[center_66%]",
                        "/img/Gemini_Generated_Image_jygizfjygizfjygi.png": "object-center"
                    };

                    return (
                        <img
                            key={image}
                            src={image}
                            alt={`Ambiente ${index + 1}`}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-50' : 'opacity-0'
                                } mask-image-gradient-to-t ${positions[image] || 'object-center'}`}
                            style={{ maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)' }}
                        />
                    );
                })}
            </div>

            <div className="relative z-10 max-w-5xl mx-auto space-y-6 animate-fade-in-up mt-8 transform -translate-y-1/4">
                <div className="text-gold-dim font-display tracking-[0.3em] text-xs md:text-sm uppercase">
                    Archivo Confidencial No. 1894
                </div>

                <h1 className="font-display font-semibold text-ink leading-tight drop-shadow-sm w-full max-w-full mx-auto uppercase px-4 text-center">
                    <span className="block text-2xl md:text-3xl lg:text-4xl xl:text-5xl">VIDA Y ENSEÑANZAS DE LOS MAESTROS</span>
                    <span className="text-gold-dim block mt-2 text-xl md:text-3xl lg:text-4xl xl:text-5xl">DEL LEJANO ORIENTE</span>
                </h1>

                <p className="font-serif text-xl text-ink-light italic mt-6">
                    B.T. Spalding
                </p>

                <div className="flex items-center justify-center gap-4 my-4">
                    <div className="h-px w-16 bg-gold"></div>
                    <div className="w-2 h-2 rotate-45 bg-gold"></div>
                    <div className="h-px w-16 bg-gold"></div>
                </div>

                <p className="font-serif text-base md:text-lg text-ink-light max-w-2xl mx-auto italic opacity-80">
                    Expedición científica a los Himalayas
                </p>
            </div>
        </section>
    );
};

export default HeroSection;
