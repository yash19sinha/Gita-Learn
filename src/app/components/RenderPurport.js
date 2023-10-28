import React from 'react';

function RenderPurport(verseDetails) {
  if (verseDetails.purport) {
    return (
      <div className="p-4 font-normal text-justify sm:mx-20 sm:px-10">
        <h2 className="flex justify-center p-3 text-2xl font-bold">Purport</h2>
        <p className="flex justify-center p-3 text-lg">{verseDetails.purport}</p>
      </div>
    );
  } else {
    return null;
  }
}

export default RenderPurport;
