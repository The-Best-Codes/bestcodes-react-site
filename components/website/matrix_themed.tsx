import React, { useState, useEffect, useRef, useCallback } from "react";
import { ReactMatrixAnimation } from "react-matrix-animation";

const MatrixThemed = React.memo(() => {
  const [theme, setTheme] = useState(() => 
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );
  const prevThemeRef = useRef(theme);

  const checkSystemTheme = useCallback(() => {
    const newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    if (newTheme !== prevThemeRef.current) {
      setTheme(newTheme);
      prevThemeRef.current = newTheme;
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addListener(checkSystemTheme);

    // Initial check
    checkSystemTheme();

    return () => mediaQuery.removeListener(checkSystemTheme);
  }, [checkSystemTheme]);

  return (
    <ReactMatrixAnimation
      key={theme}
      fontColor="#3b82f6"
      backgroundColor={theme === "dark" ? "#000000" : "#ffffff"}
    />
  );
});

MatrixThemed.displayName = 'MatrixThemed';

export default MatrixThemed;