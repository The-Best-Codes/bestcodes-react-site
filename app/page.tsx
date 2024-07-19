"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Header from "@/components/website/header";

export default function Home() {
  const { scrollY } = useScroll();

  const waveImageScale = useTransform(scrollY, [0, 200], [1, 1.5]);
  const waveImageOpacity = useTransform(scrollY, [0, 200], [1, 0]);
  return (
    <main className="flex min-h-screen flex-col items-center dark:bg-slate-900">
      <Header />
      <motion.div
        style={{ scale: waveImageScale, opacity: waveImageOpacity }}
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
      <section className="flex flex-col items-center p-16 text-center">
        <h2 className="text-6xl text-blue-500 font-bold mb-4">
          I&apos;m BestCodes
        </h2>
        <p className="text-xl text-white mb-4">
          I&apos;m a full-stack web developer.
        </p>
      </section>
      <section className="flex flex-col items-center p-16 text-center">
        <h2 className="text-4xl text-blue-500 font-bold mb-8">Skills</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-black dark:text-white">
          <li>React</li>
          <li>Next.js</li>
          <li>TypeScript</li>
          <li>Tailwind CSS</li>
          <li>Node.js</li>
          <li>Python</li>
          <li>GraphQL</li>
          <li>REST APIs</li>
          <li>SQL</li>
          <li>NoSQL</li>
        </ul>
      </section>
      <section className="flex flex-col items-center p-16 text-center">
        <h2 className="text-4xl text-blue-500 font-bold mb-8">GitHub Stats</h2>
        <Image
          src={`https://github-readme-stats.vercel.app/api?username=The-Best-Codes&hide_rank=true&show_icons=true&theme=dark`}
          alt="GitHub Stats"
          width={500}
          height={300}
          className="rounded-lg"
          unoptimized
        />
      </section>
      <section className="flex flex-col items-center p-16 text-center">
        <h2 className="text-4xl text-blue-500 font-bold mb-8">Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-2">Project 1</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Description of project 1.
            </p>
            <Link href="https://github.com/BestCodes/project1" passHref>
              <span className="text-blue-500 hover:underline mt-4 block">
                View on GitHub
              </span>
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-2">Project 2</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Description of project 2.
            </p>
            <Link href="https://github.com/BestCodes/project2" passHref>
              <span className="text-blue-500 hover:underline mt-4 block">
                View on GitHub
              </span>
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-2">Project 3</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Description of project 3.
            </p>
            <Link href="https://github.com/BestCodes/project3" passHref>
              <span className="text-blue-500 hover:underline mt-4 block">
                View on GitHub
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
