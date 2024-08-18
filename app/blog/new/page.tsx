import BlogEditor from "@/components/blog/BlogEditor";

export default function NewPostPage() {
  return (
    <main className="w-full min-h-screen scroll-smooth dark:bg-slate-900 p-8">
      <div className="container mx-auto max-w-4xl p-8 bg-gray-50 dark:bg-slate-800 rounded-lg">
        <h1 className="text-3xl font-bold mb-4 dark:text-white">Create New Post</h1>
        <BlogEditor />
      </div>
    </main>
  );
}
