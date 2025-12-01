"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/website/header";
import { PauseCircle, PlayCircle, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface CharType {
  enabled: boolean;
  frequency: number;
}

interface CharTypes {
  [key: string]: CharType;
}

const RandomTokenStreamGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [charTypes, setCharTypes] = useState<CharTypes>({
    uppercase: { enabled: true, frequency: 25 },
    lowercase: { enabled: true, frequency: 25 },
    numbers: { enabled: true, frequency: 25 },
    symbols: { enabled: false, frequency: 25 },
  });
  const [chunkSize, setChunkSize] = useState(100);
  const [generationSpeed, setGenerationSpeed] = useState(1); // chunks per second
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const generateChunk = useCallback(() => {
    const charSets = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    };

    let result = "";
    const enabledTypes = Object.entries(charTypes).filter(
      ([_, { enabled }]) => enabled,
    );
    const totalFrequency = enabledTypes.reduce(
      (sum, [_, { frequency }]) => sum + frequency,
      0,
    );

    for (let i = 0; i < chunkSize; i++) {
      const randomNum = Math.random() * totalFrequency;
      let accumulatedFrequency = 0;

      for (const [type, { frequency }] of enabledTypes) {
        accumulatedFrequency += frequency;
        if (randomNum <= accumulatedFrequency) {
          result += charSets[type as keyof typeof charSets].charAt(
            Math.floor(
              Math.random() * charSets[type as keyof typeof charSets].length,
            ),
          );
          break;
        }
      }
    }
    return result;
  }, [chunkSize, charTypes]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isGenerating) {
      intervalId = setInterval(() => {
        const newChunk = generateChunk();
        setGeneratedText((prev) => prev + newChunk);
        if (textareaRef.current) {
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
      }, 1000 / generationSpeed);
    }
    return () => clearInterval(intervalId);
  }, [isGenerating, generateChunk, generationSpeed]);

  const handleCharTypeChange = (
    type: string,
    field: "enabled" | "frequency",
    value: boolean | number,
  ) => {
    setCharTypes((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const clearOutput = () => {
    setGeneratedText("");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8">
          Random Token Stream Generator
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 max-w-2xl mx-auto">
          <div className="mb-4 flex justify-center gap-4">
            <Button
              onClick={() => setIsGenerating(!isGenerating)}
              size="icon"
              aria-label={
                isGenerating ? "Pause Generation" : "Start Generation"
              }
            >
              {isGenerating ? (
                <PauseCircle className="w-6 h-6" />
              ) : (
                <PlayCircle className="w-6 h-6" />
              )}
            </Button>
            <Button onClick={clearOutput} size="icon" aria-label="Clear Output">
              <Trash2 className="w-6 h-6" />
            </Button>
          </div>

          <div className="mb-4">
            <Label htmlFor="chunkSize" className="text-lg font-semibold mb-2">
              Chunk Size: {chunkSize}
            </Label>
            <Slider
              id="chunkSize"
              min={1}
              max={1000}
              step={1}
              value={[chunkSize]}
              onValueChange={(value) => setChunkSize(value[0])}
            />
          </div>

          <div className="mb-4">
            <Label
              htmlFor="generationSpeed"
              className="text-lg font-semibold mb-2"
            >
              Generation Speed: {generationSpeed} chunk(s)/second
            </Label>
            <Slider
              id="generationSpeed"
              min={1}
              max={1000}
              step={1}
              value={[generationSpeed]}
              onValueChange={(value) => setGenerationSpeed(value[0])}
            />
          </div>

          <div className="space-y-4 mb-4">
            {Object.entries(charTypes).map(([type, { enabled, frequency }]) => (
              <div
                key={type}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  <Switch
                    id={type}
                    checked={enabled}
                    onCheckedChange={(checked) =>
                      handleCharTypeChange(type, "enabled", checked)
                    }
                  />
                  <Label htmlFor={type} className="capitalize">
                    {type}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`${type}-frequency`}>Frequency</Label>
                  <Input
                    id={`${type}-frequency`}
                    type="number"
                    min={1}
                    max={100}
                    value={frequency}
                    onChange={(e) =>
                      handleCharTypeChange(
                        type,
                        "frequency",
                        parseInt(e.target.value),
                      )
                    }
                    disabled={!enabled}
                    className="w-16 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            ))}
          </div>

          <textarea
            ref={textareaRef}
            readOnly
            value={generatedText}
            className="w-full h-64 p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded border border-gray-300 dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

export default RandomTokenStreamGenerator;
