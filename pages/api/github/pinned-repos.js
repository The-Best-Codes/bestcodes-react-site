// pages/api/pinned-repos.js

import axios from 'axios';
import getCoverImage from '@/utils/api/github/repo-cover-image';

export default async function handler(req, res) {
    const { username, includeCover = true } = req.query;

    if (!username) {
        return res.status(400).json({ error: 'GitHub username is required' });
    }

    const query = `
    {
      user(login: "${username}") {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              stargazerCount
              forkCount
              primaryLanguage {
                name
                color
              }
            }
          }
        }
      }
    }
  `;

    try {
        const response = await axios.post(
            'https://api.github.com/graphql',
            { query },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
                },
            }
        );

        const pinnedRepos = response.data.data.user.pinnedItems.nodes;

        if (includeCover) {
            const repoPromises = pinnedRepos.map(repo => getCoverImage(repo.url));
            const coverImagePaths = await Promise.all(repoPromises);
            pinnedRepos.forEach((repo, index) => {
                repo.coverImage = coverImagePaths[index];
            });
        }
        res.status(200).json(pinnedRepos);
    } catch (error) {
        console.error('Error fetching pinned repos:', error);
        res.status(500).json({ error: 'Failed to fetch pinned repositories' });
    }
}