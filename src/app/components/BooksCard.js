// components/BooksCard.js
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
function BooksCard() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch('http://localhost:4000/api/books'); // Adjust the API endpoint URL as needed
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBooks(data.books);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }

    fetchBooks();
  }, []);

  return (
    <>
    <h2 className="p-5 my-8 text-4xl font-bold text-center text-white bg-orange-400">
        Our Books
      </h2>
    <div className="container">
      
      <div className="flex justify-center">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {books.map((book, index) => (
            <div key={index} className="max-w-md overflow-hidden bg-white rounded-lg shadow-md">
             <Link href={`/Chapters?bookId=${book.id}`} passHref>

                  <img className="object-cover object-center w-full h-96" src={book.image} alt={book.title} />
                  <div className="p-4">
                    <h3 className="mb-2 text-xl font-semibold">{book.title}</h3>
                  </div>
                
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}

export default BooksCard;
