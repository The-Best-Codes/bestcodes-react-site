import { Post } from "@/types";

export const api = {
  getPosts: async (): Promise<Post[]> => {
    const res = await fetch("/api/posts");
    return res.json();
  },
  getPost: async (id: number): Promise<Post> => {
    const res = await fetch(`/api/posts/${id}`);
    return res.json();
  },
  createPost: async (
    post: Omit<Post, "id" | "createdAt" | "updatedAt">
  ): Promise<Post> => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    return res.json();
  },
  updatePost: async (id: number, post: Partial<Post>): Promise<Post> => {
    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    return res.json();
  },
  deletePost: async (id: number): Promise<void> => {
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
  },
};
