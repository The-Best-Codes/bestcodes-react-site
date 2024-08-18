import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import { Post } from "@/types";
import BlogEditor from "@/components/blog/BlogEditor";

export default function EditPostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const router = useRouter();
  const { id } = router.query;

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
      <h1 className="text-3xl font-bold mb-4">Edit Post</h1>
      <BlogEditor post={post} />
    </main>
  );
}
