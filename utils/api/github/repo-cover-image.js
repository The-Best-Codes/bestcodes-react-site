// utils/api/github/repo-cover-image.js

import axios from 'axios';
import { parse } from 'node-html-parser';

export default async function getCoverImage(url) {
    try {
        const response = await axios.get(url);
        const htmlContent = response.data;
        const root = parse(htmlContent);
        const images = root.querySelectorAll('img')
        const image = images.find(img => img.getAttribute('for') === 'cover');

        if (!image) {
            return null;
        }

        let src = image.getAttribute('src');
        if (!src.startsWith('http') && !src.startsWith('https')) {
            src = `https://github.com${src}`;
        }
        const alt = image.getAttribute('alt');

        return { src, alt };
    } catch (error) {
        console.error('Error fetching repo cover image:', error);
        return null;
    }
}