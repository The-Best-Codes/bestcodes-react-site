// pages/api/repos-by-topic.js

import axios from 'axios';
import getCoverImage from '@/utils/api/github/repo-cover-image';

const PER_PAGE = 100; // Maximum allowed by GitHub API

async function fetchReposByTopic(username, topic, page = 1) {
    const query = `topic:${topic} user:${username}`;
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=${PER_PAGE}&page=${page}`;

    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
        },
    });

    return response.data;
}

export default async function handler(req, res) {
    const { username, topic, includeCover = true } = req.query;

    if (!username || !topic) {
        return res.status(400).json({ error: 'Both GitHub username and topic are required' });
    }

    try {
        let allRepos = [];
        let page = 1;
        let hasMorePages = true;

        while (hasMorePages) {
            const data = await fetchReposByTopic(username, topic, page);
            allRepos = allRepos.concat(data.items);

            if (includeCover) {
                const repoPromises = allRepos.map(repo => getCoverImage(repo.html_url));
                const coverImagePaths = await Promise.all(repoPromises);
                allRepos.forEach((repo, index) => {
                    repo.coverImage = coverImagePaths[index];
                });
            }

            if (data.items.length < PER_PAGE) {
                hasMorePages = false;
            } else {
                page++;
            }
        }

        const formattedRepos = allRepos.map(repo => ({
            name: repo.name,
            coverImage: repo.coverImage,
            description: repo.description,
            url: repo.html_url,
            updatedAt: repo.updated_at,
            topics: repo.topics,
            language: repo.language,
            stargazersCount: repo.stargazers_count,
            forksCount: repo.forks_count
        }));

        res.status(200).json(formattedRepos);
    } catch (error) {
        console.error('Error fetching repos by topic:', error);
        res.status(500).json({ error: 'Failed to fetch repositories', details: error.message });
    }
}