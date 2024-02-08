import { useEffect, useState } from 'react';

const FullScreenComponent = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

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

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
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
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    // Clean up on component unmount
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  return (
    <div>
      {isFullScreen && (
        <div>
          <p>Timer: {timerSeconds} seconds</p>
        </div>
      )}
      {/* Your component content goes here */}
      {isFullScreen ? (
        <button onClick={exitFullScreen}>Exit Read</button>
      ) : (
        <button onClick={enterFullScreen}>Read</button>
      )}
    </div>
  );
};

export default FullScreenComponent;
