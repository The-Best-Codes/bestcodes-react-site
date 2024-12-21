import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const revalidate = 1800;

/**
 * @swagger
 * /api/printables/highlighted-projects:
 *   get:
 *     summary: Get highlighted projects from Printables
 *     description: Returns a list of highlighted projects for a given Printables user ID
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         description: Printables user ID
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
 *                     description: Project name
 *                   url:
 *                     type: string
 *                     description: Project URL
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
 *                   description:
 *                     type: string
 *                     description: Project description
 *                   updatedAt:
 *                     type: string
 *                     description: Last updated date
 *       500:
 *         description: Failed to fetch highlighted projects
 */

interface PrintablesResponse {
  data?: {
    user?: {
      highlightedModels?: {
        models?: Array<{
          name?: string;
          id?: string;
          image?: {
            filePath?: string;
          };
          datePublished?: string;
        }>;
      };
    };
  };
  errors?: Array<{ message: string }>;
}

interface ProjectResponse {
  name: string;
  url: string;
  coverImage: {
    src: string;
    alt: string;
  };
  description: string;
  updatedAt: string;
}

export async function GET(request: NextRequest) {
  try {
    // Validate user_id parameter
    const searchParams = request.nextUrl.searchParams;
    const userID = searchParams.get("user_id");

    if (!userID) {
      return NextResponse.json(
        { error: "Missing required parameter: user_id" },
        { status: 400 },
      );
    }

    // Make API request
    const url = "https://api.printables.com/graphql/";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operationName: "ProfileHighlightedModels",
        variables: {
          userId: userID,
        },
        query:
          "query ProfileHighlightedModels($userId: ID!) {\n  user(id: $userId) {\n    id\n    highlightedModels {\n      models {\n        ...PrintListFragment\n        __typename\n      }\n      featured\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment PrintListFragment on PrintType {\n  id\n  name\n  slug\n  ratingAvg\n  likesCount\n  liked\n  datePublished\n  dateFeatured\n  firstPublish\n  downloadCount\n  category {\n    id\n    path {\n      id\n      name\n      __typename\n    }\n    __typename\n  }\n  modified\n  image {\n    ...ImageSimpleFragment\n    __typename\n  }\n  nsfw\n  premium\n  price\n  user {\n    ...AvatarUserFragment\n    __typename\n  }\n  ...LatestCompetitionResult\n  __typename\n}\n\nfragment AvatarUserFragment on UserType {\n  id\n  publicUsername\n  avatarFilePath\n  handle\n  company\n  verified\n  badgesProfileLevel {\n    profileLevel\n    __typename\n  }\n  __typename\n}\n\nfragment LatestCompetitionResult on PrintType {\n  latestCompetitionResult {\n    placement\n    competitionId\n    __typename\n  }\n  __typename\n}\n\nfragment ImageSimpleFragment on PrintImageType {\n  id\n  filePath\n  rotation\n  __typename\n}",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as PrintablesResponse;

    // Check for GraphQL errors
    if (data.errors) {
      return NextResponse.json(
        { error: data.errors[0].message },
        { status: 400 },
      );
    }

    // Validate response data structure
    if (!data.data?.user?.highlightedModels?.models) {
      return NextResponse.json(
        { error: "No highlighted projects found" },
        { status: 404 },
      );
    }

    const resData = data.data.user.highlightedModels.models;

    const resDataMap: ProjectResponse[] = resData
      .filter((project) => {
        // Filter out invalid projects
        return project.name && project.id && project.image?.filePath;
      })
      .map((project) => {
        return {
          name: project.name!,
          url: `https://www.printables.com/model/${project.id}`,
          coverImage: {
            src: `https://media.printables.com/${project.image!.filePath}`,
            alt: project.name!,
          },
          description: project.name!,
          updatedAt: project.datePublished || new Date().toISOString(),
        };
      });

    if (resDataMap.length === 0) {
      return NextResponse.json(
        { error: "No valid highlighted projects found" },
        { status: 404 },
      );
    }

    return NextResponse.json(resDataMap);
  } catch (error) {
    console.error("Error fetching highlighted projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch highlighted projects" },
      { status: 500 },
    );
  }
}
