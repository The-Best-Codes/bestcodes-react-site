import React from "react";
import Link from "next/link";
import { Post } from "@/types";

interface BlogListProps {
  posts: Post[];
}

const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="border p-4 rounded-lg">
          <Link href={`/blog/posts/${post.id}`}>
            <h2 className="text-xl font-bold">{post.title}</h2>
          </Link>
          <p className="text-sm text-gray-500">
            {post.status === "published" ? "Published" : "Draft"} on{" "}
            {new Date(post.updatedAt).toLocaleDateString()}
          </p>
          <div className="mt-2">
            <Link
              href={`/blog/posts/edit/${post.id}`}
              className="text-blue-500 hover:underline mr-4"
            >
              Edit
            </Link>
            <Link
              href={`/blog/posts/${post.id}`}
              className="text-green-500 hover:underline"
            >
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
