import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Link href="/about" className="text-gray-300 hover:text-gray-400">
          About
        </Link>
        <Link href="/blog" className="ml-3 text-gray-300 hover:text-gray-400">
          Blog
        </Link>
        <Link
          href="/contact"
          className="ml-3 text-gray-300 hover:text-gray-400"
        >
          Contact
        </Link>
        <Link
          href="/projects"
          className="ml-3 text-gray-300 hover:text-gray-400"
        >
          Projects
        </Link>
        <Link href="/resume" className="ml-3 text-gray-300 hover:text-gray-400">
          Resume
        </Link>
      </div>
    </main>
  );
}
