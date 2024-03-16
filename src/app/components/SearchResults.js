import React from "react";
import Link from "next/link";

const SearchResults = ({ searchResults }) => {
  return (
    <ul className="p-5 m-4 mt-4">
      {searchResults.length > 0 ? (
        searchResults.map(result => (
          <li key={`${result.chapter_number}-${result.verse_number}`} className="py-4 border-b border-gray-200">
            <p className="text-lg font-bold">Verse : {result.verse_number}</p>
            <div className="justify-between p-4 px-8 text-lg" dangerouslySetInnerHTML={{ __html: result.highlighted_content }} />
            <button>
              <Link href={result.verse_link} className="px-4 py-2 ml-2 font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none">Go to verse</Link>
            </button>
          </li>
        ))
      ) : (
        <li className="py-4">No results found</li>
      )}
    </ul>
  );
};



export default SearchResults;
