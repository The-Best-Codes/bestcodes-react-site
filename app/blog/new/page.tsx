"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const BlogEditor: React.FC = () => {
  const [title, setTitle] = useState<string>(`New blog post on ${new Date().toLocaleDateString()}` || "");
  const [content, setContent] = useState<string>("");
  const [theme, setTheme] = useState<string>("dark");

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const windowTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setTheme(windowTheme);
    }
  }, []);

  return (
    <main className="flex min-h-screen scroll-smooth max-w-screen w-full flex-col items-center dark:bg-slate-900">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="flex items-center justify-between mb-6">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog post title"
            className="text-2xl font-bold w-full mr-4 dark:text-white dark:bg-slate-800 dark:border-slate-700"
          />
          <div className="flex space-x-2">
            <Button variant="outline">Save Draft</Button>
            <Button variant="outline">Publish</Button>
          </div>
        </div>

        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          className={`${theme === "dark" ? "dark-mode" : ""}`}
        />
      </div>
    </main>
  );
};

export default BlogEditor;
