// context/ThemeContext.js
"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(); // Creates a Context object

export const useTheme = () => useContext(ThemeContext); // Custom hook to use the context

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Default theme

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  // This useEffect hook will be triggered every time the `theme` state changes.
  useEffect(() => {
    // Sets the attribute on <html>, allowing your CSS to react to the current theme.
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
