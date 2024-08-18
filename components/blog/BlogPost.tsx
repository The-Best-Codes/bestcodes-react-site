import React from "react";
import { Post } from "@/types";

interface BlogPostProps {
  post: Post;
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  return (
    <article className="prose lg:prose-xl dark:prose-invert">
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <p className="text-sm text-gray-500">
        {post.status === "published" ? "Published" : "Draft"} on{" "}
        {new Date(post.updatedAt).toLocaleDateString()}
      </p>
    </article>
  );
};

export default BlogPost;
