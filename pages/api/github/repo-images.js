// pages/api/repo-images.js

import axios from 'axios';
import { parse } from 'node-html-parser';

export default async function handler(req, res) {
    const { username, repo } = req.query;

    if (!username || !repo) {
        return res.status(400).json({ error: 'Both GitHub username and repository name are required' });
    }

    try {
        // Fetch the README content
        const readmeUrl = `https://api.github.com/repos/${username}/${repo}/readme`;
        const readmeResponse = await axios.get(readmeUrl, {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
                Accept: 'application/vnd.github.v3.html',
            },
        });

        const htmlContent = readmeResponse.data;
        const root = parse(htmlContent);

        // Find all images
        const images = root.querySelectorAll('img');

        let coverImage = null;
        const allImages = [];

        images.forEach(img => {
            let src = img.getAttribute('src');
            src = `https://raw.githubusercontent.com/${username}/${repo}/main/${src}`;
            const alt = img.getAttribute('alt');
            const isForCover = img.getAttribute('for') === 'cover';

            if (isForCover && !coverImage) {
                coverImage = { src, alt };
            }

            allImages.push({ src, alt });
        });

        // If no cover image was specified, use the first image as cover
        if (!coverImage && allImages.length > 0) {
            coverImage = allImages[0];
        }

        res.status(200).json({
            coverImage,
            allImages,
        });
    } catch (error) {
        console.error('Error fetching repo images:', error);
        res.status(500).json({ error: 'Failed to fetch repository images', details: error.message });
    }
}