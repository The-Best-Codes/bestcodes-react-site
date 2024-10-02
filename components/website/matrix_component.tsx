"use client";
import React, { useRef, useEffect, useState } from "react";

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, alpha = 1) => {
  let r, g, b;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  } else {
    throw new Error("Invalid HEX color.");
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const ReactMatrixAnimation = ({
  backgroundColor = "rgba(0, 0, 0, 0.05)",
  textColor = "#0F0",
  delay = 60,
}) => {
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const columnsRef = useRef(0);
  const dropsRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    const container = containerRef.current as unknown as HTMLDivElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    resizeCanvas();

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?";
    const fontSize = 16;

    const recalculateColumns = () => {
      columnsRef.current = Math.floor(canvas.width / fontSize);
      dropsRef.current = new Array(columnsRef.current)
        .fill(0)
        .map(() => Math.random() * canvas.height);
    };

    recalculateColumns();

    function draw() {
      // Convert backgroundColor to rgba if it's a hex code
      const bgColor = backgroundColor.startsWith("#")
        ? hexToRgba(backgroundColor, 0.05)
        : backgroundColor;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Convert textColor to rgba if it's a hex code
      const txtColor = textColor.startsWith("#")
        ? hexToRgba(textColor)
        : textColor;
      ctx.fillStyle = txtColor;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < dropsRef.current.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, dropsRef.current[i]);

        dropsRef.current[i] += fontSize;

        if (dropsRef.current[i] > canvas.height && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
        } else if (dropsRef.current[i] > canvas.height) {
          dropsRef.current[i] = dropsRef.current[i] - canvas.height;
        }
      }
    }

    const interval = setInterval(draw, delay);

    const handleResize = () => {
      resizeCanvas();
      recalculateColumns();
    };

    window.addEventListener("resize", handleResize);

    setLoading(false);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, [backgroundColor, delay, textColor]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas
        className={loading ? "animate-pulse w-full h-full" : ""}
        ref={canvasRef}
        style={{ background: backgroundColor }}
      />
    </div>
  );
};
