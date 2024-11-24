import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import getCoverImage from "@/utils/api/github/repo-cover-image";

const PER_PAGE = 100; // Maximum allowed by GitHub API

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  updated_at: string;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  coverImage?: {
    src: string | undefined;
    alt: string | undefined;
  } | null;
}

interface SearchResponse {
  items: GitHubRepo[];
}

interface FormattedRepo {
  name: string;
  coverImage?: {
    src: string | undefined;
    alt: string | undefined;
  } | null;
  description: string | null;
  url: string;
  updatedAt: string;
  topics: string[];
  language: string | null;
  stargazersCount: number;
  forksCount: number;
}

async function fetchReposByTopic(
  username: string,
  topic: string,
  page = 1,
): Promise<SearchResponse> {
  const query = `topic:${topic} user:${username}`;
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=${PER_PAGE}&page=${page}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  return response.data;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");
  const topic = searchParams.get("topic");
  const includeCover = searchParams.get("includeCover") !== "false";

  if (!username || !topic) {
    return NextResponse.json(
      { error: "Both GitHub username and topic are required" },
      { status: 400 },
    );
  }

  try {
    let allRepos: GitHubRepo[] = [];
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const data = await fetchReposByTopic(username, topic, page);
      allRepos = allRepos.concat(data.items);

      if (includeCover) {
        const repoPromises = data.items.map((repo) =>
          getCoverImage(repo.html_url),
        );
        const coverImagePaths = await Promise.all(repoPromises);
        data.items.forEach((repo, index) => {
          const coverImage = coverImagePaths[index];
          repo.coverImage = coverImage;
        });
      }

      if (data.items.length < PER_PAGE) {
        hasMorePages = false;
      } else {
        page++;
      }
    }

    const formattedRepos: FormattedRepo[] = allRepos.map((repo) => ({
      name: repo.name,
      coverImage: repo.coverImage,
      description: repo.description,
      url: repo.html_url,
      updatedAt: repo.updated_at,
      topics: repo.topics,
      language: repo.language,
      stargazersCount: repo.stargazers_count,
      forksCount: repo.forks_count,
    }));

    return NextResponse.json(formattedRepos);
  } catch (error) {
    console.error("Error fetching repos by topic:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch repositories",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
