"use client";
import { Button } from "@/components/ui/button";
import { Slash, Snowflake } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Snowflake {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

export default function Snow() {
  // Check if current month is December (month index is 0-based, so December is 11)
  const isDecember = new Date().getMonth() === 11;

  // If it's not December, don't render anything
  if (!isDecember) return null;

  const [isSnowing, setIsSnowing] = useState(true);
  const [isLightMode, setIsLightMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowflakes = useRef<Snowflake[]>([]);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLightMode(document.documentElement.classList.contains("light"));
    }
  }, []);

  // Responsive snowflake count
  const getSnowflakeCount = () => {
    if (typeof window === "undefined") return 200; // Default for SSR
    if (window.innerWidth < 768) return 40; // Mobile
    if (window.innerWidth < 1024) return 80; // Tablet
    return 120; // Desktop
  };

  useEffect(() => {
    if (!isSnowing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Recreate snowflakes with new responsive count
      createSnowflakes();
    };

    // Initialize snowflakes
    const createSnowflakes = () => {
      const count = getSnowflakeCount();
      snowflakes.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.5 + 0.5,
      }));
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Mouse movement handler with increased sensitivity
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      snowflakes.current.forEach((flake) => {
        // Update position
        flake.y += flake.speed;

        // Increased mouse effect
        const mouseEffect = (mouseX.current - canvas.width / 2) * 0.001; // Increased from 0.0003
        flake.x += mouseEffect;

        // Add slight wavering motion
        flake.x += Math.sin(flake.y * 0.01) * 0.5;

        // Reset if snowflake goes off screen
        if (flake.y > canvas.height) {
          flake.y = -10;
          flake.x = Math.random() * canvas.width;
        }
        if (flake.x > canvas.width) flake.x = 0;
        if (flake.x < 0) flake.x = canvas.width;

        //Shadow effect
        ctx.shadowColor = `rgba(0, 0, 0, 0.1)`; // Subtle shadow color
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        // Draw snowflake
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctx.fill();

        ctx.strokeStyle = `rgba(150, 150, 150, ${flake.opacity})`; // or another light gray
        ctx.lineWidth = 0.5; // Adjust as needed
        ctx.stroke();

        (ctx.shadowColor as any) = null;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isSnowing]);

  return (
    <>
      {isSnowing && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: isLightMode
              ? "rgba(255, 255, 255, 0.1)"
              : "transparent",
          }}
        />
      )}
      <Button
        onClick={() => setIsSnowing(!isSnowing)}
        className="fixed bottom-4 left-4 z-50 text-black dark:text-white bg-slate-400/50 hover:bg-slate-300/50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 backdrop-blur-sm"
        size="icon"
      >
        {isSnowing ? (
          <Snowflake />
        ) : (
          <div className="relative">
            <Snowflake className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <Slash className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        )}
      </Button>
    </>
  );
}
