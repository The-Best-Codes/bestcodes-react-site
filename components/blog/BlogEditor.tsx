"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Post } from "@/types";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface BlogEditorProps {
  post?: Post;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ post }) => {
  const [title, setTitle] = useState<string>(
    post?.title || `New blog post on ${new Date().toLocaleDateString()}`
  );
  const [content, setContent] = useState<string>(post?.content || "");
  const [theme, setTheme] = useState<string>("dark");
  const router = useRouter();

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

  const handleSaveDraft = async () => {
    try {
      if (post) {
        await api.updatePost(post.id, { title, content, status: "draft" });
      } else {
        await api.createPost({ title, content, status: "draft" });
      }
      router.push("/blog");
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const handlePublish = async () => {
    try {
      if (post) {
        await api.updatePost(post.id, { title, content, status: "published" });
      } else {
        await api.createPost({ title, content, status: "published" });
      }
      router.push("/blog");
    } catch (error) {
      console.error("Error publishing post:", error);
    }
  };

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
            <Button variant="outline" onClick={handleSaveDraft}>
              Save Draft
            </Button>
            <Button variant="outline" onClick={handlePublish}>
              Publish
            </Button>
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
