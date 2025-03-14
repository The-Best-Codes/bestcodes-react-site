"use client";
import React, { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface PiAnoProps {}

const PiAno: React.FC<PiAnoProps> = () => {
  const [piDigits, setPiDigits] = useState<number[]>([]); // Initialize as empty array
  const [calculationInterval, setCalculationInterval] = useState<number>(100);
  const [noteDuration, setNoteDuration] = useState<number>(200);
  const [silenceDuration, setSilenceDuration] = useState<number>(50);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const audioContext = useRef<AudioContext | null>(null);

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
      audioContext.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
  }, []);

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
      audioContext.current.currentTime + noteDuration / 1000,
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + noteDuration / 1000);
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
      calculationInterval + noteDuration + silenceDuration,
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

  const handleCalculationIntervalChange = (value: number[]) => {
    setCalculationInterval(value[0]);
  };

  const handleNoteDurationChange = (value: number[]) => {
    setNoteDuration(value[0]);
  };

  const handleSilenceDurationChange = (value: number[]) => {
    setSilenceDuration(value[0]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Pi-ano</h1>
      <p className="mb-2">
        Listen to the music of π - each digit plays a different note
      </p>
      <p className="mb-4">π = {piDigits.join("")}</p>

      <div className="mb-4">
        <label
          htmlFor="calculationInterval"
          className="block text-sm font-medium text-gray-700"
        >
          Calculation Interval (ms): {calculationInterval}
        </label>
        <Slider
          defaultValue={[calculationInterval]}
          max={500}
          min={50}
          step={1}
          onValueChange={handleCalculationIntervalChange}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="noteDuration"
          className="block text-sm font-medium text-gray-700"
        >
          Note Duration (ms): {noteDuration}
        </label>
        <Slider
          defaultValue={[noteDuration]}
          max={500}
          min={50}
          step={1}
          onValueChange={handleNoteDurationChange}
          className="w-full"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="silenceDuration"
          className="block text-sm font-medium text-gray-700"
        >
          Silence Duration (ms): {silenceDuration}
        </label>
        <Slider
          defaultValue={[silenceDuration]}
          max={200}
          min={0}
          step={1}
          onValueChange={handleSilenceDurationChange}
          className="w-full"
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={isPlaying ? pausePlaying : startPlaying}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button variant="destructive" onClick={reset}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default PiAno;
