import { NextApiRequest, NextApiResponse } from "next";
import { Post } from "@/types";
import { openDb } from "@/lib/blog_db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const db = await openDb();
    const { id, username, password } = req.query;

    switch (req.method) {
      case "GET":
        const post = await db.get("SELECT * FROM posts WHERE id = ?", id);
        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json(post);

      case "PUT":
        if (typeof username !== "string" || typeof password !== "string") {
          return res.status(400).json({ message: "Invalid request" });
        }

        if (
          username !== process.env.BLOG_USER ||
          password !== process.env.BLOG_PSW
        ) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        const { title, content, status } = req.body;
        const now = new Date().toISOString();
        await db.run(
          "UPDATE posts SET title = ?, content = ?, status = ?, updatedAt = ? WHERE id = ?",
          [title, content, status, now, id]
        );
        const updatedPost = await db.get(
          "SELECT * FROM posts WHERE id = ?",
          id
        );
        return res.status(200).json(updatedPost);

      case "DELETE":
        if (typeof username !== "string" || typeof password !== "string") {
          return res.status(400).json({ message: "Invalid request" });
        }

        if (
          username !== process.env.BLOG_USER ||
          password !== process.env.BLOG_PSW
        ) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        await db.run("DELETE FROM posts WHERE id = ?", id);
        return res.status(204).end();

      default:
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
