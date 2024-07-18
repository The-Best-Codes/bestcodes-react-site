import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold">BestCodes</h1>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
        <span className="text-3xl font-bold">Hello</span>
      </motion.div>
    </main>
  );
}
