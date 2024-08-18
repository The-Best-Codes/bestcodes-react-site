"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Post } from "@/types";
import BlogList from "@/components/blog/BlogList";

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
    <main className="container mx-auto max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-4">My Blog</h1>
      <Link
        href="/blog/new"
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Create New Post
      </Link>
      <BlogList posts={posts} />
    </main>
  );
}
