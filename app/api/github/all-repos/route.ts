import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const runtime = "edge";
export const revalidate = 3600;

/**
 * @swagger
 * /api/github/all-repos:
 *   get:
 *     summary: Get all public GitHub repositories for a user
 *     description: Returns a list of all public repositories for a given GitHub username
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         description: GitHub username
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Repository name
 *                   description:
 *                     type: string
 *                     description: Repository description
 *                   url:
 *                     type: string
 *                     description: Repository URL
 *                   updatedAt:
 *                     type: string
 *                     description: Last updated date
 *                   stargazerCount:
 *                     type: number
 *                     description: Number of stars
 *                   forkCount:
 *                     type: number
 *                     description: Number of forks
 *                   primaryLanguage:
 *                     type: object
 *                     description: Primary language
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Language name
 *                       color:
 *                         type: string
 *                         description: Language color
 *       400:
 *         description: GitHub username is required
 *       500:
 *         description: Failed to fetch repositories
 */

interface Repository {
  name: string;
  description: string | null;
  url: string;
  updatedAt: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
}

interface GraphQLResponse {
  data: {
    user: {
      repositories: {
        nodes: Repository[];
      };
    };
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "GitHub username is required" },
      { status: 400 },
    );
  }

  try {
    const query = `
      query($username: String!) {
        user(login: $username) {
          repositories(first: 100, privacy: PUBLIC, orderBy: {field: UPDATED_AT, direction: DESC}) {
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

    const response = await axios.post<GraphQLResponse>(
      "https://api.github.com/graphql",
      { query, variables },
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
      },
    );

    const repos = response.data.data.user.repositories.nodes;
    return NextResponse.json(repos);
  } catch (error) {
    console.error("Error fetching all repos:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch repositories",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
