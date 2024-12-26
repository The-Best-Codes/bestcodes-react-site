/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";

const hexToRgba = (hex: string, alpha = 1) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  let r: any;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  let g: any;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  let b: any;
  if (hex.length === 4) {
    r = Number.parseInt(hex[1] + hex[1], 16);
    g = Number.parseInt(hex[2] + hex[2], 16);
    b = Number.parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = Number.parseInt(hex.slice(1, 3), 16);
    g = Number.parseInt(hex.slice(3, 5), 16);
    b = Number.parseInt(hex.slice(5, 7), 16);
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(null);
  const columnsRef = useRef(0);
  const dropsRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?";
    const fontSize = 16;

    const recalculateColumns = () => {
      columnsRef.current = Math.floor(canvas.width / fontSize);
      dropsRef.current = new Array(columnsRef.current)
        .fill(0)
        .map(() => Math.random() * canvas.height);
    };

    const draw = () => {
      const bgColor = backgroundColor.startsWith("#")
        ? hexToRgba(backgroundColor, 0.05)
        : backgroundColor;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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

      animationFrameRef.current = requestAnimationFrame(() => {
        setTimeout(draw, delay);
      });
    };

    const handleResize = () => {
      resizeCanvas();
      recalculateColumns();
    };

    // Initial setup
    resizeCanvas();
    recalculateColumns();
    draw();

    // Add resize observer
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Add window resize listener
    window.addEventListener("resize", handleResize);

    setLoading(false);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [backgroundColor, delay, textColor]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas
        className={loading ? "animate-pulse w-full h-full" : "w-full h-full"}
        ref={canvasRef}
        style={{ background: backgroundColor }}
      />
    </div>
  );
};
