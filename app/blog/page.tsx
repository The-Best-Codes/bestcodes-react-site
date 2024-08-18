"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Post } from "@/types";
import BlogList from "@/components/blog/BlogList";
import Header from "@/components/website/header";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await api.getPosts();
      setPosts(fetchedPosts);
    };
    fetchPosts();
  }, []);

  return (
    <main className="flex min-h-screen scroll-smooth max-w-screen w-full flex-col items-center dark:bg-slate-900">
      <Header />
      <div className="w-full rounded-lg max-w-screen-lg mt-8 px-8 py-8 bg-gray-50 dark:bg-slate-800">
        <h1 className="text-3xl font-bold mb-4 dark:text-white">
          BestCodes Blog
        </h1>
        <BlogList posts={posts} />
      </div>
    </main>
  );
}
