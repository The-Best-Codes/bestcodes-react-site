"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import NumberFlow from "@number-flow/react";
import ReactConfetti from "react-confetti";
import Link from "next/link";

export default function Thanks20K() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [displayNumber, setDisplayNumber] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const { scrollYProgress } = useScroll();

  const initialTextOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const numberOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.2, 0.9, 1],
    [0, 1, 1, 0],
  );
  const thankYouOpacity = useTransform(scrollYProgress, [0.9, 0.95], [0, 1]);

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", updateWindowSize);
    updateWindowSize();

    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest > 0.95 && !showConfetti) {
        setShowConfetti(true);
      }
      setDisplayNumber(Math.round(Math.min(20000, latest * 20000 * 1.25)));
    });

    return () => unsubscribe();
  }, [scrollYProgress, showConfetti]);

  return (
    <div className="min-h-[500vh] relative bg-gradient-to-b from-blue-500 via-pink-400 to-orange-400">
      <div className="fixed inset-0 flex items-center justify-center">
        <motion.p
          style={{ opacity: initialTextOpacity }}
          className="text-white text-2xl font-bold"
        >
          Scroll down...
        </motion.p>

        <motion.div
          style={{ opacity: numberOpacity }}
          className="absolute text-white text-8xl font-bold"
        >
          <NumberFlow value={displayNumber} />
        </motion.div>

        <motion.div
          style={{ opacity: thankYouOpacity }}
          className="absolute text-white text-center"
        >
          <h1 className="text-6xl font-bold mb-4">Thank You!</h1>
          <p className="text-2xl">For 20,000 amazing followers on dev.to</p>
          <Link
            href="https://dev.to/best_codes/thanks-for-20000-followers-oag"
            className="underline text-2xl text-blue-600"
          >
            <p>Read the story</p>
          </Link>
          <Link href="/" className="underline text-2xl text-blue-600">
            <p>Home</p>
          </Link>
        </motion.div>
      </div>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          <ReactConfetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={true}
            numberOfPieces={200}
          />
        </div>
      )}
    </div>
  );
}
