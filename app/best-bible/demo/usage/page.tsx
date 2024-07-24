"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/website/header";
import { getVerse } from "best-bible";

export default function BestBible() {
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState<any>("");
  const [result, setResult] = useState<any>("");
  const [error, setError] = useState("");
  const [latency, setLatency] = useState<number | null>(null);

  const handleSearch = async () => {
    const start = performance.now();
    try {
      const verseResult = getVerse(book, parseInt(chapter), parseInt(verse));
      const end = performance.now();
      setResult(verseResult);
      setError("");
      setLatency(end - start);
    } catch (err) {
      const end = performance.now();
      setResult("");
      setError("The verse does not exist.");
      setLatency(end - start);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center">
      <Header />
      <div className="flex flex-col w-full max-w-screen bg-gray-200 dark:bg-gray-700 shadow-xl rounded-xl sm:w-3/4 md:w-1/2 p-6 mt-16 mb-8">
        <div className="flex flex-col justify-center items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Bible Search | Demo
          </h1>
          <p className="text-gray-900 dark:text-white">Using best-bible</p>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            placeholder="Book"
            value={book}
            onChange={(e) => setBook(e.target.value)}
            className="p-2 rounded-md"
          />
          <input
            type="number"
            placeholder="Chapter"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            className="p-2 rounded-md"
          />
          <input
            type="number"
            placeholder="Verse"
            value={verse}
            onChange={(e) => setVerse(e.target.value)}
            className="p-2 rounded-md"
          />
          <button
            onClick={handleSearch}
            className="p-2 bg-blue-500 text-white rounded-md"
          >
            Search
          </button>
        </div>

        {result && (
          <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-md">
            <p className="text-gray-900 dark:text-white">{result}</p>
            {latency !== null && (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Latency: {latency} ms
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500 text-white rounded-md shadow-md">
            <p>{error}</p>
            {latency !== null && (
              <p className="text-gray-100 text-sm">Latency: {latency} ms</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
