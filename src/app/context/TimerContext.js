// TimerContext.js
"use client"
import React, { createContext, useContext, useState } from 'react';
import { db } from '../firebase/config';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [timersList, setTimersList] = useState([]);

  const addTimer = async (userId, timer) => {
    try {
      const userRef = db.collection('users').doc(userId);

      // Add the timer to the 'timers' array in the user's document
      await userRef.update({
        timers: [...timersList, { timer, timestamp: new Date() }],
      });

      setTimersList((prevTimers) => [...prevTimers, { timer, timestamp: new Date() }]);
    } catch (error) {
      console.error('Error adding timer to Firestore:', error);
    }
  };

  return (
    <TimerContext.Provider value={{ timersList, addTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
};
