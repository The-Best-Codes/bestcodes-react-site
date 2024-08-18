"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Post } from "@/types";
import BlogPost from "@/components/blog/BlogPost";

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
    <main className="container mx-auto max-w-4xl py-8">
      <BlogPost post={post} />
    </main>
  );
}
