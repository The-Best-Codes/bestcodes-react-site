"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/website/header";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between dark:bg-slate-900">
      <Header />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-row items-center justify-center gap-4 p-16"
      >
        <Image
          src={`/image/emoji/waving_hand.png`}
          alt="waving hand"
          width={260}
          height={260}
          className="h-16 w-16 sm:h-16 sm:w-16 md:h-24 md:w-24 lg:h-32 lg:w-32"
        />
        <h1 className="text-9xl text-blue-500 line-clamp-1 font-bold">Hi</h1>
      </motion.div>
      <div className="h-96">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
      <div className="h-96">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
      <div className="h-96">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
      <div className="h-96">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
      <div className="h-96">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
    </main>
  );
}
