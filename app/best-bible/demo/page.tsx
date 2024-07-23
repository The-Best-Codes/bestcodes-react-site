"use client";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/website/header";
import SyntaxHighlighter from "@/components/website/code_syntax";
import { getVerse } from "best-bible";

export default function BestBible() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center">
      <Header />
      <div className="flex flex-col w-full sm:w-3/4 md:w-1/2 p-4 mt-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Best Bible Demo
        </h1>

        <div className="flex flex-col mt-8">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Input - getVerse
          </h1>
          <SyntaxHighlighter language="javascript">
            {`const { getVerse } = require("best-bible");
// Fetch verse
const verseResult = getVerse("Genesis", 1, 1);
            
// Log the result
console.log(verseResult);`}
          </SyntaxHighlighter>
        </div>
        <div className="flex flex-col mt-2">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Output
          </h1>
          <SyntaxHighlighter language="json">
            {`${JSON.stringify(getVerse("Genesis", 1, 1), null, 2)}`}
          </SyntaxHighlighter>
        </div>

        <div className="flex flex-col mt-32">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Input - getVerse, indexed
          </h1>
          <SyntaxHighlighter language="javascript">
            {`const { getVerse } = require("best-bible");
// Fetch verse
const verseResult = getVerse("Genesis", 1, 1, "indexed");
            
// Log the result
console.log(verseResult);`}
          </SyntaxHighlighter>
        </div>
        <div className="flex flex-col mt-2">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Output
          </h1>
          <SyntaxHighlighter language="json">
            {`{
  "book": "Genesis",
  "chapter": 1,
  "verse": 1,
  "content": "In the beginning God created the heaven and the earth."
}`}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
