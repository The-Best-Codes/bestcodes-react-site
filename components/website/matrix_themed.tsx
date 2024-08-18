import React, { useState, useEffect, useRef, useCallback } from "react";
import { ReactMatrixAnimation } from "react-matrix-animation";

const MatrixThemed = React.memo(() => {
  const [theme, setTheme] = useState(() =>
    (typeof window === "undefined" ? "dark" : undefined) ||
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );
  const prevThemeRef = useRef(theme);

  const checkSystemTheme = useCallback(() => {
    if (typeof window === "undefined") return;
    const newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    if (newTheme !== prevThemeRef.current) {
      setTheme(newTheme);
      prevThemeRef.current = newTheme;
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
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

MatrixThemed.displayName = "MatrixThemed";

export default MatrixThemed;
