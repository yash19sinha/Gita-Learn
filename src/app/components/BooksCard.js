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
    <div>
    <h2 className="p-4 my-8 text-3xl font-bold text-center text-white bg-orange-500 rounded ">
        Books Section
    </h2>
    <div className="bg-white ">
      
      <div className="flex justify-center">
        <div className="grid w-2/3 grid-cols-2 gap-16 p-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-3/5">
          {books.map((book, index) => (
            <div key={index} className="overflow-hidden bg-white rounded-lg shadow-md ">
             <Link href={`/Chapters?bookId=${book.id}`} passHref>

                  <img className="object-cover object-center " src={book.image} alt={book.title} />
                 
                
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}

export default BooksCard;
