import React from 'react';
import AdventureCard from './AdventureCard';
import { volumes } from '../../data/volumes';

const BookGrid = ({ onBookSelect }) => {
    return (
        <section className="py-8 px-6 md:px-12 bg-parchment-light relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10 space-y-4">
                    <h2 className="font-display text-3xl text-ink">La Biblioteca de los Maestros</h2>
                    <div className="h-px w-24 bg-gold mx-auto"></div>
                    <p className="font-serif text-ink-light italic text-sm">Selecciona un volumen para revelar sus misterios</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">
                    {volumes.map((vol) => (
                        <AdventureCard key={vol.id} volume={vol} onClick={onBookSelect} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BookGrid;
