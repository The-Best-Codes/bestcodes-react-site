"use client";
import React, { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PiAnoProps {}

const PiAno: React.FC<PiAnoProps> = () => {
  const [piDigits, setPiDigits] = useState<number[]>([]);
  const [speed, setSpeed] = useState<number>(50);
  const [noteLength, setNoteLength] = useState<number>(60);
  const [pauseLength, setPauseLength] = useState<number>(10);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const piDisplayRef = useRef<HTMLParagraphElement>(null);

  const frequencies = {
    0: 261.63,
    1: 293.66,
    2: 329.63,
    3: 349.23,
    4: 392.0,
    5: 440.0,
    6: 493.88,
    7: 523.25,
    8: 587.33,
    9: 659.25,
  };

  useEffect(() => {
    if (!audioContext.current) {
      audioContext.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }

    // Scroll to the end of piDisplay when digits change
    if (piDisplayRef.current) {
      piDisplayRef.current.scrollLeft = piDisplayRef.current.scrollWidth;
    }
  }, [piDigits]);

  // Simplified Pi digit generator using BigInt (constructed with BigInt())
  function* generateDigitsOfPi() {
    let q = BigInt(1);
    let r = BigInt(180);
    let t = BigInt(60);
    let i = BigInt(2);

    while (true) {
      let digit = Number(
        ((i * BigInt(27) - BigInt(12)) * q + r * BigInt(5)) / (t * BigInt(5)),
      );
      yield digit;

      let u = i * BigInt(3);
      u = (u + BigInt(1)) * BigInt(3) * (u + BigInt(2));
      r =
        u *
        BigInt(10) *
        (q * (i * BigInt(5) - BigInt(2)) + r - t * BigInt(digit));
      q *= BigInt(10) * i * (i * BigInt(2) - BigInt(1));
      t *= u;
      i++;
    }
  }

  const piDigitGenerator = generateDigitsOfPi();

  const calculateNextDigit = (): number => {
    const next = piDigitGenerator.next();
    return next.value as number;
  };

  const playNote = (digit: number) => {
    if (!audioContext.current) return;

    const frequency = frequencies[digit as keyof typeof frequencies];

    if (frequency === undefined) {
      console.warn(`No frequency defined for digit ${digit}`);
      return; // Don't play if frequency is undefined.
    }

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      frequency,
      audioContext.current.currentTime,
    );

    gainNode.gain.setValueAtTime(0.5, audioContext.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      0,
      audioContext.current.currentTime + noteLength / 1000,
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + noteLength / 1000);
  };

  const startPlaying = () => {
    setIsPlaying(true);
    if (audioContext.current?.state === "suspended") {
      audioContext.current.resume();
    }
    const id = setInterval(
      () => {
        const nextDigit = calculateNextDigit();

        setPiDigits((prevDigits) => [...prevDigits, nextDigit]);
        playNote(nextDigit);
      },
      speed + noteLength + pauseLength,
    );

    setIntervalId(id);
  };

  const pausePlaying = () => {
    setIsPlaying(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const reset = () => {
    pausePlaying();
    setPiDigits([]); // Reset to empty array.
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };

  const handleNoteLengthChange = (value: number[]) => {
    setNoteLength(value[0]);
  };

  const handlePauseLengthChange = (value: number[]) => {
    setPauseLength(value[0]);
  };

  return (
    <main className="bg-white dark:bg-gray-900">
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-3xl rounded-lg shadow-md dark:bg-slate-800 dark:text-slate-100 dark:border-gray-700">
          <CardHeader className="p-4">
            <CardTitle className="text-2xl font-semibold flex flex-row items-center justify-between">
              <span>Pi-ano</span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={isPlaying ? pausePlaying : startPlaying}
                  className="dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:border-gray-700 dark:hover:text-slate-200"
                >
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <Button variant="destructive" onClick={reset}>
                  Reset
                </Button>
              </div>
            </CardTitle>
            <CardDescription className="dark:text-slate-300">
              <span>
                Listen to the music of Pi &#x2014; each digit plays a different
                note.
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="mb-4 flex flex-row items-center justify-between">
              <label
                htmlFor="piDisplay"
                className="block mr-2 text-base font-medium text-gray-700 dark:text-gray-200"
              >
                &#x03C0; =
              </label>
              <div
                ref={piDisplayRef}
                className="overflow-auto whitespace-nowrap w-full min-h-8 border dark:border-gray-700 rounded p-2 bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-200"
              >
                {piDigits.join("") || "Click 'play' to start!"}
              </div>
            </div>

            <div className="mt-4">
              <span className="text-sm dark:text-slate-300">
                Pause the music before adjusting controls.
              </span>
            </div>

            <div className="mb-4">
              <label
                htmlFor="speed"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Speed: {speed} ms between digits
              </label>
              <Slider
                defaultValue={[speed]}
                max={200}
                min={5}
                step={5}
                onValueChange={handleSpeedChange}
                className="w-full"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="noteLength"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Note Length: {noteLength} ms
              </label>
              <Slider
                defaultValue={[noteLength]}
                max={500}
                min={5}
                step={5}
                onValueChange={handleNoteLengthChange}
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="pauseLength"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Pause Length: {pauseLength} ms
              </label>
              <Slider
                defaultValue={[pauseLength]}
                max={200}
                min={0}
                step={5}
                onValueChange={handlePauseLengthChange}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default PiAno;
