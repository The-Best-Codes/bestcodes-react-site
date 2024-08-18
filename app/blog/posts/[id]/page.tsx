"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Post } from "@/types";
import BlogPost from "@/components/blog/BlogPost";
import Header from "@/components/website/header";

export default function PostPage() {
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
    <main className="flex min-h-screen scroll-smooth max-w-screen w-full flex-col items-center dark:bg-slate-900">
      <Header />
      <div className="w-full rounded-lg max-w-screen-lg mt-8 px-8 py-8 bg-gray-50 dark:bg-slate-800">
        <BlogPost post={post} />
      </div>
    </main>
  );
}
