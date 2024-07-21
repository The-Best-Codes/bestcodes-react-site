// pages/api/comments/create.js

import { verifyTurnstileToken } from '../../utils/turnstile';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { comment, author, turnstileToken } = req.body;

  if (!comment || !author || !turnstileToken) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Verify the Turnstile token
    const verificationResponse = await fetch('/api/verify-turnstile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: turnstileToken }),
    });

    const verificationResult = await verificationResponse.json();

    if (!verificationResult.success) {
      return res.status(400).json({ error: 'Turnstile verification failed' });
    }

    // If verification is successful, process the comment
    // Here you would typically save the comment to your database
    // For this example, we'll just return a success message
    return res.status(200).json({ success: true, message: 'Comment posted successfully' });
  } catch (error) {
    console.error('Comment posting error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}