import { generateToken } from 'next-csrf';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const csrfToken = await generateToken();
    res.json({ csrfToken });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}