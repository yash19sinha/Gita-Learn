import Link from "next/link";


const SearchResults = ({ searchResults }) => {
    return (
      <ul className="p-5 m-4 mt-4">
        {searchResults.map(result => (
          <li key={result.verse_number} className="py-4 border-b border-gray-200">
            <p className="">{result.highlighted_content}</p>
            <p className="text-red-500">{result.user_query}</p>
            <Link href={result.verse_link} className="text-blue-500 hover:text-blue-600">Go to verse</Link>
          </li>
        ))}
      </ul>
    );
  };
  
  export default SearchResults;