"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Fireworks } from "@fireworks-js/react";
import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import { useEffect, useState, type CSSProperties } from "react";

type Props = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const Countdown = ({ days, hours, minutes, seconds }: Props) => {
  return (
    <NumberFlowGroup>
      <div
        style={
          {
            fontVariantNumeric: "tabular-nums",
            "--number-flow-char-height": "0.85em",
          } as CSSProperties
        }
        className="text-6xl sm:text-8xl flex items-baseline font-semibold"
      >
        <NumberFlow
          trend={-1}
          value={days}
          format={{ minimumIntegerDigits: 2 }}
        />
        <NumberFlow
          prefix=":"
          trend={-1}
          value={hours}
          digits={{ 1: { max: 2 } }}
          format={{ minimumIntegerDigits: 2 }}
        />
        <NumberFlow
          prefix=":"
          trend={-1}
          value={minutes}
          digits={{ 1: { max: 5 } }}
          format={{ minimumIntegerDigits: 2 }}
        />
        <NumberFlow
          prefix=":"
          trend={-1}
          value={seconds}
          digits={{ 1: { max: 5 } }}
          format={{ minimumIntegerDigits: 2 }}
        />
      </div>
    </NumberFlowGroup>
  );
};

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showFireworks, setShowFireworks] = useState(false);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear() + 1,
  ); // Initialized to next year

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextNewYear = new Date(selectedYear, 0, 1);
      let diff = nextNewYear.getTime() - now.getTime();

      if (diff <= 0) {
        //If the selected year is in the past, set time to zero
        diff = 0;
        if (!showFireworks) {
          setShowFireworks(true); // Activate fireworks only if they haven't been shown
        }
      } else {
        setShowFireworks(false);
      }

      const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
      const hours = Math.max(
        0,
        Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      );
      const minutes = Math.max(
        0,
        Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      );
      const seconds = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft(); // Initial calculation

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [selectedYear, showFireworks]);

  // Generate an array of years for the dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <main>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <h1 className="text-4xl font-bold mb-8">New Year Countdown</h1>
        <Select
          value={selectedYear.toString()}
          onValueChange={(value) => setSelectedYear(parseInt(value, 10))}
        >
          <SelectTrigger className="w-[180px] mb-4 bg-gray-800 border-gray-700 text-white rounded-lg">
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white rounded-lg">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Countdown
          days={timeLeft.days}
          hours={timeLeft.hours}
          minutes={timeLeft.minutes}
          seconds={timeLeft.seconds}
        />
        {showFireworks && (
          <Fireworks
            options={{
              rocketsPoint: {
                min: 0,
                max: 100,
              },
            }}
            style={{
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              position: "fixed",
              background: "transparent",
              zIndex: 10,
            }}
          />
        )}
      </div>
    </main>
  );
}
