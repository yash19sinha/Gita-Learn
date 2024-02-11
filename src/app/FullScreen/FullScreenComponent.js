// FullScreenComponent.js
"use client"
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';


const FullScreenComponent = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const user = auth.currentUser;

  const enterFullScreen = () => {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  const exitFullScreen = async () => {
    if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
      // Exit fullscreen only if the document is in fullscreen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
  
      // Add the timer to the user's document
      if (timerSeconds > 0 && user) {
        const userId = user.uid;
        const userRef = doc(db, 'users', userId);
      
        try {
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data();
      
          await updateDoc(userRef, {
            timers: [
              ...(userData.timers || []), // existing timers, if any
              { timer: timerSeconds, timestamp: new Date() },
            ],
          });
        } catch (error) {
          console.error('Error updating user document:', error);
        }
      }
    } else {
      console.warn('Document is not in fullscreen mode.');
    }
  };
  
  useEffect(() => {
    const handleFullScreenChange = () => {
      const fullscreenElement = document.fullscreenElement;

      setIsFullScreen(fullscreenElement !== null);

      if (fullscreenElement) {
        // Reset timer when entering fullscreen
        setTimerSeconds(0);

        // Start the timer
        const timerInterval = setInterval(() => {
          setTimerSeconds((prevSeconds) => prevSeconds + 1);
        }, 1000);

        // Stop the timer when exiting fullscreen
        document.addEventListener('fullscreenchange', () => {
          clearInterval(timerInterval);

          // Add the timer to the list when exiting fullscreen
          exitFullScreen();
        });
      } else {
        // Add the timer to the list when exiting fullscreen
        exitFullScreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    // Clean up on component unmount
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [timerSeconds, user]);

  return (
    <div>
      {isFullScreen && (
        <div>
          <p>Timer: {timerSeconds} seconds</p>
        </div>
      )}
      {isFullScreen ? (
        <button onClick={exitFullScreen}>Exit Read</button>
      ) : (
        <button onClick={enterFullScreen}>Read</button>
      )}
    </div>
  );
};

export default FullScreenComponent;
