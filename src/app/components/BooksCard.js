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
    <h2 className="h-10 my-8 text-3xl font-bold text-center text-white bg-blue-700 rounded">
        Our Books
      </h2>
    <div className="container bg-gray-200">
      
      <div className="flex justify-center">
        <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
          {books.map((book, index) => (
            <div key={index} className="w-40 h-45 overflow-hidden bg-white rounded-lg shadow-md">
             <Link href={`/Chapters?bookId=${book.id}`} passHref>

                  <img className="object-cover object-center w-60 h-66" src={book.image} alt={book.title} />
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
