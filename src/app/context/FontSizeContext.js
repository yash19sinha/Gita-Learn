"use client"
import React, { createContext, useContext, useState } from 'react';

const FontSizeContext = createContext();

export const useFontSize = () => useContext(FontSizeContext);

export const FontSizeProvider = ({ children }) => {
  const [fontSizeClass, setFontSizeClass] = useState('text-xl');

  return (
    <FontSizeContext.Provider value={{ fontSizeClass, setFontSizeClass }}>
      {children}
    </FontSizeContext.Provider>
  );
};
