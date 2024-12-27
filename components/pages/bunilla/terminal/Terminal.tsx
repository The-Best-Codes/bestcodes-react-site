"use client";

import { motion } from "framer-motion";
import { Terminal as TerminalIcon } from "lucide-react";
import { TerminalOutput } from "./TerminalOutput";

interface TerminalProps {
  title: string;
  isActive?: boolean;
  lines: string[];
}

export function Terminal({ title, isActive = true, lines }: TerminalProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-gray-400">
        <TerminalIcon size={20} className={isActive ? "text-cyan-400" : ""} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-mono bg-gray-900/50 p-4 rounded-lg border border-gray-800 relative"
      >
        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-gray-900/50 to-transparent z-10" />
        <TerminalOutput lines={lines} />
      </motion.div>
    </div>
  );
}
