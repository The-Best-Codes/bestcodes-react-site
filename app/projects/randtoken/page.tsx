"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Check, X, Copy, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/website/header";

const RandomTokenGenerator = () => {
  const [token, setToken] = useState("");
  const [length, setLength] = useState(12);
  const [charTypes, setCharTypes] = useState({
    uppercase: { enabled: true, frequency: 25 },
    lowercase: { enabled: true, frequency: 25 },
    numbers: { enabled: true, frequency: 25 },
    symbols: { enabled: false, frequency: 25 },
  });
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const generateToken = useCallback(() => {
    const charSets = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    };

    let result = "";
    const enabledTypes = Object.entries(charTypes).filter(
      ([_, { enabled }]) => enabled
    );
    const totalFrequency = enabledTypes.reduce(
      (sum, [_, { frequency }]) => sum + frequency,
      0
    );

    for (let i = 0; i < length; i++) {
      const randomNum = Math.random() * totalFrequency;
      let accumulatedFrequency = 0;

      for (const [type, { frequency }] of enabledTypes) {
        accumulatedFrequency += frequency;
        if (randomNum <= accumulatedFrequency) {
          result += charSets[type as keyof typeof charSets].charAt(
            Math.floor(
              Math.random() * charSets[type as keyof typeof charSets].length
            )
          );
          break;
        }
      }
    }
    setToken(result);
  }, [length, charTypes]);

  useEffect(() => {
    generateToken();
  }, [generateToken]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopyStatus("success");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (err) {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  const handleCharTypeChange = (
    type: string,
    field: "enabled" | "frequency",
    value: boolean | number
  ) => {
    setCharTypes((prev) => ({
      ...prev,
      [type]: { ...prev[type as keyof typeof prev], [field]: value },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8">Random Token Generator</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 max-w-2xl mx-auto">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">Your Token:</h2>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={token}
                readOnly
                aria-label="Generated Token"
                className="flex-grow bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <Button
                onClick={copyToClipboard}
                disabled={copyStatus !== "idle"}
                size="icon"
                aria-label={
                  copyStatus === "idle"
                    ? "Copy to Clipboard"
                    : copyStatus === "success"
                    ? "Copied!"
                    : "Error"
                }
              >
                {copyStatus === "success" ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : copyStatus === "error" ? (
                  <X className="w-4 h-4 text-red-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          <Button
            onClick={generateToken}
            className="w-full mb-4"
            aria-label="Regenerate Token"
          >
            Regenerate
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
          <div className="mb-4">
            <Label htmlFor="length" className="text-lg font-semibold mb-2">
              Token Length: {length}
            </Label>
            <Slider
              id="length"
              min={4}
              max={512}
              step={1}
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
            />
          </div>
          <div className="space-y-4">
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
                        parseInt(e.target.value)
                      )
                    }
                    disabled={!enabled}
                    className="w-16 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomTokenGenerator;
