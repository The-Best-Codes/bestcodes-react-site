"use client";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/website/header";
import { motion } from "motion/react";

const SussySandwichPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.5,
                ease: [0, 0.71, 0.2, 1.01],
              }}
            >
              <h1 className="text-4xl font-bold text-center mb-4">
                Shoutout to
              </h1>
              <motion.h2
                className="text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-600"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  times: [0, 0.5, 1],
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                SussySandwich445
              </motion.h2>
              <p className="text-2xl text-center mt-4">Very Cool Person!</p>
            </motion.div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SussySandwichPage;
