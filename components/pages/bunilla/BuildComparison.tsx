"use client";

import { PlayCircle } from "lucide-react";
import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Terminal } from "./terminal/Terminal";

const nextJsSteps = [
  { message: "▲ Next.js 15.1.3", delay: 0 },
  { message: "   Creating an optimized production build ...", delay: 1000 },
  { message: " ✓ Compiled successfully", delay: 3000 },
  { message: "   Linting and checking validity of types ...", delay: 4000 },
  { message: "   Collecting page data ...", delay: 6000 },
  { message: "   Generating static pages (1/2) ...", delay: 8000 },
  { message: " ✓ Generating static pages (2/2)", delay: 10000 },
  { message: "   Finalizing page optimization ...", delay: 11000 },
  { message: "   Collecting build traces ...", delay: 11500 },
  { message: " ✓ Build completed in 18s", delay: 12000 },
  { message: "", delay: 12100 },
  {
    message: "Route (app)                              Size     First Load JS",
    delay: 12200,
  },
  {
    message: "┌ ○ /                                    985 kB         1.85 MB",
    delay: 12300,
  },
  {
    message: "└ ○ /version                             892 kB         1.76 MB",
    delay: 12400,
  },
  { message: "", delay: 12500 },
  { message: "First Load JS shared by all              892 kB", delay: 12600 },
  { message: "  ├ chunks/main-app.js                   397 kB", delay: 12700 },
  { message: "  └ chunks/webpack.js                    495 kB", delay: 12800 },
  { message: "", delay: 12900 },
  { message: "$", delay: 13000 },
  { message: "du -sh .next", delay: 13100 },
  { message: "55M    .next", delay: 13200 },
  { message: "$", delay: 13300 },
];

const bunillaSteps = [
  { message: "✨ Building...", delay: 0 },
  { message: "✔ Built in 0.1s", delay: 100 },
  { message: "", delay: 150 },
  { message: "✔ Total size: 350KB", delay: 200 },
  { message: "$", delay: 300 },
  { message: "du -sh .bunilla", delay: 400 },
  { message: "350K   .bunilla", delay: 500 },
  { message: "$", delay: 600 },
];

export function BuildComparison() {
  const [isRunning, setIsRunning] = useState(false);
  const [nextJsOutput, setNextJsOutput] = useState<string[]>([]);
  const [bunillaOutput, setBunillaOutput] = useState<string[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref);
  const hasRun = useRef(false);

  useEffect(() => {
    if (isInView && !hasRun.current) {
      runSimulation();
      hasRun.current = true;
    }
  }, [isInView]);

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setNextJsOutput([]);
    setBunillaOutput([]);

    bunillaSteps.forEach(({ message, delay }) => {
      setTimeout(() => {
        setBunillaOutput((prev) => [...prev, message]);
      }, delay);
    });

    nextJsSteps.forEach(({ message, delay }) => {
      setTimeout(() => {
        setNextJsOutput((prev) => [...prev, message]);
      }, delay);
    });

    setTimeout(
      () => {
        setIsRunning(false);
      },
      Math.max(...nextJsSteps.map((s) => s.delay)) + 500,
    );
  };

  return (
    <div ref={ref} className="space-y-6">
      <div className="flex justify-center mb-8">
        <button
          onClick={runSimulation}
          disabled={isRunning}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-500/20 text-cyan-400 rounded-full hover:bg-cyan-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlayCircle size={20} />
          {isRunning ? "Building..." : "Run Build Comparison"}
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <Terminal
          title="Bunilla Build"
          isActive={true}
          lines={["$ bunilla build", ...bunillaOutput]}
        />
        <Terminal
          title="Next.js Build"
          isActive={false}
          lines={["$ next build", ...nextJsOutput]}
        />
      </div>
    </div>
  );
}
