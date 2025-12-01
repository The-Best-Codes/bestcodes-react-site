"use client";

import { motion } from "motion/react";
import { useRef } from "react";

interface ComparisonData {
  metric: string;
  bunilla: string;
  nextjs: string;
  difference: string;
  unit?: string;
}

const comparisons: ComparisonData[] = [
  {
    metric: "Build Time",
    bunilla: "0.1",
    nextjs: "18",
    difference: "180.0x",
    unit: "s",
  },
  {
    metric: "Request Handling",
    bunilla: "1",
    nextjs: "2.5",
    difference: "2.5x",
    unit: "ms",
  },
  {
    metric: "Dist Folder Size",
    bunilla: "350",
    nextjs: "55000",
    difference: "155x",
    unit: "KB",
  },
];

export function ComparisonChart() {
  const hasAnimated = useRef(false);

  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-bold text-center mb-12">
        Performance Comparison
      </h2>
      <div className="grid gap-16">
        {comparisons.map((comparison, index) => {
          const bunillaValue = parseFloat(comparison.bunilla);
          const nextjsValue = parseFloat(comparison.nextjs);
          const maxValue = Math.max(bunillaValue, nextjsValue);
          const bunillaWidth = (bunillaValue / maxValue) * 100;
          const nextjsWidth = (nextjsValue / maxValue) * 100;

          return (
            <div key={comparison.metric} className="space-y-4">
              <div className="flex justify-between items-end">
                <h3 className="text-xl font-semibold">{comparison.metric}</h3>
                <span className="text-cyan-400 font-mono">
                  {comparison.difference}{" "}
                  {comparison.metric === "Dist Folder Size"
                    ? "Smaller"
                    : nextjsWidth > bunillaWidth
                      ? "Faster"
                      : "Smaller"}
                </span>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-cyan-400">Bunilla</span>
                    <span className="text-gray-400">
                      {comparison.bunilla}
                      {comparison.unit}
                    </span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${bunillaWidth}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="h-8 bg-linear-to-r from-cyan-500 to-cyan-400 rounded-md flex items-center justify-end px-3"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Next.js</span>
                    <span className="text-gray-400">
                      {comparison.nextjs}
                      {comparison.unit}
                    </span>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${nextjsWidth}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.2 + 0.2 }}
                    className="h-8 bg-gray-700 rounded-md flex items-center justify-end px-3"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
