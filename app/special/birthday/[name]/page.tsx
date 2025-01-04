"use client";

import { Loader2 } from "lucide-react";
import { use, useEffect, useState } from "react";
import Confetti from "react-confetti";

function sanitizeGradient(gradient: string): string {
  // Basic sanitization to prevent obvious issues.
  if (typeof gradient !== "string") return "";
  return gradient.trim();
}

export default function BirthdayPage({
  params,
  searchParams,
}: {
  params: Promise<{ name: string; gradient?: string }>;
  searchParams: Promise<{ message?: string }>;
}) {
  const { name: rawName, gradient: rawGradient } = use(params);
  const resolvedSearchParams = use(searchParams);

  const [name, setName] = useState("");
  const [gradient, setGradient] = useState(
    "linear-gradient(to right, #ff69b4, #ffc0cb)",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle params asynchronously
    Promise.resolve(rawName).then((resolvedName) => {
      setName(resolvedName);
    });

    // Sanitize gradient
    if (rawGradient) {
      const sanitizedGradient = sanitizeGradient(rawGradient);
      setGradient(
        sanitizedGradient || "linear-gradient(to right, #ff69b4, #ffc0cb)",
      );
    }

    // Handle message
    if (resolvedSearchParams.message) {
      setMessage(decodeURIComponent(resolvedSearchParams.message));
    }

    setLoading(false);
  }, [rawName, rawGradient, resolvedSearchParams.message]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-16 w-16 text-gray-500" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: gradient }}
    >
      <Confetti
        style={{ position: "fixed" }}
        numberOfPieces={50}
        recycle={true}
        tweenDuration={5000}
        gravity={0.1}
        opacity={0.7}
      />
      <div className="text-center">
        <h1 className="text-4xl font-bold">Happy Birthday, {name}!</h1>
        <p className="text-xl mt-4">
          {message || "🎉 Wishing you a fantastic day! 🎉"}
        </p>
      </div>
    </div>
  );
}
