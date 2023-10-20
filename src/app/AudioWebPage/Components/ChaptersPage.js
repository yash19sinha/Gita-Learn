import React from 'react';
import chaptersData from './chapters.json';

const ChaptersPage = () => {
  return (
    <div className="container mx-auto p-5 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Chapters Table</h1>
      <table className="min-w-full border ">
        <thead>
          <tr>
            <th className="border p-2">Serial Number</th>
            <th className="border p-2">Chapter Name</th>
            <th className="border p-2">Author</th>
          </tr>
        </thead>
        <tbody>
          {chaptersData.map((chapter, index) => (
            <tr key={index}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2"><a href="#">{chapter.name}</a></td>
              <td className="border p-2">{chapter.author}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChaptersPage;
