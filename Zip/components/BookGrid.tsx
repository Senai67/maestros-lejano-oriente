
import React from 'react';
import { Book } from '../types';
import BookCard from './BookCard';

interface BookGridProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

const BookGrid: React.FC<BookGridProps> = ({ books, onSelectBook }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 px-2">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onClick={() => onSelectBook(book)} />
      ))}
    </div>
  );
};

export default BookGrid;
