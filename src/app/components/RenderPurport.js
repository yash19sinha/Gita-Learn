import React from 'react';

function RenderPurport(verseDetails) {
  // Check if purport is an array
  if (Array.isArray(verseDetails.purport)) {
    // If there are paragraphs, render each as a separate <p> element
    return (
      <div className="p-4 font-normal text-justify sm:mx-20 sm:px-10 "style={{whiteSpace: 'pre-line'}}>
        <h2 className="flex justify-center p-3 text-2xl font-bold">Purport</h2>
        {verseDetails.purport.map((paragraph, index) => (
          <p key={index} className="flex justify-center p-3 text-lg">
            {paragraph}
          </p>
        ))}
      </div>
    );
  } else if (verseDetails.purport) {
    // If purport is a single paragraph, render it as a <p> element
    return (
      <div className="p-4 font-normal text-justify sm:mx-20 sm:px-10">
        <h2 className="flex justify-center p-3 text-2xl font-bold">Purport</h2>
        <p className="flex justify-center p-3 text-lg">{verseDetails.purport}</p>
      </div>
    );
  } else {
    // If purport is null or undefined, return null
    return null;
  }
}

export default RenderPurport;
