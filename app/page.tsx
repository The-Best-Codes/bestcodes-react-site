import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold">BestCodes</h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/about">
          <Image
            src="https://avatars.githubusercontent.com/u/10091844?v=4"
            width={200}
            height={200}
            alt="BestCodes"
          />
        </Link>
      </motion.div>
    </main>
  );
}
