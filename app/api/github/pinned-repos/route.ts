import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import getCoverImage from "../../../../utils/api/github/repo-cover-image";

export const revalidate = 1800;

/**
 * @swagger
 * /api/github/pinned-repos:
 *   get:
 *     summary: Get pinned GitHub repositories for a user
 *     description: Returns a list of pinned repositories for a given GitHub username
 *     parameters:
 *       - in: query
 *         name: username
 *         required: false
 *         description: GitHub username (defaults to The-Best-Codes)
 *         schema:
 *           type: string
 *       - in: query
 *         name: includeCover
 *         required: false
 *         description: Whether to include cover images (defaults to true)
 *         schema:
 *           type: boolean
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
 *                   coverImage:
 *                     type: object
 *                     description: Cover image
 *                     properties:
 *                       src:
 *                         type: string
 *                         description: Cover image URL
 *                       alt:
 *                         type: string
 *                         description: Cover image alt text
 *       500:
 *         description: Failed to fetch pinned repositories
 */

interface PinnedRepo {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  coverImage?: {
    src: string | undefined;
    alt: string | undefined;
  } | null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username") || "The-Best-Codes";
  const includeCover = searchParams.get("includeCover") !== "false";

  // Validate the username to ensure it is a safe string
  const isValidUsername = /^[a-zA-Z0-9-_]+$/.test(username);
  if (!isValidUsername) {
    return NextResponse.json(
      { error: "Invalid username provided" },
      { status: 400 },
    );
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
      "https://api.github.com/graphql",
      { query },
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
      },
    );

    const pinnedRepos = response.data.data.user.pinnedItems
      .nodes as PinnedRepo[];

    if (includeCover) {
      const repoPromises = pinnedRepos.map((repo) => getCoverImage(repo.url));
      const coverImagePaths = await Promise.all(repoPromises);
      pinnedRepos.forEach((repo, index) => {
        repo.coverImage = coverImagePaths[index];
      });
    }

    return NextResponse.json(pinnedRepos);
  } catch (error) {
    console.error("Error fetching pinned repos:", error);
    return NextResponse.json(
      { error: "Failed to fetch pinned repositories" },
      { status: 500 },
    );
  }
}
