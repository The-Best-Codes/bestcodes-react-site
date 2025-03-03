"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface TerminalOutputProps {
  lines: string[];
  className?: string;
}

export function TerminalOutput({ lines, className }: TerminalOutputProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "h-[300px] overflow-y-auto scrollbar-thin scrollbar-track-gray-900/20 scrollbar-thumb-gray-700/50",
        className,
      )}
    >
      {lines.map((line, i) => (
        <p
          key={i}
          className={line.startsWith("✔") || line.startsWith(" ✓")
            ? "text-cyan-400"
            : line === "$"
            ? "text-green-400"
            : line.includes("Total size")
            ? "text-yellow-400 font-bold"
            : line.match(/^[├└┌]/)
            ? "text-blue-400"
            : line.startsWith("du")
            ? "text-purple-400"
            : "text-gray-400"}
        >
          {line}
        </p>
      ))}
    </div>
  );
}
