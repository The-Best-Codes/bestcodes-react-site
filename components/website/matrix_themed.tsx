"use client";
import React, { useState, useEffect } from "react";
import { ReactMatrixAnimation } from "@/components/website/matrix_component";

const MatrixThemed = () => {
  const [theme, setTheme] = useState("dark"); // Set a default value
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run this on client-side
    setMounted(true);
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(isDark ? "dark" : "light");

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) =>
      setTheme(e.matches ? "dark" : "light");

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Don't render anything until mounted (client-side)
  if (!mounted) {
    return null;
  }

  return (
    <ReactMatrixAnimation
      key={theme}
      textColor="#3b82f6"
      backgroundColor={theme === "dark" ? "#000000" : "#ffffff"}
    />
  );
};

export default MatrixThemed;
