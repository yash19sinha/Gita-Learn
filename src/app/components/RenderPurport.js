import React from 'react';

function RenderPurport({ verseDetails, fontSizeClass }) {
  if (!verseDetails.purport) {
    return null;
  }

  const renderParagraphs = (paragraphs) => {
    return paragraphs.map((paragraph, index) => (
      <p key={index} className={`p-1 flex justify-center leading-9 ${fontSizeClass}`}>
        {paragraph}
      </p>
    ));
  };

  return (
    <div className={`p-0 font-normal text-justify sm:mx-10 sm:px-5 ${fontSizeClass}`} style={{ whiteSpace: 'pre-line' }}>
      <h2 className={`flex justify-center p-3 text-2xl font-bold items-center ${fontSizeClass}`}>Purport</h2>
      {Array.isArray(verseDetails.purport) ? renderParagraphs(verseDetails.purport) : (
        <p className={`p-1 flex justify-center leading-9  ${fontSizeClass}`}>
          {verseDetails.purport}
        </p>
      )}
    </div>
  );
}

export default RenderPurport;
