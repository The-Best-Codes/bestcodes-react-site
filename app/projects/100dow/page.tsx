"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Award, Smile } from "lucide-react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

const CongratulationsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [name, setName] = useState("Congrats");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const nameParam = searchParams?.get("name");
    if (nameParam) {
      setName(nameParam);
    }
  }, [searchParams]);

  useEffect(() => {
    document.body.style.overflowX = "hidden";

    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setShowConfetti(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      document.body.style.overflowX = "auto";
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-green-600 text-white">
      {showConfetti && <Confetti style={{ position: "fixed" }} />}
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 name={name} />
    </div>
  );
};

const Section1 = () => {
  return (
    <motion.div
      className="h-screen flex flex-col items-center justify-center text-center px-4"
      initial={{ opacity: 0.25 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: false }}
    >
      <h1 className="text-4xl md:text-6xl font-bold mb-8">Scroll Down</h1>
      <ChevronDown size={48} className="animate-bounce" />
    </motion.div>
  );
};

const Section2 = () => {
  return (
    <motion.div
      className="h-screen flex flex-col items-center justify-center text-center px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: false }}
    >
      <h2 className="text-5xl md:text-7xl font-bold mb-8">Congrats!</h2>
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: false }}
      >
        <h2 className="text-6xl md:text-9xl font-bold text-yellow-300">100</h2>
      </motion.div>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: false }}
      >
        <h2 className="text-5xl md:text-7xl font-bold mt-4">Days of Wordle!</h2>
      </motion.div>
    </motion.div>
  );
};

const Section3 = () => {
  return (
    <motion.div
      className="h-screen flex flex-col items-center justify-center text-center px-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: false }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, loop: Infinity, ease: "easeInOut" }}
      >
        <Award size={120} className="text-yellow-300 mb-8" />
      </motion.div>
      <h2 className="text-4xl md:text-6xl font-bold">Wordle Champion</h2>
      <div className="grid grid-cols-3 gap-2 bg-black rounded-md p-2 mt-8">
        {["W", "O", "R", "D", "L", "E", "1", "0", "0"].map((letter, index) => (
          <motion.div
            key={index}
            className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-2xl md:text-3xl font-bold rounded ${
              index < 4
                ? "bg-white text-black"
                : index < 5
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: false }}
          >
            {letter}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Section4 = ({ name }: { name: string }) => {
  return (
    <motion.div
      className="h-screen flex flex-col items-center justify-center text-center px-4 mt-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: false }}
    >
      <Smile size={80} className="text-yellow-300 mb-8" />
      <motion.h2
        className="text-6xl md:text-8xl font-bold"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        viewport={{ once: false }}
      >
        {name}
      </motion.h2>
      <motion.p
        className="text-2xl md:text-3xl mt-8"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: false }}
      >
        You&apos;re a true Wordle master!
      </motion.p>
    </motion.div>
  );
};

export default CongratulationsPage;
