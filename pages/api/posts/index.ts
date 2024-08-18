import { NextApiRequest, NextApiResponse } from "next";
import { Post } from "@/types";
import { openDb } from "@/lib/blog_db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const db = await openDb();

    switch (req.method) {
      case "GET":
        const posts = await db.all(
          "SELECT * FROM posts ORDER BY createdAt DESC"
        );
        return res.status(200).json(posts);

      case "POST":
        const { username, password } = req.query;
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
        const result = await db.run(
          "INSERT INTO posts (title, content, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
          [title, content, status, now, now]
        );
        const newPost = await db.get(
          "SELECT * FROM posts WHERE id = ?",
          result.lastID
        );
        return res.status(201).json(newPost);

      default:
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
