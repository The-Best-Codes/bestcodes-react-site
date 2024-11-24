import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

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
