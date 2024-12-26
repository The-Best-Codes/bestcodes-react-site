import { unstable_cache } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 1800; // Cache duration (for dynamic responses)

const STATIC_USER_ID = "491469";

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

async function fetchPrintablesData(
  userID: string,
): Promise<ProjectResponse[] | null> {
  const url = "https://api.printables.com/graphql/";
  try {
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
      throw new Error(data.errors[0].message);
    }

    // Validate response data structure
    if (!data.data?.user?.highlightedModels?.models) {
      return null;
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
      return null;
    }

    return resDataMap;
  } catch (error) {
    console.error("Error fetching highlighted projects:", error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  // Validate user_id parameter
  const searchParams = request.nextUrl.searchParams;
  const userID = searchParams.get("user_id");

  if (!userID) {
    return NextResponse.json(
      { error: "Missing required parameter: user_id" },
      { status: 400 },
    );
  }

  // Check if it's the static user ID
  if (userID === STATIC_USER_ID) {
    const staticData = await unstable_cache(
      async () => {
        console.log("Fetching static user data");
        return await fetchPrintablesData(STATIC_USER_ID);
      },
      ["static-user-data"],
      {
        revalidate: false, // We only want to generate this during build, not on demand
      },
    )();

    if (staticData) {
      return NextResponse.json(staticData);
    }
  }

  // Dynamic case: fetch for any other user ID

  const dynamicData = await fetchPrintablesData(userID);
  if (dynamicData) {
    return NextResponse.json(dynamicData);
  }

  return NextResponse.json({ error: "No projects found" }, { status: 404 });
}
