// pages/api/auth/turnstile-verify.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const formData = new URLSearchParams();
        formData.append('secret', process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY);
        formData.append('response', token);

        const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body: formData,
        });

        const verificationResult = await verificationResponse.json();

        if (verificationResult.success) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(400).json({ error: 'Token verification failed' });
        }
    } catch (error) {
        console.error('Turnstile verification error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}