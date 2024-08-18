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
    post: Omit<Post, "id" | "createdAt" | "updatedAt">,
    username: string,
    password: string
  ): Promise<Post> => {
    const res = await fetch(
      `/api/posts?username=${username}&password=${password}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      }
    );
    return res.json();
  },
  updatePost: async (
    id: number,
    post: Partial<Post>,
    username: string,
    password: string
  ): Promise<Post> => {
    const res = await fetch(
      `/api/posts/${id}?username=${username}&password=${password}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      }
    );
    return res.json();
  },
  deletePost: async (
    id: number,
    username: string,
    password: string
  ): Promise<void> => {
    await fetch(`/api/posts/${id}?username=${username}&password=${password}`, {
      method: "DELETE",
    });
  },
};
