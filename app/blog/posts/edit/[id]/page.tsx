"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Post } from "@/types";
import BlogEditor from "@/components/blog/BlogEditor";

export default function EditPostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const router = useRouter();
  const { id }: any = useParams();

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        const fetchedPost = await api.getPost(id as any);
        setPost(fetchedPost);
      };
      fetchPost();
    }
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <main className="w-full min-h-screen scroll-smooth dark:bg-slate-900 p-8">
      <div className="container mx-auto max-w-4xl p-8 bg-gray-50 dark:bg-slate-800 rounded-lg">
        <h1 className="text-3xl font-bold mb-4 dark:text-white">
          Create New Post
        </h1>
        <BlogEditor post={post} />
      </div>
    </main>
  );
}
