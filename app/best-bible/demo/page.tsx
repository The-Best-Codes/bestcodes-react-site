import Image from "next/image";
import Link from "next/link";
import Header from "@/components/website/header";
import SyntaxHighlighter from "@/components/website/code_syntax";
import {
  getChapter,
  getVerse,
  getBook,
  getRange,
  getBibleBooks,
  getChapterCount,
  getVerseCount,
  bibleStats,
} from "best-bible";

export default function BestBible() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center">
      <Header />
      <div className="flex flex-col w-full max-w-screen bg-gray-200 dark:bg-gray-700 shadow-xl rounded-xl sm:w-3/4 md:w-1/2 p-6 mt-8 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Best Bible Demo
        </h1>

        <div className="flex flex-col mt-8">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Input - getVerse
          </h1>
          <SyntaxHighlighter language="javascript">
            {`const { getVerse } = require("best-bible");
// Fetch data
const dataResult = getVerse("Genesis", 1, 1);
            
// Log the result
console.log(dataResult);`}
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

        <div className="flex flex-col mt-24">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Input - getVerse, indexed
          </h1>
          <SyntaxHighlighter language="javascript">
            {`const { getVerse } = require("best-bible");
// Fetch data
const dataResult = getVerse("Genesis", 1, 1, "indexed");
            
// Log the result
console.log(dataResult);`}
          </SyntaxHighlighter>
        </div>
        <div className="flex flex-col mt-2">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Output
          </h1>
          <SyntaxHighlighter language="json">
            {`${JSON.stringify(getVerse("Genesis", 1, 1, "indexed"), null, 2)}`}
          </SyntaxHighlighter>
        </div>

        <div className="flex flex-col mt-24">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Input - getChapter
          </h1>
          <SyntaxHighlighter language="javascript">
            {`const { getChapter } = require("best-bible");
// Fetch data
const dataResult = getChapter("Genesis", 1);
            
// Log the result
console.log(dataResult);`}
          </SyntaxHighlighter>
        </div>
        <div className="flex flex-col mt-2">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Output
          </h1>
          <SyntaxHighlighter language="json" className="max-h-96">
            {`${JSON.stringify(getChapter("Genesis", 1), null, 2)}`}
          </SyntaxHighlighter>
        </div>

        <div className="flex flex-col mt-24">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Input - getChapter, indexed
          </h1>
          <SyntaxHighlighter language="javascript">
            {`const { getChapter } = require("best-bible");
// Fetch data
const dataResult = getChapter("Genesis", 1, "indexed");
            
// Log the result
console.log(dataResult);`}
          </SyntaxHighlighter>
        </div>
        <div className="flex flex-col mt-2">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Output
          </h1>
          <SyntaxHighlighter language="json" className="max-h-96">
            {`${JSON.stringify(getChapter("Genesis", 1, "indexed"), null, 2)}`}
          </SyntaxHighlighter>
        </div>

        <div className="flex flex-col mt-24">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Input - getBook
          </h1>
          <SyntaxHighlighter language="javascript">
            {`const { getBook } = require("best-bible");
// Fetch data
const dataResult = getBook("Jude"); // Jude is a lot shorter than Genesis, it only has one chapter
            
// Log the result
console.log(dataResult);`}
          </SyntaxHighlighter>
        </div>
        <div className="flex flex-col mt-2">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Output
          </h1>
          <SyntaxHighlighter language="json" className="max-h-96">
            {`${JSON.stringify(getBook("Jude"), null, 2)}`}
          </SyntaxHighlighter>
        </div>

        <div className="flex flex-col mt-24">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Input - getBook, indexed
          </h1>
          <SyntaxHighlighter language="javascript">
            {`const { getBook } = require("best-bible");
// Fetch data
const dataResult = getBook("Jude", "indexed"); // Jude is a lot shorter than Genesis, it only has one chapter
            
// Log the result
console.log(dataResult);`}
          </SyntaxHighlighter>
        </div>
        <div className="flex flex-col mt-2">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Output
          </h1>
          <SyntaxHighlighter language="json" className="max-h-96">
            {`${JSON.stringify(getBook("Jude", "indexed"), null, 2)}`}
          </SyntaxHighlighter>
        </div>

        <div className="flex flex-col mt-24">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Input - getRange
          </h1>
          <SyntaxHighlighter language="javascript">
            {`const { getRange } = require("best-bible");
// Fetch data
const dataResult = getRange("Genesis", 1, 1, "Genesis", 1, 10);
            
// Log the result
console.log(dataResult);`}
          </SyntaxHighlighter>
        </div>
        <div className="flex flex-col mt-2">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Output
          </h1>
          <SyntaxHighlighter language="json" className="max-h-96">
            {`${JSON.stringify(
              getRange("Genesis", 1, 1, "Genesis", 1, 10),
              null,
              2
            )}`}
          </SyntaxHighlighter>
        </div>

        <div className="flex flex-col mt-24">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Input - getRange, indexed
          </h1>
          <SyntaxHighlighter language="javascript">
            {`const { getRange } = require("best-bible");
// Fetch data
const dataResult = getRange("Genesis", 1, 1, "Genesis", 1, 10, "indexed");
            
// Log the result
console.log(dataResult);`}
          </SyntaxHighlighter>
        </div>
        <div className="flex flex-col mt-2">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Output
          </h1>
          <SyntaxHighlighter language="json" className="max-h-96">
            {`${JSON.stringify(
              getRange("Genesis", 1, 1, "Genesis", 1, 10, "indexed"),
              null,
              2
            )}`}
          </SyntaxHighlighter>
        </div>

        <div className="flex flex-col mt-24">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Input - getBibleBooks
          </h1>
          <SyntaxHighlighter language="javascript">
            {`const { getBibleBooks } = require("best-bible");
// Fetch data
const dataResult = getBibleBooks();
            
// Log the result
console.log(dataResult);`}
          </SyntaxHighlighter>
        </div>
        <div className="flex flex-col mt-2">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Output
          </h1>
          <SyntaxHighlighter language="json" className="max-h-96">
            {`${JSON.stringify(getBibleBooks(), null, 2)}`}
          </SyntaxHighlighter>
        </div>

        <div className="flex flex-col mt-24">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Input - getChapterCount
          </h1>
          <SyntaxHighlighter language="javascript">
            {`const { getChapterCount } = require("best-bible");
// Fetch data
const dataResult = getChapterCount("Genesis");
            
// Log the result
console.log(dataResult);`}
          </SyntaxHighlighter>
        </div>
        <div className="flex flex-col mt-2">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Output
          </h1>
          <SyntaxHighlighter language="json" className="max-h-96">
            {`${JSON.stringify(getChapterCount("Genesis"), null, 2)}`}
          </SyntaxHighlighter>
        </div>

        <div className="flex flex-col mt-24">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Input - getVerseCount
          </h1>
          <SyntaxHighlighter language="javascript">
            {`const { getVerseCount } = require("best-bible");
// Fetch data
const dataResult = getVerseCount("Genesis", 1);
            
// Log the result
console.log(dataResult);`}
          </SyntaxHighlighter>
        </div>
        <div className="flex flex-col mt-2">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Output
          </h1>
          <SyntaxHighlighter language="json" className="max-h-96">
            {`${JSON.stringify(getVerseCount("Genesis", 1), null, 2)}`}
          </SyntaxHighlighter>
        </div>

        <div className="flex flex-col mt-24">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Input - bibleStats
          </h1>
          <SyntaxHighlighter language="javascript">
            {`const { bibleStats } = require("best-bible");
// Fetch data
const dataResult = bibleStats();
            
// Log the result
console.log(dataResult);`}
          </SyntaxHighlighter>
        </div>
        <div className="flex flex-col mt-2">
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Output
          </h1>
          <SyntaxHighlighter language="json" className="max-h-96">
            {`${JSON.stringify(bibleStats(), null, 2)}`}
          </SyntaxHighlighter>
        </div>

        <p className="text-3xl sm:text-4xl font-bold text-center w-full mt-8 mb-4 text-gray-700 dark:text-gray-300">
          Made with ❤️ by Best Codes
        </p>
      </div>
    </div>
  );
}
