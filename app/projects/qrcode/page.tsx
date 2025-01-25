"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import ExploreMorePages from "@/components/website/explore_pages";
import Footer from "@/components/website/footer";
import Header from "@/components/website/header";
import { AlertCircle, Check, Copy, Download, Printer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

const QRCodeGenerator = () => {
  const [text, setText] = useState("https://bestcodes.dev");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("M");
  const [marginSize, setMarginSize] = useState(0);
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState("idle");

  useEffect(() => {
    if (text.length > 2953) {
      setError("Text is too long for QR code generation.");
    } else {
      setError("");
    }
  }, [text]);

  const handleDownload = (format: "svg" | "png") => {
    const svg = document.getElementById("qr-code");
    if (svg) {
      if (format === "svg") {
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        const svgUrl = URL.createObjectURL(svgBlob);
        const downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = "qrcode.svg";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else if (format === "png") {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        canvas.width = size;
        canvas.height = size;
        const img = new Image();
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          const pngUrl = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          downloadLink.download = "qrcode.png";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        };
        img.src = URL.createObjectURL(svgBlob);
      }
    }
  };

  const handleCopyToClipboard = () => {
    const svg = document.getElementById("qr-code");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      navigator.clipboard
        .writeText(svgData)
        .then(() => {
          setCopyStatus("success");
          setTimeout(() => setCopyStatus("idle"), 1000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          setCopyStatus("error");
          setTimeout(() => setCopyStatus("idle"), 1000);
        });
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const svg = document.getElementById("qr-code");
    if (svg && printWindow) {
      const svgData = new XMLSerializer().serializeToString(svg);
      printWindow.document.write(`
        <html>
          <head>
            <title>Print QR Code</title>
          </head>
          <body>
            ${svgData}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                }
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <main className="bg-slate-100 dark:bg-slate-900 min-h-screen w-full">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-5xl mx-auto mt-8 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center dark:text-white">
              QR Code Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="text" className="dark:text-white">
                Text or URL
              </Label>
              <Textarea
                id="text"
                placeholder="Enter text or URL for QR code"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full dark:bg-slate-700 dark:text-white dark:border-slate-900"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size" className="dark:text-white">
                  Size
                </Label>
                <Slider
                  id="size"
                  min={128}
                  max={512}
                  step={8}
                  value={[size]}
                  onValueChange={(value) => setSize(value[0])}
                  className="dark:bg-slate-700"
                />
                <div className="text-sm text-muted-foreground dark:text-slate-300">
                  {size}x{size} pixels
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="errorCorrection" className="dark:text-white">
                  Error Correction Level
                </Label>
                <Select
                  value={errorCorrectionLevel}
                  onValueChange={setErrorCorrectionLevel}
                >
                  <SelectTrigger
                    id="errorCorrection"
                    className="dark:bg-slate-700 dark:text-white dark:border-slate-900"
                  >
                    <SelectValue placeholder="Select error correction level" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-700 dark:text-white">
                    <SelectItem value="L">Low (7%)</SelectItem>
                    <SelectItem value="M">Medium (15%)</SelectItem>
                    <SelectItem value="Q">Quartile (25%)</SelectItem>
                    <SelectItem value="H">High (30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fgColor" className="dark:text-white">
                  Foreground Color
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="fgColor"
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-12 h-10 p-1 rounded dark:bg-slate-700 dark:text-white dark:border-slate-900"
                  />
                  <Input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="grow dark:bg-slate-700 dark:text-white dark:border-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bgColor" className="dark:text-white">
                  Background Color
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="bgColor"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-10 p-1 rounded dark:bg-slate-700 dark:text-white dark:border-slate-900"
                  />
                  <Input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="grow dark:bg-slate-700 dark:text-white dark:border-slate-900"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="marginSize" className="dark:text-white">
                Margin Size
              </Label>
              <Slider
                id="marginSize"
                min={0}
                max={5}
                step={1}
                value={[marginSize]}
                onValueChange={(value) => setMarginSize(value[0])}
                className="dark:bg-slate-700"
              />
              <div className="text-sm text-muted-foreground dark:text-slate-300">
                Margin Size: {marginSize}
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex justify-center">
              {!error && (
                <QRCodeSVG
                  id="qr-code"
                  value={text}
                  size={size}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level={errorCorrectionLevel as "L" | "M" | "Q" | "H"}
                  marginSize={marginSize}
                />
              )}
            </div>{" "}
          </CardContent>
          <CardFooter className="flex flex-wrap justify-center gap-2">
            <Button
              onClick={() => handleDownload("svg")}
              disabled={!text || !!error}
              className="flex items-center gap-2"
            >
              <Download size={20} />
              <span className="hidden sm:inline">Download SVG</span>
              <span className="sm:hidden">SVG</span>
            </Button>
            <Button
              onClick={() => handleDownload("png")}
              disabled={!text || !!error}
              className="flex items-center gap-2"
            >
              <Download size={20} />
              <span className="hidden sm:inline">Download PNG</span>
              <span className="sm:hidden">PNG</span>
            </Button>
            <Button
              onClick={handleCopyToClipboard}
              disabled={!text || !!error || copyStatus !== "idle"}
              className="flex items-center gap-2"
            >
              {copyStatus === "idle" && <Copy size={20} />}
              {copyStatus === "success" && <Check size={20} />}
              {copyStatus === "error" && <AlertCircle size={20} />}
              <span className="hidden sm:inline">
                {copyStatus === "idle" && "Copy to Clipboard"}
                {copyStatus === "success" && "Copied!"}
                {copyStatus === "error" && "Failed to copy"}
              </span>
            </Button>
            <Button
              onClick={handlePrint}
              disabled={!text || !!error}
              className="flex items-center gap-2"
            >
              <Printer size={20} />
              <span className="hidden sm:inline">Print QR Code</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <ExploreMorePages currentPath="/projects/qrcode" />
      <Footer />
    </main>
  );
};

export default QRCodeGenerator;
