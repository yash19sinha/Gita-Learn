import React from 'react';

function RenderPurport({ verseDetails, fontSizeClass }) {
  if (Array.isArray(verseDetails.purport)) {
    return (
      <div className={`p-4 font-normal text-justify sm:mx-20 sm:px-10 ${fontSizeClass}`} style={{ whiteSpace: 'pre-line' }}>
        <h2 className={`flex justify-center p-3 text-2xl font-bold items-center ${fontSizeClass}`}>Purport</h2>
        {verseDetails.purport.map((paragraph, index) => {
          console.log(`Rendering paragraph ${index} with fontSizeClass: ${fontSizeClass}`);
          return (
            <p key={index} className={`p-3 flex justify-center ${fontSizeClass}`}>
              {paragraph}
            </p>
          );
        })}
      </div>
    );
  } else if (verseDetails.purport) {
    return (
      <div className="flex items-center p-4 font-normal text-center sm:mx-20 sm:px-10" style={{ whiteSpace: 'pre-line' }}>
        <h2 className={`flex  p-3 text-2xl font-bold text-center ${fontSizeClass}`}>Purport</h2>
        <p className={`flex justify-between text-center items-center ${fontSizeClass}`}>
          {verseDetails.purport}
        </p>
      </div>
    );
  } else {
    return null;
  }
}

export default RenderPurport;
