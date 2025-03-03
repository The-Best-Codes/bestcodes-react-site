"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useEffect, useRef, useState } from "react";

export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [speed, setSpeed] = useState(2);
  const speedRef = useRef(0.02);

  useEffect(() => {
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    // Set canvas size with higher resolution for retina displays
    const scale = window.devicePixelRatio || 1;
    canvas.width = 600 * scale;
    canvas.height = 600 * scale;
    canvas.style.width = "600px";
    canvas.style.height = "600px";
    ctx.scale(scale, scale);

    // Constants for the visualization
    const centerX = 150;
    const centerY = 150;
    const radius = 60;
    const graphWidth = 150;
    const graphHeight = 120;

    // Updated colors
    const circleColor = "#4338ca"; // Indigo
    const sineColor = "#dc2626"; // Red
    const cosineColor = "#2563eb"; // Blue
    const lineColor = "#ffffff"; // White

    // Animation variables
    let angle = 0;
    let animationId: number;

    function drawCircle() {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = circleColor;
      ctx.fill();
    }

    function drawRotatingLine(angle: number) {
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw point at the end of line
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = lineColor;
      ctx.fill();
    }

    function drawProjectionLines(angle: number) {
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Horizontal projection line
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, centerY + radius + 30);
      ctx.strokeStyle = cosineColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Vertical projection line
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(centerX + radius + 30, y);
      ctx.strokeStyle = sineColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw points at projections
      ctx.beginPath();
      ctx.arc(x, centerY + radius + 30, 4, 0, Math.PI * 2);
      ctx.fillStyle = cosineColor;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX + radius + 30, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = sineColor;
      ctx.fill();
    }

    function drawSineWave(angle: number) {
      ctx.beginPath();
      for (let i = 0; i <= graphWidth; i++) {
        const x = centerX + radius + 30 + i;
        const y = centerY +
          Math.sin(angle - (i / graphWidth) * 4 * Math.PI) * radius;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = sineColor;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    function drawCosineWave(angle: number) {
      ctx.beginPath();
      for (let i = 0; i <= graphHeight; i++) {
        const x = centerX +
          Math.cos(angle - (i / graphHeight) * 4 * Math.PI) * radius;
        const y = centerY + radius + 30 + i;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.strokeStyle = cosineColor;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    function drawLabels() {
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";

      // Circle label
      ctx.fillStyle = circleColor;
      ctx.fillText("Unit Circle", centerX, centerY - radius - 10);

      // Sine wave label
      ctx.fillStyle = sineColor;
      ctx.fillText(
        "Sine Wave",
        centerX + radius + graphWidth / 2 + 30,
        centerY - radius - 10,
      );

      // Cosine wave label
      ctx.fillStyle = cosineColor;
      ctx.fillText(
        "Cosine Wave",
        centerX - radius - 10,
        centerY + radius + graphHeight + 50,
      );

      // Angle label
      ctx.fillStyle = "#1f2937"; // Gray-800
      ctx.font = "14px Arial";
      ctx.fillText(
        `Angle: ${(angle % (2 * Math.PI)).toFixed(2)} rad`,
        centerX,
        centerY + radius + graphHeight + 80,
      );
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      ctx.fillStyle = "#fffbeb"; // Amber-50
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawCircle();
      drawRotatingLine(angle);
      drawProjectionLines(angle);
      drawSineWave(angle);
      drawCosineWave(angle);
      drawLabels();

      angle += speedRef.current;
      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleSpeedChange = (value: number[]) => {
    const newSpeed = value[0];
    setSpeed(newSpeed);
    speedRef.current = newSpeed / 100;
  };

  const handleResetSpeed = () => {
    setSpeed(2);
    speedRef.current = 0.02;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 p-8">
      <Card className="w-full max-w-3xl bg-white shadow-xl">
        <CardHeader className="bg-indigo-100 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center text-indigo-800">
            Sine and Cosine Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 p-6">
          <canvas
            ref={canvasRef}
            className="border border-indigo-200 rounded-lg shadow-md"
            style={{ width: "600px", height: "600px" }}
          />
          <div className="w-full max-w-md space-y-2">
            <p className="text-sm font-medium text-gray-700 text-center">
              Adjust Animation Speed
            </p>
            <Slider
              value={[speed]}
              max={10}
              step={0.1}
              onValueChange={handleSpeedChange}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleResetSpeed}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
          >
            Reset Speed
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
