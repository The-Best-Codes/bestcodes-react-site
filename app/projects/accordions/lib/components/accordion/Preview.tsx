"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PreviewProps {
  htmlContent: string;
}

export const Preview: React.FC<PreviewProps> = ({ htmlContent }) => (
  <Card className="h-full dark:border-slate-700 dark:bg-slate-800 sticky top-4">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="dark:text-white">Preview</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="relative">
        <iframe
          className="w-full h-[calc(100vh-12rem)] rounded-lg border dark:border-slate-700 bg-white"
          srcDoc={htmlContent}
          title="Accordion Preview"
          sandbox="allow-scripts"
        />
        {!htmlContent && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
            <p className="text-slate-500 dark:text-slate-400">
              Add some content to see the preview
            </p>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);
