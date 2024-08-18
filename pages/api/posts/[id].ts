import { NextApiRequest, NextApiResponse } from 'next';
import { Post } from '@/types';
import { openDb } from '@/lib/blog_db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await openDb();
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      const post = await db.get('SELECT * FROM posts WHERE id = ?', id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      return res.status(200).json(post);

    case 'PUT':
      const { title, content, status } = req.body;
      const now = new Date().toISOString();
      await db.run(
        'UPDATE posts SET title = ?, content = ?, status = ?, updatedAt = ? WHERE id = ?',
        [title, content, status, now, id]
      );
      const updatedPost = await db.get('SELECT * FROM posts WHERE id = ?', id);
      return res.status(200).json(updatedPost);

    case 'DELETE':
      await db.run('DELETE FROM posts WHERE id = ?', id);
      return res.status(204).end();

    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}