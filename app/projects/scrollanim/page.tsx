"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Header from "@/components/website/header";

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Transform for the background element
  const bgScale = useTransform(scrollYProgress, 
    [0, 0.3, 0.4, 0.5, 0.6, 1], 
    [1, 0.1, 0.1, 0, 1, 1]
  );
  const bgBorderRadius = useTransform(scrollYProgress, 
    [0.25, 0.3, 0.6, 1], 
    ["50%", "20%", "20%", "50%"]
  );
  const bgRotate = useTransform(scrollYProgress,
    [0.3, 0.4, 0.5, 0.6],
    [0, 180, 360, 0]
  );
  const bgColor = useTransform(scrollYProgress,
    [0, 0.5, 0.6, 1],
    ["#8B5CF6", "#EC4899", "#3B82F6", "#3B82F6"]
  );

  // Transforms for the text
  const textScale = useTransform(scrollYProgress, 
    [0, 0.3, 0.5, 0.6, 1], 
    [1, 5, 5, 1, 1]
  );
  const textOpacity = useTransform(scrollYProgress, 
    [0, 0.15, 0.3, 0.5, 0.6, 1], 
    [1, 0.5, 0, 0, 1, 1]
  );
  const textY = useTransform(scrollYProgress, 
    [0, 0.3, 0.5, 0.6, 1], 
    ["0%", "50%", "50%", "0%", "0%"]
  );

  return (
    <div ref={ref} className="h-[800vh] relative">
      <Header />
      <motion.div
        className="fixed inset-0"
        style={{
          scale: bgScale,
          borderRadius: bgBorderRadius,
          rotate: bgRotate,
          background: bgColor,
          width: "200vmax",
          height: "200vmax",
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
        }}
      />
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <motion.h1
          className="text-6xl font-bold text-white"
          style={{ scale: textScale, opacity: textOpacity, y: textY }}
        >
          Scroll Me!
        </motion.h1>
      </div>
    </div>
  );
}