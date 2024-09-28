"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Play, Plus, Trash2, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";

const CodePerformanceTester: React.FC = () => {
  const [globalCode, setGlobalCode] = useState<string>(`// Global code here
const factorial = (n) => {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
};
`);

  const [miniCodes, setMiniCodes] = useState<
    Array<{ id: number; code: string }>
  >([
    {
      id: 1,
      code: "const result = factorial(20); // Using our global function",
    },
    {
      id: 2,
      code: "const result = factorial(200); // This one should take longer",
    },
    {
      id: 3,
      code: "const result = 2432902008176640000; // Pre-calculated factorial of 20; this should be faster",
    },
  ]);

  const [results, setResults] = useState<
    Array<{ id: number; iterations: number }>
  >([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("global");
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeEditor = () => {
      if (editorRef.current) {
        const { top } = editorRef.current.getBoundingClientRect();
        const height = window.innerHeight - top - 20; // 20px for some padding
        editorRef.current.style.height = `${height}px`;
      }
    };

    resizeEditor();
    window.addEventListener("resize", resizeEditor);

    return () => {
      window.removeEventListener("resize", resizeEditor);
    };
  }, []);

  const addMiniCode = () => {
    const newId = miniCodes.length + 1;
    setMiniCodes([...miniCodes, { id: newId, code: `// Code ${newId} here` }]);
    setActiveTab(`mini-${newId}`);
  };

  const removeMiniCode = (id: number) => {
    setMiniCodes(miniCodes.filter((code) => code.id !== id));
    if (activeTab === `mini-${id}`) {
      const index = miniCodes.findIndex((code) => code.id === id);
      if (index > 0) {
        setActiveTab(`mini-${miniCodes[index - 1].id}`);
      } else if (index === 0 && miniCodes.length > 1) {
        setActiveTab(`mini-${miniCodes[1].id}`);
      } else {
        setActiveTab("global");
      }
    }
  };

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setProgress(0);
    const newResults = [];

    try {
      const workerBlob = new Blob(
        [await fetch("/assets/codeperf/worker.js").then((res) => res.text())],
        { type: "application/javascript" }
      );
      const workerUrl = URL.createObjectURL(workerBlob);

      for (let i = 0; i < miniCodes.length; i++) {
        const miniCode = miniCodes[i];
        const fullCode = `
          ${globalCode}
          ${miniCode.code}
        `;

        let totalIterations = 0;
        let totalTime = 0;
        const numRuns = 5;
        const runTime = 200;

        for (let run = 0; run < numRuns; run++) {
          const worker = new Worker(workerUrl);

          try {
            const result = await new Promise<{
              iterations: number;
              timeElapsed: number;
            }>((resolve, reject) => {
              worker.onmessage = (e) => {
                if (e.data.error) {
                  reject(new Error(e.data.error));
                } else {
                  resolve(e.data);
                }
              };
              worker.onerror = reject;
              worker.postMessage({ code: fullCode, runTime });
            });

            totalIterations += result.iterations;
            totalTime += result.timeElapsed;
          } catch (error) {
            console.error(
              `Error in worker execution for ${miniCode.id}, run ${run + 1}:`,
              error
            );
            // I might want to handle this error differently, e.g., skip this run or the entire miniCode
            setError(JSON.stringify(error) || "Unknown error");
          } finally {
            worker.terminate();
          }
        }

        const averageIterationsPerSecond = Math.round(
          (totalIterations / totalTime) * 1000
        );

        newResults.push({
          id: miniCode.id,
          iterations: averageIterationsPerSecond,
        });

        setProgress(((i + 1) / miniCodes.length) * 100);
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      URL.revokeObjectURL(workerUrl);
      setResults(newResults);
    } catch (error) {
      console.error("Error in runCode:", error);
      // Handle the error, e.g., show an error message to the user
      setError(JSON.stringify(error) || "Unknown error");
    } finally {
      setIsRunning(false);
    }
  }, [globalCode, miniCodes]);

  const chartConfig: ChartConfig = {
    iterations: {
      label: "It./s",
      color: "hsl(var(--chart-1))",
    },
  };

  const getPerformanceComparison = (iterations: number) => {
    if (results.length === 0) return "N/A";
    const bestPerformance = Math.max(...results.map((r) => r.iterations));
    const percentage = (iterations / bestPerformance) * 100;
    return `${percentage.toFixed(2)}%`;
  };

  return (
    <div className="w-full p-4 min-h-screen flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white">
      <h2 className="text-3xl font-bold mb-6 dark:text-white">
        Code Performance Analyzer
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
        <Card className="flex flex-col h-[calc(100vh-10rem)] lg:h-auto bg-white dark:bg-gray-800 dark:border-none">
          <CardHeader>
            <CardTitle className="dark:text-white">Code Editor</CardTitle>
            <CardDescription className="dark:text-gray-300">
              Write and edit your code here
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="h-full flex flex-col"
            >
              <TabsList className="justify-start overflow-x-auto bg-gray-100 dark:bg-gray-700">
                <TabsTrigger
                  value="global"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 dark:text-white dark:data-[state=active]:text-white"
                >
                  Global Code
                </TabsTrigger>
                {miniCodes.map((miniCode) => (
                  <TabsTrigger
                    key={miniCode.id}
                    value={`mini-${miniCode.id}`}
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 dark:text-white dark:data-[state=active]:text-white"
                  >
                    Code {miniCode.id}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="flex-grow overflow-auto">
                <TabsContent value="global" className="h-full mt-0">
                  <Editor
                    value={globalCode}
                    onValueChange={(code) => setGlobalCode(code)}
                    highlight={(code) =>
                      highlight(code, languages.javascript, "javascript")
                    }
                    padding={10}
                    style={{
                      fontFamily: '"Fira code", "Fira Mono", monospace',
                      fontSize: 12,
                      height: "100%",
                      backgroundColor: "white",
                    }}
                  />
                </TabsContent>
                {miniCodes.map((miniCode) => (
                  <TabsContent
                    key={miniCode.id}
                    value={`mini-${miniCode.id}`}
                    className="h-full mt-0"
                  >
                    <div className="relative h-full">
                      <Editor
                        value={miniCode.code}
                        onValueChange={(code) =>
                          setMiniCodes(
                            miniCodes.map((c) =>
                              c.id === miniCode.id ? { ...c, code: code } : c
                            )
                          )
                        }
                        highlight={(code) =>
                          highlight(code, languages.javascript, "javascript")
                        }
                        padding={10}
                        style={{
                          fontFamily: '"Fira code", "Fira Mono", monospace',
                          fontSize: 12,
                          height: "100%",
                          backgroundColor: "white",
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => removeMiniCode(miniCode.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button
              aria-label="Add Mini Code"
              onClick={addMiniCode}
              className="mr-2 dark:bg-gray-700 dark:text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Mini Code
            </Button>
            <Button
              aria-label="Run Code"
              onClick={runCode}
              disabled={isRunning}
              className="dark:bg-gray-700 dark:text-white"
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isRunning ? "Running..." : "Run Tests"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col h-[calc(100vh-10rem)] lg:h-auto bg-white dark:bg-gray-800 dark:border-none">
          <CardHeader>
            <CardTitle className="dark:text-white">
              Performance Results
            </CardTitle>
            <CardDescription className="dark:text-gray-300">
              Iterations per second for each code snippet
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto">
            {isRunning && (
              <div className="mb-4">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-center mt-2 dark:text-gray-300">
                  {Math.ceil((progress / 100) * miniCodes.length) === 0
                    ? "Initializing..."
                    : `Running code ${Math.ceil(
                        (progress / 100) * miniCodes.length
                      )} of ${miniCodes.length}`}
                </p>
              </div>
            )}
            {error !== null && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>An Error Occurred</AlertTitle>
                <AlertDescription>
                  {error !== "{}"
                    ? error
                    : "One or more code snippets failed to run."}
                </AlertDescription>
              </Alert>
            )}
            {results.length > 0 && (
              <ChartContainer config={chartConfig}>
                <BarChart data={results}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="id" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="iterations"
                    fill="var(--color-iterations)"
                    radius={8}
                  />
                </BarChart>
              </ChartContainer>
            )}
            {results.length === 0 && (
              <div className="flex h-full items-center justify-center dark:text-gray-300">
                No results yet &middot; Click &quot;Run Tests&quot; to get
                started
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none text-xl dark:text-white">
              {results.length > 0 && (
                <>
                  Best performance: Code{" "}
                  {
                    results.reduce((max, obj) =>
                      obj.iterations > max.iterations ? obj : max
                    ).id
                  }
                </>
              )}
            </div>
            {results.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-lg mb-2 dark:text-white">
                  Performance Comparison:
                </h3>
                {results.map((result) => (
                  <p
                    className="mb-2 text-base dark:text-gray-300"
                    key={result.id}
                  >
                    Code {result.id}:{" "}
                    <span className="font-bold">
                      {getPerformanceComparison(result.iterations)}
                    </span>{" "}
                    of best performance
                  </p>
                ))}
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CodePerformanceTester;
