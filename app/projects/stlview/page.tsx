"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Upload, Loader2, Camera, Download, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import Header from "@/components/website/header";
import ExploreMorePages from "@/components/website/explore_pages";

const STLViewer = dynamic(() => import("@/components/stlview/STLViewer"), {
  ssr: false,
});

export default function Home() {
  const searchParams = useSearchParams();
  const [url, setUrl] = useState("");
  const [loadedUrl, setLoadedUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [color, setColor] = useState("#aaaaaa");
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const screenshotRef = useRef<() => void>(null);

  useEffect(() => {
    const urlParam = searchParams?.get("url");
    if (urlParam) {
      setUrl(urlParam);
    }
  }, [searchParams]);

  const validateUrl = (url: string) => {
    const pattern = /^https?:\/\/.+\.stl$/i;
    return pattern.test(url);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (file) {
      setLoadedUrl(URL.createObjectURL(file));
    } else if (validateUrl(url)) {
      setIsLoading(true);
      try {
        const response = await fetch(url, { method: "HEAD" });
        if (!response.ok) {
          throw new Error("Failed to fetch STL file");
        }
        setLoadedUrl(url);
        // Update URL without causing a page reload
        window.history.pushState({}, "", `?url=${encodeURIComponent(url)}`);
      } catch (err) {
        setError(
          "Failed to load STL file. Please check the URL and try again."
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Please enter a valid STL URL or upload a file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUrl("");
    }
  };

  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleScreenshot = () => {
    if (screenshotRef.current) {
      screenshotRef.current();
    }
  };

  return (
    <main className="min-h-screen w-full bg-gray-100 bg-white dark:bg-gray-900">
      <Header />
      <div className="container mx-auto p-4 h-full">
        <div className="lg:flex lg:space-x-8">
          <Card className="w-full lg:w-1/3 shadow-lg mb-8 lg:mb-0 dark:bg-gray-800 dark:text-gray-200 dark:border-none">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
                STL Viewer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="url">Enter STL URL</Label>
                  <Input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter STL URL"
                    className="w-full dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                    disabled={!!file}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="url"><span className="italic">Or</span>  Upload File</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                    >
                      Upload STL File
                    </Button>
                    <span className="text-sm flex-grow">
                      {file ? file.name : "No file chosen"}
                    </span>
                    {file && (
                      <Button
                        type="button"
                        onClick={handleClearFile}
                        variant="ghost"
                        size="icon"
                        className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".stl"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Select onValueChange={setColor} defaultValue={color}>
                    <SelectTrigger className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
                      <SelectItem value="#aaaaaa">Default</SelectItem>
                      <SelectItem value="#ffffff">White</SelectItem>
                      <SelectItem value="#00ff00">Green</SelectItem>
                      <SelectItem value="#ffaaff">Pink</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="rotationSpeed"
                    className="block text-sm font-medium mb-2"
                  >
                    Rotation Speed
                  </Label>
                  <Slider
                    min={0}
                    max={5}
                    step={0.1}
                    value={[rotationSpeed]}
                    onValueChange={(value) => setRotationSpeed(value[0])}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Load STL
                    </>
                  )}
                </Button>
              </form>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {loadedUrl && (
                <Button onClick={handleScreenshot} className="w-full mt-4">
                  <Camera className="mr-2 h-4 w-4" />
                  Take Screenshot
                </Button>
              )}
            </CardContent>
          </Card>
          <div className="lg:w-2/3">
            {loadedUrl && !error && (
              <div className="mt-8 lg:mt-0">
                <STLViewer
                  url={loadedUrl}
                  color={color}
                  rotationSpeed={rotationSpeed}
                  screenshotRef={screenshotRef}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <ExploreMorePages
        currentPath="/projects/stlview"
        className="mt-32 mb-0 pb-16"
      />
    </main>
  );
}
