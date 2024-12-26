"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/website/header";
import { useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import levenshtein from "js-levenshtein";

const textOptions = {
  short:
    "What is the weather like today? I think it's sunny. I love the beach.",
  letters:
    "The quick brown fox jumps over the lazy dog. How vexinly quick daft zebras jump!",
  grammar:
    "The manager, who was responsible for overseeing the project, ensured that all team members were aware of their roles and responsibilities. The project's success was contingent upon everyone's cooperation; therefore, it was essential that each person understood their tasks and deadlines. Meanwhile, the marketing team was busy creating promotional materials, including brochures, flyers, and social media posts. After all, the launch date was quickly approaching, and everything needed to be perfect! Nevertheless, the team remained confident and focused, knowing that their hard work would ultimately pay off.",
  random:
    "Alice said why. I wonder if the phone is real. I doubt this issue is compact. Try not to smile as we tickle the cat. Hats are a Western staple. Do go on and check if your chair is stable.",
  chat: "Hey! How's it going? I hope you're having a great day. Did you see that new movie that just came out? It's supposed to be really good. We should totally check it out sometime. Maybe grab dinner before? Let me know what you think!",
  formal:
    "Dear esteemed colleagues, I hope this message finds you well. I am writing to cordially invite you to our annual conference, which will be held on the 15th of next month. We have an impressive lineup of speakers and engaging workshops planned. Your presence would be greatly appreciated.",
};

type TextOption = keyof typeof textOptions;

function useDebounce(value: boolean, delay: number): boolean {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<TextOption>("short");
  const [inputText, setInputText] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [letterStats, setLetterStats] = useState<
    { letter: string; time: number }[]
  >([]);
  const [maxLetterTime, setMaxLetterTime] = useState<number>(0);
  const [isEditAllowed, setIsEditAllowed] = useState(false);
  const [isDisabledKeyPressed, setIsDisabledKeyPressed] = useState(false);
  const debouncedKeyPress = useDebounce(isDisabledKeyPressed, 200);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const targetText = textOptions[selectedOption];

  useEffect(() => {
    if (inputText.length === 1 && startTime === null) {
      setStartTime(Date.now());
    }
  }, [inputText, startTime]);

  const disabledKeys = [
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Backspace",
    "Delete",
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.shiftKey && e.key === "Enter") {
      e.preventDefault();
      finishTyping();
    }
    if (!isEditAllowed && disabledKeys.includes(e.key)) {
      e.preventDefault();
      setIsDisabledKeyPressed(true);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (!isEditAllowed) {
      if (disabledKeys.includes(e.key)) {
        setIsDisabledKeyPressed(false);
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputText(newValue);
  };

  const finishTyping = () => {
    if (startTime !== null && endTime === null) {
      const end = Date.now();
      setEndTime(end);
      calculateResults(end);
    }
  };

  const calculateResults = (endTime: number) => {
    if (startTime) {
      const timeInMinutes = (endTime - startTime) / 60000;
      const wordsTyped = inputText.trim().split(/\s+/).length;
      setWpm(Math.round(wordsTyped / timeInMinutes));

      const accuracyPercentage =
        100 - (levenshtein(targetText, inputText) / targetText.length) * 100;
      setAccuracy(Math.round(accuracyPercentage * 100) / 100);

      setMaxLetterTime(0);
      analyzeWordData(startTime, endTime);
    }
  };

  const analyzeWordData = (start: number, end: number) => {
    const words = inputText.split(/\s+/);
    let currentTime = start;
    const letterTimes: { [key: string]: number[] } = {};

    words.forEach((word, index) => {
      const wordEndTime = start + (end - start) * ((index + 1) / words.length);
      const timeTaken = wordEndTime - currentTime;

      const letterTimesForWord = word.split("").map((letter, letterIndex) => {
        const letterTime =
          currentTime +
          (timeTaken * (letterIndex + 1)) / word.length -
          currentTime;
        if (!letterTimes[letter]) letterTimes[letter] = [];
        letterTimes[letter].push(letterTime);
        return { letter, time: letterTime };
      });

      currentTime = wordEndTime;
    });

    const avgLetterTimes = Object.entries(letterTimes)
      .map(([letter, times]) => ({
        letter,
        time: Number(
          (times.reduce((sum, time) => sum + time, 0) / times.length).toFixed(
            2,
          ),
        ),
      }))
      .sort((a, b) => a.letter.localeCompare(b.letter));

    setLetterStats(avgLetterTimes);

    // Calculate and set the maximum letter time
    const maxTime = Math.max(...avgLetterTimes.map((item) => item.time));
    setMaxLetterTime(maxTime.toFixed(2) as unknown as number);
  };

  const handleReset = () => {
    setInputText("");
    setStartTime(null);
    setEndTime(null);
    setWpm(null);
    setAccuracy(null);
    setLetterStats([]);
    setMaxLetterTime(0);
    inputRef.current?.focus();
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-white to-slate-100 dark:from-slate-800 dark:to-slate-900">
      <Header />
      <div className="container mx-auto p-4 mt-10">
        <Card className="max-w-4xl mx-auto dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Typing Speed Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select
                onValueChange={(value: TextOption) => setSelectedOption(value)}
                value={selectedOption}
              >
                <SelectTrigger className="dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700">
                  <SelectValue placeholder="Select text type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700">
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="letters">Letters</SelectItem>
                  <SelectItem value="grammar">Grammar</SelectItem>
                  <SelectItem value="random">Random</SelectItem>
                  <SelectItem value="chat">Chat</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <h3 className="font-bold mb-2">Text to type:</h3>
              <div className="p-2 bg-gray-100 rounded dark:bg-slate-700">
                {targetText}
              </div>
            </div>

            <div className="mb-4 flex items-center gap-2">
              <Switch
                className="dark:data-[state=unchecked]:bg-slate-700 dark:data-[state=unchecked]:border-slate-600 dark:data-[state=checked]:bg-slate-800 dark:data-[state=checked]:text-slate-100 dark:data-[state=checked]:border-slate-500"
                checked={isEditAllowed}
                onCheckedChange={(value) => setIsEditAllowed(value)}
              />
              <span className="ml-2">Allow editing</span>
            </div>

            <div className="mb-4">
              <Textarea
                ref={inputRef}
                value={inputText}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                onPaste={(e) => e.preventDefault()}
                disabled={endTime !== null}
                placeholder="Start typing here..."
                className={`w-full transition-colors duration-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:placeholder:text-slate-300 ${
                  isDisabledKeyPressed || debouncedKeyPress
                    ? "bg-orange-200 ring-orange-400 focus:ring-orange-400 focus-visible:ring-orange-400 dark:bg-orange-800 dark:ring-orange-600 dark:focus:ring-orange-600 dark:focus-visible:ring-orange-600"
                    : ""
                }`}
              />
            </div>

            {wpm !== null && accuracy !== null && (
              <div className="text-center text-xl font-bold mb-4">
                <p>Your typing speed: {wpm} WPM</p>
                <p>Accuracy: {accuracy}%</p>
              </div>
            )}

            {letterStats.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold mb-2">Letter Timing Chart:</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={letterStats}>
                    <XAxis dataKey="letter" />
                    <YAxis domain={[0, (maxLetterTime * 1.1).toFixed(0)]} />
                    <Tooltip />
                    <Bar dataKey="time" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleReset}>Reset</Button>
            <Button onClick={finishTyping} disabled={endTime !== null}>
              Done
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
