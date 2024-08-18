import React from "react";
import Link from "next/link";
import { Post } from "@/types";
import DOMPurify from "dompurify";

interface BlogListProps {
  posts: Post[];
}

const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

const BlogList: React.FC<BlogListProps> = ({ posts }) => {
  return (
    <div className="space-y-8 px-4 md:px-8 lg:px-16">
      {posts.map((post) => (
        <div
          key={post.id}
          className="group relative overflow-hidden border border-gray-200 dark:border-gray-700 p-6 rounded-lg bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out hover:shadow-lg dark:hover:shadow-gray-700/50"
        >
          <div className="relative z-10">
            <Link href={`/blog/posts/${post.id}`}>
              <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {post.title}
              </h2>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {stripHtml(DOMPurify.sanitize(post.content)).slice(0, 200).concat("...")}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Published on {new Date(post.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;