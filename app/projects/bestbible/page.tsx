"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/website/header";
import SyntaxHighlighter from "@/components/website/code_syntax";

export default function BestBible() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden ">
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              Best Bible
            </h1>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {["v", "dm", "l"].map((type) => (
                <Image
                  key={type}
                  src={`https://img.shields.io/npm/${type}/best-bible.svg`}
                  alt={`npm ${type}`}
                  width={100}
                  height={20}
                  className="h-8 w-auto"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
              ))}
            </div>

            <div className="flex flex-col w-full items-center gap-6 justify-center mb-8">
              <Image
                src="https://github.com/The-Best-Codes/best-bible/blob/main/.image/best-bible-js-logo.png?raw=true"
                alt="Best Bible Logo"
                width={200}
                height={200}
                className="rounded-2xl"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
              <Button
                aria-label="Usage Demo"
                className="w-fit text-3xl bg-blue-500 h-16"
              >
                <Link prefetch={true} href="/projects/bestbible/demo">
                  Usage Demo
                </Link>
              </Button>
            </div>

            <p className="text-center italic mb-8 text-gray-600 dark:text-gray-300">
              Fetch, parse, and analyze the Bible easily with JavaScript
            </p>

            <div className="space-y-6 text-gray-700 dark:text-gray-300">
              <p>
                Best Bible is a powerful and easy-to-use Node.js package that
                provides a simple way to access and retrieve Bible verses,
                chapters, and books. It offers a comprehensive set of functions
                to fetch Bible data in various formats, making it convenient for
                developers to integrate Bible functionality into their
                applications.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Installation
              </h2>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
                <SyntaxHighlighter language="bash">
                  npm install best-bible
                </SyntaxHighlighter>
              </pre>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Usage
              </h2>
              <p>Import the best-bible package in your Node.js application:</p>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
                <SyntaxHighlighter language="javascript">{`const { getVerse, getChapter, getBook } = require('best-bible');`}</SyntaxHighlighter>
              </pre>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Contributing
              </h2>
              <p>
                Contributions to Best Bible are welcome! If you find any issues
                or have suggestions for improvements, please open an issue or
                submit a pull request on the{" "}
                <Link
                  prefetch={true}
                  href="https://github.com/The-Best-Codes/best-bible"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  GitHub repository
                </Link>
                .
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                License
              </h2>
              <p>
                Best Bible is open-source software licensed under the{" "}
                <Link
                  prefetch={true}
                  href="https://www.gnu.org/licenses/gpl-3.0.en.html"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  GNU General Public License Version 3
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
