"use client";

import { BuildComparison } from "@/components/pages/bunilla/BuildComparison";
import { ComparisonChart } from "@/components/pages/bunilla/ComparisonChart";
import { Box, Terminal, Zap } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  const handleGetStarted = () => {
    window.open("https://forms.gle/K4axUYa5yJULh5gV9", "_blank");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-purple-600 mb-6">
              Bunilla
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8">
              The Next Generation Web Framework
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="px-8 py-3 rounded-full bg-linear-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Request Access
              </button>
              <button
                className="px-8 py-3 rounded-full border border-gray-700 text-gray-400 font-semibold cursor-not-allowed opacity-50"
                disabled
              >
                Documentation
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-xl bg-linear-to-b from-gray-900 to-black border border-gray-800"
          >
            <Terminal className="w-12 h-12 text-cyan-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Zero Config</h3>
            <p className="text-gray-400">
              Start building instantly with zero configuration needed. Just
              write code and watch it come to life.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-xl bg-linear-to-b from-gray-900 to-black border border-gray-800"
          >
            <Zap className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-400">
              Built for speed with optimized performance and minimal overhead.
              Your apps will fly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-xl bg-linear-to-b from-gray-900 to-black border border-gray-800"
          >
            <Box className="w-12 h-12 text-pink-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Modern Tooling</h3>
            <p className="text-gray-400">
              Integrated with the latest development tools and best practices
              out of the box.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <ComparisonChart />
      </div>

      {/* Build Comparison */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <BuildComparison />
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="p-8 rounded-2xl bg-linear-to-r from-cyan-500/10 to-purple-600/10 border border-gray-800"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build the Future?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join the closed beta and be among the first to experience the next
            evolution in web development.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 rounded-full bg-linear-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Request to Join Waitlist
          </button>
        </motion.div>
      </div>
    </div>
  );
}
