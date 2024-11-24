import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import getCoverImage from "@/utils/api/github/repo-cover-image";

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
