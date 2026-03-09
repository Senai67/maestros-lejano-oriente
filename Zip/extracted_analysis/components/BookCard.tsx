
import React from 'react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="group bg-[#F5F5DC]/90 backdrop-blur-sm border border-[#704214]/30 shadow-md p-3 flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative h-full text-left w-full"
    >
      {/* Book "Cover" look */}
      <div className="relative mb-3 overflow-hidden aspect-[2/3] border border-[#704214]/50 shadow-inner bg-[#3d2b1f]">
        <img 
          src={`https://picsum.photos/seed/${book.id + 500}/400/600`} 
          alt={book.imageAlt}
          className="w-full h-full object-cover sepia-filter grayscale opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 to-transparent flex flex-col justify-end p-2">
           <span className="text-white font-bold text-[10px] tracking-widest uppercase opacity-80">{book.volume}</span>
        </div>
      </div>

      <div className="flex-grow">
        <h3 className="text-xl font-bold text-[#704214] mb-1 leading-tight uppercase tracking-tighter h-14 overflow-hidden line-clamp-2 font-serif">
          {book.title}
        </h3>
        <p className="text-[10px] text-[#A67B5B] uppercase tracking-widest font-bold mt-1">Ver Detalles →</p>
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-[#704214] text-[#F5F5DC] p-1 rounded-full shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="m15 5 7 7-7 7"/></svg>
        </div>
      </div>
    </button>
  );
};

export default BookCard;
