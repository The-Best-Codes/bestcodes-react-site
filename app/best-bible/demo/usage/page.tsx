"use client";
import { useState } from "react";
import Header from "@/components/website/header";
import { getVerse, getBibleBooks } from "best-bible";

// Levenshtein distance function
function levenshteinDistance(a: string, b: string) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export default function BestBible() {
  const [input, setInput] = useState<any>("");
  const [result, setResult] = useState<any>("");
  const [error, setError] = useState<any>("");
  const [latency, setLatency] = useState<any>(null);

  const handleSearch = async () => {
    const start = performance.now();
    try {
      const parsed = parseInput(input);
      if (!parsed) {
        throw new Error("Invalid input format");
      }
      const { book, chapter, verse } = parsed;
      const verseResult = getVerse(book, chapter, verse);
      const end = performance.now();
      setResult(verseResult);
      setError("");
      setLatency(end - start);
    } catch (err: any) {
      const end = performance.now();
      setResult("");
      setError(err.message);
      setLatency(end - start);
    }
  };

  const parseInput = (input: string) => {
    const regex = /^(\d*\s*[a-zA-Z]+)\s*(\d+)[:.,]?\s*(\d+)$/;
    const match = input.match(regex);
    if (!match) return null;

    let [, book, chapter, verse] = match;
    book = book.trim();

    const bibleBooks = getBibleBooks();
    let closestBook = bibleBooks.reduce(
      (closest, current) => {
        const distance = levenshteinDistance(
          book.toLowerCase(),
          current.toLowerCase()
        );
        return distance < closest.distance
          ? { name: current, distance }
          : closest;
      },
      { name: "", distance: Infinity }
    );

    return {
      book: closestBook.name,
      chapter: parseInt(chapter),
      verse: parseInt(verse),
    };
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
            placeholder="Enter verse (e.g., John 3:16 or John 3 16)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
                Latency: {latency.toFixed(2)} ms
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500 text-white rounded-md shadow-md">
            <p>{error}</p>
            {latency !== null && (
              <p className="text-gray-100 text-sm">
                Latency: {latency.toFixed(2)} ms
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
