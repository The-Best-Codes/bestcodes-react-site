import BlogEditor from '@/components/blog/BlogEditor';

export default function NewPostPage() {
  return (
    <main className="container mx-auto max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-4">Create New Post</h1>
      <BlogEditor />
    </main>
  );
}