// pages/api/all-repos.js

import axios from 'axios';

export default async function handler(req, res) {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ error: 'GitHub username is required' });
    }

    try {
        const query = `
      query($username: String!) {
        user(login: $username) {
          repositories(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
            nodes {
              name
              description
              url
              updatedAt
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
    `;

        const variables = { username };

        const response = await axios.post(
            'https://api.github.com/graphql',
            { query, variables },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
                },
            }
        );

        const repos = response.data.data.user.repositories.nodes;
        res.status(200).json(repos);
    } catch (error) {
        console.error('Error fetching all repos:', error);
        res.status(500).json({ error: 'Failed to fetch repositories' });
    }
}