import React, { useState, useEffect, Key } from "react";
import { ReactMatrixAnimation } from "react-matrix-animation";

const MatrixThemed = () => {
  const [darkModeState, setDarkModeState] = useState(false);
  const [key, setKey] = useState<Key>(0);

  useEffect(() => {
    const checkSystemTheme = () => {
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (isDarkMode !== darkModeState) {
        setDarkModeState(isDarkMode);
        setKey((prevKey: any) => prevKey + 1);
      }
    };

    // Initial check
    checkSystemTheme();

    // Set up interval to check every second
    const intervalId = setInterval(checkSystemTheme, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [darkModeState]);

  return (
    <ReactMatrixAnimation
      key={key}
      fontColor="#3b82f6"
      backgroundColor={darkModeState ? "#000000" : "#ffffff"}
    />
  );
};

export default React.memo(MatrixThemed);
